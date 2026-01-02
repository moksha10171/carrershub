import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const supabase = await createServerSupabaseClient();

        if (!query || query.length < 2) {
            return NextResponse.json({ success: true, companies: [], jobs: [] });
        }

        // Search Companies
        // Note: Supabase ILIKE is simple. For better search we'd use textSearch but ILIKE is fine here.
        const { data: companies, error: companiesError } = await supabase
            .from('companies')
            .select('id, name, slug, logo_url, tagline')
            .ilike('name', `%${query}%`)
            .limit(5);

        if (companiesError) {
            console.error('Company search error:', companiesError);
        }

        // Search Jobs
        // We need component info too (slug) to link properly
        const { data: jobs, error: jobsError } = await supabase
            .from('jobs')
            .select(`
                id, 
                title, 
                slug, 
                location, 
                department, 
                job_type,
                posted_at,
                company_id,
                companies (
                    name, 
                    slug,
                    logo_url
                )
            `)
            .ilike('title', `%${query}%`)
            .eq('is_active', true)
            .limit(10);

        if (jobsError) {
            console.error('Job search error:', jobsError);
        }

        return NextResponse.json({
            success: true,
            companies: companies || [],
            jobs: jobs || []
        });

    } catch (error: any) {
        console.error('Global search error:', error);
        return NextResponse.json(
            { success: false, error: 'Search failed' },
            { status: 500 }
        );
    }
}
