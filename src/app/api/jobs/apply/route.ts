import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { companyId, jobId, applicantName, applicantEmail } = body;

        if (!companyId || !jobId || !applicantName || !applicantEmail) {
            return NextResponse.json(
                { success: false, error: 'All fields are required' },
                { status: 400 }
            );
        }

        const supabase = await createServerSupabaseClient();

        // Check if job exists and belongs to the company
        const { data: job, error: jobError } = await supabase
            .from('jobs')
            .select('id')
            .eq('id', jobId)
            .eq('company_id', companyId)
            .single();

        if (jobError || !job) {
            return NextResponse.json(
                { success: false, error: 'Job not found' },
                { status: 404 }
            );
        }

        // Insert application
        const { error: applyError } = await supabase
            .from('job_applications')
            .insert({
                company_id: companyId,
                job_id: jobId,
                applicant_name: applicantName,
                applicant_email: applicantEmail,
                status: 'pending'
            });

        if (applyError) {
            console.error('Application error:', applyError);
            return NextResponse.json(
                { success: false, error: 'Failed to submit application' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Application submitted successfully'
        });

    } catch (error: any) {
        console.error('Job Apply API error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
