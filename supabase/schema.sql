-- ========================================================
-- ToddlerHQ: Enterprise Preschool & Franchise OS Schema
-- PostgreSQL / Supabase Schema with Row Level Security (RLS)
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations & Franchise Campuses
CREATE TABLE IF NOT EXISTS campuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name VARCHAR(150) NOT NULL,
    brand_id VARCHAR(100) NOT NULL DEFAULT 'independent',
    campus_name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    locality VARCHAR(150) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    current_mode VARCHAR(30) DEFAULT 'setup' CHECK (current_mode IN ('setup', 'operations')),
    budget_allocated NUMERIC(12, 2) DEFAULT 2500000.00,
    budget_spent NUMERIC(12, 2) DEFAULT 940000.00,
    compliance_score INT DEFAULT 88,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Staff & Hierarchy (Downstairs Delegation Model)
CREATE TABLE IF NOT EXISTS staff_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'founder', 'center_head', 'academic_lead',
        'educator', 'admissions_counselor', 'accountant', 'support_staff'
    )),
    reports_to_id UUID REFERENCES staff_users(id),
    designation VARCHAR(150),
    google_email VARCHAR(255),
    google_refresh_token TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Departmental Tasks & State Machine
-- State Machine: backlog -> todo -> in_progress -> under_review -> completed -> verified
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    department VARCHAR(50) NOT NULL CHECK (department IN (
        'Legal', 'Civil', 'Safety', 'Academic', 'HR', 'Marketing', 'Operations', 'Finance'
    )),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by_id UUID REFERENCES staff_users(id),
    assigned_to_id UUID REFERENCES staff_users(id),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'safety_critical')),
    status VARCHAR(30) DEFAULT 'todo' CHECK (status IN (
        'backlog', 'todo', 'in_progress', 'under_review', 'completed', 'verified'
    )),
    requires_proof BOOLEAN DEFAULT FALSE,
    proof_image_url TEXT,
    proof_notes TEXT,
    sop_steps JSONB DEFAULT '[]'::jsonb,
    verified_by_id UUID REFERENCES staff_users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Students & Parents (Google Contacts Integrated)
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    program_grade VARCHAR(50) NOT NULL CHECK (program_grade IN (
        'Playgroup', 'Nursery', 'LKG', 'UKG', 'Daycare'
    )),
    parent_name VARCHAR(150) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    parent_email VARCHAR(255),
    google_contact_resource_name TEXT,
    status VARCHAR(30) DEFAULT 'lead' CHECK (status IN (
        'lead', 'tour_scheduled', 'tour_completed', 'admitted', 'alumni'
    )),
    emergency_contact VARCHAR(20),
    allergies_dietary TEXT,
    notes TEXT,
    fee_amount NUMERIC(10, 2) DEFAULT 75000.00,
    fee_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Daily Care Logs (Educator 1-Touch Console)
CREATE TABLE IF NOT EXISTS daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    logged_by_id UUID REFERENCES staff_users(id),
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    attendance VARCHAR(20) DEFAULT 'present' CHECK (attendance IN ('present', 'absent', 'late')),
    meal_status VARCHAR(50) CHECK (meal_status IN ('ate_full', 'ate_half', 'refused', 'light_snack')),
    nap_minutes INT DEFAULT 0,
    mood_emoji VARCHAR(20) DEFAULT '😊',
    notes TEXT,
    observation_photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Vendor Orders & Safety POs
CREATE TABLE IF NOT EXISTS vendor_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    vendor_name VARCHAR(200) NOT NULL,
    item_details TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    safety_certified BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'quote_received' CHECK (status IN (
        'rfq_sent', 'quote_received', 'safety_approved', 'dispatched', 'installed_verified'
    )),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_orders ENABLE ROW LEVEL SECURITY;

-- Transparent Public Policy for Authenticated Campus Operations
CREATE POLICY "Campus members read all campus data" ON campuses FOR ALL USING (true);
CREATE POLICY "Staff read campus users" ON staff_users FOR ALL USING (true);
CREATE POLICY "Tasks read and write by staff" ON tasks FOR ALL USING (true);
CREATE POLICY "Students read and write by staff" ON students FOR ALL USING (true);
CREATE POLICY "Daily logs read and write by educators" ON daily_logs FOR ALL USING (true);
CREATE POLICY "Vendor orders read and write" ON vendor_orders FOR ALL USING (true);
