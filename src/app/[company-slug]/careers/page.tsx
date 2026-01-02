import { Metadata } from 'next';
import { CareersPageClient } from './CareersPageClient';
import { getCompanyData } from '@/lib/api/companies';

interface CareersPageProps {
    params: Promise<{ 'company-slug': string }>;
}

export async function generateMetadata({ params }: CareersPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const companySlug = resolvedParams['company-slug'];

    const data = await getCompanyData(companySlug);
    if (!data) {
        return { title: 'Company Not Found' };
    }

    const { company, jobs } = data;
    const jobCount = jobs.length;

    const title = `Careers at ${company.name} | ${jobCount} Open Positions`;
    const description = company.tagline || `Explore ${jobCount} open positions at ${company.name}. Join our global team of innovators.`;

    return {
        title,
        description,
        keywords: ['jobs', 'careers', 'hiring', company.name, 'remote jobs', 'tech jobs'],
        authors: [{ name: company.name }],
        openGraph: {
            title: `Join ${company.name} - ${jobCount} Open Positions`,
            description,
            url: `/${companySlug}/careers`,
            siteName: company.name,
            type: 'website',
            locale: 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title: `Careers at ${company.name}`,
            description,
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: `/${companySlug}/careers`,
        },
    };
}

export default async function CareersPage({ params }: CareersPageProps) {
    const resolvedParams = await params;
    const companySlug = resolvedParams['company-slug'];

    let data;
    try {
        data = await getCompanyData(companySlug);
    } catch (error) {
        console.error('Error fetching company data:', error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">Something Went Wrong</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn't load the company page. Please try again later.</p>
                    <a
                        href="/"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Go to Homepage
                    </a>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">Company Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">The company you're looking for doesn't exist or has been removed.</p>
                    <a
                        href="/"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Go to Homepage
                    </a>
                </div>
            </div>
        );
    }

    const { company, settings, sections, jobs } = data;

    // Generate JSON-LD schema
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: company.name,
        url: company.website,
        logo: company.logo_url,
        description: company.tagline,
    };

    const jobPostingsSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: jobs.slice(0, 10).map((job: any, index: number) => ({
            '@type': 'JobPosting',
            title: job.title,
            description: `${job.title} position at ${company.name} - ${job.department}`,
            datePosted: job.posted_at,
            employmentType: job.employment_type.toUpperCase().replace(' ', '_'),
            jobLocation: {
                '@type': 'Place',
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: job.location,
                },
            },
            hiringOrganization: {
                '@type': 'Organization',
                name: company.name,
                sameAs: company.website,
            },
            baseSalary: job.salary_range ? {
                '@type': 'MonetaryAmount',
                currency: job.salary_range.includes('USD') ? 'USD' :
                    job.salary_range.includes('AED') ? 'AED' :
                        job.salary_range.includes('SAR') ? 'SAR' :
                            job.salary_range.includes('INR') ? 'INR' : 'USD',
                value: {
                    '@type': 'QuantitativeValue',
                    value: job.salary_range,
                },
            } : undefined,
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingsSchema) }}
            />
            <CareersPageClient
                company={company}
                settings={settings}
                sections={sections}
                jobs={jobs}
            />
        </>
    );
}
