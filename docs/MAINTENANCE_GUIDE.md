# SmartSeva — Developer Maintenance & Operations Manual

## 1. Purpose & Scope
This guide is the authoritative handover baseline for developers, DevOps engineers, and system maintainers who will maintain, extend, troubleshoot, and operate the SmartSeva platform. It details repository topology, maintenance procedures, location resolution logic, AI boundaries, security standards, release checklists, and troubleshooting runbooks.

---

## 2. Project Structure & Responsibilities

### Frontend (`src/`)
- `src/App.tsx`: Top-level application state container, screen navigation router, and offline state coordinator.
- `src/main.tsx`: React 18 DOM mount entry point.
- `src/index.css`: Global Tailwind CSS import declarations (`@import "tailwindcss";`).
- `src/types.ts`: Global TypeScript domain types (`ServiceItem`, `OfficeItem`, `LocationState`, `DocumentItem`, etc.).
- `src/components/`: Reusable presentation and utility components:
  - `ErrorBoundary.tsx`: Top-level React error catcher with graceful fallback.
  - `Navigation.tsx`: Responsive navigation bar, language switcher, profile toggle, and breadcrumbs.
  - `OfflineBanner.tsx`: Live network status banner detecting offline state and sync recovery.
  - `SearchableLocationModal.tsx`: Searchable modal for manual State/District/City selection.
- `src/context/`:
  - `AuthContext.tsx`: Client authentication state, session storage persistence, profile data, and login/logout handlers.
  - `LanguageContext.tsx`: Multilingual locale state (`en`, `te`, `hi`, `kn`), translation lookup helper (`t()`), and persistence.
- `src/data/`:
  - `localizedServices.ts`: Definitive catalog of 30 public services with fees, timelines, eligibility, and localized titles.
  - `locationData.ts`: India postal PIN boundaries, cascading State/District/City indexes, and coordinate approximations.
  - `officesData.ts`: Verified government facilitation offices registry (RTOs, PSKs, UIDAI Kendras, MeeSeva centers).
  - `mockData.ts`: Fallback catalog structure for resilience when network is disconnected.
- `src/db/schema.sql`: Supabase PostgreSQL table definitions, spatial indexes, and Row-Level Security (RLS) policies.
- `src/screens/`: Independent user-facing views:
  - `SplashScreen.tsx`: Language selection & welcome onboarding.
  - `LoginScreen.tsx`: Secure citizen login (Phone + OTP or Email + Password).
  - `HomeScreen.tsx`: Category chips, search bar, and civic service catalog.
  - `ServiceDetailsScreen.tsx`: Statutory fee breakdown, eligibility rules, and timeline overview.
  - `DocumentChecklistScreen.tsx`: Interactive client-side document readiness self-check.
  - `DocumentGuideScreen.tsx`: Missing document guidance, approved alternatives, and departmental steps.
  - `PreparationPlanScreen.tsx`: Printable pre-visit summary, original/photocopy checklists, and readiness score.
  - `NearbyOfficesScreen.tsx`: Tri-mode location resolver (GPS / PIN / Manual), service-filtered office matching, and navigation links.
  - `ProfileScreen.tsx`: Citizen profile view, language preferences, and sign-out controls.
  - `NotificationsScreen.tsx`: Renewal notices and preparation reminders.
  - `HelpSupportScreen.tsx`: Citizen helpline numbers, FAQs, and escalation contacts.
- `src/services/`:
  - `locationService.ts`: Normalizes location from GPS (HTML5 + Nominatim), 6-digit PIN code, or manual selection.
  - `officeService.ts`: Filters offices strictly matching selected service category and computes Haversine distances.
- `src/translations/index.ts`: Unified localization dictionary across English, Telugu, Hindi, and Kannada.
- `src/utils/`:
  - `apiError.ts`: Robust error extractor for network and API responses.
  - `debounce.ts`: Debouncing utility for search inputs.
  - `serviceDocuments.ts`: Document classification logic, metadata registry, and checklist persistence.

