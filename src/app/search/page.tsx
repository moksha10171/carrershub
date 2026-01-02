import { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SearchPageClient } from '@/components/search/SearchPageClient';

export const metadata: Metadata = {
    title: 'Search | CareerHub',
    description: 'Search for jobs and companies.',
};

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const query = searchParams.q || '';
    const supabase = await createServerSupabaseClient();

    let jobs: any[] = [];
    let companies: any[] = [];

    if (query) {
        // Fetch Jobs
        const { data: jobsData } = await supabase
            .from('jobs')
            .select(`
                *,
                companies (
                    name,
                    slug,
                    logo_url
                )
            `)
            .eq('is_active', true)
            .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
            .limit(20);

        if (jobsData) jobs = jobsData;

        // Fetch Companies
        const { data: companiesData } = await supabase
            .from('companies')
            .select('*')
            .or(`name.ilike.%${query}%,industry.ilike.%${query}%`)
            .limit(20);

        if (companiesData) companies = companiesData;
    }

    return (
        <SearchPageClient
            initialJobs={jobs}
            initialCompanies={companies}
            initialQuery={query}
        />
    );
}
