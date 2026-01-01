'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Users, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
    companyName: string;
    tagline: string | null;
    logoUrl: string | null;
    bannerUrl: string | null;
    primaryColor?: string;
    jobCount: number;
}

export function HeroSection({
    companyName,
    tagline,
    logoUrl,
    bannerUrl,
    primaryColor = '#6366F1',
    jobCount,
}: HeroSectionProps) {
    const scrollToJobs = () => {
        const jobsSection = document.getElementById('jobs');
        if (jobsSection) {
            jobsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden bg-white dark:bg-gray-950"
        >
            {/* Background Image with sophisticated overlay */}
            {bannerUrl && (
                <div className="absolute inset-0 z-0">
                    <img
                        src={bannerUrl}
                        alt="Hero Banner"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/60 to-white dark:from-gray-950/10 dark:via-gray-950/60 dark:to-gray-950" />
                </div>
            )}

            {/* Decorative background for "Clean White" feel */}
            {!bannerUrl && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-50 dark:bg-purple-900/20 rounded-full blur-3xl home-hero-blob" />
                </div>
            )}

            {/* Main content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center text-center max-w-4xl mx-auto"
                >
                    {/* Logo with clean border */}
                    {logoUrl ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                            className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 mb-8"
                        >
                            <img
                                src={logoUrl}
                                alt={`${companyName} logo`}
                                className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                            />
                        </motion.div>
                    ) : (
                        <div className="bg-indigo-600 dark:bg-indigo-500 p-5 rounded-3xl shadow-xl mb-8">
                            <Briefcase className="h-10 w-10 text-white" />
                        </div>
                    )}

                    {/* Company Name */}
                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Grow your career at <span className="text-indigo-600 dark:text-indigo-400 block sm:inline">{companyName}</span>
                    </motion.h1>

                    {/* Tagline */}
                    {tagline && (
                        <motion.p
                            className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            {tagline}
                        </motion.p>
                    )}

                    {/* Quick Stats Pills */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full shadow-sm">
                            <Briefcase className="h-5 w-5 text-indigo-500" />
                            <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">{jobCount} Openings</span>
                        </div>
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-full shadow-sm">
                            <MapPin className="h-5 w-5 text-indigo-500" />
                            <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">Global Remote</span>
                        </div>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.button
                        onClick={scrollToJobs}
                        className="group flex items-center gap-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:bg-gray-800 dark:hover:bg-white transition-all duration-300 hover:scale-105"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        See Open Positions
                        <ChevronDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
                    </motion.button>
                </motion.div>
            </div>

            {/* Subtle scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <div className="w-6 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 flex justify-center p-1.5">
                    <motion.div
                        className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full"
                        animate={{ y: [0, 16, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </section>
    );
}