### Backend (`server.ts`)
- Bundled into `dist/server.cjs` via `esbuild`.
- Endpoints:
  - `GET /health`: Production liveness probe returning uptime and timestamp.
  - `GET /api/services`: Paginated, filterable civic services catalog.
  - `GET /api/services/:id`: Detailed single-service specification.
  - `GET /api/offices/nearby` & `POST /api/offices/nearby`: Spatial office discovery filtered by service category.
  - `POST /api/ai/guidance`: Server-side Gemini 2.5 Flash gateway with deterministic rule fallback.
  - `GET /api/locations/*`: States, districts, and cities lookup APIs.
- Security middlewares: CORS origin whitelist, sliding-window rate limiters (120 req/min general, 20 req/min AI), payload cap (100kb), and JSON 404 handler for undefined API routes.

---

## 3. Local Development Guide

### Prerequisites
- **Node.js**: Version 18.x or 20.x LTS.
- **Package Manager**: `npm` (v9+) or `bun`.
- **Git**: For version control.

### Setup Instructions
```bash
# 1. Clone the repository
git clone https://github.com/your-org/smartseva.git
cd smartseva

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Start local development server (starts Express + Vite on port 3000)
npm run dev

# 5. Open in browser
# http://localhost:3000
```

### Build & Verification Commands
```bash
# Static type checking
npm run lint

# Production build (Vite client + esbuild CommonJS server)
npm run build

# Start production server
npm start
```

---

## 4. Environment Variables Reference

All environment variables must be declared in `.env.example`. Never commit actual secrets to git.

| Variable | Ownership | Required | Purpose |
|---|---|:---:|---|
| `PORT` | Backend | Yes | Port for Express server (default: `3000`). |
| `NODE_ENV` | Shared | Yes | `development` or `production`. |
| `GEMINI_API_KEY` | Backend Only | Yes | Google Gemini API key for civic guidance proxy. |
| `CORS_ORIGIN` | Backend | Yes | Comma-separated list of allowed frontend domains. |
| `RATE_LIMIT_WINDOW_MS` | Backend | No | Window duration in milliseconds (default: `60000`). |
| `RATE_LIMIT_MAX_API` | Backend | No | Max general API calls per IP per minute (default: `120`). |
| `RATE_LIMIT_MAX_AI` | Backend | No | Max AI queries per IP per minute (default: `20`). |
| `SUPABASE_URL` | Shared | Conditional | Supabase project URL for cloud authentication. |
| `SUPABASE_ANON_KEY` | Shared | Conditional | Supabase public anonymous key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend Only | Conditional | Supabase service-role administrative key. |
| `VITE_API_URL` | Frontend | No | Base URL for API when frontend is hosted separately from backend. |

---

## 5. Database & Migration Baseline

The database schema is defined in `src/db/schema.sql` (and documented in `docs/DATABASE.md`).

### Tables & Relationships
1. `users_profile`: Citizen profiles keyed by `auth.users(id)`.
2. `categories`: High-level civic classifications (`transport`, `identity`, `revenue`, `welfare`, `education`).
3. `services`: Catalog of civic offerings with statutory fees and turnaround times.
4. `requirements`: Granular document proof definitions tied to services (`service_id`).
5. `user_checklists`: Active citizen document check states (`available`, `missing`, `renew`).
6. `preparation_history`: Archived readiness records for returning citizens.
7. `offices`: Physical facilitation centers with latitude, longitude, and category tags.

### Row-Level Security (RLS) Rules
- `users_profile`, `user_checklists`, and `preparation_history` enforce:
  ```sql
  CREATE POLICY "Users access own data only"
  ON user_checklists FOR ALL
  USING (auth.uid() = user_id);
  ```
- `services`, `requirements`, and `offices` enforce public read-only access:
  ```sql
  CREATE POLICY "Public read-only access"
  ON offices FOR SELECT
  USING (is_active = true);
  ```

---

## 6. Authentication Architecture

