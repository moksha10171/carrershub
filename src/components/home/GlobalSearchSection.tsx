'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, Briefcase, MapPin, ArrowRight, Loader2 } from 'lucide-react';

// Simple debounce hook implementation if strict hook doesn't exist
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export function GlobalSearchSection() {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounceValue(query, 500);
    const [results, setResults] = useState<{ companies: any[], jobs: any[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchResults() {
            if (debouncedQuery.length < 2) {
                setResults(null);
                return;
            }

            setIsLoading(true);
            try {
                const res = await fetch(`/api/global-search?q=${encodeURIComponent(debouncedQuery)}`);
                const data = await res.json();
                if (data.success) {
                    setResults({ companies: data.companies, jobs: data.jobs });
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchResults();
    }, [debouncedQuery]);

    return (
        <section className="py-16 sm:py-24 bg-indigo-50 dark:bg-gray-900 border-y border-indigo-100 dark:border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Find your dream company
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                        Search across all companies and open positions on our platform.
                    </p>

                    <div className="relative max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-4 py-4 rounded-xl border-2 border-transparent bg-white dark:bg-gray-800 shadow-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg"
                            placeholder="Search by company name or job title..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {isLoading && (
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
                            </div>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {(results && (results.companies.length > 0 || results.jobs.length > 0)) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2"
                        >
                            {/* Companies Column */}
                            {results.companies.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-2">
                                        Companies
                                    </h3>
                                    {results.companies.map((company) => (
                                        <Link href={`/${company.slug}/careers`} key={company.id} className="block">
                                            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-md transition-shadow border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900">
                                                {company.logo_url ? (
                                                    <img src={company.logo_url} alt={company.name} className="w-12 h-12 object-contain rounded-lg bg-gray-50 dark:bg-gray-700" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                        <Building2 className="h-6 w-6" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">{company.name}</h4>
                                                    {company.tagline && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{company.tagline}</p>
                                                    )}
                                                </div>
                                                <ArrowRight className="h-5 w-5 text-gray-300 ml-auto" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Jobs Column */}
                            {results.jobs.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-2">
                                        Jobs
                                    </h3>
                                    {results.jobs.map((job) => {
                                        const company = Array.isArray(job.companies) ? job.companies[0] : job.companies;
                                        return (
                                            <Link href={`/${company?.slug || 'demo'}/jobs/${job.slug}`} key={job.id} className="block">
                                                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-md transition-shadow border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900">
                                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{job.title}</h4>
                                                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                                        <div className="flex items-center gap-1">
                                                            <Building2 className="h-3 w-3" />
                                                            <span>{company?.name || 'Unknown Company'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            <span>{job.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {results && results.companies.length === 0 && results.jobs.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8"
                        >
                            <p className="text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
