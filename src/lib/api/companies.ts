import { createServerSupabaseClient } from '@/lib/supabase/server';
// import { demoCompany, demoSettings, demoSections, getAllJobs, getJobBySlug } from '@/lib/data';

// Shared types
export interface CompanyData {
    company: any;
    settings: any;
    sections: any[];
    jobs: any[];
    fromDatabase: boolean;
}

/**
 * Fetches company data from Supabase or falls back to demo data
 */
export async function getCompanyData(slug: string): Promise<CompanyData | null> {
    try {
        const supabase = await createServerSupabaseClient();

        // Try to fetch from Supabase
        const { data: company, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('slug', slug)
            .single();

        if (company && !companyError) {
            const { data: settings } = await supabase
                .from('company_settings')
                .select('*')
                .eq('company_id', company.id)
                .single();

            const { data: sections } = await supabase
                .from('content_sections')
                .select('*')
                .eq('company_id', company.id)
                .eq('is_visible', true)
                .order('display_order', { ascending: true });

            const { data: jobs } = await supabase
                .from('jobs')
                .select('*')
                .eq('company_id', company.id)
                .eq('is_active', true);

            return {
                company,
                settings: settings || {
                    primary_color: '#6366F1',
                    secondary_color: '#4F46E5',
                    accent_color: '#10B981',
                },
                sections: sections || [],
                jobs: jobs || [],
                fromDatabase: true,
            };
        }
    } catch (error) {
        console.warn('Supabase fetch failed:', error);
    }

    return null;
}

/**
 * Fetches a specific job from Supabase or falls back to demo data
 */
export async function getJobData(companySlug: string, jobSlug: string) {
    try {
        const supabase = await createServerSupabaseClient();

        // Check if company exists first to avoid invalid job lookups
        const { data: company, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('slug', companySlug)
            .single();

        if (company && !companyError) {
            const { data: job, error: jobError } = await supabase
                .from('jobs')
                .select('*')
                .eq('company_id', company.id)
                .eq('slug', jobSlug)
                .single();

            if (job && !jobError) {
                const { data: settings } = await supabase
                    .from('company_settings')
                    .select('*')
                    .eq('company_id', company.id)
                    .single();

                // Fetch related jobs (3 other active jobs from same company)
                const { data: relatedJobs } = await supabase
                    .from('jobs')
                    .select('id, title, location, slug, employment_type')
                    .eq('company_id', company.id)
                    .eq('is_active', true)
                    .neq('id', job.id) // Exclude current job
                    .limit(3);

                return {
                    job,
                    company,
                    settings: settings || {
                        primary_color: '#6366F1',
                        secondary_color: '#4F46E5',
                        accent_color: '#10B981',
                    },
                    relatedJobs: relatedJobs || [],
                    fromDatabase: true
                };
            }
        }
    } catch (error) {
        console.warn('Supabase job fetch failed:', error);
    }

    return null;
}
