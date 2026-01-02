# CareerHub - Careers Page Builder

A modern, branded careers page builder that helps recruiters create stunning company hiring pages and enables candidates to discover and browse open roles.

![CareerHub](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-Ready-green) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)

## 🎯 Features

### For Recruiters

- **Brand Customization** - Colors, logo, banner via CSS variables
- **Content Sections** - About Us, Culture, Benefits with icons
- **Job Management** - Full CRUD operations, CSV import, bulk upload
- **Analytics Dashboard** - Track page views, visitors, applications, traffic sources
- **Account Settings** - Profile, password, delete company/account

### For Candidates

- **Global Job Search** - Search jobs and companies across the platform
- **Smart Filters** - Filter by location, department, work policy, employment type
- **Clean UI** - Card-based job listings with hover effects and animations
- **Dark Mode** - System-aware theme toggle with polished styling

### Core Features

- **Public Careers Pages** - Branded pages at `/[company-slug]/careers`
- **Blog Section** - Editorial content with 3D visualizations
- **3D Animations** - Interactive backgrounds with Three.js/React Three Fiber
- **Authentication** - Full auth flow with login, signup, forgot/reset password
- **Mobile-First** - Responsive design for all devices
- **Accessibility** - WCAG 2.1 compliant with keyboard navigation
- **SEO Ready** - Meta tags, JSON-LD structured data, sitemap

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

1. Create a Supabase project
2. Run the migration scripts in `supabase/migrations/` to set up tables
3. Enable Row Level Security (RLS) policies (included in schema)

### Running Locally

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 📍 Key Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with 3D hero and global search |
| `/search` | Search jobs and companies |
| `/blog` | Blog section with articles |
| `/login` | User authentication |
| `/signup` | New account registration |
| `/forgot-password` | Password recovery |
| `/reset-password` | Password reset |
| `/dashboard` | Recruiter dashboard home |
| `/dashboard/jobs` | Job management (CRUD, CSV import) |
| `/dashboard/analytics` | Analytics with charts |
| `/dashboard/settings` | Account & security settings |
| `/[company-slug]/careers` | Public careers page |
| `/[company-slug]/jobs/[job-slug]` | Job detail page |
| `/[company-slug]/edit` | Company page editor |
| `/[company-slug]/preview` | Preview mode |
| `/about` | About page |
| `/contact` | Contact form |
| `/pricing` | Pricing plans |
| `/help` | Help center with FAQs |

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **3D Graphics** | Three.js / React Three Fiber |
| **Icons** | Lucide React |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page with Global Search
│   ├── blog/                       # Blog section
│   ├── search/                     # Global search page
│   ├── dashboard/                  # Recruiter panel
│   │   ├── analytics/              # Analytics dashboard
│   │   ├── jobs/                   # Job management
│   │   └── settings/               # Account settings
│   ├── [company-slug]/             # Dynamic company routes
│   │   ├── careers/                # Public careers page
│   │   ├── jobs/[job-slug]/        # Job detail page
│   │   ├── edit/                   # Company page editor
│   │   └── preview/                # Preview mode
│   ├── login/                      # Authentication
│   ├── signup/                     # Registration
│   ├── forgot-password/            # Password recovery
│   ├── reset-password/             # Password reset
│   └── api/                        # API Routes
├── components/
│   ├── ui/                         # Reusable UI components
│   ├── three/                      # Three.js 3D components
│   ├── careers/                    # Careers page components
│   ├── dashboard/                  # Dashboard components
│   ├── layout/                     # Header, Footer, etc.
│   └── blog/                       # Blog components
├── lib/
│   ├── supabase/                   # Supabase client/server
│   ├── auth/                       # Auth utilities
│   ├── api/                        # API helpers
│   └── utils.ts                    # Helper functions
└── types/
    └── index.ts                    # TypeScript definitions
```

## 🔧 Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## � Analytics

The analytics dashboard tracks:
- **Page Views** - Total and unique visitors
- **Traffic Sources** - Direct, organic, referral, social
- **Devices** - Desktop, mobile, tablet breakdown
- **Top Jobs** - Performance by job listing
- **Time on Page** - Average engagement metrics

## 🗺 Roadmap

- [ ] Image Uploads - Logo and banner via Supabase Storage
- [ ] Rich Text Editor - For section content
- [ ] Application Flow - Allow candidates to apply directly
- [ ] Email Notifications - For new applications
- [ ] ATS Integrations - Connect with Greenhouse, Lever, etc.

## 📜 License

Built for the WhiteCarrot assignment © 2024
