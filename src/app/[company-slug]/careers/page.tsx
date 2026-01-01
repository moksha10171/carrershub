import { Metadata } from 'next';
import { CareersPageClient } from './CareersPageClient';
import { getAllJobs, demoCompany, demoSettings, demoSections } from '@/lib/data';
import { createServerSupabaseClient } from '@/lib/supabase/server';

interface CareersPageProps {
    params: Promise<{ 'company-slug': string }>;
}

// Helper function to fetch company data from Supabase or fall back to demo
async function getCompanyData(slug: string) {
    try {
        const supabase = await createServerSupabaseClient();

        // Try to fetch from Supabase
        const { data: company, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('slug', slug)
            .single();

        if (company && !companyError) {
            const { data: settings } = await supabase
                .from('company_settings')
                .select('*')
                .eq('company_id', company.id)
                .single();

            const { data: sections } = await supabase
                .from('content_sections')
                .select('*')
                .eq('company_id', company.id)
                .eq('is_visible', true)
                .order('display_order', { ascending: true });

            const { data: jobs } = await supabase
                .from('jobs')
                .select('*')
                .eq('company_id', company.id)
                .eq('is_active', true);

            return {
                company,
                settings: settings || demoSettings,
                sections: sections || [],
                jobs: jobs || [],
                fromDatabase: true,
            };
        }
    } catch (error) {
        console.warn('Supabase fetch failed, using demo data:', error);
    }

    // Fallback to demo data
    if (slug === 'techcorp' || slug === demoCompany.slug) {
        return {
            company: demoCompany,
            settings: demoSettings,
            sections: demoSections.filter(s => s.is_visible).sort((a, b) => a.display_order - b.display_order),
            jobs: getAllJobs(demoCompany.id, false),
            fromDatabase: false,
        };
    }

    return null;
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

    const data = await getCompanyData(companySlug);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Company Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400">The company you're looking for doesn't exist.</p>
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
