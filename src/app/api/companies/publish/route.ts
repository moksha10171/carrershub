import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAuth, unauthorizedResponse } from '@/lib/api/auth';

/**
 * Publish draft changes to live
 * This copies changes from draft_companies to companies, company_settings, and content_sections
 */
export async function POST(request: NextRequest) {
    const { user, error: authError } = await requireAuth(request);
    if (authError || !user) {
        return unauthorizedResponse();
    }

    try {
        const body = await request.json();
        const { company_id } = body;

        if (!company_id) {
            return NextResponse.json(
                { success: false, error: 'Company ID is required' },
                { status: 400 }
            );
        }

        const supabase = await createServerSupabaseClient();

        // Verify ownership
        const { data: company } = await supabase
            .from('companies')
            .select('id, user_id')
            .eq('id', company_id)
            .single();

        if (!company || company.user_id !== user.id) {
            return NextResponse.json(
                { success: false, error: 'Not authorized' },
                { status: 403 }
            );
        }

        // Get draft data
        const { data: draft, error: draftError } = await supabase
            .from('draft_companies')
            .select('*')
            .eq('company_id', company_id)
            .single();

        if (draftError || !draft) {
            return NextResponse.json(
                { success: false, error: 'No draft found to publish' },
                { status: 404 }
            );
        }

        // Validate draft before publishing
        if (!draft.company_data?.name || draft.company_data.name.trim() === '') {
            return NextResponse.json(
                { success: false, error: 'Invalid draft: company name is required' },
                { status: 400 }
            );
        }

        // Track update progress for debugging
        const updateLog = {
            company: false,
            settings: false,
            sections: false
        };

        // Begin transaction-like operation by updating all tables

        // 1. Update companies table
        if (draft.company_data) {
            // Explicitly pick only allowed fields to prevent system field corruption
            const companyUpdates = {
                name: draft.company_data.name,
                tagline: draft.company_data.tagline || null,
                website: draft.company_data.website || null,
                logo_url: draft.company_data.logo_url || null,
                banner_url: draft.company_data.banner_url || null,
                slug: draft.company_data.slug,
                updated_at: new Date().toISOString()
            };

            const { error: companyError } = await supabase
                .from('companies')
                .update(companyUpdates)
                .eq('id', company_id);

            if (companyError) {
                console.error('Company update error:', companyError);
                console.error('Update progress:', updateLog);
                return NextResponse.json(
                    { success: false, error: 'Failed to publish company data' },
                    { status: 500 }
                );
            }
            updateLog.company = true;
        }

        // 2. Update company_settings table
        if (draft.settings_data) {
            // Explicitly pick only allowed settings fields
            const settingsUpdates = {
                company_id,
                primary_color: draft.settings_data.primary_color || null,
                secondary_color: draft.settings_data.secondary_color || null,
                accent_color: draft.settings_data.accent_color || null,
                culture_video_url: draft.settings_data.culture_video_url || null,
                updated_at: new Date().toISOString()
            };

            const { error: settingsError } = await supabase
                .from('company_settings')
                .upsert(settingsUpdates, {
                    onConflict: 'company_id'
                });

            if (settingsError) {
                console.error('Settings update error:', settingsError);
                console.error('Update progress:', updateLog);
                return NextResponse.json(
                    { success: false, error: 'Failed to publish settings' },
                    { status: 500 }
                );
            }
            updateLog.settings = true;
        }

        // 3. Update content_sections table
        if (draft.sections_data && Array.isArray(draft.sections_data)) {
            // First, delete existing sections for this company
            const { error: deleteError } = await supabase
                .from('content_sections')
                .delete()
                .eq('company_id', company_id);

            if (deleteError) {
                console.error('Section delete error:', deleteError);
                console.error('Update progress:', updateLog);
                return NextResponse.json(
                    { success: false, error: 'Failed to clear old sections' },
                    { status: 500 }
                );
            }

            // Then insert new sections with display_order
            const sectionsToInsert = draft.sections_data.map((section: any, index: number) => ({
                company_id,
                title: section.title,
                type: section.type,
                content: section.content,
                is_visible: section.is_visible ?? true,
                display_order: index
            }));

            if (sectionsToInsert.length > 0) {
                const { error: insertError } = await supabase
                    .from('content_sections')
                    .insert(sectionsToInsert);

                if (insertError) {
                    console.error('Section insert error:', insertError);
                    console.error('Update progress:', updateLog);
                    return NextResponse.json(
                        { success: false, error: 'Failed to publish sections' },
                        { status: 500 }
                    );
                }
            }
            updateLog.sections = true;
        }

        // 4. Mark draft as published (update timestamp)
        await supabase
            .from('draft_companies')
            .update({
                last_published_at: new Date().toISOString()
            })
            .eq('company_id', company_id);

        return NextResponse.json({
            success: true,
            message: 'Changes published successfully',
            publishedAt: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Publish error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
