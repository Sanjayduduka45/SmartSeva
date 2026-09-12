# SmartSeva — Digital Citizen Preparation Portal

> **A citizen-first preparation portal helping people verify required documents, understand office procedures, and locate relevant civic facilitation centers before visiting government offices.**

---

## 1. Problem Statement
Every year, millions of citizens across India visit municipal, regional transport, passport, revenue, and utility offices only to be turned away due to:
- Missing supporting documents (e.g. proof of date of birth, gazette notifications, or specific address proofs)
- Unprepared physical copies or non-compliant document formats
- Lack of clarity regarding official fee structures and submission counters
- Arriving at the wrong jurisdictional office or during non-operational hours

These challenges lead to repeated office visits, wasted workdays, and unnecessary reliance on unauthorized intermediaries.

---

## 2. The Solution
**SmartSeva** is a client-side and server-assisted civic preparation platform. It functions as a single entry point where citizens can:
1. Select their required civic service (e.g., Driving License, Passport, Aadhaar update, Caste Certificate, Voter ID).
2. Review official eligibility criteria, fee structures, processing timelines, and accepted document proofs.
3. Use a private, client-side interactive checklist to check off available documents without ever uploading personal files.
4. Receive intelligent civic guidance on missing document alternatives and department procedures via server-side Gemini 2.5 Flash with deterministic fallback.
5. Locate the nearest verified jurisdictional facilitation centers (RTOs, PSKs, UIDAI Seva Kendras, MeeSeva / CSCs) via GPS, 6-digit PIN code, or state/district hierarchy.

---

## 3. Target Users
- **Urban & Rural Citizens**: Individuals applying for or renewing identity, transport, revenue, education, or welfare certificates.
- **First-Time Applicants**: Young adults applying for their first PAN card, Passport, or Learner's License who need step-by-step guidance.
- **Facilitation Center Operators & Volunteers**: CSC / MeeSeva village-level entrepreneurs assisting local residents.
- **Multilingual Communities**: Citizens preferring native language interfaces in Telugu, Hindi, Kannada, or English.

---

## 4. Key Capabilities
- **Multi-Category Catalog**: 16+ core public services spanning Identity, Transport, Revenue, Welfare, and Certificates.
- **Dynamic Document Checklist**: Categorized requirements (Identity, Address, Age, Photos) with status tracking (`Available`, `Missing`, `Replace/Renew`).
- **Private Self-Check**: Zero document uploads. Citizen document files are never requested, scanned, or transmitted over the wire.
- **Intelligent Civic Guidance**: Backend-proxied Gemini 2.5 Flash guidance for missing documents, renewal advice, and gazette procedures, guarded by deterministic departmental rules.
- **Tri-Mode Location Discovery**:
  - **GPS**: High-accuracy HTML5 geolocation with reverse geocoding.
  - **PIN Code**: 6-digit postal code resolution via India Post boundary lookup.
  - **Manual Hierarchy**: Cascading State → District → City selection.
- **Relevant Office Matching**: Service-to-office classification mapping (e.g. Driving License to RTOs, Passport to PSK/POPSKs, Certificates to Tahsildar/MeeSeva).
- **Multilingual Support**: Real-time localized UI and metadata in English, Telugu, Hindi, and Kannada.
- **Offline Readiness**: Service worker caching and network status alerts preventing data loss during intermittent connectivity.

---

## 5. Major User Flow
```
[ Citizen Lands on Portal ]
           │
           ▼
[ Authentication ] ── (Mobile OTP or Email/Password)
           │
           ▼
[ Service Selection ] ── (Browse by Category or Search Catalog)
           │
           ▼
[ Service Requirements & Fees ] ── (Review Official Eligibility & Timeline)
           │
           ▼
[ Interactive Checklist ] ── (Mark Available / Missing Documents Locally)
           │
           ▼
[ Missing Document Guidance ] ── (AI Assistance + Department Guidelines)
           │
           ▼
[ Preparation Summary ] ── (Printable Readiness Plan & Form Checklist)
           │
           ▼
[ Location Selection ] ── (GPS Geolocation / 6-Digit PIN / State Hierarchy)
           │
           ▼
[ Relevant Office Discovery ] ── (Jurisdictional Sorting & Distance Calculation)
           │
           ▼
[ Office Details & Directions ] ── (Timings, Counter Services & Turn-by-Turn Map)
```

