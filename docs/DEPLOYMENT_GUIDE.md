# SmartSeva V2 — Production Deployment & Go-Live Guide

## 1. Production Architecture
The SmartSeva platform is architected for high availability, zero credential exposure, sub-100ms response times, and progressive offline readiness:
- **Frontend SPA**: React 18 + Vite + Tailwind CSS deployed to **Vercel** with client-side SPA routing (`vercel.json`) and immutable caching for static assets.
- **Backend Service**: Express / Node.js bundled CommonJS server (`dist/server.cjs`) deployed to **Railway** via `Procfile`, enforcing CORS, IP rate limiting, spatial indexing, and sanitized proxying.
- **Database & Auth**: **Supabase** (PostgreSQL) with Row-Level Security (RLS) policies, B-tree/GiST indexes, and email/mobile authentication.
- **AI Civic Guidance**: **Gemini 2.5 Flash** integrated exclusively through the server-side proxy (`/api/ai/guidance`) with 7-second timeout race, strict token limits, prompt-injection sanitization, and deterministic departmental fallbacks.
- **Source Control**: **GitHub** (main branch) with clean staging, no secret exposure, and comprehensive build workflows.

---

## 2. Environment Variables Configuration
Declare all required environment variables in your deployment dashboards (Vercel & Railway). **Never commit secret values to repository files.**

### Backend Environment Variables (Railway):
| Variable Name | Purpose | Example / Format |
|---|---|---|
| `PORT` | Server listening port | `3000` |
| `NODE_ENV` | Environment mode | `production` |
| `GEMINI_API_KEY` | Server-side Gemini API key | String secret |
| `CORS_ORIGIN` | Allowed production origin(s) | `https://smartseva.vercel.app,https://smartseva.gov.in` |
| `RATE_LIMIT_WINDOW_MS` | Rate limiting window in ms | `60000` |
| `RATE_LIMIT_MAX_API` | General API max requests per window | `120` |
| `RATE_LIMIT_MAX_AI` | AI endpoint max requests per window | `20` |
| `SUPABASE_URL` | Supabase project API URL | `https://xyzcompany.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anonymous public key | String secret |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin service role key | String secret |

### Frontend Environment Variables (Vercel):
| Variable Name | Purpose | Example / Format |
|---|---|---|
| `VITE_API_URL` | Public backend API URL | `https://smartseva-backend.up.railway.app` (or empty if served by full-stack proxy) |

---

## 3. Supabase Production Setup
1. **Create Database Tables & Apply Schema**:
   - Run `/src/db/schema.sql` in the Supabase SQL Editor.
   - Tables initialized: `users_profile`, `services`, `checklists`, `preparation_history`, `offices`.
2. **Verify Row-Level Security (RLS)**:
   - Run verification query:
     ```sql
     SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
     ```
   - Confirm `rowsecurity = true` for `users_profile`, `checklists`, and `preparation_history`.
3. **Verify Indexes**:
   - Ensure indexes `idx_offices_category_pincode`, `idx_offices_city_state`, `idx_checklists_user_service`, and `idx_history_user_created` exist.
4. **Authentication Configuration**:
   - Email/Password enabled.
   - Mobile OTP / Phone login enabled.
   - Google/OAuth disabled as per approved scope.
   - Site URL set to production frontend URL (e.g. `https://smartseva.vercel.app`).

---

## 4. Railway Backend Deployment Procedure
1. **Connect Repository**:
   - Link GitHub repository to Railway project.
2. **Configure Service**:
   - **Root Directory**: `/`
   - **Build Command**: `npm run build`
   - **Start Command**: `node dist/server.cjs` (automatically detected from `Procfile`).
3. **Set Environment Variables**:
   - Add all variables listed in Section 2 under Railway Service Settings.
4. **Deploy & Validate**:
   - Trigger deployment.
   - Check build logs: verify `dist/server.cjs` compiles cleanly.
   - Check runtime logs: confirm `SmartSeva Server running on http://0.0.0.0:3000`.
   - Test Health Probe: `curl https://<railway-domain>/health` -> `{"status":"ok", ...}`.

---

## 5. Vercel Frontend Deployment Procedure
1. **Import Project**:
   - In Vercel dashboard, click **Add New Project** and select the SmartSeva GitHub repository.
2. **Build & Output Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Set Environment Variables**:
   - Set `VITE_API_URL` to your live Railway backend URL (`https://<railway-domain>`).
4. **Deploy & Validate**:
   - Deploy project.
   - Verify `vercel.json` applies client-side rewrite for SPA routes (`/* -> /index.html`).
   - Open production URL and check browser console (0 errors, no mixed content warnings).

---

## 6. Local Development Commands
```bash
# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev

# Run TypeScript typecheck / linter
npm run lint

# Compile production bundle (Vite + esbuild)
npm run build

# Start production server locally
npm start
```

---

## 7. Rollback Procedure
If any critical regression or incident occurs in production:
1. **Vercel Frontend Rollback**:
   - Go to Vercel Dashboard -> **Deployments**.
   - Find the previous green deployment.
   - Click the triple-dot menu (`...`) and select **Instant Rollback**.
   - Traffic routes immediately to the previous immutable build artifact within seconds.
2. **Railway Backend Rollback**:
   - Go to Railway Dashboard -> Project -> **Deployments**.
   - Select the last stable deployment commit.
   - Click **Rollback** to redeploy the previous stable container image.
3. **Database Migration Rollback**:
   - If a schema alteration caused issues, execute the corresponding rollback migration script located in `src/db/` or restore from Supabase Point-in-Time Recovery (PITR) backup snapshot.

---

## 8. Health-Check & Monitoring Endpoints
- **Health Check**: `GET /health` or `GET /api/health`
  - Returns HTTP 200 with JSON payload:
    ```json
    { "status": "ok", "service": "SmartSeva Production API", "timestamp": "...", "uptime": 120.5 }
    ```
- **Logging Policy**:
  - Request logging is structured and minimal (`[API METHOD] PATH STATUS (DURATIONms)`).
  - No authorization tokens, citizen passwords, or PII are printed in server logs.

---

## 9. Known Operational Boundaries
- **Nominatim / OpenStreetMap Geocoding**: Reverse geocoding for GPS coordinates uses OpenStreetMap Nominatim with an enforced 6000ms timeout and graceful fallback to postal pincode or manual district search if external latency spikes occur.
- **Rate Limits**: 120 requests/minute per IP for standard catalog and office searches; 20 requests/minute per IP for AI guidance.
