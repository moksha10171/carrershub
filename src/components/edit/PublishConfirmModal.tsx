'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Clock, CheckCircle, X } from 'lucide-react';

interface PublishConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    hasUnsavedChanges: boolean;
    lastPublishedAt: string | null;
    isPublishing?: boolean;
}

export function PublishConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    hasUnsavedChanges,
    lastPublishedAt,
    isPublishing = false
}: PublishConfirmModalProps) {
    if (!isOpen) return null;

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden"
                        >
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Publish Changes
                                    </h2>
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        aria-label="Close"
                                    >
                                        <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-4 space-y-4">
                                {/* Warning for unsaved changes */}
                                {hasUnsavedChanges && (
                                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                        <div className="flex gap-3">
                                            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
                                                    Unsaved Changes Detected
                                                </h3>
                                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                                    Your draft will be saved automatically before publishing.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Main warning */}
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                            <AlertTriangle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                Changes will go live immediately
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Publishing will make your changes visible on your public careers page.
                                                This action cannot be undone automatically.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Last published info */}
                                    {lastPublishedAt && (
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pl-12">
                                            <Clock className="h-4 w-4" />
                                            <span>Last published: {formatDate(lastPublishedAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isPublishing}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={onConfirm}
                                    isLoading={isPublishing}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    Publish to Live Site
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