SmartSeva supports:
1. **Phone + OTP Authentication**: Real-world Indian civic standard for citizens without dedicated email accounts.
2. **Email + Password Authentication**: Standard credentials-based sign-in.
3. **Session Persistence**: Stored securely in `localStorage` under `smartseva_auth_user` and synchronized with Supabase Auth when configured.
4. **Sign-Out**: Clears session tokens, active checklist memory, and resets the navigation stack to the landing screen.
5. **Notice on Third-Party Auth**: Third-party Google login was intentionally removed to protect citizen privacy and avoid external tracking of civic service lookups.

---

## 7. Service Data Maintenance

All service specifications reside in `src/data/localizedServices.ts` and the `services` database table.

### Procedure to Add or Edit a Service
1. Define the service in `FULL_SERVICES_CATALOG` (`src/data/localizedServices.ts`):
   - Set a unique, kebab-case `id` (e.g., `birth-certificate`).
   - Define statutory `feeBreakdown` (government fees vs processing charges).
   - Specify `processingTime`, `eligibility`, and `documentsRequired`.
2. Ensure every document in `documentsRequired` has a corresponding metadata entry in `DOCUMENT_METADATA_REGISTRY` (`src/utils/serviceDocuments.ts`).
3. Verify that translations for title and description exist in `CATEGORY_TRANSLATIONS` and `TRANSLATIONS` (`src/translations/index.ts`).
4. Execute `npm run lint` and `npm run build` to confirm type correctness.

---

## 8. Facilitation Office Data Maintenance

Government offices are stored in `src/data/officesData.ts` and the `offices` database table.

### Strict Data Integrity Rules
- **NEVER Add Fabricated Offices**: Only register real, officially verified RTOs, PSKs, UIDAI Seva Kendras, Tahsildar offices, or authorized citizen centers.
- **Accurate Coordinates**: Provide verified latitude and longitude coordinates to ensure accurate distance sorting and map navigation.
- **Strict Categorization**: The office `category` MUST match the service category (`Transport`, `Identity`, `Revenue`, `Welfare`).

---

## 9. Location System Architecture

SmartSeva implements a normalized tri-mode location resolution engine in `src/services/locationService.ts`:

1. **GPS (HTML5 Geolocation)**:
   - Queries browser `navigator.geolocation.getCurrentPosition`.
   - Reverse geocodes coordinates via OpenStreetMap Nominatim with a 6-second timeout.
2. **Postal PIN Code**:
   - Validates 6-digit Indian PIN format (`^[1-9][0-9]{5}$`).
   - Maps PIN to district, state, and approximate centroid via `locationData.ts`.
3. **Manual Cascading Hierarchy**:
   - State &rarr; District &rarr; City selection with fuzzy district matching.

### Location State Contract
All three methods output a normalized `LocationState`:
```typescript
interface LocationState {
  method: 'gps' | 'pincode' | 'manual' | null;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  district: string | null;
  state: string | null;
  pincode: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
}
```
*Note*: Changing location instantly invalidates cached office results, prompting a fresh query for the current location.

---

## 10. Multilingual Architecture

- Supported Locales: `en` (English), `te` (Telugu), `hi` (Hindi), `kn` (Kannada).
- All UI strings are mapped in `src/translations/index.ts`.
- `useLanguage()` hook provides active `language` and the translation helper `t(key)`.
- Fallback Policy: If a translation key is missing in a target language, it gracefully defaults to English (`en`) without crashing.
- Selected language is persisted in `localStorage` under `smartseva_language`.

---

## 11. AI Guidance & Safety Boundary

- **Backend Gateway**: Implemented in `server.ts` at `POST /api/ai/guidance`.
- **Model**: Google Gemini 2.5 Flash via `@google/genai`.
- **Input Sanitization**: User queries are capped at 500 characters and stripped of prompt-injection keywords (`SYSTEM:`, `[INST]`, `Ignore previous instructions`).
- **Deterministic Guardrails**: Statutory eligibility, official fees, and office mappings are NEVER generated by AI. They are served directly from the verified database.
- **Timeout & Resilience**: Gemini API calls are protected by a 7-second `Promise.race` timeout. If the AI call fails or times out, the endpoint immediately returns verified departmental rules.