---

## 6. Technology Stack
- **Frontend SPA**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React icons, Motion animations.
- **Backend API**: Node.js / Express CommonJS bundled service (`dist/server.cjs`) and REST API specification.
- **Database & Authentication**: Supabase (PostgreSQL 15) with Row-Level Security (RLS) policies and B-tree/spatial indexes.
- **AI Engine**: Google Gemini 2.5 Flash via `@google/genai` with server-side proxying, rate limiting, and prompt sanitization.
- **Hosting & Infrastructure**:
  - **Frontend**: Vercel (SPA rewrite rules via `vercel.json`).
  - **Backend**: Railway / Cloud Run container (`Procfile`).
  - **Database**: Supabase Cloud.

---

## 7. Project Structure
```
smartseva/
├── .env.example              # Template for environment variables
├── .gitignore                # Production git exclusion rules
├── Procfile                  # Railway deployment process command
├── index.html                # Single-page entry HTML
├── metadata.json             # Application identity & capabilities
├── package.json              # Project dependencies & build scripts
├── server.ts                 # Backend Express API & Vite dev middleware
├── tsconfig.json             # TypeScript configuration
├── vercel.json               # Vercel SPA routing & cache configuration
├── vite.config.ts            # Vite bundler configuration
├── docs/                     # Technical & operational documentation
│   ├── API_DOCUMENTATION.md  # Detailed REST API endpoints & schemas
│   ├── ARCHITECTURE.md       # Architecture diagrams & component topology
│   ├── DATABASE.md           # PostgreSQL schema, indexes & RLS rules
│   ├── DEPLOYMENT_GUIDE.md   # Vercel, Railway & Supabase deployment
│   ├── SECURITY_AND_PRIVACY.md # Security audit, secret handling & privacy
│   ├── USER_FLOW.md          # Citizen journey & navigation documentation
│   ├── DEMO_GUIDE.md         # Evaluator demonstration walkthrough
│   └── MAINTENANCE_GUIDE.md  # Developer maintenance & expansion manual
└── src/
    ├── App.tsx               # Root application router & state manager
    ├── main.tsx              # React DOM entry point
    ├── index.css             # Global Tailwind styling
    ├── types.ts              # TypeScript domain types & interfaces
    ├── components/           # Reusable UI components
    │   ├── ErrorBoundary.tsx # Top-level error boundary with recovery
    │   ├── Navigation.tsx    # Header, language selector & breadcrumbs
    │   ├── OfflineBanner.tsx # Connectivity monitor & offline toast
    │   └── SearchableLocationModal.tsx # Location picker modal
    ├── context/              # Global state contexts
    │   ├── AuthContext.tsx   # Citizen session & profile management
    │   └── LanguageContext.tsx # Active locale & translation provider
    ├── data/                 # Localized catalogs & static datasets
    │   ├── localizedServices.ts # Multilingual service catalog & fees
    │   ├── locationData.ts   # States, districts, cities & PIN boundaries
    │   ├── mockData.ts       # Fallback services & user history seed
    │   └── officesData.ts    # Comprehensive office registry (RTO, PSK, etc.)
    ├── db/                   # Database scripts
    │   └── schema.sql        # Supabase PostgreSQL DDL & RLS policies
    ├── screens/              # Core application view screens
    │   ├── SplashScreen.tsx  # Initial trust screen & language picker
    │   ├── OnboardingScreen.tsx # Citizen guidance walkthrough
    │   ├── LoginScreen.tsx   # Mobile OTP & email authentication
    │   ├── HomeScreen.tsx    # Service dashboard & category browser
    │   ├── ServiceDetailsScreen.tsx # Service guidelines & fee breakdown
    │   ├── DocumentChecklistScreen.tsx # Interactive document readiness tracker
    │   ├── DocumentGuideScreen.tsx # Alternative & missing document guide
    │   ├── PreparationPlanScreen.tsx # Final readiness plan & print view
    │   ├── NearbyOfficesScreen.tsx # Geocoded office discovery & filtering
    │   ├── ProfileScreen.tsx # Citizen account profile & language settings
    │   ├── NotificationsScreen.tsx # Expiry alerts & readiness updates
    │   └── HelpSupportScreen.tsx # FAQs, helpline numbers & escalation
    ├── services/             # Client API integration services
    │   ├── locationService.ts # Geolocation & pincode resolution
    │   └── officeService.ts  # Office query builder & distance filter
    ├── translations/         # Localization dictionaries
    │   └── index.ts          # English, Telugu, Hindi, Kannada strings
    └── utils/                # Helper utilities
        ├── apiError.ts       # Structured error parser
        ├── debounce.ts       # Search input debouncer
        └── serviceDocuments.ts # Document relationship rules
```

