# CareerHub - Careers Page Builder

A modern, branded careers page builder that helps recruiters create stunning company hiring pages and enables candidates to discover and browse open roles.

![CareerHub](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-Ready-green) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)

## 🎯 Features

### For Recruiters
- **Brand Customization** - Colors, logo, banner via CSS variables
- **Content Sections** - About Us, Culture, Benefits with icons
- **Job Management** - Full CRUD, CSV import, bulk upload
- **Analytics Dashboard** - Track page views, visitors, applications, traffic sources
- **Account Settings** - Profile, password, delete company/account

### For Candidates
- **Global Job Search** - Search jobs and companies across the platform
- **Smart Filters** - Filter by location, department, work policy, employment type
- **Clean UI** - Card-based job listings with hover effects
- **Dark Mode** - System-aware theme toggle

### Core Features
- **Public Careers Pages** - Branded pages at `/[company-slug]/careers`
- **Blog Section** - Editorial content with animations
- **3D Animations** - Interactive backgrounds with Three.js/React Three Fiber
- **Authentication** - Login, signup, forgot/reset password
- **Mobile-First** - Responsive design for all devices
- **SEO Ready** - Meta tags, JSON-LD structured data, sitemap

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation
```bash
git clone https://github.com/moksha10171/carrershub.git
cd whitecarrot_project
pnpm install
cp .env.example .env.local
# Add your Supabase URL and Anon Key
```

### Database Setup
1. Create a Supabase project
2. Run migration scripts in `supabase/migrations/`
3. Enable Row Level Security (RLS) policies

### Running Locally
```bash
pnpm dev
```
Visit [http://localhost:3000](http://localhost:3000)

## 📍 Key Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with 3D hero and global search |
| `/search` | Search jobs and companies |
| `/blog` | Blog section |
| `/login` | Authentication |
| `/signup` | Registration |
| `/dashboard` | Recruiter dashboard home |
| `/dashboard/jobs` | Job management |
| `/dashboard/analytics` | Analytics with charts |
| `/dashboard/settings` | Account settings |
| `/[company-slug]/careers` | Public careers page |
| `/[company-slug]/jobs/[job-slug]` | Job detail page |
| `/[company-slug]/edit` | Company page editor |

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
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
│   ├── dashboard/           # Recruiter panel
│   │   ├── analytics/       # Analytics dashboard
│   │   ├── jobs/            # Job management
│   │   └── settings/        # Account settings
│   ├── [company-slug]/      # Dynamic company routes
│   │   ├── careers/         # Public careers page
│   │   ├── jobs/[job-slug]/ # Job detail
│   │   └── edit/            # Page editor
│   └── api/                 # API Routes
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── three/               # 3D components
│   ├── careers/             # Careers components
│   └── layout/              # Header, Footer
└── lib/
    ├── supabase/            # Supabase client/server
    └── api/                 # API helpers
```

## 🔧 Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📊 Analytics
- **Page Views** - Total and unique visitors
- **Traffic Sources** - Direct, organic, referral, social
- **Devices** - Desktop, mobile, tablet breakdown
- **Top Jobs** - Performance by job listing

## 🗺 Roadmap
- [ ] Image Uploads via Supabase Storage
- [ ] Rich Text Editor for sections
- [ ] Application Flow for candidates
- [ ] Email Notifications

## 📜 License
Built for the WhiteCarrot assignment © 2024