---

## 12. Security Release Checklist

Before every production release, verify:
- [ ] No hardcoded API keys or credentials exist in `src/` or `server.ts`.
- [ ] `.env` and `.env.local` are excluded by `.gitignore`.
- [ ] Gemini API key is configured only in server environment variables.
- [ ] API rate limiters (`120 req/min` general, `20 req/min` AI) are active.
- [ ] CORS origin whitelist is configured to permit only authorized domains.
- [ ] Zero document upload inputs exist in the codebase.
- [ ] Database RLS policies are enabled on all user-specific tables.

---

## 13. Deployment Procedures

### Frontend Deployment (Vercel)
1. Link repository to Vercel.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Environment Variable: `VITE_API_URL` (point to Railway backend).
6. Verify `vercel.json` provides SPA routing rewrites to `/index.html`.

### Backend Deployment (Railway)
1. Link repository to Railway.
2. Railway detects `Procfile` command: `web: node dist/server.cjs`.
3. Configure environment variables (`GEMINI_API_KEY`, `CORS_ORIGIN`, `PORT=3000`).
4. Set health check path to `/health`.

---

## 14. Troubleshooting & Diagnostic Runbook

### 1. Frontend Cannot Reach Backend
- **Cause**: Incorrect `VITE_API_URL` or backend server is not running.
- **Diagnostic**: Run `curl -i http://localhost:3000/health` or check the network tab for failed requests.
- **Fix**: Ensure backend is running and `VITE_API_URL` points to the active server.

### 2. CORS Error in Browser Console
- **Cause**: Origin not included in backend `CORS_ORIGIN` whitelist.
- **Diagnostic**: Look for `Access-Control-Allow-Origin` missing in response headers.
- **Fix**: Add frontend origin to `CORS_ORIGIN` in backend environment settings.

### 3. AI Guidance Returns Departmental Fallback
- **Cause**: Missing `GEMINI_API_KEY`, quota exhaustion, or external network timeout.
- **Diagnostic**: Check server logs for `Gemini AI guidance error: ...`.
- **Fix**: Verify API key validity in Google AI Studio; deterministic rules will continue serving users in the interim.

### 4. GPS Geolocation Fails
- **Cause**: Browser location permission denied or insecure HTTP origin.
- **Diagnostic**: Check for `GeolocationPositionError.PERMISSION_DENIED` in console.
- **Fix**: Inform user to allow location access or switch to the 6-digit PIN code search.

### 5. No Offices Found for Service
- **Cause**: No facilitation centers of the requested category are registered within the search radius of the selected location.
- **Diagnostic**: Check `src/data/officesData.ts` for offices matching `category` and `state`.
- **Fix**: Expand search radius or add verified regional offices for the target district.

---

## 15. Release Checklist

### Pre-Release Verification
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` generates valid `dist/` and `dist/server.cjs`.
- [ ] Health endpoint (`GET /health`) returns `status: "ok"`.
- [ ] Authentication, checklist, location selection, and office matching pass manual smoke tests.
- [ ] All four language dictionaries have 100% key parity.
- [ ] Git working tree is clean with no unstaged or uncommitted artifacts.

### Post-Release Verification
- [ ] Production URL loads without console errors.
- [ ] Health probe returns HTTP 200 OK.
- [ ] Search query returns expected services.
- [ ] Nearest office search returns verified locations.
- [ ] AI guidance responds within expected latency.

---

## 16. Change Management Baseline

When making future updates to SmartSeva:
1. **Inspect First**: Read relevant code and documentation before applying edits.
2. **Preserve Working Architecture**: Do not rewrite stable components or replace established libraries.
3. **No Fabricated Data**: Ensure all office entries and government rules are grounded in official departmental sources.
4. **Selective Git Commits**: Never use `git add .` blindly; inspect `git status` and stage files explicitly.
5. **Documentation Synchronization**: When adding an endpoint or changing an environment variable, update `docs/API_DOCUMENTATION.md`, `.env.example`, and this guide immediately.
