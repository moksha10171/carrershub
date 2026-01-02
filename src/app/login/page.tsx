'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import dynamic from 'next/dynamic';

const InteractiveBackground = dynamic(
    () => import('@/components/three/InteractiveBackground'),
    { ssr: false }
);

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setIsLoading(true);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError(signInError.message);
                setIsLoading(false);
                return;
            }

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-white dark:bg-gray-950">
            <InteractiveBackground className="opacity-60" />

            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/80 via-white/50 to-indigo-50/50 dark:from-gray-950/80 dark:via-gray-950/50 dark:to-gray-950/80" />


            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Sign in to manage your careers page
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
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                icon={<Mail className="h-5 w-5" />}
                                required
                            />

                            <div className="relative">
                                <Input
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    icon={<Lock className="h-5 w-5" />}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                                </label>
                                <Link href="/forgot-password" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                            >
                                Sign In
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        </div>

                        {/* Demo Access */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                Want to see the platform in action?
                            </p>
                            <Link href="/techcorp/careers">
                                <Button variant="outline" className="w-full">
                                    View Demo Careers Page
                                </Button>
                            </Link>
                        </div>

                        {/* Sign Up Link */}
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                                Sign up for free
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
