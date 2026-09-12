import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { officeService } from './src/services/officeService';
import { FULL_SERVICES_CATALOG } from './src/data/localizedServices';
import { locationDataService } from './src/data/locationData';
import { LocationState, DocumentItem } from './src/types';

// Lazy initialized Gemini client for server-side AI civic guidance
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// Lightweight in-memory rate limiting map
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

// Periodic cleanup of expired rate limit keys every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 300000);

function createRateLimiter(maxRequests: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const rawIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const record = rateLimitMap.get(rawIp) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count += 1;
    }
    rateLimitMap.set(rawIp, record);

    if (record.count > maxRequests) {
      return res.status(429).json({
        status: 'error',
        error: 'Too many requests. Please slow down and try again.'
      });
    }
    next();
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '100kb' }));

  // CORS Configuration for Production and Preview
  app.use((req, res, next) => {
    const allowedOrigins = (process.env.CORS_ORIGIN || '*').split(',').map((o) => o.trim());
    const origin = req.headers.origin;

    if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Performance-optimized lean logger: records method, path, status, and duration only
  // Strictly avoids dumping payloads, user credentials, or large lists into production logs
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (req.path.startsWith('/api') || req.path === '/health') {
        console.log(`[API ${req.method}] ${req.path} ${res.statusCode} (${duration}ms)`);
      }
    });
    next();
  });

  // Standard API Rate Limiter: 120 requests per minute per IP
  const apiLimiter = createRateLimiter(120, 60000);
  app.use('/api', apiLimiter);

  // Health and Readiness Probes for Railway / Cloud Run
  app.get(['/health', '/api/health'], (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'SmartSeva Production API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // --- RELEVANT OFFICE SEARCH API ENDPOINT (GET) ---
  app.get('/api/offices/nearby', (req, res) => {
    try {
      const serviceId = (req.query.service_id || req.query.serviceId) as string;
      if (!serviceId) {
        return res.status(400).json({
          status: 'error',
          error: 'service_id parameter is required.'
        });
      }

      const method = (req.query.method as any) || 'manual';
      const latRaw = req.query.lat || req.query.latitude;
      const lngRaw = req.query.lng || req.query.longitude;
      const latitude = latRaw !== undefined && latRaw !== '' ? Number(latRaw) : null;
      const longitude = lngRaw !== undefined && lngRaw !== '' ? Number(lngRaw) : null;
      const city = (req.query.city as string) || null;
      const district = (req.query.district as string) || null;
      const state = (req.query.state as string) || null;
      const pincode = (req.query.pincode as string) || null;

      const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
      const rawLimit = String(req.query.page_size || req.query.limit || req.query.pageSize || '20');
      const pageSize = Math.min(50, Math.max(1, parseInt(rawLimit, 10)));

      const locationState: LocationState = {
        method,
        latitude: typeof latitude === 'number' && !isNaN(latitude) ? latitude : null,
        longitude: typeof longitude === 'number' && !isNaN(longitude) ? longitude : null,
        city,
        district,
        state,
        pincode,
        formattedAddress: null,
        status: 'success',
        errorType: null,
        errorMessage: null
      };

      const result = officeService.searchNearbyOffices(serviceId, locationState, page, pageSize);
      if (result.status === 'error') {
        return res.status(400).json(result);
      }

      // Add HTTP caching for identical searches (120s TTL)
      res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=60');
      return res.json(result);
    } catch (err: any) {
      console.error('Error in GET /api/offices/nearby:', err);
      return res.status(500).json({
        status: 'error',
        error: 'An internal server error occurred while searching for offices.'
      });
    }
  });

  // --- RELEVANT OFFICE SEARCH API ENDPOINT (POST) ---
  app.post('/api/offices/nearby', (req, res) => {
    try {
      const { service_id, serviceId, location, page: reqPage, page_size, limit } = req.body || {};
      const targetServiceId = service_id || serviceId;

      if (!targetServiceId) {
        return res.status(400).json({
          status: 'error',
          error: 'service_id is required in request body.'
        });
      }

      const page = Math.max(1, parseInt(reqPage || '1', 10));
      const pageSize = Math.min(50, Math.max(1, parseInt(page_size || limit || '20', 10)));

      const locationState: LocationState = location || {
        method: 'manual',
        latitude: null,
        longitude: null,
        city: null,
        district: null,
        state: null,
        pincode: null,
        formattedAddress: null,
        status: 'success',
        errorType: null,
        errorMessage: null
      };

      const result = officeService.searchNearbyOffices(targetServiceId, locationState, page, pageSize);
      if (result.status === 'error') {
        return res.status(400).json(result);
      }

      return res.json(result);
    } catch (err: any) {
      console.error('Error in POST /api/offices/nearby:', err);
      return res.status(500).json({
        status: 'error',
        error: 'An internal server error occurred while searching for offices.'
      });
    }
  });

  // --- SERVICES CATALOG API WITH FIELD FILTERING & PAGINATION ---
  app.get('/api/services', (req, res) => {
    try {
      const category = (req.query.category as string)?.toLowerCase();
      const q = (req.query.q as string)?.trim().toLowerCase();
      const fields = (req.query.fields as string)?.split(',').map(f => f.trim()) || [];
      const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
      const rawLimit = String(req.query.page_size || req.query.limit || '20');
      const pageSize = Math.min(50, Math.max(1, parseInt(rawLimit, 10)));

      let filtered = FULL_SERVICES_CATALOG;

      if (category && category !== 'all') {
        filtered = filtered.filter(s => s.category.toLowerCase() === category);
      }

      if (q) {
        filtered = filtered.filter(s =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
        );
      }

      const total = filtered.length;
      const totalPages = Math.ceil(total / pageSize) || 1;
      const startIndex = (page - 1) * pageSize;
      const pagedItems = filtered.slice(startIndex, startIndex + pageSize);

      // Field projection if requested
      const projectedItems = fields.length > 0
        ? pagedItems.map(item => {
            const projected: Record<string, any> = {};
            for (const f of fields) {
              if (f in item) projected[f] = (item as any)[f];
            }
            return projected;
          })
        : pagedItems;

      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=120');
      return res.json({
        status: 'success',
        items: projectedItems,
        page,
        page_size: pageSize,
        total,
        total_pages: totalPages
      });
    } catch (err: any) {
      console.error('Error in GET /api/services:', err);
      return res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
  });

  // --- SINGLE SERVICE BY ID ---
  app.get('/api/services/:id', (req, res) => {
    const service = FULL_SERVICES_CATALOG.find(s => s.id === req.params.id);
    if (!service) {
      return res.status(404).json({ status: 'error', error: 'Service not found' });
    }
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=120');
    return res.json({ status: 'success', service });
  });

  // --- SERVICE REQUIREMENTS / CHECKLIST QUERY (Avoids loading all requirements) ---
  app.get('/api/services/:id/checklist', (req, res) => {
    try {
      const serviceId = req.params.id;
      const service = FULL_SERVICES_CATALOG.find(s => s.id === serviceId);
      if (!service) {
        return res.status(404).json({ status: 'error', error: 'Service not found' });
      }

      // Explicit field mapping for service requirements
      const requirements: DocumentItem[] = (service.documentsRequired || []).map((docName, idx) => ({
        id: `req-${serviceId}-${idx + 1}`,
        title: docName,
        description: `Official ${docName} verification document for ${service.title}.`,
        required: true,
        status: 'not_sure',
        category: 'Required Document',
        notes: 'Original copy along with 1 self-attested photocopy required during office visit.'
      }));

      // Add optional affidavit / supplementary proof if relevant
      if (requirements.length > 0) {
        requirements.push({
          id: `req-${serviceId}-opt`,
          title: 'Supporting Affidavit / Supplementary Proof',
          description: 'Notarized self-declaration if details differ from standard ID.',
          required: false,
          status: 'dont_have',
          category: 'Supplementary Document',
          notes: 'Applicable only if there is a name, age, or address discrepancy.'
        });
      }

      const totalRequired = requirements.filter(r => r.required).length;
      const totalOptional = requirements.length - totalRequired;

      res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=180');
      return res.json({
        status: 'success',
        serviceId,
        serviceTitle: service.title,
        totalRequired,
        totalOptional,
        requirements
      });
    } catch (err: any) {
      console.error('Error in GET /api/services/:id/checklist:', err);
      return res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
  });

  // Mock store for user preparation history records
  const USER_HISTORY_STORE: Record<string, any[]> = {
    'user-default-101': [
      {
        id: 'hist-101-1',
        userId: 'user-default-101',
        serviceId: 'driving-license',
        serviceTitle: 'Driving License',
        readinessScore: 100,
        totalDocuments: 5,
        availableDocuments: 5,
        status: 'ready_for_visit',
        summaryNotes: 'All mandatory documents verified. RTO visit recommended.',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'hist-101-2',
        userId: 'user-default-101',
        serviceId: 'passport',
        serviceTitle: 'Passport Service',
        readinessScore: 75,
        totalDocuments: 4,
        availableDocuments: 3,
        status: 'in_progress',
        summaryNotes: 'Birth certificate pending verification.',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
      }
    ]
  };

  // --- USER PREPARATION HISTORY WITH SERVER-SIDE PAGINATION ---
  app.get('/api/user/history', (req, res) => {
    try {
      const userId = (req.query.user_id as string) || 'user-default-101';
      const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
      const rawLimit = String(req.query.page_size || req.query.limit || '20');
      const pageSize = Math.min(50, Math.max(1, parseInt(rawLimit, 10)));

      const userRecords = USER_HISTORY_STORE[userId] || [];
      const total = userRecords.length;
      const totalPages = Math.ceil(total / pageSize) || 1;
      const startIndex = (page - 1) * pageSize;
      const pagedItems = userRecords.slice(startIndex, startIndex + pageSize);

      // Never cache private user data publicly
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      return res.json({
        status: 'success',
        items: pagedItems,
        page,
        page_size: pageSize,
        total,
        total_pages: totalPages
      });
    } catch (err: any) {
      console.error('Error in GET /api/user/history:', err);
      return res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
  });

  // --- SAVE / UPDATE USER CHECKLIST ATOMICALLY ---
  app.post('/api/user/checklist', (req, res) => {
    try {
      const { user_id, service_id, documents } = req.body || {};
      if (!user_id || !service_id || !Array.isArray(documents)) {
        return res.status(400).json({
          status: 'error',
          error: 'user_id, service_id, and documents array are required.'
        });
      }

      const requiredCount = documents.filter((d: any) => d.required).length;
      const availableCount = documents.filter((d: any) => d.status === 'have').length;
      const readinessScore = requiredCount > 0 ? Math.round((availableCount / requiredCount) * 100) : 100;

      const historyRecord = {
        id: `hist-${Date.now()}`,
        userId: user_id,
        serviceId: service_id,
        serviceTitle: service_id.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
        readinessScore,
        totalDocuments: documents.length,
        availableDocuments: availableCount,
        status: readinessScore === 100 ? 'ready_for_visit' : 'in_progress',
        createdAt: new Date().toISOString()
      };

      if (!USER_HISTORY_STORE[user_id]) {
        USER_HISTORY_STORE[user_id] = [];
      }
      USER_HISTORY_STORE[user_id].unshift(historyRecord);

      return res.json({
        status: 'success',
        message: 'Checklist updated successfully.',
        readinessScore
      });
    } catch (err: any) {
      console.error('Error in POST /api/user/checklist:', err);
      return res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
  });

  // --- LOCATION REFERENCE DATA ENDPOINTS ---
  app.get('/api/locations/states', (req, res) => {
    const states = locationDataService.getStates();
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.json({ status: 'success', states });
  });

  app.get('/api/locations/districts', (req, res) => {
    const state = req.query.state as string;
    if (!state) {
      return res.status(400).json({ status: 'error', error: 'state query parameter is required' });
    }
    const districts = locationDataService.getDistricts(state);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.json({ status: 'success', districts });
  });

  app.get('/api/locations/cities', (req, res) => {
    const state = req.query.state as string;
    const district = req.query.district as string;
    if (!state || !district) {
      return res.status(400).json({ status: 'error', error: 'state and district query parameters are required' });
    }
    const cities = locationDataService.getCities(state, district);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.json({ status: 'success', cities });
  });

  // API Health Endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'SmartSeva API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // --- AI CIVIC GUIDANCE ENDPOINT (Strict Rate Limiting & Deterministic Safety) ---
  const aiLimiter = createRateLimiter(20, 60000);
  app.post('/api/ai/guidance', aiLimiter, async (req, res) => {
    try {
      const { service_id, serviceId, query } = req.body || {};
      const targetId = String(service_id || serviceId || '').trim();

      if (!targetId) {
        return res.status(400).json({
          status: 'error',
          error: 'service_id is required.'
        });
      }

      // Sanitize user query (prevent prompt injection, max 300 chars)
      const userQuery = String(query || '')
        .slice(0, 300)
        .replace(/[<>{}\\]/g, '')
        .trim();

      const service = FULL_SERVICES_CATALOG.find((s) => s.id === targetId);
      if (!service) {
        return res.status(404).json({
          status: 'error',
          error: 'Service not found in official catalog.'
        });
      }

      const deterministicGuidelines = {
        requiredDocuments: service.documentsRequired || [],
        processingTime: service.processingTime,
        estCompletion: service.estCompletion,
        eligibility: service.eligibility,
        importantNotes: service.importantNotes
      };

      const fallbackAdvice = `For ${service.title}, ensure all original documents (${service.documentsRequired.slice(0, 3).join(', ')}) match your name and date of birth exactly. Carry 1 to 2 self-attested photocopies and visit during working hours.`;

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          status: 'success',
          serviceId: service.id,
          serviceTitle: service.title,
          advice: fallbackAdvice,
          source: 'deterministic_rules',
          guidelines: deterministicGuidelines
        });
      }

      // Safe Gemini call with strict timeout
      try {
        const aiPromise = ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Citizen Question: ${userQuery || 'What documents and precautions do I need?'}\nService: ${service.title}\nOfficial Requirements: ${service.documentsRequired.join(', ')}\nEligibility: ${service.eligibility}`
                }
              ]
            }
          ],
          config: {
            systemInstruction:
              'You are SmartSeva Official Civic Assistant for Indian Citizen Services. Provide concise (2 to 3 sentences, max 80 words), legally accurate document preparation advice. Deterministic departmental rules are paramount and must never be altered. Never ask for or accept OTPs, passwords, or personal credentials.',
            maxOutputTokens: 150
          }
        });

        // 7000ms strict timeout race
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI_TIMEOUT')), 7000)
        );

        const response: any = await Promise.race([aiPromise, timeoutPromise]);
        const text = response.text ? response.text.trim() : fallbackAdvice;

        return res.json({
          status: 'success',
          serviceId: service.id,
          serviceTitle: service.title,
          advice: text,
          source: 'ai',
          guidelines: deterministicGuidelines
        });
      } catch (aiErr: any) {
        // Safe fallback without server disruption
        return res.json({
          status: 'success',
          serviceId: service.id,
          serviceTitle: service.title,
          advice: fallbackAdvice,
          source: 'deterministic_fallback',
          guidelines: deterministicGuidelines
        });
      }
    } catch (err: any) {
      console.error('Error in /api/ai/guidance:', err?.message || err);
      return res.status(500).json({
        status: 'error',
        error: 'An internal error occurred while generating guidance.'
      });
    }
  });

  // Catch-all 404 handler for undefined API routes (ensures JSON error instead of SPA HTML)
  app.all('/api/*', (req, res) => {
    return res.status(404).json({
      status: 'error',
      error: `API route ${req.method} ${req.path} not found.`
    });
  });

  // Global Express Error Handling Middleware (prevents uncaught crashes and stack leakage)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[Production Server Error]:', err?.message || 'Unknown error');
    if (!res.headersSent) {
      res.status(500).json({ status: 'error', error: 'An unexpected error occurred. Please try again.' });
    }
  });

  // Vite Middleware Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartSeva Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
