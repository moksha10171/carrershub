-- CareerHub Database Schema
-- Run this in Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- COMPANIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    banner_url TEXT,
    website VARCHAR(255),
    tagline TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);

-- =============================================
-- COMPANY SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS company_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    primary_color VARCHAR(7) DEFAULT '#6366F1',
    secondary_color VARCHAR(7) DEFAULT '#4F46E5',
    accent_color VARCHAR(7) DEFAULT '#10B981',
    dark_mode_enabled BOOLEAN DEFAULT true,
    culture_video_url TEXT,
    meta_tags JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id)
);

-- =============================================
-- CONTENT SECTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS content_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('about', 'culture', 'benefits', 'values', 'team', 'custom')),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sections_company_id ON content_sections(company_id);

-- =============================================
-- JOBS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    work_policy VARCHAR(20) NOT NULL CHECK (work_policy IN ('Remote', 'Hybrid', 'On-site')),
    location VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    employment_type VARCHAR(20) NOT NULL CHECK (employment_type IN ('Full time', 'Part time', 'Contract')),
    experience_level VARCHAR(20) NOT NULL CHECK (experience_level IN ('Junior', 'Mid-level', 'Senior')),
    job_type VARCHAR(20) NOT NULL CHECK (job_type IN ('Permanent', 'Temporary', 'Internship')),
    salary_range VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_department ON jobs(department);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Users can view their own companies" ON companies
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create companies" ON companies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companies" ON companies
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own companies" ON companies
    FOR DELETE USING (auth.uid() = user_id);

-- Public read access for careers pages
CREATE POLICY "Anyone can view companies by slug" ON companies
    FOR SELECT USING (true);

-- Company settings policies
CREATE POLICY "Users can manage their company settings" ON company_settings
    FOR ALL USING (
        company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
    );

CREATE POLICY "Anyone can view company settings" ON company_settings
    FOR SELECT USING (true);

-- Content sections policies
CREATE POLICY "Users can manage their company sections" ON content_sections
    FOR ALL USING (
        company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
    );

CREATE POLICY "Anyone can view visible sections" ON content_sections
    FOR SELECT USING (is_visible = true);

-- Jobs policies
CREATE POLICY "Users can manage their company jobs" ON jobs
    FOR ALL USING (
        company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
    );

CREATE POLICY "Anyone can view active jobs" ON jobs
    FOR SELECT USING (is_active = true);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_company_settings_updated_at
    BEFORE UPDATE ON company_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- To insert sample data, run the following after creating a user:
-- INSERT INTO companies (user_id, name, slug, tagline, website)
-- VALUES (auth.uid(), 'TechCorp', 'techcorp', 'Building the future of technology', 'https://techcorp.example.com');
