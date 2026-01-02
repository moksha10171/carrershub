import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAuth, unauthorizedResponse } from '@/lib/api/auth';

export async function POST(request: NextRequest) {
    const { user, error } = await requireAuth(request);
    if (error || !user) return unauthorizedResponse();

    const supabase = await createServerSupabaseClient();

    // Get company
    const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!company) {
        return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404 });
    }

    // Get Jobs
    const { data: jobs } = await supabase
        .from('jobs')
        .select('id')
        .eq('company_id', company.id);

    if (!jobs || jobs.length === 0) {
        return NextResponse.json({ success: false, error: 'No jobs found. Create jobs first.' }, { status: 400 });
    }

    const views = [];
    const applications = [];
    const now = new Date();

    // Generate 30 days of data
    for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Random daily views (10-100)
        const dailyViews = Math.floor(Math.random() * 90) + 10;

        for (let j = 0; j < dailyViews; j++) {
            const job = jobs[Math.floor(Math.random() * jobs.length)];
            const isJobView = Math.random() > 0.3; // 70% job views, 30% main page
            const visitorId = `visitor-${Math.floor(Math.random() * 1000)}`;
            const sources = ['Google', 'LinkedIn', 'Twitter', 'Direct', 'Direct', 'Direct'];
            const source = sources[Math.floor(Math.random() * sources.length)];
            const userAgents = ['Mozilla/5.0 (iPhone; CPU iPhone OS...)', 'Mozilla/5.0 (Macintosh; Intel Mac OS X...)', 'Mozilla/5.0 (Windows NT 10.0...)'];
            const ua = userAgents[Math.floor(Math.random() * userAgents.length)];

            views.push({
                company_id: company.id,
                page_type: isJobView ? 'job_detail' : 'careers',
                job_id: isJobView ? job.id : null,
                visitor_id: visitorId,
                referrer: source,
                user_agent: ua,
                created_at: date.toISOString() // Note: Supabase might override with NOW() if not careful, but we send it
            });

            // Random application conversion (5% chance)
            if (isJobView && Math.random() < 0.05) {
                applications.push({
                    company_id: company.id,
                    job_id: job.id,
                    applicant_name: `Candidate ${Math.floor(Math.random() * 1000)}`,
                    applicant_email: `candidate${Math.floor(Math.random() * 1000)}@example.com`,
                    status: 'pending',
                    created_at: date.toISOString()
                });
            }
        }
    }

    // Bulk insert
    // Note: chunking might be needed for large datasets, but 3000 rows is fine for Supabase
    const { error: viewError } = await supabase.from('page_views').insert(views);
    if (viewError) return NextResponse.json({ success: false, error: viewError.message });

    const { error: appError } = await supabase.from('job_applications').insert(applications);
    if (appError) return NextResponse.json({ success: false, error: appError.message });

    return NextResponse.json({
        success: true,
        message: `Seeded ${views.length} views and ${applications.length} applications`
    });
}
