'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    const validateForm = () => {
        if (!name.trim()) {
            setError('Please enter your name.');
            return false;
        }
        if (!email.trim()) {
            setError('Please enter your email.');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                setIsLoading(false);
                return;
            }

            setSuccess(true);
            setIsLoading(false);

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
                    >
                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Account Created!
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Welcome aboard! Redirecting to your dashboard...
                                </p>
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500 mx-auto" />
                            </motion.div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        Create Account
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Start building your careers page today
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
                                        label="Full Name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        icon={<User className="h-5 w-5" />}
                                        required
                                    />

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

                                    <Input
                                        label="Confirm Password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        icon={<Lock className="h-5 w-5" />}
                                        required
                                    />

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        By signing up, you agree to our{' '}
                                        <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                            Privacy Policy
                                        </Link>
                                        .
                                    </p>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        isLoading={isLoading}
                                    >
                                        Create Account
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </form>

                                {/* Sign In Link */}
                                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
