'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ExternalLink, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApplyButtonProps {
    jobId: string;
    companyId: string;
    jobTitle: string;
    companyName: string;
    description?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ApplyButton({
    jobId,
    companyId,
    jobTitle,
    companyName,
    description = 'Apply Now',
    className,
    size = 'lg'
}: ApplyButtonProps) {
    const [isApplied, setIsApplied] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsApplying(true);
        setError('');

        try {
            const response = await fetch('/api/jobs/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobId,
                    companyId,
                    applicantName: formData.name,
                    applicantEmail: formData.email
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to submit application');
            }

            setIsApplied(true);
            setShowModal(false);
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsApplying(false);
        }
    };

    if (isApplied) {
        return (
            <Button
                size={size}
                className={`bg-green-600 hover:bg-green-700 text-white cursor-default border-none ${className}`}
                disabled
            >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Application Sent
            </Button>
        );
    }

    return (
        <>
            <Button
                size={size}
                className={className}
                onClick={() => setShowModal(true)}
            >
                {description}
                <ExternalLink className="h-4 w-4 ml-2" />
            </Button>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative z-10 border border-gray-200 dark:border-gray-800"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Apply for {jobTitle}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                {companyName}
                            </p>

                            {error && (
                                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleApply} className="space-y-4">
                                <Input
                                    label="Full Name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your full name"
                                />
                                <Input
                                    label="Work Email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                />
                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        isLoading={isApplying}
                                        size="lg"
                                    >
                                        Submit Application
                                    </Button>
                                    <p className="text-[10px] text-center text-gray-500 mt-4">
                                        By clicking submit, you agree to our Terms and privacy policy.
                                        Your details will be shared with {companyName}.
                                    </p>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
