'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || initialQuery);
    const [jobs, setJobs] = useState<JobWithCompany[]>(initialJobs);
    const [companies, setCompanies] = useState<any[]>(initialCompanies);
    const [activeTab, setActiveTab] = useState<'jobs' | 'companies'>('jobs');
    const [isPending, setIsPending] = useState(false);

    // Debounced Search Effect - fetch from API
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!query.trim()) {
                setJobs([]);
                setCompanies([]);
                return;
            }

            setIsPending(true);
            try {
                const response = await fetch(`/api/global-search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                if (data.success) {
                    setJobs(data.jobs || []);
                    setCompanies(data.companies || []);
                }
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setIsPending(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Search is already triggered by the useEffect above
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search Header */}
                <div className="max-w-2xl mx-auto mb-10 text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                        Find your next opportunity
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Search thousands of jobs and discover companies hiring now
                    </p>
                    <form onSubmit={handleSearch} className="relative mt-6">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className={`h-5 w-5 transition-colors ${isPending ? 'text-indigo-500 animate-pulse' : 'text-gray-400 group-focus-within:text-indigo-500'}`} />
                            </div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search jobs, companies, keywords..."
                                className="block w-full pl-11 pr-28 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-sm transition-all"
                                autoFocus
                            />
                            <div className="absolute inset-y-2 right-2 flex items-center">
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={!query || isPending}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-md"
                                >
                                    {isPending ? 'Searching...' : 'Search'}
                                </Button>
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
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            <Briefcase className="h-4 w-4" />
                            Jobs
                            <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${activeTab === 'jobs' ? 'bg-indigo-100 dark:bg-indigo-800/40 text-indigo-600 dark:text-indigo-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                                {jobs.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('companies')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'companies'
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            <Building2 className="h-4 w-4" />
                            Companies
                            <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${activeTab === 'companies' ? 'bg-indigo-100 dark:bg-indigo-800/40 text-indigo-600 dark:text-indigo-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                                {companies.length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {!query ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-16"
                        >
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 mb-6">
                                <Search className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Start your search</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                Enter keywords like job titles, skills, or company names to find opportunities.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 mt-6">
                                {['Software Engineer', 'Product Manager', 'Designer', 'Marketing'].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => setQuery(suggestion)}
                                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : isPending ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                            <p className="text-gray-500 dark:text-gray-400 mt-4">Searching...</p>
                        </motion.div>
                    ) : query && (jobs.length === 0 && companies.length === 0) ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900 mb-4">
                                <Search className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No results found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
                                We couldn't find anything matching "<span className="font-medium text-gray-700 dark:text-gray-300">{query}</span>". Try different keywords or check your spelling.
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
                                    {jobs.map((job, idx) => (
                                        <JobCard key={job.id} job={job} index={idx} companySlug={job.companies?.slug || 'demo'} />
                                    ))}
                                    {jobs.length === 0 && (
                                        <div className="col-span-full text-center py-12 text-gray-500">
                                            No jobs found matching "{query}"
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {companies.map((company, idx) => (
                                        <CompanyCard key={company.id} company={company} index={idx} />
                                    ))}
                                    {companies.length === 0 && (
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
