# SmartSeva High-Performance API Documentation & Specification

## Architecture Overview
The SmartSeva API delivers sub-100ms response times for civic service preparation, document readiness verification, and nearest office discovery. Built with strict performance parameters:
- **Server-Side Pagination**: Standard format `{ status, items, page, page_size, total, total_pages }`
- **Lean Response Projection**: Field selection supported via `?fields=`
- **Bounding-Box Spatial Pre-Filtering**: Haversine calculations applied only to spatial bounding candidates
- **Two-Tier Caching**: In-Memory LRU (3-minute TTL) + HTTP `Cache-Control` (`stale-while-revalidate`)
- **Strict Timeouts**: 6000ms max external network requests via `AbortController`
- **Zero Heavy Production Logging**: Metadata-only logs (`[API METHOD] PATH STATUS (DURATIONms)`)

---

## 1. Nearby Government Offices Search

### `GET /api/offices/nearby`
Performs dual service-matching and location-matching discovery.

#### Query Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service_id` | string | **Yes** | Unique service ID (e.g., `driving-license`, `passport`, `aadhaar-update`) |
| `method` | string | No | Location method (`gps`, `pincode`, `manual`) |
| `lat` / `latitude` | float | Conditional | Latitude (-90.0 to 90.0) |
| `lng` / `longitude` | float | Conditional | Longitude (-180.0 to 180.0) |
| `city` | string | Conditional | City or town name |
| `district` | string | Conditional | District name |
| `state` | string | Conditional | State name |
| `pincode` | string | Conditional | 6-digit Indian postal PIN code |
| `page` | integer | No | Page number (default: 1) |
| `page_size` / `limit` | integer | No | Items per page (default: 20, max: 50) |

#### Caching Policy:
`Cache-Control: public, max-age=120, stale-while-revalidate=60`

#### Response:
```json
{
  "status": "success",
  "service": {
    "id": "driving-license",
    "name": "Driving License",
    "category": "Transport"
  },
  "location": {
    "city": "Hyderabad",
    "district": "Hyderabad",
    "state": "Telangana",
    "pincode": "500001",
    "latitude": 17.385,
    "longitude": 78.4867
  },
  "offices": [
    {
      "id": "rto-hyd-central",
      "name": "RTO Central Hyderabad (Khairatabad)",
      "category": "Transport",
      "office_type": "Regional Transport Office (RTO)",
      "address": "Near Khairatabad Flyover, Hyderabad, Telangana",
      "city": "Hyderabad",
      "district": "Hyderabad",
      "state": "Telangana",
      "pincode": "500004",
      "distanceKm": 2.4,
      "phone": "040-23311234",
      "workingHours": "10:00 AM - 05:00 PM (Mon-Sat)",
      "servicesHandled": ["Driving License", "Learner's License", "RC Transfer"],
      "coordinates": { "lat": 17.4123, "lng": 78.4589 }
    }
  ],
  "total": 6,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

---

## 2. Services Catalog & Search

### `GET /api/services`
Retrieves government services with optional category filtering, text query, and field projection.

#### Query Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | No | Filter by category (e.g., `Identity`, `Transport`, `Certificates`) |
| `q` | string | No | Free-text search query across title, description, and keywords |
| `fields` | string | No | Comma-separated field projection (e.g., `id,title,category,estCompletion`) |
| `page` | integer | No | Page number (default: 1) |
| `page_size` | integer | No | Items per page (default: 20, max: 50) |

#### Caching Policy:
`Cache-Control: public, max-age=300, stale-while-revalidate=120`

#### Response:
```json
{
  "status": "success",
  "items": [
    {
      "id": "driving-license",
      "title": "Driving License",
      "category": "Transport",
      "estCompletion": "15 mins"
    }
  ],
  "page": 1,
  "page_size": 20,
  "total": 12,
  "total_pages": 1
}
```

---

## 3. Service Requirements / Checklist Query

### `GET /api/services/:id/checklist`
Retrieves requirements for a specific service. Eliminates loading the entire requirements table.

#### Caching Policy:
`Cache-Control: public, max-age=600, stale-while-revalidate=180`

#### Response:
```json
{
  "status": "success",
  "serviceId": "driving-license",
  "serviceTitle": "Driving License",
  "totalRequired": 5,
  "totalOptional": 1,
  "requirements": [
    {
      "id": "req-driving-license-1",
      "title": "Learner's License",
      "description": "Official Learner's License verification document for Driving License.",
      "required": true,
      "status": "not_sure",
      "category": "Required Document",
      "notes": "Original copy along with 1 self-attested photocopy required during office visit."
    }
  ]
}
```

---

## 4. User Preparation History (Paginated)

### `GET /api/user/history`
Returns paginated historical preparation logs for the authenticated citizen.

#### Query Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string | No | User ID (defaults to authenticated session ID) |
| `page` | integer | No | Page number (default: 1) |
| `page_size` | integer | No | Items per page (default: 20) |

#### Caching Policy:
`Cache-Control: private, no-cache, no-store, must-revalidate`

#### Response:
```json
{
  "status": "success",
  "items": [
    {
      "id": "hist-101-1",
      "userId": "user-default-101",
      "serviceId": "driving-license",
      "serviceTitle": "Driving License",
      "readinessScore": 100,
      "totalDocuments": 5,
      "availableDocuments": 5,
      "status": "ready_for_visit",
      "summaryNotes": "All mandatory documents verified. RTO visit recommended.",
      "createdAt": "2026-09-10T14:30:00.000Z"
    }
  ],
  "page": 1,
  "page_size": 20,
  "total": 1,
  "total_pages": 1
}
```

---

## 5. Location Reference Hierarchy

- `GET /api/locations/states` - Returns supported Indian states (`Cache-Control: public, max-age=3600`)
- `GET /api/locations/districts?state=Telangana` - Returns districts for state (`Cache-Control: public, max-age=3600`)
- `GET /api/locations/cities?state=Telangana&district=Hyderabad` - Returns cities for district (`Cache-Control: public, max-age=3600`)

---

## 6. AI Civic Guidance (Gemini Flash + Deterministic Guardrails)

### `POST /api/ai/guidance`
Provides server-side intelligent civic preparation guidance using Gemini 2.5 Flash with deterministic departmental fallback. Rate-limited to 20 requests per minute per IP.

#### Request Body:
```json
{
  "service_id": "driving-license",
  "query": "Do I need physical presence for learner licence test?"
}
```

#### Response:
```json
{
  "status": "success",
  "serviceId": "driving-license",
  "serviceTitle": "New Driving Licence",
  "advice": "Physical verification is required at the driving test track for permanent licence endorsement. Ensure your Learner's Licence is valid and carry original identity proof.",
  "source": "ai",
  "guidelines": {
    "requiredDocuments": ["Learner's Licence", "Age Proof", "Address Proof", "Passport Photo", "Medical Certificate"],
    "processingTime": "7-10 Days",
    "eligibility": "Citizens aged 18+ with valid learner's permit."
  }
}
```

---

## 7. System Health & Readiness Probes

- `GET /health` or `GET /api/health`
- Response: `{"status": "ok", "service": "SmartSeva Production API", "timestamp": "...", "uptime": 12.34}`

