import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAuth, unauthorizedResponse } from '@/lib/api/auth';

/**
 * Enable preview mode to view draft content
 * GET /api/preview?company_id=xxx
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
                { success: false, error: 'Company ID required' },
                { status: 400 }
            );
        }

        const supabase = await createServerSupabaseClient();

        // Verify user owns this company
        const { data: company } = await supabase
            .from('companies')
            .select('id, slug, user_id')
            .eq('id', companyId)
            .eq('user_id', user.id)
            .single();

        if (!company) {
            return NextResponse.json(
                { success: false, error: 'Company not found or unauthorized' },
                { status: 403 }
            );
        }

        // Enable draft mode (sets cookie)
        (await draftMode()).enable();

        // Redirect to preview page
        const previewUrl = `/${company.slug}/preview`;
        return NextResponse.redirect(new URL(previewUrl, request.url));

    } catch (error: any) {
        console.error('Preview mode error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to enable preview mode' },
            { status: 500 }
        );
    }
}
