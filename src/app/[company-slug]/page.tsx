import { redirect } from 'next/navigation';

interface CompanyRootPageProps {
    params: Promise<{ 'company-slug': string }>;
}

export default async function CompanyRootPage({ params }: CompanyRootPageProps) {
    const resolvedParams = await params;
    const slug = resolvedParams['company-slug'];

    // Redirect /slug -> /slug/careers
    redirect(`/${slug}/careers`);
}
