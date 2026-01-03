import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAuth, unauthorizedResponse } from '@/lib/api/auth';

/**
 * Heartbeat endpoint for tracking active editors
 * POST - Update heartbeat
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

        // Get user email
        const { data: userData } = await supabase.auth.getUser();
        const userEmail = userData.user?.email || 'Unknown';

        // Update or insert heartbeat
        const { error: heartbeatError } = await supabase
            .from('active_editors')
            .upsert({
                company_id,
                user_id: user.id,
                user_email: userEmail,
                last_heartbeat: new Date().toISOString()
            }, {
                onConflict: 'company_id,user_id'
            });

        if (heartbeatError) {
            console.error('Heartbeat error:', heartbeatError);
            return NextResponse.json(
                { success: false, error: 'Failed to update heartbeat' },
                { status: 500 }
            );
        }

        // Get other active editors (last heartbeat within 2 minutes)
        const twoMinutesAgo = new Date(Date.now() - 120000).toISOString();
        const { data: activeEditors } = await supabase
            .from('active_editors')
            .select('user_id, user_email')
            .eq('company_id', company_id)
            .neq('user_id', user.id)
            .gte('last_heartbeat', twoMinutesAgo);

        return NextResponse.json({
            success: true,
            activeEditors: activeEditors || []
        });

    } catch (error: any) {
        console.error('Heartbeat error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * DELETE - Cleanup heartbeat when user leaves
 */
export async function DELETE(request: NextRequest) {
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

        // Remove heartbeat
        await supabase
            .from('active_editors')
            .delete()
            .eq('company_id', companyId)
            .eq('user_id', user.id);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Cleanup error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
