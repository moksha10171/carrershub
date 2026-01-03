-- Create draft_companies table for storing unpublished changes
CREATE TABLE IF NOT EXISTS draft_companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Store entire data structures as JSONB for flexibility
    company_data JSONB,
    settings_data JSONB,
    sections_data JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_published_at TIMESTAMPTZ,
    
    -- Ensure one draft per company
    UNIQUE(company_id)
);

-- Create index on company_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_draft_companies_company_id ON draft_companies(company_id);
CREATE INDEX IF NOT EXISTS idx_draft_companies_user_id ON draft_companies(user_id);

-- Enable Row Level Security
ALTER TABLE draft_companies ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view drafts for their own companies
CREATE POLICY "Users can view their own drafts"
    ON draft_companies
    FOR SELECT
    USING (
        user_id = auth.uid()
    );

-- Policy: Users can create/update drafts for their own companies
CREATE POLICY "Users can manage their own drafts"
    ON draft_companies
    FOR ALL
    USING (
        user_id = auth.uid()
    );

-- Add comment for documentation
COMMENT ON TABLE draft_companies IS 'Stores draft versions of company data before publishing to live site';
