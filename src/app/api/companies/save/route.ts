import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAuth, unauthorizedResponse } from '@/lib/api/auth';

/**
 * Save company changes to draft
 * This allows editing without affecting the live site
 */
export async function POST(request: NextRequest) {
    const { user, error: authError } = await requireAuth(request);
    if (authError || !user) {
        return unauthorizedResponse();
    }

    try {
        const body = await request.json();
        const { company, settings, sections } = body;

        if (!company?.id) {
            return NextResponse.json(
                { success: false, error: 'Company ID is required' },
                { status: 400 }
            );
        }

        const supabase = await createServerSupabaseClient();

        // Verify ownership
        const { data: existingCompany } = await supabase
            .from('companies')
            .select('id, user_id')
            .eq('id', company.id)
            .single();

        if (!existingCompany || existingCompany.user_id !== user.id) {
            return NextResponse.json(
                { success: false, error: 'Not authorized' },
                { status: 403 }
            );
        }

        // Validate draft data before saving
        if (company && (!company.name || company.name.trim() === '')) {
            return NextResponse.json(
                { success: false, error: 'Company name is required' },
                { status: 400 }
            );
        }

        if (sections && !Array.isArray(sections)) {
            return NextResponse.json(
                { success: false, error: 'Sections must be an array' },
                { status: 400 }
            );
        }

        // Check for conflicts (has published version changed since draft was created?)
        const { data: currentPublished } = await supabase
            .from('companies')
            .select('version')
            .eq('id', company.id)
            .single();

        const { data: existingDraft } = await supabase
            .from('draft_companies')
            .select('base_version, version')
            .eq('company_id', company.id)
            .single();

        // If draft exists and published version has changed, return conflict
        if (existingDraft && currentPublished) {
            const publishedVersion = currentPublished.version || 1;
            const draftBaseVersion = existingDraft.base_version || 1;

            if (publishedVersion > draftBaseVersion) {
                return NextResponse.json({
                    success: false,
                    conflict: true,
                    error: 'Content was published by another user. Please review changes before continuing.',
                    publishedVersion,
                    draftBaseVersion
                }, { status: 409 }); // 409 Conflict
            }
        }

        // Create or update draft entry
        const draftData = {
            company_id: company.id,
            user_id: user.id,
            company_data: company,
            settings_data: settings,
            sections_data: sections,
            updated_at: new Date().toISOString(),
            base_version: currentPublished?.version || 1,
            version: (existingDraft?.version || 0) + 1
        };

        // Upsert to draft_companies table
        const { error: draftError } = await supabase
            .from('draft_companies')
            .upsert(draftData, {
                onConflict: 'company_id'
            });

        if (draftError) {
            console.error('Draft save error:', draftError);
            return NextResponse.json(
                { success: false, error: 'Failed to save draft' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Draft saved successfully',
            updatedAt: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Save draft error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Get draft data for a company
 */
export async function GET(request: NextRequest) {
    const { user, error: authError } = await requireAuth(request);
    if (authError || !user) {
        return unauthorizedResponse();
    }

    try {
        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get('company_id');

        if (!companyId) {
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
            .eq('id', companyId)
            .single();

        if (!company || company.user_id !== user.id) {
            return NextResponse.json(
                { success: false, error: 'Not authorized' },
                { status: 403 }
            );
        }

        // Get draft data
        const { data: draft } = await supabase
            .from('draft_companies')
            .select('*')
            .eq('company_id', companyId)
            .single();

        return NextResponse.json({
            success: true,
            draft
        });

    } catch (error: any) {
        console.error('Get draft error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
