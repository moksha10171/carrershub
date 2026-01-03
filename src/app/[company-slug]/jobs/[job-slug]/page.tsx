import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getJobData } from '@/lib/api/companies';
import {
    MapPin, Briefcase, Clock, DollarSign, Calendar, Building2,
    ChevronLeft, ExternalLink
} from 'lucide-react';
import { JobActions } from './JobActions';
import { StickyApply } from './StickyApply';
import { ApplyButton } from './ApplyButton';
import { ThemeSetup } from '@/components/company/ThemeSetup';
import { AnalyticsTracker } from '@/components/company/AnalyticsTracker';

interface JobPageProps {
    params: Promise<{ 'company-slug': string; 'job-slug': string }>;
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const companySlug = resolvedParams['company-slug'];
    const jobSlug = resolvedParams['job-slug'];

    const data = await getJobData(companySlug, jobSlug);

    if (!data) {
        return { title: 'Job Not Found' };
    }

    const { job, company } = data;

    return {
        title: `${job.title} at ${company.name}`,
        description: `${job.title} - ${job.department} - ${job.location}. ${job.employment_type}, ${job.experience_level} position.`,
        openGraph: {
            title: `${job.title} at ${company.name}`,
            description: `Apply for ${job.title} in ${job.location}`,
            type: 'website',
        },
    };
}

export default async function JobPage({ params }: JobPageProps) {
    const resolvedParams = await params;
    const companySlug = resolvedParams['company-slug'];
    const jobSlug = resolvedParams['job-slug'];

    const data = await getJobData(companySlug, jobSlug);

    if (!data) {
        notFound();
    }

    const { job, company, settings, relatedJobs } = data;

    // Format posted date
    const postedDate = new Date(job.posted_at);
    const formattedDate = postedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const jobSchema = {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.title,
        description: job.description,
        identifier: {
            '@type': 'PropertyValue',
            name: company.name,
            value: job.id,
        },
        datePosted: job.posted_at,
        validThrough: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
        employmentType: job.employment_type.toUpperCase().replace(' ', '_'),
        hiringOrganization: {
            '@type': 'Organization',
            name: company.name,
            sameAs: company.website,
            logo: company.logo_url,
        },
        jobLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                addressLocality: job.location,
            },
        },
        baseSalary: job.salary_range ? {
            '@type': 'MonetaryAmount',
            currency: 'USD',
            value: {
                '@type': 'QuantitativeValue',
                value: job.salary_range, // Best effort, strictly should be numeric
            }
        } : undefined,
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
            />
            <ThemeSetup settings={settings} />
            <AnalyticsTracker
                companyId={company.id}
                jobId={job.id}
                pageType="job_detail"
            />
            <StickyApply
                jobId={job.id}
                companyId={company.id}
                title={job.title}
                companyName={company.name}
            />
            <main className="pt-20 lg:pt-24 pb-16">
                {/* Breadcrumb */}
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Link
                                href={`/${companySlug}/careers`}
                                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Back to all jobs
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Job Header */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-6">
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                            {job.title}
                                        </h1>
                                        <p className="text-lg text-gray-600 dark:text-gray-400">
                                            {company.name}
                                        </p>
                                    </div>
                                    <JobActions
                                        jobTitle={`${job.title} at ${company.name}`}
                                        jobUrl={`https://whitecarrot.com/${companySlug}/jobs/${jobSlug}`}
                                    />
                                </div>

                                {/* Job Meta */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <MapPin className="h-4 w-4 flex-shrink-0" />
                                        <span className="text-sm">{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Briefcase className="h-4 w-4 flex-shrink-0" />
                                        <span className="text-sm">{job.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Clock className="h-4 w-4 flex-shrink-0" />
                                        <span className="text-sm">{job.employment_type}</span>
                                    </div>
                                    {job.salary_range && (
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <DollarSign className="h-4 w-4 flex-shrink-0" />
                                            <span className="text-sm">{job.salary_range}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="px-3 py-1 text-sm rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                                        {job.work_policy}
                                    </span>
                                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                        {job.experience_level}
                                    </span>
                                    <span className="px-3 py-1 text-sm rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                        {job.job_type}
                                    </span>
                                </div>

                                {/* Apply Button - Mobile */}
                                <div className="lg:hidden">
                                    <ApplyButton
                                        jobId={job.id}
                                        companyId={company.id}
                                        jobTitle={job.title}
                                        companyName={company.name}
                                        description="Apply for this position"
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    About this role
                                </h2>
                                <div
                                    className="prose prose-gray dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: job.description || '' }}
                                />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Apply Card - Desktop */}
                            <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    Interested in this role?
                                </h3>
                                <ApplyButton
                                    jobId={job.id}
                                    companyId={company.id}
                                    jobTitle={job.title}
                                    companyName={company.name}
                                    description="Apply Now"
                                    className="w-full mb-4"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    Application opens in external system
                                </p>
                            </div>

                            {/* Company Info */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center">
                                        <Building2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {company.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Technology
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    {company.tagline}
                                </p>
                                <Link href={`/${companySlug}/careers`}>
                                    <Button variant="outline" className="w-full" size="sm">
                                        View all jobs at {company.name}
                                    </Button>
                                </Link>
                            </div>

                            {/* Job Details */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    Job Details
                                </h3>
                                <dl className="space-y-3">
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">Posted</dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{formattedDate}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">Department</dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{job.department}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">Experience</dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{job.experience_level}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500 dark:text-gray-400">Type</dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{job.employment_type}</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Similar Jobs */}
                            {relatedJobs && relatedJobs.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                        Similar Positions
                                    </h3>
                                    <div className="space-y-3">
                                        {relatedJobs.map((similarJob: any) => (
                                            <Link
                                                key={similarJob.id}
                                                href={`/${companySlug}/jobs/${similarJob.slug}`}
                                                className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                            >
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {similarJob.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {similarJob.location}
                                                    </span>
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                                                        {similarJob.employment_type}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
