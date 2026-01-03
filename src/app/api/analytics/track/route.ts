import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { companyId, jobId, pageType, referrer, visitorId } = body;

        if (!companyId) {
            return NextResponse.json({ success: false, error: 'Company ID required' }, { status: 400 });
        }

        const supabase = await createServerSupabaseClient();
        const userAgent = request.headers.get('user-agent');

        const { error } = await supabase
            .from('page_views')
            .insert({
                company_id: companyId,
                job_id: jobId || null,
                page_type: pageType || 'careers',
                referrer: referrer || 'Direct',
                visitor_id: visitorId || 'anonymous',
                user_agent: userAgent
            });

        if (error) {
            console.error('Track error:', error);
            // Don't fail the request if tracking fails
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Analytics track error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
