-- Add version tracking and concurrent editing support
-- Migration: 20240106_version_tracking_and_active_editors.sql

-- 1. Add version column to companies table (for optimistic locking)
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- 2. Add version tracking to draft_companies
ALTER TABLE draft_companies 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS base_version INTEGER DEFAULT 1;

-- 3. Create function to increment version on updates
CREATE OR REPLACE FUNCTION increment_company_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = COALESCE(OLD.version, 0) + 1;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger for companies table
DROP TRIGGER IF EXISTS company_version_trigger ON companies;
CREATE TRIGGER company_version_trigger
BEFORE UPDATE ON companies
FOR EACH ROW
WHEN (OLD.* IS DISTINCT FROM NEW.*)
EXECUTE FUNCTION increment_company_version();

-- 5. Create active_editors table for concurrent editing detection
CREATE TABLE IF NOT EXISTS active_editors (
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT,
    last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (company_id, user_id)
);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_active_editors_heartbeat ON active_editors(last_heartbeat);
CREATE INDEX IF NOT EXISTS idx_active_editors_company ON active_editors(company_id);

-- 7. Function to cleanup stale heartbeats (older than 5 minutes)
CREATE OR REPLACE FUNCTION cleanup_stale_heartbeats()
RETURNS void AS $$
BEGIN
  DELETE FROM active_editors
  WHERE last_heartbeat < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- 8. Enable RLS on active_editors
ALTER TABLE active_editors ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies for active_editors
CREATE POLICY "Users can view active editors for companies they own"
    ON active_editors
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM companies
            WHERE companies.id = active_editors.company_id
            AND companies.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own heartbeat"
    ON active_editors
    FOR ALL
    USING (user_id = auth.uid());

-- 10. Add helpful comments
COMMENT ON COLUMN companies.version IS 'Incremented on each update for optimistic locking';
COMMENT ON COLUMN draft_companies.base_version IS 'Version of published data this draft is based on';
COMMENT ON TABLE active_editors IS 'Tracks which users are currently editing each company (heartbeat system)';
