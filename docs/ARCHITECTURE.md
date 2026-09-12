# SmartSeva — Architecture & System Design Specification

## 1. System Overview
SmartSeva is a high-performance civic preparation portal engineered to help citizens navigate official service requirements, track document readiness, and identify the correct jurisdictional facilitation offices before arriving in person.

The platform is designed with:
- **Zero Document Uploads**: Eliminates citizen liability by strictly managing readiness check states client-side and in isolated user records.
- **Zero Client-Side Secret Exposure**: Gemini AI keys and database service credentials reside exclusively on the server.
- **Sub-100ms API Responses**: In-memory caching, bounding-box spatial indexing, and lean response projections.

---

## 2. High-Level Component Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CITIZEN BROWSER (CLIENT)                        │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌────────────┐  │
│  │   React 18 SPA (Vite) │  │  Language Context     │  │ Auth State │  │
│  │   Tailwind + Lucide   │  │  (EN / TE / HI / KN)  │  │ (Citizen)  │  │
│  └───────────┬───────────┘  └───────────────────────┘  └─────┬──────┘  │
└──────────────┼───────────────────────────────────────────────┼─────────┘
               │ HTTPS (REST API)                              │
               ▼                                               │
┌──────────────────────────────────────────────────────────────┴─────────┐
│                   BACKEND SERVICE (Railway / Container)                │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Reverse Proxy / CORS Guard / IP Rate Limiter (120/min & 20/min) │  │
│  └───────────────────┬───────────────────────────────┬──────────────┘  │
│                      │                               │                 │
│         ┌────────────▼────────────┐     ┌────────────▼────────────┐    │
│         │ Catalog & Office Engine │     │ AI Guidance Proxy       │    │
│         │ (Spatial Index & Cache) │     │ (Gemini 2.5 Flash Race) │    │
│         └────────────┬────────────┘     └────────────┬────────────┘    │
└──────────────────────┼───────────────────────────────┼─────────────────┘
                       │                               │
       ┌───────────────▼───────────────┐               ▼
       │      SUPABASE POSTGRESQL      │     ┌───────────────────┐
       │                               │     │  Google Gemini    │
       │  • users_profile              │     │  2.5 Flash API    │
       │  • services & checklists      │     │  (Server Secret)  │
       │  • preparation_history        │     └───────────────────┘
       │  • offices (Spatial index)    │
       │  • Row-Level Security (RLS)   │
       └───────────────────────────────┘
```

---

## 3. Technology Stack Breakdown

### Frontend Layer
- **Framework**: React 18 with Vite build tool.
- **Styling**: Tailwind CSS utility classes with an Atkinson Hyperlegible Next + Public Sans typography hierarchy.
- **Icons**: Lucide React for consistent UI indicators.
- **Transitions**: Motion for accessible, subtle view transitions.
- **Internationalization**: Custom zero-dependency multilingual provider supporting English (`en`), Telugu (`te`), Hindi (`hi`), and Kannada (`kn`).

### Backend Layer
- **Runtime**: Node.js 18+ (Express 4) compiled to a single self-contained CommonJS executable (`dist/server.cjs`) via `esbuild`.
- **API Specification**: Standard REST endpoints adhering to JSON API response conventions (`status`, `items`, `page`, `page_size`, `total_pages`).
- **Safety Middleware**: CORS origin validation, JSON payload size limiter (100kb), and sliding-window IP rate limiters.
- **AI Integration**: Server-side `@google/genai` client invoking Gemini 2.5 Flash with prompt sanitization and a 7-second timeout race against deterministic departmental rules.

### Persistence & Identity Layer
- **Database**: Supabase PostgreSQL 15.
- **Authentication**: Supabase Auth / Phone OTP and email-password credential hashing.
- **Access Control**: PostgreSQL Row-Level Security (RLS) ensuring that queries on user profiles, checklists, and history are filtered by `auth.uid() = user_id`.

---

## 4. Core Subsystem Workflows

### 4.1. Authentication Flow
```
Citizen
   │  1. Submits Mobile Number (10 digits) or Email
   ▼
