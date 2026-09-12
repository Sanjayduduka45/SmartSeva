# SmartSeva — Database Schema & Data Architecture Specification

## 1. Overview & Data Philosophy
SmartSeva uses **Supabase PostgreSQL 15** as its primary relational store. The database is architected around three core principles:
1. **Zero Citizen Liability**: No citizen files, PDFs, or photos are ever stored in the database. Only readiness state markers (`have`, `dont_have`, `not_sure`, `expired`) and metadata are recorded.
2. **Strict Row-Level Security (RLS)**: Public catalogs (`services`, `categories`, `offices`, `locations`) are read-only for public clients; all citizen-specific records (`users`, `user_checklists`, `preparation_history`) are strictly isolated to `auth.uid() = user_id`.
3. **Query Performance & Indexing**: Targeted composite B-tree and partial spatial indexes ensure sub-50ms execution on paginated office searches and document checklist lookups without wasteful index bloat.

---

## 2. Relational Entity Diagram

```
┌─────────────────┐       ┌─────────────────┐
│   categories    │◀──────┤    services     │
└─────────────────┘ 1   * └────────┬────────┘
                                   │ 1
                                   ▼ *
                          ┌─────────────────┐
                          │  requirements   │
                          └────────┬────────┘
                                   │ 1
                                   ▼ *
┌─────────────────┐ 1   * ┌─────────────────┐       ┌─────────────────┐
│      users      ├──────▶│ user_checklists │◀──────┤ preparation_    │
└────────┬────────┘       └─────────────────┘       │ plans / history │
         │ 1                                        └─────────────────┘
         ▼ *
┌─────────────────┐       ┌────────────────────────┐       ┌─────────────────┐
│  user_settings  │       │service_office_mappings ├──────▶│     offices     │
└─────────────────┘       └────────────────────────┘ *   1 └─────────────────┘
```

---

## 3. Production Table Schemas

### 3.1. `users`
Stores citizen profile and preferences. Managed in coordination with Supabase Auth.
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    mobile_number VARCHAR(15) UNIQUE,
    email VARCHAR(255) UNIQUE,
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_users_mobile CHECK (mobile_number IS NULL OR mobile_number ~ '^[6-9][0-9]{9}$'),
    CONSTRAINT chk_users_email CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);
```

### 3.2. `categories`
Top-level categorization for civic services (Identity, Transport, Revenue, Welfare, Banking).
```sql
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3.3. `services`
Official government services catalog.
```sql
CREATE TABLE services (
    id VARCHAR(80) PRIMARY KEY,
    category_id VARCHAR(50) NOT NULL REFERENCES categories(id) ON UPDATE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    est_completion VARCHAR(50) NOT NULL DEFAULT '15 mins',
    processing_time VARCHAR(50) NOT NULL DEFAULT '7-10 Days',
    eligibility TEXT,
    benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
    important_notes TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3.4. `requirements`
Individual document requirements tied to a service.
```sql
CREATE TABLE requirements (
    id VARCHAR(100) PRIMARY KEY,
    service_id VARCHAR(80) NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    required BOOLEAN NOT NULL DEFAULT TRUE,
    category VARCHAR(80),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3.5. `offices`
Physical government facilitation centers and jurisdictional offices.
```sql
CREATE TABLE offices (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    category VARCHAR(80) NOT NULL,
    office_type VARCHAR(120),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone VARCHAR(50),
    working_hours VARCHAR(150),
    services_handled JSONB NOT NULL DEFAULT '[]'::jsonb,
    tips JSONB NOT NULL DEFAULT '[]'::jsonb,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_offices_pincode CHECK (pincode IS NULL OR pincode ~ '^[1-9][0-9]{5}$'),
    CONSTRAINT chk_offices_coords CHECK (
        (latitude IS NULL AND longitude IS NULL) OR
        (latitude >= -90.0 AND latitude <= 90.0 AND longitude >= -180.0 AND longitude <= 180.0)
    )
);
```

### 3.6. `service_office_mappings`
Many-to-many relationship linking services to offices that process them.
```sql
CREATE TABLE service_office_mappings (
    id BIGSERIAL PRIMARY KEY,
    service_id VARCHAR(80) NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    office_id VARCHAR(100) NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_service_office UNIQUE (service_id, office_id)
);
```

### 3.7. `user_checklists`
Citizen's personal document readiness tracker for a given service.
```sql
CREATE TABLE user_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id VARCHAR(80) NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    requirement_id VARCHAR(100) NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'not_sure',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_doc_status CHECK (status IN ('have', 'dont_have', 'not_sure', 'expired')),
    CONSTRAINT uq_user_requirement UNIQUE (user_id, service_id, requirement_id)
);
```

### 3.8. `preparation_history`
Persisted record of completed or active preparation plans for citizens.
```sql
CREATE TABLE preparation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id VARCHAR(80) NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    service_title VARCHAR(200) NOT NULL,
    readiness_score INT NOT NULL DEFAULT 0,
    total_documents INT NOT NULL DEFAULT 0,
    available_documents INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'completed',
    summary_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_history_status CHECK (status IN ('in_progress', 'ready_for_visit', 'completed', 'archived'))
);
```

---

## 4. Performance Indexes

Targeted indexes prevent full table scans on production query paths:
- `idx_services_category`: Filter active services by category (`WHERE active = TRUE`).
- `idx_requirements_service`: Join requirements by `(service_id, required)`.
- `idx_offices_pincode`: Fast lookup of facilitation centers by 6-digit postal code.
- `idx_offices_location`: Composite index on `(state, district, city)` for hierarchical lookups.
- `idx_offices_coords`: Spatial coordinate index on `(latitude, longitude)` for bounding-box queries.
- `idx_service_office_service_id` & `idx_service_office_office_id`: Bidirectional lookup for service-office mapping.
- `idx_user_checklists_user_service`: User-specific checklist lookup (`user_id, service_id`).
- `idx_prep_history_user_date`: Paginated history queries sorted by `created_at DESC`.

---

## 5. Row-Level Security (RLS) Policies

All tables have RLS explicitly enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).

### Public Read Policies:
```sql
CREATE POLICY "Public read access for active categories" ON categories FOR SELECT USING (active = TRUE);
CREATE POLICY "Public read access for active services" ON services FOR SELECT USING (active = TRUE);
CREATE POLICY "Public read access for requirements" ON requirements FOR SELECT USING (TRUE);
CREATE POLICY "Public read access for active offices" ON offices FOR SELECT USING (active = TRUE);
CREATE POLICY "Public read access for service office mappings" ON service_office_mappings FOR SELECT USING (TRUE);
CREATE POLICY "Public read access for active locations" ON locations FOR SELECT USING (active = TRUE);
```

### Citizen Isolation Policies:
```sql
CREATE POLICY "Users can manage own profile" ON users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own checklists" ON user_checklists
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own preparation plans" ON preparation_plans
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own preparation history" ON preparation_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own settings" ON user_settings
    FOR ALL USING (auth.uid() = user_id);
```

---

## 6. Maintenance & Migrations
- Schema definitions are version-controlled in `/src/db/schema.sql`.
- In production, schema changes should be applied via Supabase migration CLI or through non-destructive SQL commands.
- Never hardcode Supabase Service Role keys in migrations or client-side files.