---

## 8. Local Setup & Installation

### Prerequisites
- Node.js 18.x or later
- npm or bun

### Step 1: Clone and Install
```bash
git clone https://github.com/your-org/smartseva.git
cd smartseva
npm install
```

### Step 2: Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the required variables (see Section 9).

### Step 3: Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 9. Environment Variables
| Variable | Description | Default / Format |
|---|---|---|
| `PORT` | Listening port for backend server | `3000` |
| `NODE_ENV` | Runtime environment mode | `development` or `production` |
| `GEMINI_API_KEY` | Google Gemini API key (server-side secret) | `AIzaSy...` |
| `CORS_ORIGIN` | Allowed cross-origin frontend domains | `http://localhost:3000,https://smartseva.vercel.app` |
| `RATE_LIMIT_WINDOW_MS` | Rate limiting sliding window in ms | `60000` |
| `RATE_LIMIT_MAX_API` | Max requests per minute per IP for general API | `120` |
| `RATE_LIMIT_MAX_AI` | Max requests per minute per IP for AI guidance | `20` |
| `SUPABASE_URL` | Supabase project API URL | `https://<project-id>.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase public anonymous key | String |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase administrative key (server-only) | String |
| `VITE_API_URL` | Frontend API proxy destination | Empty or `https://smartseva-api.up.railway.app` |

---

## 10. Database Setup (Supabase)
1. Log in to the [Supabase Dashboard](https://supabase.com).
2. Create a new PostgreSQL project.
3. Open the **SQL Editor** in your project dashboard.
4. Paste the entire content of `src/db/schema.sql` and click **Run**.
5. This initializes:
   - 5 core relational tables: `users_profile`, `services`, `checklists`, `preparation_history`, `offices`.
   - B-tree and composite spatial indexes.
   - Row-Level Security (RLS) policies ensuring users only query their own checklists and history.

---

## 11. Testing & Build Verification
```bash
# Validate TypeScript typing and linting rules
npm run lint

# Compile frontend bundle and server bundle
npm run build

# Start production server bundle locally
npm start
```

---

## 12. Deployment
- **Frontend (Vercel)**: Connect repository, set build command to `npm run build`, output directory to `dist`, and define `VITE_API_URL`. The included `vercel.json` ensures SPA rewrites to `/index.html`.
- **Backend (Railway)**: Connect repository, Railway detects `Procfile` and runs `node dist/server.cjs`. Configure backend environment variables in Railway dashboard.
- For complete step-by-step instructions, see [`docs/DEPLOYMENT_GUIDE.md`](./docs/DEPLOYMENT_GUIDE.md).

---

## 13. Security & Privacy Principles
- **No Document Uploads**: SmartSeva does not accept, scan, or store digital copies of citizen documents. Document readiness is tracked purely via client-side check states.
- **Server-Side AI Secrets**: The Gemini API key is stored strictly on the server and is never passed to client bundles.
- **Row-Level Security**: Citizens can only read and modify their own preparation checklists and saved histories.
- **Rate-Limiting**: Production API routes enforce in-memory sliding-window rate limits (120 req/min general, 20 req/min AI) to prevent automated abuse.
- **Accurate Claims**: SmartSeva is an independent citizen preparation and facilitation aid. It does not claim to be an official government application processing portal or offer guaranteed government approvals.

---

## 14. Known Limitations
- **Nominatim Geocoding Rate Limits**: Reverse GPS geocoding uses OpenStreetMap Nominatim with an enforced 6-second timeout; if external rate limits are encountered, the system gracefully falls back to PIN code or manual selection.
- **Physical Office Verification**: While office timings and counters are maintained in the database registry, citizens are advised to check official gazette notices on regional public holidays.
- **AI Guidance Advisory**: AI guidance provides preparation recommendations based on departmental manuals; it does not substitute for on-ground scrutiny by authorized verification officers.
