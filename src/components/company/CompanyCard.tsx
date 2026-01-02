'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, MapPin, ChevronRight, Briefcase } from 'lucide-react';

interface Company {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
    industry?: string;
    location?: string;
    description?: string;
}

interface CompanyCardProps {
    company: Company;
    index?: number;
}

export function CompanyCard({ company, index = 0 }: CompanyCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Link href={`/${company.slug}/careers`} className="block group">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group-hover:border-primary-500/50 dark:group-hover:border-primary-500/50">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            {/* Logo Placeholder or Image */}
                            <div className="h-16 w-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200 dark:border-gray-600">
                                {company.logo_url ? (
                                    <img src={company.logo_url} alt={company.name} className="h-full w-full object-cover" />
                                ) : (
                                    <Building2 className="h-8 w-8 text-gray-400" />
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {company.name}
                                </h3>

                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    {company.industry && (
                                        <div className="flex items-center gap-1.5">
                                            <Briefcase className="h-4 w-4" />
                                            <span>{company.industry}</span>
                                        </div>
                                    )}
                                    {company.location && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-4 w-4" />
                                            <span>{company.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="self-center">
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>

                    {company.description && (
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {company.description.replace(/<[^>]*>?/gm, '') /* Strip HTML */}
                        </p>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}
