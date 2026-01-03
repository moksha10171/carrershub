'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PreviewBannerProps {
    companySlug: string;
}

export function PreviewBanner({ companySlug }: PreviewBannerProps) {
    return (
        <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
        >
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Preview Info */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Eye className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">Preview Mode</h3>
                            <p className="text-xs opacity-90">Viewing draft content - not visible to public</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Link href={`/${companySlug}/edit`}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
                            >
                                Back to Editor
                            </Button>
                        </Link>
                        <Link href={`/api/preview/exit?return=/${companySlug}/careers`}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
                            >
                                <X className="h-4 w-4" />
                                Exit Preview
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
