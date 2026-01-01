'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApplyButton } from './ApplyButton';

export function StickyApply({ title, companyName }: { title: string; companyName: string }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0 hidden sm:block">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{title}</h3>
                            <p className="text-sm text-gray-500 truncate">{companyName}</p>
                        </div>
                        <ApplyButton
                            jobTitle={title}
                            companyName={companyName}
                            description="Apply Now"
                            className="flex-1 sm:flex-none w-full sm:w-auto shadow-indigo-500/25 shadow-lg"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
