# Tech Spec.md - Careers Page Builder

## 🏗 Architecture Overview
The application is built using **Next.js 16** with the **App Router** for optimized routing and server-side rendering. It follows a multi-tenant pattern where each company has its own isolated branding and content.

### Core Modules
1. **Public Engine**: Handles `/[company-slug]/careers` pages with dynamic SSR for SEO and fast loads.
2. **Recruiter Studio**: Protected routes under `/dashboard` for managing content, branding, jobs, and analytics.
3. **Identity System**: Authentication via Supabase Auth with middleware-protected routes.
4. **Data Layer**: Standardized API routes (`/api/*`) interfacing with Supabase PostgreSQL.
5. **Analytics Engine**: Real-time tracking of page views, visitors, traffic sources, and job performance.

## 🗄 Database Schema (Supabase)

### `companies`
- `id` (uuid, PK)
- `user_id` (uuid, FK) - Owner of the company
- `name` (text)
- `slug` (text, unique) - Used in URLs
- `logo_url` (text)
- `banner_url` (text)
- `tagline` (text)
- `website` (text)

### `company_settings`
- `company_id` (uuid, FK)
- `primary_color` (text)
- `secondary_color` (text)
- `accent_color` (text)
- `culture_video_url` (text)
- `is_searchable` (boolean)

### `jobs`
- `id` (uuid, PK)
- `company_id` (uuid, FK)
- `title` (text)
- `slug` (text)
- `description` (html)
- `location` (text)
- `department` (text)
- `work_policy` (text) - Remote, Hybrid, On-site
- `employment_type` (text) - Full-time, Contract, etc.
- `experience_level` (text)
- `salary_range` (text)
- `is_active` (boolean)
- `posted_at` (timestamp)

### `content_sections`
- `id` (uuid, PK)
- `company_id` (uuid, FK)
- `title` (text)
- `type` (text) - about, culture, benefits, etc.
- `content` (html)
- `display_order` (integer)
- `is_visible` (boolean)

### `analytics` (NEW)
- `id` (uuid, PK)
- `company_id` (uuid, FK)
- `page_type` (text) - careers, job_detail
- `page_views` (integer)
- `unique_visitors` (integer)
- `avg_time_seconds` (integer)
- `source` (text) - direct, organic, referral, social
- `device_type` (text) - desktop, mobile, tablet
- `recorded_at` (timestamp)

## 🎨 Design System
- **Colors**: Controlled via CSS variables injected per-company; indigo-purple gradient for CTAs.
- **Typography**: `Inter` font for clean readability.
- **Components**: Custom Tailwind CSS + Framer Motion for premium interactions.
- **Theme**: Full light/dark mode support with `next-themes`.

## 🔍 SEO & Performance
- **Dynamic Meta Tags**: Every page generates unique titles and descriptions.
- **JSON-LD**: Structured data for JobPostings (Google Jobs visibility).
- **Image Optimization**: Using `next/image` where applicable.
- **Static Generation**: Blog posts and landing pages pre-rendered.

## 🧪 Test Plan
1. **Visual Consistency**: Audit layout across breakpoints (375px to 1440px).
2. **Filter Logic**: Verify job filtering updates UI and counts correctly.
3. **Recruiter Flow**: Test CRUD for company settings, jobs, and analytics.
4. **Auth Guards**: Ensure `/dashboard` and `/edit` routes require authentication.
5. **Theme Toggle**: Verify all components respect light/dark mode.
6. **Mobile Readiness**: Scroll and tap target verification.

## 🚀 Scaling Strategy
- **Static Generation**: Use `generateStaticParams` for high-traffic pages.
- **Full-Text Search**: PostgreSQL `tsvector` for fast job discovery.
- **CDN Caching**: Cache API responses for frequently visited pages.
- **Analytics Aggregation**: Daily rollups to reduce query load.
