# CareerHub - Careers Page Builder

A modern, branded careers page builder that helps recruiters create stunning company hiring pages and enables candidates to discover and browse open roles.

![CareerHub](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)

## 🎯 What I Built

A full-stack careers page builder with:

- **Public Careers Pages** - Branded pages at `/{company-slug}/careers` with dynamic theming
- **Job Listings** - Filterable by location, department, work policy, employment type
- **Recruiter Dashboard** - Manage branding, content sections, and job listings
- **Dark Mode** - System-aware theme toggle
- **Mobile-First** - Responsive design that works on all devices
- **Accessibility** - WCAG 2.1 compliant with keyboard navigation
- **SEO Ready** - Meta tags and JSON-LD structured data

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
cd whitecarrot_project

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

### Demo Pages

- **Landing Page**: `/` - Platform overview
- **Demo Careers Page**: `/techcorp/careers` - Full careers page demo
- **Login**: `/login` - Recruiter authentication
- **Dashboard**: `/dashboard` - Recruiter management panel

## 🛠 Tech Stack

| Category | Technology | Why |
|----------|------------|-----|
| **Framework** | Next.js 14 (App Router) | SSR/SSG for SEO, API routes, dynamic routing |
| **Language** | TypeScript | Type safety, better DX |
| **Styling** | Tailwind CSS | Rapid development, responsive utilities |
| **Animations** | Framer Motion | Smooth micro-interactions |
| **Icons** | Lucide React | Consistent, accessible icons |
| **Database** | Supabase (ready) | PostgreSQL with Row-Level Security |

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Auth page
│   ├── dashboard/page.tsx          # Recruiter panel
│   └── [company-slug]/careers/     # Dynamic careers pages
├── components/
│   ├── ui/                         # Reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Select.tsx
│   └── careers/                    # Careers page components
│       ├── HeroSection.tsx
│       ├── JobCard.tsx
│       ├── JobFilters.tsx
│       ├── JobListings.tsx
│       └── ContentSection.tsx
├── lib/
│   ├── utils.ts                    # Helper functions
│   ├── constants.ts                # App constants
│   └── sample-jobs.json            # Demo data
└── types/
    └── index.ts                    # TypeScript definitions
```

## ✨ Key Features

### For Recruiters

1. **Brand Customization** - Colors, logo, banner via CSS variables
2. **Content Sections** - About Us, Culture, Benefits with icons
3. **Job Management** - 30 sample jobs with full metadata
4. **Preview Mode** - See changes before publishing

### For Candidates

1. **Job Search** - Filter by title, location, department
2. **Smart Filters** - Work policy, employment type, experience
3. **Clean UI** - Card-based job listings with hover effects
4. **Dark Mode** - Toggle between light/dark themes

### Accessibility

- Skip-to-content links
- ARIA labels on all interactive elements
- Keyboard navigation support
- Color contrast (WCAG AA)
- Semantic HTML structure

## 🔧 Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Custom Theming

Colors are controlled via CSS variables in `globals.css`:

```css
:root {
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --accent-500: #10b981;
}
```

## 📈 Scalability Considerations

| Challenge | Solution |
|-----------|----------|
| Multi-tenant data | Row-Level Security (RLS) in Supabase |
| Static content | ISR for careers pages |
| Image storage | CDN via Supabase Storage |
| Search performance | PostgreSQL full-text search |

## 🗺 Improvement Roadmap

1. **Full Supabase Integration** - Replace demo data with real database
2. **Image Uploads** - Logo and banner via Supabase Storage
3. **Drag-and-Drop Sections** - Reorder content sections
4. **Rich Text Editor** - For section content
5. **Application Flow** - Allow candidates to apply
6. **Analytics** - Track page views and conversions

## 👤 User Guide

### Recruiter Flow

1. Visit `/login` and sign in
2. Access `/dashboard` to manage your page
3. Copy your public URL to share with candidates
4. Edit branding, content, and jobs

### Candidate Flow

1. Visit `/{company-slug}/careers`
2. Browse company information (About, Culture, Benefits)
3. Search and filter job listings
4. Click a job card for details

## 📜 License

Built for the WhiteCarrot assignment © 2024
