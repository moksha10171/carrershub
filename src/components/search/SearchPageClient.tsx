'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Briefcase, Building2, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { JobCard } from '@/components/careers/JobCard';
import { CompanyCard } from '@/components/company/CompanyCard';
import type { Job } from '@/types';

interface JobWithCompany extends Job {
    companies?: {
        name: string;
        slug: string;
        logo_url: string | null;
    };
}

interface SearchPageClientProps {
    initialJobs: JobWithCompany[];
    initialCompanies: any[]; // using explicit type from CompanyCard
    initialQuery: string;
}

export function SearchPageClient({ initialJobs, initialCompanies, initialQuery }: SearchPageClientProps) {
    const router = useRouter();
    const [query, setQuery] = useState(initialQuery);
    const [activeTab, setActiveTab] = useState<'jobs' | 'companies'>(initialJobs.length === 0 && initialCompanies.length > 0 ? 'companies' : 'jobs');
    const [isPending, setIsPending] = useState(false);

    // Debounced Search Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query !== initialQuery) {
                setIsPending(true);
                const params = new URLSearchParams();
                if (query) params.set('q', query);
                router.replace(`/search?${params.toString()}`);
                setIsPending(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, router, initialQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Trigger immediate navigation
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search Header */}
                <div className="max-w-2xl mx-auto mb-10 text-center space-y-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                        Find your next opportunity
                    </h1>
                    <form onSubmit={handleSearch} className="relative">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search based on keywords, titles, companies..."
                                className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-sm transition-all"
                                autoFocus
                            />
                            <div className="absolute inset-y-0 right-2 flex items-center">
                                <Button type="submit" size="sm" disabled={!query}>Search</Button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center shadow-sm">
                        <button
                            onClick={() => setActiveTab('jobs')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'jobs'
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            <Briefcase className="h-4 w-4" />
                            Jobs
                            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                {initialJobs.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('companies')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'companies'
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            <Building2 className="h-4 w-4" />
                            Companies
                            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                {initialCompanies.length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {query && (initialJobs.length === 0 && initialCompanies.length === 0) ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900 mb-4">
                                <Search className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No results found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Try adjusting your search terms or checking different keywords.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: activeTab === 'jobs' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-5xl mx-auto"
                        >
                            {activeTab === 'jobs' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {initialJobs.map((job, idx) => (
                                        <JobCard key={job.id} job={job} index={idx} companySlug={job.companies?.slug || 'demo'} />
                                    ))}
                                    {initialJobs.length === 0 && (
                                        <div className="col-span-full text-center py-12 text-gray-500">
                                            No jobs found matching "{query}"
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {initialCompanies.map((company, idx) => (
                                        <CompanyCard key={company.id} company={company} index={idx} />
                                    ))}
                                    {initialCompanies.length === 0 && (
                                        <div className="col-span-full text-center py-12 text-gray-500">
                                            No companies found matching "{query}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
