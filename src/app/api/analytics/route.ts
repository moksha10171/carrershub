import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAuth, unauthorizedResponse } from '@/lib/api/auth';

interface PageView {
    id: string;
    visitor_id: string | null;
    referrer: string | null;
    user_agent: string | null;
    created_at: string;
    job_id: string | null;
}

interface JobApplication {
    id: string;
    job_id: string;
    created_at: string;
}

interface Job {
    id: string;
    title: string;
}

export async function GET(request: NextRequest) {
    // Check authentication
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

        const supabase = await createServerSupabaseClient();

        // Verify ownership
        const { data: company } = await supabase
            .from('companies')
            .select('id')
            .eq('id', companyId)
            .eq('user_id', user.id)
            .single();

        if (!company) {
            return NextResponse.json({ success: false, error: 'Company not found or unauthorized' }, { status: 403 });
        }

        // Initialize date range based on param (default 30 days)
        const range = searchParams.get('range') || '30d';
        const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Fetch Page Views
        const { data: pageViews, error: viewsError } = await supabase
            .from('page_views')
            .select('*')
            .eq('company_id', companyId)
            .gte('created_at', startDate.toISOString());

        if (viewsError) throw viewsError;

        // Fetch Job Applications
        const { data: applications, error: appsError } = await supabase
            .from('job_applications')
            .select('*, jobs(title)')
            .eq('company_id', companyId)
            .gte('created_at', startDate.toISOString());

        if (appsError) throw appsError;

        // Fetch All Jobs (for top jobs list)
        const { data: jobs, error: jobsError } = await supabase
            .from('jobs')
            .select('id, title')
            .eq('company_id', companyId);

        if (jobsError) throw jobsError;

        // --- Aggregation Logic ---

        // 1. Overview Metrics
        const totalViews = pageViews?.length || 0;
        // Unique visitors based on visitor_id
        const uniqueVisitors = new Set(pageViews?.map((v: PageView) => v.visitor_id).filter(Boolean)).size;
        const totalApplications = applications?.length || 0;

        // Mock avg time (since we don't track duration yet)
        const avgTimeOnPage = '1m 24s';

        // 2. Views Over Time (Line Chart)
        const viewsMap = new Map<string, { views: number, visitors: Set<string> }>();

        // Initialize all dates in range with 0
        for (let i = 0; i < days; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            viewsMap.set(dateStr, { views: 0, visitors: new Set() });
        }

        pageViews?.forEach((view: PageView) => {
            const date = new Date(view.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (viewsMap.has(date)) {
                const entry = viewsMap.get(date)!;
                entry.views++;
                if (view.visitor_id) entry.visitors.add(view.visitor_id);
            }
        });

        // Convert map to array and reverse to show oldest to newest
        const viewsOverTime = Array.from(viewsMap.entries()).map(([date, data]) => ({
            date,
            views: data.views,
            visitors: data.visitors.size
        })).reverse();

        // 3. Top Jobs Stats
        const jobStats = new Map<string, { id: string, title: string, views: number, applications: number }>();

        jobs?.forEach((job: Job) => {
            jobStats.set(job.id, { id: job.id, title: job.title, views: 0, applications: 0 });
        });

        pageViews?.forEach((view: PageView) => {
            if (view.job_id && jobStats.has(view.job_id)) {
                jobStats.get(view.job_id)!.views++;
            }
        });

        applications?.forEach((app: JobApplication) => {
            if (app.job_id && jobStats.has(app.job_id)) {
                jobStats.get(app.job_id)!.applications++;
            }
        });

        const topJobs = Array.from(jobStats.values())
            .map(stat => ({
                title: stat.title,
                views: stat.views,
                applications: stat.applications,
                conversion: stat.views > 0 ? `${((stat.applications / stat.views) * 100).toFixed(1)}%` : '0%'
            }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 5); // Top 5

        // 4. Traffic Sources (Pie Chart)
        const sourceMap = new Map<string, number>();
        pageViews?.forEach((view: PageView) => {
            const source = view.referrer || 'Direct';
            // Simple normalization
            let cleanSource = 'Direct';
            if (source.includes('google')) cleanSource = 'Google';
            else if (source.includes('linkedin')) cleanSource = 'LinkedIn';
            else if (source.includes('twitter') || source.includes('t.co')) cleanSource = 'Twitter';
            else if (source !== 'Direct') cleanSource = 'Other';

            sourceMap.set(cleanSource, (sourceMap.get(cleanSource) || 0) + 1);
        });

        const trafficSources = Array.from(sourceMap.entries()).map(([name, value], i) => ({
            name,
            value,
            color: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][i % 5]
        }));

        if (trafficSources.length === 0) {
            trafficSources.push({ name: 'No Data', value: 1, color: '#e5e7eb' });
        }

        // 5. Device Breakdown (Bar Chart)
        // Since we don't have user_agent parser yet, we'll mock or infer simpler
        const deviceData = [
            { name: 'Desktop', value: 0, color: '#6366f1' },
            { name: 'Mobile', value: 0, color: '#8b5cf6' },
            { name: 'Tablet', value: 0, color: '#ec4899' },
        ];

        pageViews?.forEach((view: PageView) => {
            const ua = (view.user_agent || '').toLowerCase();
            if (ua.includes('mobile')) deviceData[1].value++;
            else if (ua.includes('tablet') || ua.includes('ipad')) deviceData[2].value++;
            else deviceData[0].value++;
        });

        // Handle empty case
        if (deviceData.every(d => d.value === 0)) {
            deviceData[0].value = 1; // Default to desktop to avoid empty chart
        }

        const realData = {
            overview: {
                totalViews,
                viewsChange: '+0%', // meaningful change requires previous period comparison
                uniqueVisitors,
                visitorsChange: '+0%',
                totalApplications,
                applicationsChange: '+0%',
                avgTimeOnPage,
                timeChange: '0%'
            },
            viewsOverTime,
            topJobs,
            trafficSources,
            deviceBreakdown: deviceData
        };

        return NextResponse.json({
            success: true,
            data: realData
        });
    } catch (error: any) {
        console.error('Analytics API error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
