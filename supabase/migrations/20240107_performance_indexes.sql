-- Critical Database Indexes for Performance (SAFE VERSION)
-- Migration: 20240107_performance_indexes.sql
-- Only indexes columns that are confirmed to exist

-- 1. Companies table indexes
-- Most critical: slug lookups happen on every company page view
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);

-- 2. Jobs table indexes
-- Only index columns we know exist for sure
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);

-- 3. Content sections indexes
-- Always queried with company_id and ordered by display_order
CREATE INDEX IF NOT EXISTS idx_content_sections_company_order 
ON content_sections(company_id, display_order);

-- 4. Applications indexes (if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'applications') THEN
        CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
        CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
    END IF;
END $$;

-- 5. Draft companies indexes
CREATE INDEX IF NOT EXISTS idx_draft_companies_company_id ON draft_companies(company_id);
CREATE INDEX IF NOT EXISTS idx_draft_companies_user ON draft_companies(user_id);

-- 6. Company settings index
CREATE INDEX IF NOT EXISTS idx_company_settings_company ON company_settings(company_id);

-- Analyze tables to update statistics
ANALYZE companies;
ANALYZE jobs;
ANALYZE content_sections;
ANALYZE draft_companies;
ANALYZE company_settings;

-- Verify indexes were created
SELECT 
    schemaname,
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('companies', 'jobs', 'content_sections', 'draft_companies', 'company_settings')
ORDER BY tablename, indexname;

COMMENT ON INDEX idx_companies_slug IS 'Critical for company page lookups by slug';
COMMENT ON INDEX idx_jobs_company_id IS 'Optimizes job listings filtered by company';
COMMENT ON INDEX idx_content_sections_company_order IS 'Optimizes content section ordering queries';
