# SmartSeva — Security Architecture & Privacy Principles

## 1. Security Philosophy
SmartSeva is designed around the principle of **Minimal Privilege and Zero Citizen Liability**. Because civic interactions frequently involve sensitive personal identity materials, SmartSeva was intentionally engineered to eliminate the necessity of handling, uploading, or transmitting citizens' digital document files.

---

## 2. Authentication & Credential Management
- **Phone Number Authentication**: Supported via 10-digit Indian mobile numbers (`^[6-9][0-9]{9}$`) with one-time verification codes (OTP).
- **Email & Password Authentication**: Email authentication uses standardized RFC 5322 regex validation. Passwords are never stored in plaintext and are hashed before evaluation.
- **Session Tokens**: Client sessions use standard signed JWTs. Tokens are stored in secure browser local storage and transmitted via standard `Authorization: Bearer <token>` headers.
- **Third-Party OAuth**: External social logins are intentionally omitted from public terminals to prevent third-party telemetry leakage during civic preparation.

---

## 3. Authorization & Row-Level Security (RLS)
- **Database-Level Isolation**: Access control is enforced at the database engine level via PostgreSQL Row-Level Security (RLS), not solely in application code.
- **Citizen Isolation**:
  - Tables containing citizen preparation state (`users`, `user_checklists`, `preparation_plans`, `preparation_history`, `user_settings`) strictly enforce `auth.uid() = user_id`.
  - A citizen cannot view, mutate, or query the preparation plans or document check status of another citizen.
- **Public Catalogs**: Catalogs of government services, requirements, categories, and public offices are strictly read-only for client connections. Administrative mutations require database service-role privileges.

---

## 4. Secret Management & Server-Side AI Protection
- **No Client Secrets**: No API keys or service role secrets are bundled into the client-side JavaScript artifact (`dist/assets/index-*.js`).
- **Gemini API Key Protection**:
  - The `GEMINI_API_KEY` is read strictly server-side via `process.env.GEMINI_API_KEY`.
  - Citizens interact with AI capabilities exclusively through the backend reverse proxy endpoint `POST /api/ai/guidance`.
  - The client has zero direct access to the Google Generative Language endpoints.
- **Supabase Service Key Protection**:
  - The frontend only receives the public `SUPABASE_ANON_KEY`.
  - Administrative tasks utilize the backend-restricted `SUPABASE_SERVICE_ROLE_KEY`.

---

## 5. Input Validation & API Protection
- **Payload Limits**: All incoming JSON request bodies are capped at 100 KB (`express.json({ limit: '100kb' })`) to prevent memory exhaustion attacks.
- **Input Sanitization**:
  - AI guidance queries are limited to 500 characters and stripped of prompt-injection delimiter strings (`SYSTEM:`, `[INST]`, `Ignore previous instructions`).
  - Coordinates are validated against geographical bounds: latitude (-90.0 to 90.0) and longitude (-180.0 to 180.0).
  - PIN codes are validated against the 6-digit Indian postal code regex (`^[1-9][0-9]{5}$`).
- **Structured Error Responses**: Unhandled exceptions never return raw stack traces or internal server paths. All API errors return standardized JSON:
  ```json
  {
    "status": "error",
    "error": "Human-readable description of error"
  }
  ```

---

## 6. Rate Limiting & Abuse Prevention
To protect shared civic infrastructure against automated scraping, spam, or denial-of-service attempts, the backend implements sliding-window in-memory IP rate limiting:
- **General API Endpoints**:
  - Limit: **120 requests per minute** per client IP address.
  - Applies to `/api/services`, `/api/offices/nearby`, `/api/locations/*`.
- **AI Civic Guidance Endpoint**:
  - Limit: **20 requests per minute** per client IP address.
  - Applies to `POST /api/ai/guidance`.
  - Returns HTTP 429 (`Too Many Requests`) if threshold is exceeded.

---

## 7. Citizen Privacy & Location Handling
- **No Sensitive Document Uploads**:
  - SmartSeva does not ask citizens to scan, capture, or upload documents, certificates, or identity cards.
  - Citizens only interact with self-check indicators (`Available`, `Missing`, `Replace/Renew`).
  - The system has zero storage liability for Aadhaar cards, PAN cards, or land records.
- **Location Privacy**:
  - GPS coordinates obtained via HTML5 Geolocation are used transiently in-memory to compute distance to nearby facilitation centers.
  - GPS coordinates are never permanently logged or associated with a citizen's profile.
  - Citizens who prefer not to share GPS can use 6-digit PIN code lookup or manual state/district selection.
- **Logging Hygiene**:
  - Production server logs only record method, endpoint, status code, and response time (e.g. `[API GET] /api/services/passport 200 (4.2ms)`).
  - Authorization headers, user identifiers, contact numbers, and search queries are excluded from logs.

---

## 8. Accurate Platform Boundaries & Disclaimers
- **Independent Preparation Aid**: SmartSeva is an independent citizen preparation and document readiness portal. It is not an official government application processing portal and does not issue identity cards, licenses, or legal certificates.
- **No Processing Guarantees**: SmartSeva does not guarantee official approval or accelerated turnaround times at government offices. Final document verification and eligibility adjudication remain strictly within the purview of authorized government officers.
- **Advisory Guidance**: AI guidance is intended as an informational checklist aid based on published public citizen charters.
