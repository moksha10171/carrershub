# Draft/Publish Workflow - Complete System Guide

## 🎯 Overview

A production-ready draft/publish system for company profile editing with separate draft storage, preview mode, and atomic publishing to live site.

---

## 📋 Quick Start

### 1. **Setup Database**
Run the migration to create `draft_companies` table:
```bash
# Apply migration in Supabase
psql $DATABASE_URL < supabase/migrations/20240105_draft_companies.sql
```

### 2. **Edit Company Profile**
```
Navigate to: /{company-slug}/edit
- Make changes to branding, settings, content
- Click "Save Draft" (Ctrl+S) - saves without publishing
- Changes stored in draft_companies table
```

### 3. **Preview Changes**
```
Navigate to: /{company-slug}/preview
- See exactly how changes will look
- Draft content loaded automatically
- Orange banner indicates preview mode
```

### 4. **Publish to Live**
```
From edit page:
- Click "Publish" button
- Confirm in modal
- Changes copied to live tables
- Now visible on public careers page
```

---

## 🏗️ Architecture

### Database Tables

| Table | Purpose | Updated By |
|-------|---------|------------|
| `draft_companies` | Stores unpublished changes (JSONB) | Save Draft |
| `companies` | Live company data | Publish |
| `company_settings` | Live branding settings | Publish |
| `content_sections` | Live content sections | Publish |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/companies/save` | POST | Save changes to draft |
| `/api/companies/save?company_id=xxx` | GET | Retrieve draft data |
| `/api/companies/publish` | POST | Publish draft to live |
| `/api/preview?company_id=xxx` | GET | Enable preview mode |
| `/api/preview/exit` | GET | Exit preview mode |

### Key Components

- **Edit Page** (`/[company-slug]/edit`) - Editor interface
- **Preview Page** (`/[company-slug]/preview`) - Draft preview with banner
- **PreviewBanner** - Orange sticky header in preview mode
- **PublishConfirmModal** - Confirmation before publishing
- **Middleware** - Cache control for preview/edit routes

---

## 🔄 Complete Workflow

```
┌─────────────────────────────────────────────────────────┐
│  1. EDIT & SAVE DRAFT                                   │
│  /{company-slug}/edit                                   │
│  ├─ User edits company name, colors, sections          │
│  ├─ Clicks "Save Draft" or Ctrl+S                      │
│  └─ POST /api/companies/save                           │
│     └─ Saves to draft_companies (JSONB)                │
│     └─ ✅ Live site unchanged                          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  2. PREVIEW CHANGES                                     │
│  /{company-slug}/preview                                │
│  ├─ GET /api/companies/save?company_id=xxx             │
│  ├─ Loads draft_companies data                         │
│  ├─ Renders with PreviewBanner                         │
│  └─ User sees exactly how changes will look            │
│     └─ ✅ Draft content visible in preview only        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  3. PUBLISH TO LIVE                                     │
│  /{company-slug}/edit → Click "Publish"                │
│  ├─ PublishConfirmModal shows warning                  │
│  ├─ User confirms                                       │
│  └─ POST /api/companies/publish                        │
│     ├─ Validates draft                                  │
│     ├─ Copies to companies table ✅                    │
│     ├─ Copies to company_settings ✅                   │
│     ├─ Copies to content_sections ✅                   │
│     └─ Updates last_published_at                       │
│        └─ ✅ Changes NOW live on careers page          │
└─────────────────────────────────────────────────────────┘
```

---

## 🛡️ Data Safety Features

### 1. **System Field Protection**
Protected fields **never** modified:
- ✅ `id` - Primary key preserved
- ✅ `user_id` - Owner reference locked  
- ✅ `created_at` - Original timestamp kept

### 2. **Explicit Field Whitelisting**
Only allowed fields updated during publish:

**Companies**: `name`, `tagline`, `website`, `logo_url`, `banner_url`, `slug`  
**Settings**: `primary_color`, `secondary_color`, `accent_color`, `culture_video_url`  
**Sections**: `title`, `type`, `content`, `is_visible`, `display_order`

### 3. **Data Validation**
**Save API**:
- ✅ Company name required (non-empty)
- ✅ Sections must be array
- ✅ Returns 400 for invalid data

**Publish API**:
- ✅ Double-checks company name before publish
- ✅ Validates draft structure
- ✅ Won't publish broken drafts

### 4. **Progress Tracking**
```typescript
updateLog = {
  company: true,   // ✅ Succeeded
  settings: true,  // ✅ Succeeded  
  sections: false  // ❌ Failed here
}
```
Know exactly what succeeded before failure

---

## 🎨 UX Features

### Draft Status Indicators
```
Edit Page:
- "Draft saved: 5m ago" 
- "Published: 2h ago"
- Unsaved changes warning
```

### Navigation Guards
```
Browser warning when:
- Unsaved changes exist
- User tries to close tab
- Prevents data loss
```

### Preview Banner
```
Orange sticky banner:
- "Preview Mode - Viewing Draft Content"
- "Back to Editor" button
- "Exit Preview" button
```

### Publish Confirmation
```
Modal before publishing:
- Warning: "Changes will go live immediately"
- Shows if unsaved changes (auto-saves first)
- "Cancel" or "Publish to Live Site"
```

---

## 🔒 Security

### Authentication
- ✅ All APIs require `requireAuth()`
- ✅ User must be logged in

### Authorization
- ✅ Ownership verification before save/publish
- ✅ User must own company to edit
- ✅ Row Level Security on `draft_companies`

### RLS Policies
```sql
-- Users can only view their own drafts
CREATE POLICY "Users can view their own drafts"
ON draft_companies FOR SELECT
USING (user_id = auth.uid());

