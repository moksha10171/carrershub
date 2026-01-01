import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAuth, unauthorizedResponse } from '@/lib/api/auth';
import sampleJobs from '@/lib/sample-jobs.json';

export async function POST(request: NextRequest) {
    const { user, error: authError } = await requireAuth(request);
    if (authError || !user) {
        return unauthorizedResponse();
    }

    try {
        const body = await request.json();
        const { company_id } = body;

        if (!company_id) {
            return NextResponse.json({ success: false, error: 'Company ID is required' }, { status: 400 });
        }

        const supabase = await createServerSupabaseClient();

        // Verify company ownership
        const { data: company } = await supabase
            .from('companies')
            .select('id, user_id')
            .eq('id', company_id)
            .single();

        if (!company || company.user_id !== user.id) {
            return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
        }

        // Map sample jobs to database schema
        const now = new Date();
        const jobsToInsert = sampleJobs.map((job: any) => {
            const postedAt = new Date(now);
            postedAt.setDate(postedAt.getDate() - (job.posted_days_ago || 0));

            return {
                company_id: company.id,
                title: job.title,
                slug: job.job_slug,
                location: job.location,
                department: job.department,
                work_policy: job.work_policy,
                employment_type: job.employment_type,
                experience_level: job.experience_level,
                job_type: job.job_type,
                salary_range: job.salary_range,
                description: `<p>We are looking for a talented ${job.title} to join our ${job.department} team in ${job.location}.</p><h2>About the Role</h2><p>This is a ${job.employment_type} ${job.work_policy} position.</p>`,
                is_active: true,
                posted_at: postedAt.toISOString(),
            };
        });

        const { data, error } = await supabase
            .from('jobs')
            .insert(jobsToInsert)
            .select();

        if (error) {
            console.error('Failed to seed jobs:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Successfully loaded ${data?.length || 0} sample jobs`,
            count: data?.length || 0
        });

    } catch (error: any) {
        console.error('Seed jobs error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
