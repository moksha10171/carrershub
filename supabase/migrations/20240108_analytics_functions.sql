-- Analytics Aggregation Functions for Scalability
-- Migration: 20240108_analytics_functions.sql

-- 1. Get Daily Page Views (Efficient Group By)
CREATE OR REPLACE FUNCTION get_daily_page_views(
  p_company_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS TABLE (
  view_date DATE,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    created_at::DATE as view_date,
    COUNT(*) as count
  FROM page_views
  WHERE company_id = p_company_id
    AND created_at >= p_start_date 
    AND created_at <= p_end_date
  GROUP BY view_date
  ORDER BY view_date;
END;
$$ LANGUAGE plpgsql;

-- 2. Get Unique Visitors (Efficient Count Distinct)
CREATE OR REPLACE FUNCTION get_unique_visitors(
  p_company_id UUID,
  p_start_date TIMESTAMPTZ
)
RETURNS BIGINT AS $$
DECLARE
  v_count BIGINT;
BEGIN
  SELECT COUNT(DISTINCT visitor_id)
  INTO v_count
  FROM page_views
  WHERE company_id = p_company_id
    AND created_at >= p_start_date;
    
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- 3. Get Top Jobs (Efficient Join & Aggregation)
CREATE OR REPLACE FUNCTION get_top_performing_jobs(
  p_company_id UUID,
  p_limit INT DEFAULT 5
)
RETURNS TABLE (
  job_title TEXT,
  view_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    j.title as job_title,
    COUNT(pv.id) as view_count
  FROM jobs j
  LEFT JOIN page_views pv ON j.id = pv.job_id
  WHERE j.company_id = p_company_id
  GROUP BY j.id, j.title
  ORDER BY view_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Indexes for Analytics Performance
CREATE INDEX IF NOT EXISTS idx_page_views_company_date 
ON page_views(company_id, created_at);

CREATE INDEX IF NOT EXISTS idx_page_views_job_id 
ON page_views(job_id) WHERE job_id IS NOT NULL;
