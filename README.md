# CareerHub - Careers Page Builder

A modern, branded careers page builder that helps recruiters create stunning company hiring pages and enables candidates to discover and browse open roles.

![CareerHub](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-Ready-green) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)

## 🎯 What I Built

A full-stack careers page builder with:

- **Public Careers Pages** - Branded pages at `/[company-slug]/careers` with dynamic theming.
- **Global Search** - Find jobs and companies across the platform.
- **Blog** - Editorial section with 3D visualizations and insights.
- **Recruiter Dashboard** - Manage branding, content sections, and job listings.
- **Job Listings** - Filterable by location, department, work policy, employment type.
- **Dark Mode** - System-aware theme toggle.
- **Mobile-First** - Responsive design that works on all devices.
- **Accessibility** - WCAG 2.1 compliant with keyboard navigation.
- **SEO Ready** - Meta tags, JSON-LD structured data, and sitemap.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd whitecarrot_project

# Install dependencies
pnpm install

# Setup Environment Variables
cp .env.example .env.local
# Add your Supabase URL and Anon Key
```

### Database Setup

1.  Create a Supabase project.
2.  Run the migration scripts in `supabase/migrations/` or `schema.sql` to set up tables (`companies`, `jobs`, `company_settings`, etc.).
3.  Enable Row Level Security (RLS) policies (included in schema).

### Running Locally

```bash
# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

### Key Routes

- **Landing Page**: `/`
- **Global Search**: `/` (Hero Section)
- **Blog**: `/blog`
- **Login**: `/login`
- **Dashboard**: `/dashboard`
- **Status Page**: `/status`

## 🛠 Tech Stack

| Category | Technology | Why |
|----------|------------|-----|
| **Framework** | Next.js 14 (App Router) | SSR/SSG for SEO, API routes, dynamic routing |
| **Language** | TypeScript | Type safety, better DX |
| **Styling** | Tailwind CSS | Rapid development, responsive utilities |
| **Animations** | Framer Motion | Smooth micro-interactions |
| **3D Graphics** | Three.js / React Three Fiber | Interactive hero sections |
| **Icons** | Lucide React | Consistent, accessible icons |
| **Database** | Supabase | PostgreSQL, Auth, Row-Level Security |

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page with Global Search
│   ├── blog/                       # Blog section
│   ├── dashboard/                  # Recruiter panel
│   ├── [company-slug]/careers/     # Dynamic careers pages
│   └── api/                        # API Routes
├── components/
│   ├── ui/                         # Reusable components
│   ├── three/                      # Three.js components
│   └── careers/                    # Careers page components
├── lib/
│   ├── supabase/                   # Supabase clients
│   └── utils.ts                    # Helper functions
└── types/
    └── index.ts                    # TypeScript definitions
```

## ✨ Key Features

### For Recruiters

1.  **Brand Customization** - Colors, logo, banner via CSS variables.
2.  **Content Sections** - About Us, Culture, Benefits with icons.
3.  **Job Management** - CRUD operations for job postings.
4.  **CSV Import** - Bulk upload jobs.
5.  **Analytics** - (Coming Soon) Track page views.

### For Candidates

1.  **Global Job Search** - Filter by title, location, department across all companies.
2.  **Smart Filters** - Work policy, employment type, experience.
3.  **Clean UI** - Card-based job listings with hover effects.
4.  **Dark Mode** - Toggle between light/dark themes.

## 🔧 Configuration

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🗺 Improvement Roadmap

1.  **Image Uploads** - Logo and banner via Supabase Storage.
2.  **Rich Text Editor** - For section content.
3.  **Application Flow** - Allow candidates to apply directly.
4.  **Analytics** - Track page views and conversions.

## 📜 License

Built for the WhiteCarrot assignment © 2024
