import { NextRequest, NextResponse } from 'next/server';
import { demoCompany, demoSettings, demoSections, getAllJobs } from '@/lib/data';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        const supabase = await createServerSupabaseClient();

        if (!slug) {
            return NextResponse.json({ success: false, error: 'Slug required' }, { status: 400 });
        }

        // Try Supabase first
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
                .order('display_order', { ascending: true });

            return NextResponse.json({
                success: true,
                data: {
                    company,
                    settings,
                    sections: sections || [],
                    jobCount: 0, // In a real app we'd fetch actual count
                    stats: { totalJobs: 0, departments: 0, locations: 0, remoteJobs: 0 }
                }
            });
        }

        // Fallback to demo
        if (slug === 'techcorp' || slug === demoCompany.slug) {
            const jobs = getAllJobs(demoCompany.id);
            return NextResponse.json({
                success: true,
                data: {
                    company: demoCompany,
                    settings: demoSettings,
                    sections: demoSections,
                    jobCount: jobs.length,
                    stats: {
                        totalJobs: jobs.length,
                        departments: Array.from(new Set(jobs.map(j => j.department))).length,
                        locations: Array.from(new Set(jobs.map(j => j.location))).length,
                        remoteJobs: jobs.filter(j => j.work_policy === 'Remote').length,
                    },
                },
            });
        }

        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}

import { requireAuth, unauthorizedResponse } from '@/lib/api/auth';

export async function POST(request: NextRequest) {
    // Check authentication
    const { user, error: authError } = await requireAuth(request);
    if (authError || !user) {
        return unauthorizedResponse();
    }

    try {
        const body = await request.json();
        const { action, slug, company: companyData, settings: settingsData, sections: sectionsData } = body;
        const supabase = await createServerSupabaseClient();

        if (action === 'update_company') {
            const { data: company } = await supabase.from('companies').select('id').eq('slug', slug).single();
            if (company) {
                if (companyData) await supabase.from('companies').update(companyData).eq('id', company.id);
                if (settingsData) await supabase.from('company_settings').update(settingsData).eq('company_id', company.id);

                // Update content sections
                if (body.sections && Array.isArray(body.sections)) {
                    try {
                        // Delete existing sections for this company
                        await supabase
                            .from('content_sections')
                            .delete()
                            .eq('company_id', company.id);

                        // Insert new sections
                        const sectionsWithCompanyId = body.sections.map((section: any) => ({
                            ...section,
                            company_id: company.id,
                        }));

                        const { error: sectionsError } = await supabase
                            .from('content_sections')
                            .insert(sectionsWithCompanyId);

                        if (sectionsError) {
                            console.error('Failed to update sections:', sectionsError);
                        }
                    } catch (error) {
                        console.error('Error updating content sections:', error);
                    }
                }
            }
        }

        return NextResponse.json({ success: true, message: 'Updated successfully (Supabase/Demo)' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
