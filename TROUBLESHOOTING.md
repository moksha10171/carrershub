# Troubleshooting: "Failed to save draft" Error

## Problem
Getting error: `Failed to save draft: Error: Failed to save draft`

## Root Cause
The new version tracking columns (`version`, `base_version`) may not have been properly added to the database yet.

## Solution

### Step 1: Verify Migration Status

Run this query in your Supabase SQL Editor to check if columns exist:

```sql
-- Check if version columns exist
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('companies', 'draft_companies') 
AND column_name LIKE '%version%'
ORDER BY table_name, column_name;
```

**Expected result**:
- `companies.version` (integer)
- `draft_companies.version` (integer)
- `draft_companies.base_version` (integer)

### Step 2: Run Improved Migration

If columns are missing, run the improved migration:

**File**: `supabase/migrations/20240106_version_tracking_v2.sql`

```bash
# In Supabase dashboard: SQL Editor
# Copy and paste the entire contents of 20240106_version_tracking_v2.sql
# Click "Run"
```

**Or via CLI**:
```bash
cd whitecarrot_project
supabase db push
```

### Step 3: Verify Active Editors Table

```sql
-- Check if active_editors table exists
SELECT * FROM information_schema.tables 
WHERE table_name = 'active_editors';

-- Check heartbeat function exists
SELECT routine_name FROM information_schema.routines 
WHERE routine_name = 'cleanup_stale_heartbeats';
```

### Step 4: Test Save Again

1. Clear browser cache (Ctrl+Shift+R)
2. Navigate to `/{company-slug}/edit`
3. Make a change
4. Click "Save Draft"
5. ✅ Should work now!

## Code Changes Made

The save API was updated to gracefully handle missing version columns:

```typescript
// Before: Would fail if version column missing
const { data: currentPublished } = await supabase
  .from('companies')
  .select('version')
  .eq('id', company.id)
  .single();

// After: Wrapped in try-catch, optional
try {
  const { data: publishedData } = await supabase
    .from('companies')
    .select('version')
    .eq('id', company.id)
    .single();
  // ... use data if available
} catch (versionError) {
  // Version tracking not available - that's okay
  console.log('Version tracking not available');
}
```

## What This Means

**With version columns** (after migration):
- ✅ Full conflict detection
- ✅ Version tracking
- ✅ Optimistic locking

**Without version columns** (migration not run):
- ✅ Saving still works
- ⚠️ No conflict detection (basic mode)
- ⚠️ No version tracking

## Common Issues

### Issue 1: "Column does not exist" error
**Solution**: Migration not applied. Run Step 2 above.

### Issue 2: Permissions error
**Solution**: Ensure RLS policies are created:
```sql
-- Check policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('draft_companies', 'active_editors');
```

### Issue 3: Trigger not working
**Solution**: Recreate trigger:
```sql
DROP TRIGGER IF EXISTS company_version_trigger ON companies;
CREATE TRIGGER company_version_trigger
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION increment_company_version();
```

## Verification

After migration, verify everything works:

```sql
-- 1. Check companies version
SELECT id, name, version FROM companies LIMIT 5;

-- 2. Check draft_companies 
SELECT company_id, version, base_version, updated_at 
FROM draft_companies LIMIT 5;

-- 3. Check active_editors
SELECT * FROM active_editors;
```

## Still Having Issues?

Check the server logs for the full error details:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try saving again
4. Click on the failed request
5. Check Response tab for detailed error

The API will log: `Version tracking not available (columns may not exist)` if columns are missing - this is expected and safe.
