import { Metadata } from 'next';
import { CareersPageClient } from './CareersPageClient';
import { getAllJobs, demoCompany, demoSettings, demoSections } from '@/lib/data';

interface CareersPageProps {
    params: Promise<{ 'company-slug': string }>;
}

export async function generateMetadata({ params }: CareersPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const companySlug = resolvedParams['company-slug'];

    // In production, fetch company from database
    const company = demoCompany;

    const title = `Careers at ${company.name} | ${getAllJobs().length} Open Positions`;
    const description = company.tagline || `Explore ${getAllJobs().length} open positions at ${company.name}. Join our global team of innovators.`;

    return {
        title,
        description,
        keywords: ['jobs', 'careers', 'hiring', company.name, 'remote jobs', 'tech jobs'],
        authors: [{ name: company.name }],
        openGraph: {
            title: `Join ${company.name} - ${getAllJobs().length} Open Positions`,
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

    // In production, fetch from API route
    const company = demoCompany;
    const settings = demoSettings;
    const sections = demoSections.filter(s => s.is_visible).sort((a, b) => a.display_order - b.display_order);

    // OPTIMIZED: Don't load descriptions for list view (not displayed anyway)
    const jobs = getAllJobs(company.id, false);

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
        itemListElement: jobs.slice(0, 10).map((job, index) => ({
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
