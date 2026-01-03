'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConflictModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRefresh: () => void;
    onOverwrite: () => void;
    conflictData?: {
        publishedVersion: number;
        draftBaseVersion: number;
        error: string;
    };
}

export function ConflictModal({
    isOpen,
    onClose,
    onRefresh,
    onOverwrite,
    conflictData
}: ConflictModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            >
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white mb-2">
                    Conflict Detected
                </h3>

                {/* Message */}
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                    {conflictData?.error || 'The published content has been updated by another user while you were editing.'}
                </p>

                {/* Version info */}
                {conflictData && (
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-6 text-xs">
                        <div className="flex justify-between mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Your draft is based on version:</span>
                            <span className="font-mono font-semibold text-gray-900 dark:text-white">{conflictData.draftBaseVersion}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Current published version:</span>
                            <span className="font-mono font-semibold text-gray-900 dark:text-white">{conflictData.publishedVersion}</span>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                    <Button
                        onClick={onRefresh}
                        className="w-full"
                        variant="outline"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh & Review Changes
                    </Button>
                    <Button
                        onClick={onOverwrite}
                        className="w-full bg-red-600 hover:bg-red-700"
                    >
                        Overwrite with My Changes
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full"
                    >
                        Cancel
                    </Button>
                </div>

                {/* Warning */}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                    ⚠️ Overwriting will discard the other user's changes
                </p>
            </motion.div>
        </div>
    );
}
