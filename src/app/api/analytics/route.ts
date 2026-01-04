import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAuth, unauthorizedResponse } from '@/lib/api/auth';

interface AnalyticsOverview {
    totalViews: number;
    viewsChange: string;
    uniqueVisitors: number;
    visitorsChange: string;
    totalApplications: number;
    applicationsChange: string;
    avgTimeOnPage: string;
    timeChange: string;
}

interface ViewsChartData {
    date: string;
    views: number;
    applicants: number;
}

interface TopJob {
    title: string;
    views: number;
    applications: number;
    conversion: string;
}

interface TrafficSource {
    name: string;
    value: number;
    color: string;
}

interface AnalyticsData {
    overview: AnalyticsOverview;
    viewsOverTime: ViewsChartData[];
    topJobs: TopJob[];
    trafficSources: TrafficSource[];
    deviceBreakdown: TrafficSource[];
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
        const startDateStr = startDate.toISOString();
        const endDateStr = new Date().toISOString();

        // 1. Overview Metrics (Parallel inefficient counts)
        const [
            { count: totalViews },
            { data: uniqueCount },
            { count: totalApplications }
        ] = await Promise.all([
            // Total Views
            supabase
                .from('page_views')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', companyId)
                .gte('created_at', startDateStr),

            // Unique Visitors (via RPC)
            supabase.rpc('get_unique_visitors', {
                p_company_id: companyId,
                p_start_date: startDateStr
            }),

            // Total Applications
            supabase
                .from('job_applications')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', companyId)
                .gte('created_at', startDateStr)
        ]);

        // 2. Views Over Time (via RPC)
        const { data: dailyViews } = await supabase.rpc('get_daily_page_views', {
            p_company_id: companyId,
            p_start_date: startDateStr,
            p_end_date: endDateStr
        });

        // 3. Top Jobs (via RPC)
        const { data: topJobs } = await supabase.rpc('get_top_performing_jobs', {
            p_company_id: companyId,
            p_limit: 5
        });

        // Format chart data
        // Fill in missing dates with 0
        const viewsMap = new Map();
        if (dailyViews) {
            dailyViews.forEach((d: any) => viewsMap.set(d.view_date, Number(d.count)));
        }

        const chartData = [];
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            const dateStr = date.toISOString().split('T')[0];

            chartData.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                views: viewsMap.get(dateStr) || 0,
                applicants: 0 // TODO: Add daily applicants RPC if needed
            });
        }

        // Calculate conversion rates for top jobs
        const topJobsWithConversion = topJobs?.map((j: any) => {
            const views = Number(j.view_count) || 0;
            const applications = 0; // TODO: Add RPC to get applications per job
            const conversionRate = views > 0 ? ((applications / views) * 100).toFixed(1) : '0.0';
            return {
                title: j.job_title,
                views,
                applications,
                conversion: `${conversionRate}%`
            };
        }) || [];

        // Formulate response to match Frontend expectations
        const responseData = {
            overview: {
                totalViews: totalViews || 0,
                viewsChange: '+0%', // TODO: Calculate compared to previous period
                uniqueVisitors: uniqueCount || 0,
                visitorsChange: '+0%', // TODO: Calculate compared to previous period
                totalApplications: totalApplications || 0,
                applicationsChange: '+0%', // TODO: Calculate compared to previous period
                avgTimeOnPage: 'N/A', // Note: Requires time tracking implementation
                timeChange: '0%'
            },
            viewsOverTime: chartData,
            topJobs: topJobsWithConversion,
            trafficSources: [
                { name: 'Direct', value: (totalViews || 0) > 0 ? totalViews : 1, color: '#6366f1' }
                // TODO: Add actual traffic source tracking
            ],
            deviceBreakdown: [
                { name: 'Desktop', value: (totalViews || 0) > 0 ? totalViews : 1, color: '#6366f1' },
                { name: 'Mobile', value: 0, color: '#8b5cf6' },
                { name: 'Tablet', value: 0, color: '#ec4899' }
                // TODO: Add actual device tracking from user_agent parsing
            ]
        };

        return NextResponse.json({
            success: true,
            data: responseData
        });
    } catch (error: any) {
        console.error('Analytics API error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
