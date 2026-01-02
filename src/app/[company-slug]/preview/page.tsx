'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
    ChevronLeft, Edit, Share2, Smartphone, Monitor, Tablet, Copy, Check, ExternalLink
} from 'lucide-react';

import { HeroSection, JobListings, ContentSectionComponent } from '@/components/careers';
// import { getAllJobs, demoCompany, demoSettings, demoSections } from '@/lib/data';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';
type Orientation = 'portrait' | 'landscape';

export default function PreviewPage() {
    const params = useParams();
    const rawSlug = params['company-slug'] as string;
    const companySlug = (rawSlug && rawSlug !== 'undefined' && rawSlug !== 'null') ? rawSlug : null;

    const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Company data state
    // Company data state
    const [company, setCompany] = useState<any>(null);
    const [settings, setSettings] = useState<any>(null);
    const [sections, setSections] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);

    // Fetch company data
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!companySlug) return;

                // Fall back to API
                const response = await fetch(`/api/companies?slug=${companySlug}`);
                const result = await response.json();
                if (result.success && result.data) {
                    setCompany(result.data.company);
                    setSettings(result.data.settings || {});
                    setSections(result.data.sections || []);
                    if (result.data.jobs) {
                        setJobs(result.data.jobs);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch preview data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [companySlug]);

    const publicUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/${companySlug}/careers`
        : `/${companySlug}/careers`;

    const copyLink = () => {
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const [orientation, setOrientation] = useState<Orientation>('portrait');

    const toggleOrientation = () => {
        setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
    };

    const deviceWidths: Record<DeviceMode, string> = {
        desktop: '100%',
        tablet: orientation === 'portrait' ? '768px' : '1024px',
        mobile: orientation === 'portrait' ? '375px' : '700px', // Wider mobile landscape
    };

    const deviceHeights: Record<DeviceMode, string> = {
        desktop: '100%',
        tablet: orientation === 'portrait' ? '1024px' : '768px',
        mobile: orientation === 'portrait' ? '800px' : '375px',
    };

    const deviceIcons: Record<DeviceMode, React.ReactNode> = {
        desktop: <Monitor className="h-4 w-4" />,
        tablet: <Tablet className="h-4 w-4" />,
        mobile: <Smartphone className="h-4 w-4" />,
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 gap-4">
                <p className="text-gray-500">Company not found.</p>
                <Link href="/dashboard">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 overflow-x-hidden">
            {/* Preview Toolbar */}
            {!isFullscreen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm"
                >
                    <div className="container mx-auto px-4 py-3">
                        <div className="flex items-center justify-between gap-4">
                            {/* Left - Back & Title */}
                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/${companySlug}/edit`}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    aria-label="Back to edit page"
                                >
                                    <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                </Link>
                                <div className="hidden sm:block">
                                    <div className="flex items-center gap-2">
                                        <h1 className="font-semibold text-gray-900 dark:text-white">Preview Mode</h1>
                                        <span className="px-2 py-0.5 text-xs font-mono bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-md">
                                            /{companySlug}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{company.name} Careers Page</p>
                                </div>
                            </div>

                            {/* Center - Device Toggle */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-lg p-1">
                                    {(['desktop', 'tablet', 'mobile'] as DeviceMode[]).map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => setDeviceMode(mode)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${deviceMode === mode
                                                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                                }`}
                                            aria-label={`${mode} view`}
                                        >
                                            {deviceIcons[mode]}
                                            <span className="hidden sm:inline capitalize">{mode}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
                                <button
                                    onClick={toggleOrientation}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                    title="Rotate Device"
                                >
                                    <Smartphone className={`h-4 w-4 transition-transform duration-300 ${orientation === 'landscape' ? 'rotate-90' : ''}`} />
                                </button>
                            </div>

                            {/* Right - Actions */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyLink}
                                    className="hidden sm:flex"
                                >
                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                    {copied ? 'Copied!' : 'Copy Link'}
                                </Button>
                                <Link href={`/${companySlug}/edit`}>
                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                        <span className="hidden sm:inline">Edit</span>
                                    </Button>
                                </Link>
                                <Link href={`/${companySlug}/careers`} target="_blank">
                                    <Button size="sm">
                                        <ExternalLink className="h-4 w-4" />
                                        <span className="hidden sm:inline">Publish</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Preview Frame */}
            <div className={`pt-16 pb-20 flex justify-center items-start min-h-screen ${isFullscreen ? 'pt-0 pb-0' : ''} transition-all duration-300`}>
                <div className="relative" style={{ perspective: '1000px' }}>
                    <motion.div
                        layout
                        className="bg-white dark:bg-gray-950 shadow-2xl overflow-hidden relative"
                        animate={{
                            width: deviceWidths[deviceMode],
                            height: deviceMode === 'desktop' ? '100%' : deviceHeights[deviceMode],
                            borderRadius: deviceMode === 'desktop' ? '0' : '30px',
                            borderWidth: deviceMode !== 'desktop' ? '12px' : '0',
                            borderColor: '#1f2937',
                        }}
                        style={{
                            maxWidth: '100vw',
                            margin: '0 auto',
                        }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    >
                        {/* Device Notch/Camera (Visual Only) */}
                        {deviceMode !== 'desktop' && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-xl z-50 flex items-center justify-center">
                                <div className="w-16 h-1 bg-gray-800 rounded-full" />
                            </div>
                        )}

                        {/* Actual Page Content */}
                        <div
                            className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
                            style={{
                                height: '100%',
                            }}
                        >
                            {/* Hero Section */}
                            <HeroSection
                                companyName={company.name}
                                tagline={company.tagline}
                                logoUrl={company.logo_url}
                                bannerUrl={company.banner_url}
                                primaryColor={settings.primary_color}
                                jobCount={jobs.length}
                            />

                            {/* Content Sections */}
                            {sections
                                .filter(s => s.is_visible)
                                .sort((a, b) => a.display_order - b.display_order)
                                .map((section, index) => (
                                    <ContentSectionComponent key={section.id} section={section} index={index} />
                                ))}

                            {/* Job Listings (Wrapped to ensure it doesn't break layout) */}
                            <div className="w-full max-w-full overflow-hidden">
                                <JobListings jobs={jobs} />
                            </div>

                            {/* Footer */}
                            <footer className="py-8 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                                <div className="container mx-auto px-4 text-center">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        © {new Date().getFullYear()} {company.name}. All rights reserved.
                                    </p>
                                </div>
                            </footer>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Preview Info Bar */}
            {
                !isFullscreen && (
                    <div className="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white py-2 px-4 text-center text-sm">
                        <span className="hidden sm:inline">
                            This is a preview of your careers page.
                        </span>
                        <Link href={`/${companySlug}/careers`} className="underline hover:no-underline ml-1">
                            View live page →
                        </Link>
                    </div>
                )
            }
        </div>
    );
}
