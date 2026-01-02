-- Page view tracking
CREATE TABLE IF NOT EXISTS page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    page_type TEXT NOT NULL, -- 'careers', 'job_detail', etc.
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    visitor_id TEXT, -- Anonymous visitor ID (cookie-based)
    referrer TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job application tracking
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    applicant_email TEXT,
    applicant_name TEXT,
    resume_url TEXT,
    status TEXT DEFAULT 'pending', -- pending, reviewed, interviewed, hired, rejected
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Company owners can view their page views
CREATE POLICY "Company owners can view page views"
    ON page_views FOR SELECT
    USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

-- Company owners can view applications
CREATE POLICY "Company owners can view applications"
    ON job_applications FOR SELECT
    USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

-- Anyone (anon) can insert page views (for tracking)
CREATE POLICY "Anyone can insert page views"
    ON page_views FOR INSERT
    WITH CHECK (true);

-- Anyone (anon) can insert applications
CREATE POLICY "Anyone can insert applications"
    ON job_applications FOR INSERT
    WITH CHECK (true);
