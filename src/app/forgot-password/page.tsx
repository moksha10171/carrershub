'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, ArrowRight, AlertCircle, CheckCircle, ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Canvas } from '@react-three/fiber';
import GeometricBackground from '@/components/three/GeometricBackground';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) {
                setError(resetError.message);
                setIsLoading(false);
                return;
            }

            setSuccess(true);
            setIsLoading(false);
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-gray-950">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 8, 15], fov: 45 }}>
                    <color attach="background" args={['#030712']} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4f46e5" />
                    {mounted && <GeometricBackground color="#4f46e5" isDark={true} />}
                </Canvas>
                {/* Gradients for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50/90 via-transparent to-gray-50/90 dark:from-gray-950/90 dark:to-gray-950/90 opacity-80" />
            </div>

            <div className="min-h-screen relative z-10 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/10 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 sm:p-10"
                    >
                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Check Your Email
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    We've sent a password reset link to<br />
                                    <span className="font-medium text-gray-900 dark:text-white">{email}</span>
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    Click the link in the email to reset your password. The link will expire in 1 hour.
                                </p>
                                <Link href="/login">
                                    <Button variant="outline" className="w-full">
                                        <ChevronLeft className="h-5 w-5" />
                                        Back to Sign In
                                    </Button>
                                </Link>
                            </motion.div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        Forgot Password?
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        No worries! Enter your email and we'll send you reset instructions.
                                    </p>
                                </div>

                                {/* Error Alert */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-center gap-3"
                                    >
                                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                    </motion.div>
                                )}

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        icon={<Mail className="h-5 w-5" />}
                                        required
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                                        size="lg"
                                        isLoading={isLoading}
                                    >
                                        Send Reset Link
                                        <ArrowRight className="h-5 w-5 ml-2" />
                                    </Button>
                                </form>

                                {/* Back to login */}
                                <div className="mt-6 text-center">
                                    <Link href="/login" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1">
                                        <ChevronLeft className="h-4 w-4" />
                                        Back to Sign In
                                    </Link>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
