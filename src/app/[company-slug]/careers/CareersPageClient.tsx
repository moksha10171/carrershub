'use client';

import React from 'react';
import { HeroSection, JobListings, ContentSectionComponent } from '@/components/careers';
import type { Company, CompanySettings, ContentSection, Job } from '@/types';
import { Moon, Sun, ArrowUp, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CareersPageClientProps {
    company: Company;
    settings: CompanySettings;
    sections: ContentSection[];
    jobs: Job[];
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback?: React.ReactNode },
    { hasError: boolean; error?: Error }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="flex items-center justify-center min-h-[200px] p-8">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Something went wrong
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Please refresh the page and try again.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export function CareersPageClient({ company, settings, sections, jobs }: CareersPageClientProps) {
    const [isDark, setIsDark] = React.useState(false);
    const [showScrollTop, setShowScrollTop] = React.useState(false);
    const [isLoaded, setIsLoaded] = React.useState(false);

    // Initialize dark mode
    React.useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(settings.dark_mode_enabled && prefersDark);
        setIsLoaded(true);
    }, [settings.dark_mode_enabled]);

    // Toggle dark mode
    React.useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    // Show scroll to top button
    React.useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 600);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Generate custom CSS variables for theming
    const customStyles = `
    :root {
      --primary-50: ${settings.primary_color}10;
      --primary-100: ${settings.primary_color}20;
      --primary-200: ${settings.primary_color}40;
      --primary-300: ${settings.primary_color}60;
      --primary-400: ${settings.primary_color}80;
      --primary-500: ${settings.primary_color};
      --primary-600: ${settings.secondary_color};
      --primary-700: ${settings.secondary_color}dd;
      --primary-800: ${settings.secondary_color}bb;
      --primary-900: ${settings.secondary_color}99;
    }
  `;

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <style dangerouslySetInnerHTML={{ __html: customStyles }} />

            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                {/* Dark mode toggle */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => setIsDark(!isDark)}
                    className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    <AnimatePresence mode="wait">
                        {isDark ? (
                            <motion.div
                                key="sun"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Sun className="h-5 w-5 text-amber-500" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="moon"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Moon className="h-5 w-5 text-gray-700" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>

                {/* Hero Section */}
                <ErrorBoundary fallback={<div className="h-[50vh] bg-primary-600" />}>
                    <HeroSection
                        companyName={company.name}
                        tagline={company.tagline}
                        logoUrl={company.logo_url}
                        bannerUrl={company.banner_url}
                        primaryColor={settings.primary_color}
                        jobCount={jobs.length}
                    />
                </ErrorBoundary>

                {/* Content Sections */}
                <ErrorBoundary>
                    {sections && sections.length > 0 ? (
                        sections
                            .filter(s => s.is_visible)
                            .sort((a, b) => a.display_order - b.display_order)
                            .map((section, index) => (
                                <ContentSectionComponent key={section.id} section={section} index={index} />
                            ))
                    ) : (
                        <div className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                <p className="text-gray-500 dark:text-gray-400">
                                    Company information will be available soon.
                                </p>
                            </div>
                        </div>
                    )}
                </ErrorBoundary>

                {/* Job Listings */}
                <ErrorBoundary>
                    {jobs && jobs.length > 0 ? (
                        <JobListings jobs={jobs} />
                    ) : (
                        <div className="py-20 sm:py-24 bg-white dark:bg-gray-900">
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        No Open Positions
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        We don't have any open positions at the moment, but check back soon! We're always looking for talented individuals.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </ErrorBoundary>

                {/* Footer */}
                <footer className="mt-auto py-12 sm:py-16 bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            © {new Date().getFullYear()} {company.name}. All rights reserved.
                        </p>
                        {company.website && (
                            <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-3 text-sm sm:text-base text-primary-600 dark:text-primary-400 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1"
                            >
                                Visit our website →
                            </a>
                        )}
                    </div>
                </footer>

                {/* Scroll to top button */}
                <AnimatePresence>
                    {showScrollTop && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            onClick={scrollToTop}
                            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 p-3 sm:p-4 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            aria-label="Scroll to top"
                        >
                            <ArrowUp className="h-5 w-5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </ErrorBoundary>
    );
}