Frontend Auth Context
   │  2. Triggers OTP delivery or credential verification
   ▼
Backend / Supabase Auth
   │  3. Validates OTP or verifies SHA-256 password hash
   │  4. Returns JWT Session Token & Citizen Profile
   ▼
Client Session State
      5. Stores session locally, initializing language and user profile
```

### 4.2. Service & Document Checklist Flow
```
Citizen selects Service (e.g. "Passport Application")
   │
   ▼
Frontend requests /api/services/passport
   │
   ├──> Cached in-memory: returns service metadata, fees, and processing time
   │
   ▼
Interactive Checklist Screen
   │
   ├──> Loads required & optional documents from catalog
   ├──> Citizen marks items: "Available", "Missing", or "Replace/Renew"
   ├──> State persists in localStorage + remote /api/user/checklist (if logged in)
   │
   ▼
Preparation Summary
   └──> Computes readiness score (e.g. 100% Ready or N docs missing)
   └──> Generates printable preparation plan
```

### 4.3. Location Resolution Flow
SmartSeva supports three complementary location discovery mechanisms:
1. **GPS (HTML5 Geolocation)**:
   - Queries browser `navigator.geolocation.getCurrentPosition`.
   - Sends coordinates to OpenStreetMap Nominatim reverse geocoding with a 6-second timeout.
   - Resolves city, district, and PIN code.
2. **PIN Code Search**:
   - Citizen enters a 6-digit Indian postal code.
   - Backend matches postal code boundary cache (India Post dataset).
   - Resolves corresponding district and state.
3. **Manual Selection**:
   - Cascading dropdown/modal: State → District → City.
   - Backed by cached reference endpoints (`/api/locations/states`, `/api/locations/districts`, `/api/locations/cities`).

### 4.4. Relevant Office Matching Flow
```
Location resolved + Service selected
   │
   ▼
GET /api/offices/nearby?service_id=passport&pincode=506001
   │
   ▼
Backend Matching Engine:
   1. Determines required office types for service (e.g. PSK, POPSK).
   2. Filters office registry by state/district/pincode bounding candidates.
   3. Computes Haversine distance if coordinates are present.
   4. Sorts by: Primary Jurisdictional Match → Distance in KM.
   │
   ▼
Returns Paginated Office Collection with:
   - Operating hours (Monday–Friday 9:00 AM – 5:00 PM)
   - Counter services handled
   - Contact numbers and full address
   - Direct Google Maps directions link
```

### 4.5. AI Civic Guidance Boundary
```
Citizen submits missing document query
(e.g. "My electricity bill is in my father's name, can I use it for Passport?")
   │
   ▼
POST /api/ai/guidance (Rate limit: 20 req/min/IP)
   │
   ▼
Backend AI Controller:
   ├── Step 1: Sanitize input (strip prompt injection delimiters, length cap at 500 chars).
   ├── Step 2: Formulate civic system prompt with departmental context.
   ├── Step 3: Race Gemini 2.5 Flash against 7000ms timeout.
   │
   ├── [Case A: Gemini responds within 7s]
   │    └── Formats concise 2-sentence actionable advice with acceptable alternatives.
   │
   └── [Case B: Gemini times out or API key missing]
        └── Seamlessly returns deterministic official departmental rules from catalog.
```

---

## 5. Security & Isolation Boundaries

| Boundary | Enforcement Mechanism |
|---|---|
| **Client ↔ Server** | HTTPS, CORS domain whitelist (`CORS_ORIGIN`), in-memory IP rate limiting. |
| **API Keys** | `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` reside exclusively in server memory; never bundled into Vite static assets. |
| **Citizen Data Isolation** | PostgreSQL Row-Level Security (`auth.uid() = user_id`). Citizens cannot query other citizens' preparation records. |
| **Zero Document Uploads** | No file upload endpoints or multipart handlers exist in the backend. File attachments are technically impossible. |
| **AI Prompt Injection** | System instructions enforce strict civic scope; input is sanitized before passing to the model. |
