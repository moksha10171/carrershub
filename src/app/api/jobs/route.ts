import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Job } from '@/types';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const supabase = await createServerSupabaseClient();

        // Query parameters
        const companyId = searchParams.get('company_id');
        if (!companyId) {
            return NextResponse.json({
                success: false,
                error: 'Company ID is required',
                jobs: [],
                total: 0
            }, { status: 400 });
        }
        const search = searchParams.get('search');
        const location = searchParams.get('location');
        const department = searchParams.get('department');
        const workPolicy = searchParams.get('work_policy');
        const employmentType = searchParams.get('employment_type');
        const experienceLevel = searchParams.get('experience_level');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '150'); // Increased for management view

        let jobs: Job[] = [];

        // Try Supabase first
        try {
            const { data: dbJobs, error: dbError } = await supabase
                .from('jobs')
                .select('*')
                .eq('company_id', companyId);

            if (dbJobs && !dbError) {
                jobs = dbJobs;
            } else {
                console.error('Supabase query failed:', dbError?.message);
                // jobs remain empty
            }
        } catch (supabaseError) {
            console.error('Supabase connection failed:', supabaseError);
            // jobs remain empty
        }

        // Apply filters
        if (search) {
            const searchLower = search.toLowerCase();
            jobs = jobs.filter(job =>
                job.title.toLowerCase().includes(searchLower) ||
                job.department.toLowerCase().includes(searchLower) ||
                job.location.toLowerCase().includes(searchLower)
            );
        }

        if (location) jobs = jobs.filter(job => job.location === location);
        if (department) jobs = jobs.filter(job => job.department === department);
        if (workPolicy) jobs = jobs.filter(job => job.work_policy === workPolicy);
        if (employmentType) jobs = jobs.filter(job => job.employment_type === employmentType);
        if (experienceLevel) jobs = jobs.filter(job => job.experience_level === experienceLevel);

        // Sort by posted_at desc
        jobs.sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime());

        // Pagination
        const total = jobs.length;
        const offset = (page - 1) * limit;
        const paginatedJobs = jobs.slice(offset, offset + limit);

        return NextResponse.json({
            success: true,
            jobs: paginatedJobs,
            total,
            filters: {
                locations: Array.from(new Set(jobs.map(j => j.location))).sort(),
                departments: Array.from(new Set(jobs.map(j => j.department))).sort(),
                types: Array.from(new Set(jobs.map(j => j.employment_type))).sort()
            },
        });
    } catch (error: any) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch jobs',
            jobs: [],
            total: 0,
            filters: { locations: [], departments: [], types: [] }
        }, { status: 500 });
    }
}

import { requireAuth, unauthorizedResponse } from '@/lib/api/auth';

export async function POST(request: NextRequest) {
    // Check authentication
    const { user, error: authError } = await requireAuth(request);
    if (authError || !user) {
        return unauthorizedResponse();
    }

    try {
        const body = await request.json();
        const { action, jobId, is_active, jobs: importJobs } = body;
        const supabase = await createServerSupabaseClient();

        if (action === 'create_job' || action === 'update_job') {
            const { title, location, department, work_policy, company_id, id: jobId } = body;

            if (!company_id || !title || !location || !department) {
                return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
            }

            // Verify company ownership
            const { data: company } = await supabase
                .from('companies')
                .select('id, user_id')
                .eq('id', company_id)
                .single();

            if (!company || company.user_id !== user.id) {
                return NextResponse.json({ success: false, error: 'Not authorized or company not found' }, { status: 403 });
            }

            if (action === 'create_job') {
                const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substring(2, 7);

                const { data, error } = await supabase
                    .from('jobs')
                    .insert({
                        company_id,
                        title,
                        location,
                        department,
                        work_policy,
                        slug,
                        description: `<p>Join our team as a ${title} in ${location}.</p>`,
                        employment_type: body.employment_type || 'Full time',
                        experience_level: body.experience_level || 'Mid-level',
                        job_type: body.job_type || 'Permanent',
                        is_active: true,
                        posted_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .select()
                    .single();

                if (error) throw error;
                return NextResponse.json({ success: true, job: data });
            } else {
                // update_job
                // Verify job ownership (redundant but safe since we checked company ownership above)
                const { error } = await supabase
                    .from('jobs')
                    .update({
                        title,
                        location,
                        department,
                        work_policy,
                        employment_type: body.employment_type,
                        experience_level: body.experience_level,
                        job_type: body.job_type,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', jobId)
                    .eq('company_id', company_id);

                if (error) throw error;
                return NextResponse.json({ success: true });
            }
        }
        if (action === 'update_status' || action === 'delete') {
            // Verify ownership
            const { data: job } = await supabase
                .from('jobs')
                .select('company_id, companies!inner(user_id)')
                .eq('id', jobId)
                .single();

            if (!job || (job as any).companies.user_id !== user.id) {
                return NextResponse.json({ success: false, error: 'Not authorized or job not found' }, { status: 403 });
            }

            if (action === 'update_status') {
                const { error } = await supabase
                    .from('jobs')
                    .update({ is_active })
                    .eq('id', jobId);
                if (error) throw error;
            } else if (action === 'delete') {
                const { error } = await supabase
                    .from('jobs')
                    .delete()
                    .eq('id', jobId);
                if (error) throw error;
            }
        }

        if (action === 'import') {
            const { company_id, jobs: importJobs } = body;

            if (!company_id || !Array.isArray(importJobs) || importJobs.length === 0) {
                return NextResponse.json({ success: false, error: 'Company ID and jobs required' }, { status: 400 });
            }

            // Verify company ownership
            const { data: company } = await supabase
                .from('companies')
                .select('id, user_id')
                .eq('id', company_id)
                .single();

            if (!company || company.user_id !== user.id) {
                return NextResponse.json({ success: false, error: 'Not authorized or company not found' }, { status: 403 });
            }

            try {
                // Ensure all jobs have the correct company_id
                const jobsToInsert = importJobs.map(job => ({
                    ...job,
                    company_id: company.id,
                    user_id: user.id, // For RLS if needed
                    is_active: job.is_active !== false,
                    posted_at: job.posted_at || new Date().toISOString(),
                }));

                // Insert jobs into Supabase
                const { data, error } = await supabase
                    .from('jobs')
                    .insert(jobsToInsert)
                    .select();

                if (error) {
                    console.error('Failed to import jobs to Supabase:', error);
                    return NextResponse.json({
                        success: false,
                        error: 'Failed to import jobs',
                        details: error.message
                    }, { status: 500 });
                }

                return NextResponse.json({
                    success: true,
                    imported: data?.length || 0,
                    message: `Successfully imported ${data?.length || 0} jobs`
                });
            } catch (error: any) {
                console.error('Error importing jobs:', error);
                return NextResponse.json({
                    success: false,
                    error: 'Internal server error'
                }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating job:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
