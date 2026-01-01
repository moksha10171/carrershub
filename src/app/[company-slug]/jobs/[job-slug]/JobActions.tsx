'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Share2, Bookmark, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function JobActions({
    jobTitle,
    jobUrl
}: {
    jobTitle: string;
    jobUrl: string;
}) {
    const [isSaved, setIsSaved] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSave = () => {
        setIsSaved(!isSaved);
        // In a real app, this would persist to localStorage or DB
        const event = new CustomEvent('job-saved', { detail: { title: jobTitle, saved: !isSaved } });
        window.dispatchEvent(event);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: jobTitle,
                    url: jobUrl,
                });
            } catch (err) {
                // Share cancelled or failed
            }
        } else {
            setShowShareMenu(!showShareMenu);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(jobUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            setShowShareMenu(false);
        }, 2000);
    };

    return (
        <div className="flex gap-2 relative">
            <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className={isSaved ? "text-indigo-600 border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20" : ""}
                aria-label={isSaved ? "Remove from saved" : "Save job"}
            >
                <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>

            <div className="relative">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    aria-label="Share job"
                >
                    <Share2 className="h-4 w-4" />
                </Button>

                <AnimatePresence>
                    {showShareMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 min-w-[200px] z-50"
                        >
                            <button
                                onClick={copyLink}
                                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                            >
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                {copied ? 'Copied to clipboard' : 'Copy Link'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
