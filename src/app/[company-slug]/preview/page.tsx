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
import { getAllJobs, demoCompany, demoSettings, demoSections } from '@/lib/data';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export default function PreviewPage() {
    const params = useParams();
    const companySlug = params['company-slug'] as string || 'techcorp';

    const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Company data state
    const [company, setCompany] = useState(demoCompany);
    const [settings, setSettings] = useState(demoSettings);
    const [sections, setSections] = useState(demoSections);
    const [jobs, setJobs] = useState(getAllJobs(demoCompany.id));

    // Fetch company data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Try localStorage first (for recent edits)
                const savedData = localStorage.getItem(`company_${companySlug}`);
                if (savedData) {
                    const data = JSON.parse(savedData);
                    // Validate data structure
                    if (data?.company?.name && data?.settings) {
                        setCompany({
                            ...demoCompany,
                            name: data.company.name || 'Untitled',
                            tagline: data.company.tagline || '',
                            logo_url: data.company.logo_url || '',
                            banner_url: data.company.banner_url || '',
                        });
                        setSettings({
                            ...demoSettings,
                            primary_color: data.settings.primary_color || '#6366F1',
                            secondary_color: data.settings.secondary_color || '#4F46E5',
                            accent_color: data.settings.accent_color || '#10B981',
                        });
                        if (data.sections && Array.isArray(data.sections)) {
                            setSections(data.sections);
                        }
                        setIsLoading(false);
                        return;
                    }
                }

                // Fall back to API
                const response = await fetch(`/api/companies?slug=${companySlug}`);
                const result = await response.json();
                if (result.success && result.data) {
                    setCompany(result.data.company);
                    setSettings(result.data.settings || demoSettings);
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

    const deviceWidths: Record<DeviceMode, string> = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px',
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
            <div className={`pt-16 pb-20 ${isFullscreen ? 'pt-0 pb-0' : ''}`}>
                <div className="flex justify-center px-2 sm:px-4">
                    <motion.div
                        layout
                        className="bg-white dark:bg-gray-950 shadow-2xl overflow-hidden"
                        style={{
                            width: deviceWidths[deviceMode],
                            maxWidth: 'calc(100vw - 16px)',
                            borderRadius: deviceMode === 'desktop' ? '0' : '24px',
                            border: deviceMode !== 'desktop' ? '6px solid #1f2937' : 'none',
                            transform: deviceMode === 'mobile' ? 'scale(0.9)' : deviceMode === 'tablet' ? 'scale(0.95)' : 'none',
                            transformOrigin: 'top center',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {/* Device Frame Header (for mobile/tablet) */}
                        {deviceMode !== 'desktop' && (
                            <div className="bg-gray-800 h-5 flex items-center justify-center">
                                <div className="w-12 h-1 bg-gray-600 rounded-full" />
                            </div>
                        )}

                        {/* Actual Page Content */}
                        <div
                            className="overflow-y-auto overflow-x-hidden"
                            style={{
                                height: deviceMode === 'desktop' ? 'auto' : '70vh',
                                maxHeight: deviceMode === 'desktop' ? 'none' : '600px',
                                minHeight: deviceMode === 'desktop' ? '100vh' : 'auto',
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

                            {/* Job Listings */}
                            <JobListings jobs={jobs} />

                            {/* Footer */}
                            <footer className="py-6 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                                <div className="container mx-auto px-4 text-center">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        © {new Date().getFullYear()} {company.name}. All rights reserved.
                                    </p>
                                </div>
                            </footer>
                        </div>

                        {/* Device Frame Footer (for mobile/tablet) */}
                        {deviceMode !== 'desktop' && (
                            <div className="bg-gray-800 h-4 flex items-center justify-center">
                                <div className="w-16 h-1 bg-gray-600 rounded-full" />
                            </div>
                        )}
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
