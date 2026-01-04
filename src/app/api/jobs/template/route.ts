import { NextResponse } from 'next/server';

export async function GET() {
    // Create CSV template with proper headers
    const csvContent = `title,location,department,work_policy,employment_type,experience_level,job_type,salary_range
Senior Product Designer,Remote,Design,Remote,Full time,Senior,Permanent,$120k-$150k
Backend Engineer,New York,Engineering,Hybrid,Full time,Mid-level,Permanent,$100k-$130k
Marketing Manager,San Francisco,Marketing,On-site,Full time,Senior,Permanent,$90k-$120k
Data Analyst,Remote,Data,Remote,Full time,Junior,Permanent,$70k-$90k`;

    return new NextResponse(csvContent, {
        status: 200,
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="jobs_template.csv"',
        },
    });
}
