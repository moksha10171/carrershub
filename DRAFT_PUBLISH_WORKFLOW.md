# Draft/Publish Workflow Implementation

## Overview
Implemented a draft/publish workflow for the company editing system to allow safe editing without affecting the live careers site.

## Architecture

### Database
- **New Table**: `draft_companies`
  - Stores draft versions of company data, settings, and content sections as JSONB
  - One draft per company (unique constraint on `company_id`)
  - Includes timestamps for `created_at`, `updated_at`, and `last_published_at`
  - RLS policies ensure users can only access their own drafts

### API Routes

#### `/api/companies/save` (POST & GET)
- **POST**: Saves company changes to draft table
  - Accepts: `{ company, settings, sections }`
  - Upserts to `draft_companies` table
  - Does NOT affect live site

- **GET**: Retrieves draft data for a company
  - Query param: `company_id`
  - Returns draft if exists, null otherwise

#### `/api/companies/publish` (POST)
- Publishes draft changes to live tables
- Atomically updates:
  1. `companies` table
  2. `company_settings` table  
  3. `content_sections` table (delete old, insert new)
- Updates `last_published_at` timestamp on draft
- Requires authentication and ownership verification

### Frontend Changes

#### Edit Page (`/[company-slug]/edit/page.tsx`)
1. **State Management**
   - Added `companyId`, `isPublishing`, `publishSuccess` states
   - Removed `hasChanges` dependency from save (draft auto-saves)

2. **Data Loading**
   - On mount, checks for existing draft via `/api/companies/save`
   - Uses draft data if available, otherwise uses live data
   - This allows resuming work on unpublished changes

3. **Save Handler** (`handleSave`)
   - Changed from direct update to draft save
   - Calls `/api/companies/save` endpoint
   - Shows "Saved Draft" success message
   - No longer requires published changes

4. **Publish Handler** (`handlePublish`)
   - New function that calls `/api/companies/publish`
   - Auto-saves pending changes before publishing
   - Shows "Published!" success message
   - Makes changes live to the careers site

5. **UI Updates**
   - "Save" button → "Save Draft" (outline variant)
   - New "Publish" button (primary variant)
   - Both buttons show loading and success states
   - Tooltips explain the difference

## User Workflow

### Editing Flow
1. User navigates to `/[company-slug]/edit`
2. Page loads draft if exists, otherwise loads live data
3. User makes changes
4. Clicks "Save Draft" (Ctrl+S) - saves to draft table
5. Changes are NOT visible on live site
6. User can preview changes (future: preview mode)
7. When ready, clicks "Publish"
8. Changes go live instantly

### Benefits
- ✅ **Safe Editing**: Mistakes don't affect live site
- ✅ **Work in Progress**: Save partial work without publishing
- ✅ **Review Changes**: Can review before publishing
- ✅ **Rollback**: Can discard drafts (future feature)
- ✅ **Audit Trail**: `last_published_at` tracks when changes went live

## Migration Required

Run the migration to create the `draft_companies` table:

\`\`\`bash
# Apply migration in Supabase dashboard or via CLI
psql $DATABASE_URL < supabase/migrations/20240105_draft_companies.sql
\`\`\`

## Future Enhancements

1. **Preview Mode**: View careers page with draft data before publishing
2. **Discard Draft**: Button to delete draft and revert to live data
3. **Change Comparison**: Show diff between draft and live
4. **Auto-draft**: Auto-save to draft every few seconds
5. **Publishing History**: Track all publishes with timestamps
6. **Scheduled Publishing**: Publish at a specific time

## Testing Checklist

- [ ] Create a company and make edits
- [ ] Verify "Save Draft" doesn't affect live site
- [ ] Navigate away and back - draft should persist
- [ ] Click "Publish" - changes should go live
- [ ] Check analytics still work with published data
- [ ] Verify RLS policies prevent unauthorized access
- [ ] Test with multiple users/companies

## Security Considerations

- ✅ RLS policies on `draft_companies` table
- ✅ Ownership verification in both API routes
- ✅ Authentication required for all operations
- ✅ Published data inherits RLS from main tables
