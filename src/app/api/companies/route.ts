import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

import { requireAuth, unauthorizedResponse } from '@/lib/api/auth';

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

            // Fetch real job stats from Supabase
            const { data: jobs } = await supabase
                .from('jobs')
                .select('id, department, location, work_policy')
                .eq('company_id', company.id)
                .eq('is_active', true);

            const jobList = jobs || [];

            return NextResponse.json({
                success: true,
                data: {
                    company,
                    settings: settings || {
                        primary_color: '#6366F1',
                        secondary_color: '#4F46E5',
                        accent_color: '#10B981',
                    },
                    sections: sections || [],
                    jobCount: jobList.length,
                    stats: {
                        totalJobs: jobList.length,
                        departments: Array.from(new Set(jobList.map((j: any) => j.department))).length,
                        locations: Array.from(new Set(jobList.map((j: any) => j.location))).length,
                        remoteJobs: jobList.filter((j: any) => j.work_policy === 'Remote').length,
                    }
                }
            });
        }

        // Return 404 if not found
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    } catch (error) {
        console.error('Companies GET error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch company' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    // Check authentication
    const { user, error: authError } = await requireAuth(request);
    if (authError || !user) {
        return unauthorizedResponse();
    }

    try {
        const body = await request.json();
        const { action, slug, company: companyData, settings: settingsData } = body;
        const supabase = await createServerSupabaseClient();

        // Create a new company for new users
        if (action === 'create_company') {
            const { name, slug: newSlug, tagline, website } = body;

            if (!name || !newSlug) {
                return NextResponse.json({ success: false, error: 'Name and slug are required' }, { status: 400 });
            }

            // Check if slug is already taken
            const { data: existingCompany } = await supabase
                .from('companies')
                .select('id')
                .eq('slug', newSlug)
                .single();

            if (existingCompany) {
                return NextResponse.json({ success: false, error: 'This URL is already taken' }, { status: 400 });
            }

            // Create company
            const { data: newCompany, error: companyError } = await supabase
                .from('companies')
                .insert({
                    user_id: user.id,
                    name,
                    slug: newSlug.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                    tagline: tagline || null,
                    website: website || null,
                })
                .select()
                .single();

            if (companyError) {
                console.error('Failed to create company:', companyError);
                return NextResponse.json({ success: false, error: 'Failed to create company' }, { status: 500 });
            }

            // Create default settings
            await supabase.from('company_settings').insert({
                company_id: newCompany.id,
                primary_color: '#6366F1',
                secondary_color: '#4F46E5',
                accent_color: '#10B981',
            });

            // Create default sections
            await supabase.from('content_sections').insert([
                {
                    company_id: newCompany.id,
                    type: 'about',
                    title: 'About Us',
                    content: '<p>Tell your company story here...</p>',
                    display_order: 1,
                    is_visible: true,
                },
                {
                    company_id: newCompany.id,
                    type: 'culture',
                    title: 'Our Culture',
                    content: '<p>Describe your company culture...</p>',
                    display_order: 2,
                    is_visible: true,
                },
                {
                    company_id: newCompany.id,
                    type: 'benefits',
                    title: 'Benefits & Perks',
                    content: '<p>List your benefits...</p>',
                    display_order: 3,
                    is_visible: true,
                },
            ]);

            return NextResponse.json({
                success: true,
                data: { company: newCompany },
                message: 'Company created successfully'
            });
        }

        // Update existing company
        if (action === 'update_company') {
            const { data: company } = await supabase.from('companies').select('id, user_id').eq('slug', slug).single();

            if (!company) {
                return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404 });
            }

            // Check ownership
            if (company.user_id !== user.id) {
                return NextResponse.json({ success: false, error: 'Not authorized to edit this company' }, { status: 403 });
            }

            if (companyData) {
                await supabase.from('companies').update(companyData).eq('id', company.id);
            }

            if (settingsData) {
                // Upsert settings (create if not exists)
                const { data: existingSettings } = await supabase
                    .from('company_settings')
                    .select('id')
                    .eq('company_id', company.id)
                    .single();

                if (existingSettings) {
                    await supabase.from('company_settings').update(settingsData).eq('company_id', company.id);
                } else {
                    await supabase.from('company_settings').insert({ company_id: company.id, ...settingsData });
                }
            }

            // Update content sections
            if (body.sections && Array.isArray(body.sections)) {
                // Delete existing sections for this company
                await supabase
                    .from('content_sections')
                    .delete()
                    .eq('company_id', company.id);

                // Insert new sections
                const sectionsWithCompanyId = body.sections.map((section: any, index: number) => ({
                    company_id: company.id,
                    type: section.type || 'custom',
                    title: section.title,
                    content: section.content,
                    display_order: index + 1,
                    is_visible: section.is_visible !== false,
                }));

                await supabase.from('content_sections').insert(sectionsWithCompanyId);
            }

            return NextResponse.json({ success: true, message: 'Company updated successfully' });
        }

        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error('Companies POST error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
    }
}

