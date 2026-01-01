export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            companies: {
                Row: {
                    id: string;
                    slug: string;
                    name: string;
                    tagline: string | null;
                    description: string | null;
                    website: string | null;
                    logo_url: string | null;
                    banner_url: string | null;
                    industry: string | null;
                    size: string | null;
                    founded: number | null;
                    headquarters: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    slug: string;
                    name: string;
                    tagline?: string | null;
                    description?: string | null;
                    website?: string | null;
                    logo_url?: string | null;
                    banner_url?: string | null;
                    industry?: string | null;
                    size?: string | null;
                    founded?: number | null;
                    headquarters?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    slug?: string;
                    name?: string;
                    tagline?: string | null;
                    description?: string | null;
                    website?: string | null;
                    logo_url?: string | null;
                    banner_url?: string | null;
                    industry?: string | null;
                    size?: string | null;
                    founded?: number | null;
                    headquarters?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            company_settings: {
                Row: {
                    id: string;
                    company_id: string;
                    primary_color: string;
                    secondary_color: string;
                    accent_color: string;
                    culture_video_url: string | null;
                    custom_css: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    company_id: string;
                    primary_color?: string;
                    secondary_color?: string;
                    accent_color?: string;
                    culture_video_url?: string | null;
                    custom_css?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    company_id?: string;
                    primary_color?: string;
                    secondary_color?: string;
                    accent_color?: string;
                    culture_video_url?: string | null;
                    custom_css?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            content_sections: {
                Row: {
                    id: string;
                    company_id: string;
                    title: string;
                    type: string;
                    content: string | null;
                    display_order: number;
                    is_visible: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    company_id: string;
                    title: string;
                    type: string;
                    content?: string | null;
                    display_order?: number;
                    is_visible?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    company_id?: string;
                    title?: string;
                    type?: string;
                    content?: string | null;
                    display_order?: number;
                    is_visible?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            jobs: {
                Row: {
                    id: string;
                    company_id: string;
                    title: string;
                    slug: string;
                    description: string | null;
                    department: string | null;
                    location: string;
                    work_policy: string;
                    employment_type: string;
                    experience_level: string | null;
                    salary_min: number | null;
                    salary_max: number | null;
                    salary_currency: string;
                    is_active: boolean;
                    posted_at: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    company_id: string;
                    title: string;
                    slug: string;
                    description?: string | null;
                    department?: string | null;
                    location: string;
                    work_policy?: string;
                    employment_type?: string;
                    experience_level?: string | null;
                    salary_min?: number | null;
                    salary_max?: number | null;
                    salary_currency?: string;
                    is_active?: boolean;
                    posted_at?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    company_id?: string;
                    title?: string;
                    slug?: string;
                    description?: string | null;
                    department?: string | null;
                    location?: string;
                    work_policy?: string;
                    employment_type?: string;
                    experience_level?: string | null;
                    salary_min?: number | null;
                    salary_max?: number | null;
                    salary_currency?: string;
                    is_active?: boolean;
                    posted_at?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
        Views: {};
        Functions: {};
        Enums: {};
    };
}