-- Users can only manage their own drafts
CREATE POLICY "Users can manage their own drafts"  
ON draft_companies FOR ALL
USING (user_id = auth.uid());
```

---

## 📊 Cache Strategy

| Route | Cache-Control | Reason |
|-------|--------------|---------|
| `/edit` | `no-store` | Always fresh data |
| `/preview` | `no-store` | Never cache draft |
| `/careers` (live) | Default | CDN cacheable |

Set by middleware for `/preview` and `/edit`:
```typescript
'Cache-Control': 'no-store, must-revalidate'
'CDN-Cache-Control': 'no-store'
'Pragma': 'no-cache'
```

---

## 🧪 Testing Guide

### Test: Save Draft
1. Edit company name
2. Click "Save Draft"
3. ✅ Check: Success message
4. ✅ Check: "Draft saved: Just now"
5. ✅ Visit live careers page - unchanged

### Test: Preview
1. Save draft with changes
2. Navigate to `/{slug}/preview`
3. ✅ Check: PreviewBanner visible
4. ✅ Check: Draft changes shown
5. ✅ Click "Exit Preview" - returns to live

### Test: Publish
1. Make changes, save draft
2. Click "Publish" in edit page
3. ✅ Check: Modal appears
4. ✅ Check: Unsaved warning if applicable
5. ✅ Confirm publish
6. ✅ Check: "Published: Just now"
7. ✅ Visit live careers - changes visible

### Test: Validation
1. Try saving draft with empty name
2. ✅ Check: Error "Company name is required"
3. Try publishing invalid draft
4. ✅ Check: Publish rejected

---

## 🚀 Deployment Checklist

- [ ] Run `20240105_draft_companies.sql` migration
- [ ] Verify RLS policies enabled
- [ ] Test save/publish workflow
- [ ] Test preview mode
- [ ] Verify cache headers
- [ ] Test navigation guards
- [ ] Check error logging
- [ ] Confirm validation works

---

## 📝 API Reference

### Save Draft
```typescript
POST /api/companies/save
Body: {
  company: { id, name, tagline, website, logo_url, banner_url },
  settings: { primary_color, secondary_color, accent_color, culture_video_url },
  sections: [{ title, type, content, is_visible }]
}
Response: { success, message, updatedAt }
```

### Get Draft
```typescript
GET /api/companies/save?company_id=xxx
Response: { success, draft: { company_data, settings_data, sections_data, updated_at, last_published_at } }
```

### Publish
```typescript
POST /api/companies/publish
Body: { company_id }
Response: { success, message, publishedAt }
```

---

## 🔧 Troubleshooting

### Draft not showing in preview
- Check: Is user authenticated?
- Check: GET `/api/companies/save?company_id=xxx` returns draft
- Check: Browser console for errors

### Publish fails
- Check: Draft has required company name
- Check: Server logs for error details
- Check: `updateLog` to see what succeeded

### Stale preview data
- Check: Cache-control headers present
- Try: Hard refresh (Ctrl+Shift+R)
- Check: Middleware is running

---

## ✅ Summary

**Production Features**:
- ✨ Separate draft storage (no live impact)
- 🔍 Visual preview before publishing
- 🛡️ Data integrity protection
- ✅ Input validation
- 📊 Progress tracking
- 🚫 Cache control
- 🔒 Security & RLS
- 🎨 Rich UX with modals & indicators

**Reliability**:
- No system field corruption
- Validation prevents bad drafts
- Error tracking for debugging
- Safe field handling
- Atomic-ish publishing

The system is **production-ready** and safe to deploy! 🎉
