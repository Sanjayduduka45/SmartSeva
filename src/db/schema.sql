-- ==============================================================================
-- SMARTSEVA HIGH-PERFORMANCE POSTGRESQL / SUPABASE DATABASE SCHEMA
-- Purpose: Optimized relational schema with strict constraints, targeted composite
--          indexes, Row-Level Security (RLS), and zero N+1 query structures.
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. USERS / PROFILES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users (
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

-- ==============================================================================
-- 2. SERVICE CATEGORIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. GOVERNMENT SERVICES CATALOG TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS services (
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

-- ==============================================================================
-- 4. SERVICE REQUIREMENTS / DOCUMENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS requirements (
    id VARCHAR(100) PRIMARY KEY,
    service_id VARCHAR(80) NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    required BOOLEAN NOT NULL DEFAULT TRUE,
    category VARCHAR(80),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. GOVERNMENT OFFICES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS offices (
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

-- ==============================================================================
-- 6. SERVICE TO OFFICE MAPPING (RELATIONSHIP)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS service_office_mappings (
    id BIGSERIAL PRIMARY KEY,
    service_id VARCHAR(80) NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    office_id VARCHAR(100) NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_service_office UNIQUE (service_id, office_id)
);

-- ==============================================================================
-- 7. USER CHECKLISTS (DOCUMENT READINESS STATE)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS user_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id VARCHAR(80) NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    requirement_id VARCHAR(100) NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'not_sure',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_doc_status CHECK (status IN ('have', 'dont_have', 'not_sure', 'expired')),
    CONSTRAINT uq_user_requirement UNIQUE (user_id, service_id, requirement_id)
);

-- ==============================================================================
-- 8. USER PREPARATION PLANS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS preparation_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id VARCHAR(80) NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    readiness_percentage INT NOT NULL DEFAULT 0,
    is_ready BOOLEAN NOT NULL DEFAULT FALSE,
    plan_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_prep_score CHECK (readiness_percentage >= 0 AND readiness_percentage <= 100)
);

-- ==============================================================================
-- 9. USER PREPARATION HISTORY (PAGINATED RECORD)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS preparation_history (
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

-- ==============================================================================
-- 10. USER SETTINGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sms_alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    offline_mode_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    high_contrast BOOLEAN NOT NULL DEFAULT FALSE,
    app_language VARCHAR(10) NOT NULL DEFAULT 'en',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 11. LOCATION REFERENCE DATA HIERARCHY
-- ==============================================================================
CREATE TABLE IF NOT EXISTS locations (
    id BIGSERIAL PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_location_hierarchy UNIQUE (state, district, city, pincode)
);

-- ==============================================================================
-- 12. AUDIT & ACCESS LOGS TABLE (LEAN STRUCTURE)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- TARGETED INDEXES (REAL QUERY PATTERNS ONLY - NO WASTEFUL INDEXES)
-- ==============================================================================

-- Services & Categories lookup & ordering
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);

-- Requirements lookup by service (prevents full scan of all requirements)
CREATE INDEX IF NOT EXISTS idx_requirements_service ON requirements(service_id, required);

-- Offices query performance (Crucial: Bounding area, pincode, active status)
CREATE INDEX IF NOT EXISTS idx_offices_active ON offices(active);
CREATE INDEX IF NOT EXISTS idx_offices_category_active ON offices(category, active);
CREATE INDEX IF NOT EXISTS idx_offices_location ON offices(state, district, city) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_offices_pincode ON offices(pincode) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_offices_coords ON offices(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Service-Office relationship filtering
CREATE INDEX IF NOT EXISTS idx_service_office_service_id ON service_office_mappings(service_id);
CREATE INDEX IF NOT EXISTS idx_service_office_office_id ON service_office_mappings(office_id);

-- User Checklist lookup by user and service
CREATE INDEX IF NOT EXISTS idx_user_checklists_user_service ON user_checklists(user_id, service_id);

-- User History pagination (High priority: filtered by user, sorted by created_at DESC)
CREATE INDEX IF NOT EXISTS idx_prep_history_user_date ON preparation_history(user_id, created_at DESC);

-- Location hierarchy lookups
CREATE INDEX IF NOT EXISTS idx_locations_state_dist ON locations(state, district);

-- Audit logs indexing for time-window queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_date ON audit_logs(user_id, created_at DESC);

-- ==============================================================================
-- VIEWS TO PREVENT N+1 QUERIES
-- ==============================================================================

-- Pre-joined view of service details with required document counts
CREATE OR REPLACE VIEW v_services_with_doc_counts AS
SELECT 
    s.id,
    s.category_id,
    s.title,
    s.description,
    s.icon,
    s.est_completion,
    s.processing_time,
    s.active,
    COUNT(r.id) FILTER (WHERE r.required = TRUE) AS required_doc_count,
    COUNT(r.id) AS total_doc_count
FROM services s
LEFT JOIN requirements r ON s.id = r.service_id
GROUP BY s.id;

-- Pre-joined view of offices mapped to services
CREATE OR REPLACE VIEW v_service_offices AS
SELECT 
    som.service_id,
    o.id AS office_id,
    o.name AS office_name,
    o.category,
    o.office_type,
    o.address,
    o.city,
    o.district,
    o.state,
    o.pincode,
    o.latitude,
    o.longitude,
    o.phone,
    o.working_hours,
    o.active
FROM service_office_mappings som
JOIN offices o ON som.office_id = o.id
WHERE o.active = TRUE;

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES FOR SUPABASE / POSTGRESQL
-- ==============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE preparation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE preparation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Public read-only tables (no write for regular clients)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_office_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Public tables policies (everyone can read active services & offices)
CREATE POLICY "Public read access for active categories" ON categories FOR SELECT USING (active = TRUE);
CREATE POLICY "Public read access for active services" ON services FOR SELECT USING (active = TRUE);
CREATE POLICY "Public read access for requirements" ON requirements FOR SELECT USING (TRUE);
CREATE POLICY "Public read access for active offices" ON offices FOR SELECT USING (active = TRUE);
CREATE POLICY "Public read access for service office mappings" ON service_office_mappings FOR SELECT USING (TRUE);
CREATE POLICY "Public read access for active locations" ON locations FOR SELECT USING (active = TRUE);

-- User data isolation policies (users can only access their own data)
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
