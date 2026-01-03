'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

type VerificationStatus = 'verifying' | 'success' | 'error';

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<VerificationStatus>('verifying');
    const [error, setError] = useState('');
    const supabase = createClient();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                // Get token from URL
                const token = searchParams.get('token');
                const type = searchParams.get('type');
                const email = searchParams.get('email');

                if (!token) {
                    setError('Verification link is invalid or expired.');
                    setStatus('error');
                    return;
                }

                // Verify the email using Supabase
                const { error: verifyError } = await supabase.auth.verifyOtp({
                    token_hash: token,
                    type: type === 'signup' ? 'signup' : 'email',
                });

                if (verifyError) {
                    console.error('Verification error:', verifyError);
                    setError(verifyError.message || 'Verification failed. The link may have expired.');
                    setStatus('error');
                    return;
                }

                // Success - email verified
                setStatus('success');

                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);

            } catch (err: any) {
                console.error('Unexpected error:', err);
                setError('An unexpected error occurred. Please try again.');
                setStatus('error');
            }
        };

        verifyEmail();
    }, [searchParams, router, supabase]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 text-center"
            >
                {status === 'verifying' && (
                    <>
                        <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                            <Loader2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Verifying Your Email
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Please wait while we verify your email address...
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Email Verified!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Your email has been successfully verified. Redirecting to dashboard...
                        </p>
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500 mx-auto" />
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Verification Failed
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {error}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/signup">
                                <Button variant="primary">
                                    Sign Up Again
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline">
                                    Go to Login
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
            </div>
        }>
            <VerifyContent />
        </React.Suspense>
    );
}
