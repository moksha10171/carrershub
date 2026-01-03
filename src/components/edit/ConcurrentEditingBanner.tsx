'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Users } from 'lucide-react';

interface ConcurrentEditingBannerProps {
    activeEditors: Array<{ user_id: string; user_email: string }>;
}

export function ConcurrentEditingBanner({ activeEditors }: ConcurrentEditingBannerProps) {
    if (activeEditors.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4"
        >
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-yellow-700 dark:text-yellow-300" />
                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            {activeEditors.length === 1 ? 'Another editor is active' : `${activeEditors.length} other editors are active`}
                        </h3>
                    </div>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                        <p>
                            {activeEditors.map(e => e.user_email).join(', ')} {activeEditors.length === 1 ? 'is' : 'are'} currently editing this company profile.
                        </p>
                        <p className="mt-1 text-xs">
                            Be careful of conflicting changes. Your work is auto-saved every 30 seconds.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
