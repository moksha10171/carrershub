'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, EyeOff, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Canvas } from '@react-three/fiber';
import GeometricBackground from '@/components/three/GeometricBackground';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Check if user has valid reset session
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // No valid session, redirect to forgot password
                router.push('/forgot-password');
            }
        };
        checkSession();
    }, [router, supabase.auth]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) {
                setError(updateError.message);
                setIsLoading(false);
                return;
            }

            setSuccess(true);

            // Redirect to login after success
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
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
                                className="text-center py-8"
                            >
                                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Password Reset Complete!
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Your password has been successfully updated. Redirecting to dashboard...
                                </p>
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500 mx-auto" />
                            </motion.div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        Reset Password
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Enter your new password below
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
                                    <div className="relative">
                                        <Input
                                            label="New Password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Min. 6 characters"
                                            icon={<Lock className="h-5 w-5" />}
                                            required
                                            minLength={6}
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
                                        label="Confirm New Password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter password"
                                        icon={<Lock className="h-5 w-5" />}
                                        required
                                        minLength={6}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                                        size="lg"
                                        isLoading={isLoading}
                                    >
                                        Reset Password
                                        <ArrowRight className="h-5 w-5 ml-2" />
                                    </Button>
                                </form>

                                {/* Cancel link */}
                                <div className="mt-6 text-center">
                                    <Link href="/login" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
                                        Cancel and go back to Sign In
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
