# SmartSeva — Citizen Journey & User Flow Specification

## 1. End-to-End Citizen Journey Overview
The SmartSeva user experience is designed for high accessibility, low cognitive friction, and seamless multilingual operation. A citizen can complete a full preparation cycle in under 3 minutes.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CITIZEN PREPARATION CYCLE                       │
│                                                                        │
│  [1. Splash / Language] ──▶ [2. Auth / Login] ──▶ [3. Service Catalog] │
│                                                          │             │
│  [6. Missing Doc Help] ◀── [5. Doc Checklist] ◀── [4. Service Details] │
│          │                                                             │
│          ▼                                                             │
│  [7. Prep Summary] ───────▶ [8. Location Mode] ──▶ [9. Office Match]   │
│                                                          │             │
│  [12. Directions Map]  ◀─── [11. Contact & Timings] ◀─── [10. Details] │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Step-by-Step Flow Breakdown

### Step 1: Splash & Language Selection
- **Screen**: `SplashScreen.tsx`
- **Citizen Action**: Citizen opens SmartSeva. They are greeted with the core mission and a quick language picker pill (English, Telugu, Hindi, Kannada).
- **Behavior**: Selected language is persisted immediately in browser local storage and propagates across all UI labels, navigation buttons, and service descriptions.
- **Privacy Notice**: Display badge indicates *"Private Self-Check • No Document Uploads Required"*.

### Step 2: Authentication
- **Screen**: `LoginScreen.tsx`
- **Citizen Action**:
  - **Phone Login**: Enters 10-digit mobile number -> Receives 6-digit OTP -> Validates code.
  - **Email Login**: Enters registered email address and password.
  - **Guest Access**: Citizen can also proceed directly to search services; authentication is prompted when saving a preparation plan to history.
- **State**: User session and citizen name are initialized into `AuthContext`.

### Step 3: Service Discovery & Selection
- **Screen**: `HomeScreen.tsx` & `SearchServicesScreen.tsx`
- **Citizen Action**:
  - Browses categorized service chips: **Identity**, **Transport**, **Revenue**, **Certificates**, **Welfare**.
  - Or uses the instant debounced search bar with predictive matching (e.g. typing "license", "aadhaar", or "caste").
  - Taps a service card (e.g. "New Driving Licence" or "Passport Application").

### Step 4: Service Overview & Official Requirements
- **Screen**: `ServiceDetailsScreen.tsx`
- **Citizen Review**:
  - **Official Fee**: Breakdown of application fees, portal charges, and smart-card fees.
  - **Processing Timeline**: Standard departmental turnaround (e.g. 7-10 working days).
  - **Eligibility Criteria**: Age rules, state residency clauses, and prerequisites.
  - **Key Guidelines**: Important notes regarding gazette notices, biometric appointments, and physical signatures.
- **Action**: Citizen taps *"Start Preparation Checklist"*.

### Step 5: Interactive Document Checklist
- **Screen**: `DocumentChecklistScreen.tsx`
- **Citizen Action**:
  - Views categorized required documents (Proof of Identity, Proof of Address, Date of Birth Proof, Photographs).
  - Taps status chips for each document:
    - **I Have It** (Green checkmark): Marked as physically ready.
    - **I Need It** (Amber alert): Flagged as missing.
    - **Replace / Renew** (Orange icon): Flagged as expired or damaged.
  - Live progress meter updates (e.g. *"3 of 5 required documents ready — 60%"*).
- **Privacy Guarantee**: Clear notice reminds the citizen that no scanning or uploading is required; items are recorded purely for visit readiness.

### Step 6: Missing Document & Alternative Guidance
- **Screen**: `DocumentGuideScreen.tsx` & AI Modal
- **Citizen Action**:
  - For any missing document, citizen taps *"See how to get this"*.
  - Modal provides official departmental alternative lists (e.g. If birth certificate is missing, acceptable alternatives include Class 10 Marks Memo, School Leaving Certificate, or Passport).
  - Citizen can submit specific questions to the **AI Civic Assistant** (e.g. *"Can I use an e-Aadhaar without a physical PVC card?"*).
  - Server-side Gemini 2.5 Flash provides instant, practical advice backed by deterministic fallback rules.

### Step 7: Preparation Summary & Printable Plan
- **Screen**: `PreparationPlanScreen.tsx` & `CompletionScreen.tsx`
- **Citizen Review**:
  - Clean summary card showing overall Readiness Score (e.g. *"85% Prepared"*).
  - Breakdown of verified documents to carry in original + recommended copies.
  - Action items for missing items before office arrival.
  - Button to **Print / Save PDF Preparation Summary**.
- **Action**: Citizen taps *"Find Nearest Office to Submit"*.

### Step 8: Location Selection (Tri-Mode Discovery)
- **Component**: `SearchableLocationModal.tsx` / `NearbyOfficesScreen.tsx`
- **Three Supported Methods**:
  1. **Current GPS Location**: Taps *"Use My Current Location"*. Browser prompts for location permission; system reverse-geocodes coordinates into city and district.
  2. **6-Digit Postal PIN Code**: Enters Indian postal code (e.g. `500001` or `506001`); system matches local boundary dataset.
  3. **Manual State & District Selection**: Selects state (e.g. Telangana) -> district (e.g. Warangal) -> city.

### Step 9: Relevant Office Matching
- **Screen**: `NearbyOfficesScreen.tsx`
- **Filtering Engine**:
  - Automatically matches service to designated office types (e.g. Passport filters exclusively for PSK / POPSK; Driving License filters for RTOs).
  - Computes approximate distance in kilometers from citizen's location.
  - Displays office cards with status badges (*"Open Today"*, *"Accepts Walk-Ins"*).

### Step 10: Office Details & Operational Timings
- **Component**: Office Details Expanded View
- **Information Displayed**:
  - Official office name and jurisdiction.
  - Complete physical street address.
  - Working hours (e.g. *Monday - Friday: 9:00 AM - 5:00 PM*).
  - Public enquiry phone numbers.
  - Facilitation counter tips (e.g. *"Token counter closes at 1:30 PM for fresh submissions"*).

### Step 11: Navigation & Turn-by-Turn Directions
- **Action**: Citizen taps *"Get Directions"*.
- **Behavior**: Launches Google Maps navigation with pre-populated destination coordinates for turn-by-turn driving or transit directions.

---

## 3. Global Navigation, Back Navigation & State Persistence

### Back Navigation Consistency
- Every detail screen (`ServiceDetailsScreen`, `DocumentChecklistScreen`, `DocumentGuideScreen`, `NearbyOfficesScreen`, `PreparationPlanScreen`) features a dedicated top-left **Back Button**.
- Tapping Back returns the citizen to the immediate preceding screen without losing checklist checkbox state or active search filters.

### Multilingual Persistence
- Language state is managed by `LanguageContext` and backed by `localStorage.getItem('smartseva_lang')`.
- When switching between English, Telugu, Hindi, and Kannada:
  - Header, breadcrumbs, search placeholders, and buttons translate immediately.
  - Service titles, eligibility criteria, and document requirements update in real time.
  - Official office names and physical addresses preserve accurate local transliterations to prevent navigation errors.
