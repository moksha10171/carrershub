'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, Users, Globe, Award, Sparkles } from 'lucide-react';
import type { ContentSection } from '@/types';

interface ContentSectionProps {
    section: ContentSection;
    index?: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    about: Globe,
    culture: Heart,
    benefits: Sparkles,
    values: Award,
    team: Users,
    custom: Zap,
};

export function ContentSectionComponent({ section, index = 0 }: ContentSectionProps) {
    const Icon = iconMap[section.type] || Zap;
    const isEven = index % 2 === 0;

    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`py-16 sm:py-24 lg:py-32 ${isEven ? 'bg-white dark:bg-gray-950' : 'bg-gray-50 dark:bg-gray-900'}`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Visual Content (rendered directly as it contains its own grid/flex in data.ts) */}
                <div className="max-w-7xl mx-auto">
                    {/* Section Label (Optional, if content doesn't already have one) */}
                    {!(section.content?.includes('<h3')) && (
                        <motion.div
                            className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="p-3 rounded-xl bg-primary-100 flex-shrink-0">
                                <Icon className="h-6 w-6 text-primary-600" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                {section.title}
                            </h2>
                        </motion.div>
                    )}

                    {/* Content */}
                    {section.content && (
                        <motion.div
                            className="text-gray-600 dark:text-gray-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                    )}
                </div>
            </div>
        </motion.section>
    );
}
