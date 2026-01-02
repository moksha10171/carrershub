'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Search, LayoutGrid, List } from 'lucide-react';
import { JobCard, JobCardSkeleton } from './JobCard';
import { JobFiltersComponent } from './JobFilters';
import { getFilterOptions } from '@/lib/data';
import type { Job, JobFilters } from '@/types';

interface JobListingsProps {
    jobs: Job[];
    companySlug?: string;
    isLoading?: boolean;
}

export function JobListings({ jobs, companySlug = 'demo', isLoading = false }: JobListingsProps) {
    const [filters, setFilters] = useState<JobFilters>({
        search: '',
        location: '',
        department: '',
        work_policy: '',
        employment_type: '',
        experience_level: '',
    });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Get unique values for filter options
    const { locations, departments } = useMemo(() => getFilterOptions(jobs), [jobs]);

    // Filter jobs based on current filters
    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const matchesSearch = !filters.search ||
                job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                job.department.toLowerCase().includes(filters.search.toLowerCase());
            const matchesLocation = !filters.location || job.location === filters.location;
            const matchesDepartment = !filters.department || job.department === filters.department;
            const matchesWorkPolicy = !filters.work_policy || job.work_policy === filters.work_policy;
            const matchesEmployment = !filters.employment_type || job.employment_type === filters.employment_type;
            const matchesExperience = !filters.experience_level || job.experience_level === filters.experience_level;

            return matchesSearch && matchesLocation && matchesDepartment &&
                matchesWorkPolicy && matchesEmployment && matchesExperience;
        });
    }, [jobs, filters]);

    // Group jobs by department
    const groupedJobs = useMemo(() => {
        const groups: Record<string, Job[]> = {};
        filteredJobs.forEach((job) => {
            if (!groups[job.department]) {
                groups[job.department] = [];
            }
            groups[job.department].push(job);
        });
        // Sort departments by job count
        return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
    }, [filteredJobs]);

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-950" id="jobs" aria-labelledby="jobs-heading">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-8 sm:mb-10">
                    <motion.h2
                        id="jobs-heading"
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Open Positions
                    </motion.h2>
                    <motion.p
                        className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Find your next opportunity. We&apos;re looking for talented people to join our team.
                    </motion.p>
                </div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 sm:mb-8"
                >
                    <JobFiltersComponent
                        filters={filters}
                        onFilterChange={setFilters}
                        locations={locations}
                        departments={departments}
                        totalJobs={jobs.length}
                        filteredCount={filteredJobs.length}
                    />
                </motion.div>

                {/* View Toggle (Desktop only) */}
                <div className="hidden sm:flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400 sm:hidden lg:block">
                        {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} available
                    </p>
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded transition-colors ${viewMode === 'grid'
                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                            aria-label="Grid view"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded transition-colors ${viewMode === 'list'
                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                            aria-label="List view"
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className={`grid gap-4 sm:gap-6 ${viewMode === 'grid'
                        ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                        : 'grid-cols-1 max-w-3xl mx-auto'
                        }`}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <JobCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Job Listings */}
                {!isLoading && (
                    <AnimatePresence mode="wait">
                        {filteredJobs.length > 0 ? (
                            <div className="space-y-8 sm:space-y-10">
                                {groupedJobs.map(([department, deptJobs]) => (
                                    <motion.div
                                        key={department}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 sm:mb-5 flex items-center gap-2 px-1">
                                            <Briefcase className="h-5 w-5 text-primary-500" />
                                            {department}
                                            <span className="text-sm font-normal text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                                {deptJobs.length}
                                            </span>
                                        </h3>
                                        <div className={`grid gap-4 sm:gap-5 ${viewMode === 'grid'
                                            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                                            : 'grid-cols-1 max-w-3xl'
                                            }`}>
                                            {deptJobs.map((job, index) => (
                                                <JobCard key={job.id} job={job} index={index} companySlug={companySlug} />
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-center py-16 sm:py-20"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 sm:mb-6">
                                    <Search className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                                    No jobs found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto px-4">
                                    We couldn&apos;t find any positions matching your criteria. Try adjusting your filters or search terms.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </section >
    );
}
