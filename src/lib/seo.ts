import { Metadata } from 'next';

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    twitterCard?: 'summary' | 'summary_large_image';
    keywords?: string[];
    noindex?: boolean;
}

export function generateMetadata({
    title,
    description,
    canonical,
    ogImage = '/images/og-default.png',
    ogType = 'website',
    twitterCard = 'summary_large_image',
    keywords = [],
    noindex = false,
}: SEOProps): Metadata {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://careerhub.app';
    const fullTitle = title.includes('CareerHub') ? title : `${title} | CareerHub`;
    const canonicalUrl = canonical || siteUrl;

    return {
        title: fullTitle,
        description,
        keywords: keywords.join(', '),
        authors: [{ name: 'CareerHub' }],
        robots: noindex ? 'noindex,nofollow' : 'index,follow',
        openGraph: {
            title: fullTitle,
            description,
            url: canonicalUrl,
            siteName: 'CareerHub',
            images: [
                {
                    url: ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: 'en_US',
            type: ogType,
        },
        twitter: {
            card: twitterCard,
            title: fullTitle,
            description,
            images: [ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`],
        },
        alternates: {
            canonical: canonicalUrl,
        },
    };
}

// JSON-LD Schema helpers
export function generateOrganizationSchema(company: {
    name: string;
    url?: string;
    logo?: string;
    description?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: company.name,
        url: company.url,
        logo: company.logo,
        description: company.description,
    };
}

export function generateJobPostingSchema(job: {
    title: string;
    description: string;
    datePosted: string;
    employmentType: string;
    location: string;
    company: {
        name: string;
        url?: string;
        logo?: string;
    };
    salary?: {
        min?: number;
        max?: number;
        currency?: string;
    };
}) {
    const schema: any = {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.title,
        description: job.description,
        datePosted: job.datePosted,
        employmentType: job.employmentType.toUpperCase().replace(' ', '_'),
        jobLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                addressLocality: job.location,
            },
        },
        hiringOrganization: {
            '@type': 'Organization',
            name: job.company.name,
            sameAs: job.company.url,
            logo: job.company.logo,
        },
    };

    if (job.salary && (job.salary.min || job.salary.max)) {
        schema.baseSalary = {
            '@type': 'MonetaryAmount',
            currency: job.salary.currency || 'USD',
            value: {
                '@type': 'QuantitativeValue',
                minValue: job.salary.min,
                maxValue: job.salary.max,
                unitText: 'YEAR',
            },
        };
    }

    return schema;
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}
