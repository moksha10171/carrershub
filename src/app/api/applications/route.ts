import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAuth, unauthorizedResponse } from '@/lib/api/auth';

export async function GET(request: NextRequest) {
    const { user, error: authError } = await requireAuth(request);
    if (authError || !user) {
        return unauthorizedResponse();
    }

    try {
        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get('company_id');

        if (!companyId) {
            return NextResponse.json({ success: false, error: 'Company ID required' }, { status: 400 });
        }

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        const supabase = await createServerSupabaseClient();

        // Verify ownership
        const { data: company } = await supabase
            .from('companies')
            .select('id')
            .eq('id', companyId)
            .eq('user_id', user.id)
            .single();

        if (!company) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        // Fetch applications with pagination
        const { data: applications, error, count } = await supabase
            .from('job_applications')
            .select(`
                *,
                jobs (
                    title
                )
            `, { count: 'exact' })
            .eq('company_id', companyId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            applications: applications || [],
            metadata: {
                total: count || 0,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit)
            }
        });

    } catch (error: any) {
        console.error('Applications API error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch applications' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const { user, error: authError } = await requireAuth(request);
    if (authError || !user) {
        return unauthorizedResponse();
    }

    try {
        const body = await request.json();
        const { action, applicationId, status } = body;
        const supabase = await createServerSupabaseClient();

        if (action === 'update_status') {
            // Verify ownership via company link
            const { data: app } = await supabase
                .from('job_applications')
                .select('id, company_id')
                .eq('id', applicationId)
                .single();

            if (!app) {
                return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
            }

            const { data: company } = await supabase
                .from('companies')
                .select('id')
                .eq('id', app.company_id)
                .eq('user_id', user.id)
                .single();

            if (!company) {
                return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
            }

            const { error: updateError } = await supabase
                .from('job_applications')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', applicationId);

            if (updateError) throw updateError;

            return NextResponse.json({ success: true, message: 'Status updated' });
        }

        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error('Applications POST error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
