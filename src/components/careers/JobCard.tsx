'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock, Building2, Banknote, Briefcase, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkPolicyBadge, EmploymentTypeBadge, ExperienceBadge } from '@/components/ui/Badge';
import type { Job } from '@/types';

interface JobCardProps {
    job: Job;
    index?: number;
    companySlug?: string;
    onClick?: () => void;
}

export function JobCard({ job, index = 0, companySlug = 'techcorp', onClick }: JobCardProps) {
    const formatPostedDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return `${Math.floor(diffDays / 30)}mo ago`;
    };

    const jobUrl = `/${companySlug}/jobs/${job.slug}`;

    return (
        <Link href={jobUrl} className="block h-full">
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                className="h-full"
            >
                <div
                    className={cn(
                        "group relative h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",
                        "p-5 sm:p-6 shadow-sm transition-all duration-300",
                        "hover:shadow-xl hover:border-indigo-500 dark:hover:border-indigo-500",
                        "cursor-pointer"
                    )}
                >
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                                    {job.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                        <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span className="truncate">{job.department}</span>
                                    </div>
                                </div>
                            </div>
                            <motion.div
                                whileHover={{ rotate: -10, scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                                className="flex-shrink-0 pt-0.5"
                            >
                                <WorkPolicyBadge policy={job.work_policy} />
                            </motion.div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2.5 mb-4 flex-grow">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span className="truncate">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span>{job.job_type}</span>
                            </div>
                            {job.salary_range && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <Banknote className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    <span className="truncate">{job.salary_range}</span>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50 mt-auto">
                            <div className="flex items-center gap-2 flex-wrap">
                                <EmploymentTypeBadge type={job.employment_type} />
                                <ExperienceBadge level={job.experience_level} />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatPostedDate(job.posted_at)}</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.article>
        </Link>
    );
}

// Loading skeleton for job cards
export function JobCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 animate-pulse">
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>
            <div className="space-y-2.5 mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex gap-2">
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
        </div>
    );
}
