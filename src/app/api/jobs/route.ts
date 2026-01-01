import { NextRequest, NextResponse } from 'next/server';
import { getAllJobs, getFilterOptions, demoCompany } from '@/lib/data';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Job } from '@/types';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const supabase = await createServerSupabaseClient();

        // Query parameters
        const companyId = searchParams.get('company_id') || demoCompany.id;
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
                console.warn('Supabase query failed, falling back to demo data:', dbError?.message);
                jobs = getAllJobs(companyId);
            }
        } catch (supabaseError) {
            console.warn('Supabase connection failed, using demo data:', supabaseError);
            jobs = getAllJobs(companyId);
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
            filters: getFilterOptions(jobs),
        });
    } catch (error: any) {
        console.error('Error fetching jobs:', error);
        // Graceful fallback with demo data
        const fallbackJobs = getAllJobs();
        return NextResponse.json({
            success: true,
            jobs: fallbackJobs,
            total: fallbackJobs.length,
            filters: getFilterOptions(fallbackJobs),
            warning: 'Using demo data due to server error',
        }, { status: 200 });
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
        // Import jobs
        if (action === 'import') {
            // The `importJobs` variable is already destructured from `body`
            if (!Array.isArray(importJobs) || importJobs.length === 0) {
                return NextResponse.json({ success: false, error: 'No jobs provided' }, { status: 400 });
            }

            try {
                // Insert jobs into Supabase
                const { data, error } = await supabase
                    .from('jobs')
                    .insert(importJobs)
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
