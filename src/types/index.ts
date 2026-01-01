// Company Types
export interface Company {
    id: string;
    user_id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    banner_url: string | null;
    website: string | null;
    tagline: string | null;
    created_at: string;
    updated_at: string;
}

export interface CompanySettings {
    id: string;
    company_id: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    dark_mode_enabled: boolean;
    culture_video_url: string | null;
    meta_tags: Record<string, string>;
    updated_at: string;
}

// Content Section Types
export type SectionType = 'about' | 'culture' | 'benefits' | 'values' | 'team' | 'custom';

export interface ContentSection {
    id: string;
    company_id: string;
    type: SectionType;
    title: string;
    content: string | null;
    display_order: number;
    is_visible: boolean;
    created_at: string;
}

// Job Types
export type WorkPolicy = 'Remote' | 'Hybrid' | 'On-site';
export type EmploymentType = 'Full time' | 'Part time' | 'Contract';
export type ExperienceLevel = 'Junior' | 'Mid-level' | 'Senior';
export type JobType = 'Permanent' | 'Temporary' | 'Internship';

export interface Job {
    id: string;
    company_id: string;
    title: string;
    slug: string;
    description: string;
    department: string;
    location: string;
    work_policy: 'Remote' | 'On-site' | 'Hybrid';
    employment_type: string;
    experience_level: string;
    job_type: string;
    salary_range?: string;
    is_active: boolean;
    posted_at: string;
    updated_at: string;

    // Enhanced fields
    skills_required?: string[];
    skills_preferred?: string[];
    application_deadline?: string;
    perks?: string[];
    team_size?: number;
    reports_to?: string;
    travel_required?: string;
    visa_sponsorship?: boolean;
    equity_range?: string;
}

// Filter Types
export interface JobFilters {
    search: string;
    location: string;
    department: string;
    work_policy: WorkPolicy | '';
    employment_type: EmploymentType | '';
    experience_level: ExperienceLevel | '';
}

// API Response Types
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
}

// Company with all relations
export interface CompanyWithDetails extends Company {
    settings: CompanySettings | null;
    sections: ContentSection[];
    jobs: Job[];
}
