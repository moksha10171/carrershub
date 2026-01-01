# Tech Spec.md - Careers Page Builder

## 🏗 Architecture Overview
The application is built using **Next.js 16** with the **App Router** for optimized routing and server-side rendering. It follows a multi-tenant pattern where each company has its own isolated branding and content.

### Core Modules
1. **Public Engine**: Handles `/[company-slug]/careers` pages with dynamic SSR to ensure SEO compatibility and fast load times.
2. **Recruiter Studio**: Protected routes under `/dashboard` for managing page content, branding, and job listings.
3. **Identity System**: Authentication via Supabase Auth with custom `AuthContext` supporting both demo and production modes.
4. **Data Layer**: Standardized API routes (`/api/*`) that interface with Supabase PostgreSQL, ensuring a consistent data shape across the app.

## 🗄 Database Schema (Supabase)

### `companies`
- `id` (uuid, PK)
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

## 🎨 Design System
- **Colors**: Controlled via CSS variables injected into the root of each careers page based on company settings.
- **Typography**: `Inter` for clean readability across all devices.
- **Components**: Custom-built using Tailwind CSS and Framer Motion for premium interactions.

## 🔍 SEO & Performance
- **Dynamic Meta Tags**: Every company page generates unique titles and descriptions.
- **JSON-LD**: Structured data for JobPostings to ensure visibility in Google Jobs.
- **Image Optimization**: Using `next/image` (where applicable) and high-performance CDN-backed assets.

## 🧪 Test Plan
1. **Visual Consistency**: Audit layout across breakpoint (375px to 1440px).
2. **Filter Logic**: Verify that job filtering by Department and Location correctly updates the UI and total count.
3. **Recruiter Flow**: Test the CRUD operations for company settings and job status toggling.
4. **Auth Guards**: Ensure `/dashboard` and `/edit` routes are inaccessible without a session.
5. **Mobile Readiness**: Scroll tests and tap targets verification using the browser subagent.

## 🚀 Scaling Strategy
- **Static Generation**: Use `generateStaticParams` for high-traffic companies to serve cached versions.
- **Full-Text Search**: Leverage PostgreSQL `tsvector` for fast job discovery as listing counts grow.
- **CDN Caching**: Cache API responses for frequently visited careers pages.
