'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Canvas } from '@react-three/fiber';
import AuthParticles from '@/components/three/AuthParticles';
import { useTheme } from 'next-themes';

type Step = 'signup' | 'verify' | 'success';

export default function SignupPage() {
    const [step, setStep] = useState<Step>('signup');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);
    const { theme, resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');
    const canvasBgColor = isDark ? '#030712' : '#f9fafb';

    // Resend email state
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

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

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Get the base URL - use production domain or fallback to current origin
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carrershub.vercel.app';
            const redirectUrl = `${baseUrl}/auth/verify`;

            // Sign up with email confirmation
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                    emailRedirectTo: redirectUrl,
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                setIsLoading(false);
                return;
            }

            // Check if email confirmation is required
            if (data?.user && !data.user.confirmed_at) {
                // Email sent successfully - show success message
                setStep('verify');
                setIsLoading(false);
            } else if (data?.user?.confirmed_at) {
                // Auto-confirmed (unlikely in production)
                setStep('success');
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            }

        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    const startResendCooldown = () => {
        setResendCooldown(60);
        const interval = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResendEmail = async () => {
        setIsResending(true);
        setError('');

        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carrershub.vercel.app';
            const redirectUrl = `${baseUrl}/auth/verify`;

            // Resend confirmation email
            const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email: email,
                options: {
                    emailRedirectTo: redirectUrl,
                },
            });

            if (resendError) {
                setError('Failed to resend email. Please try again.');
            } else {
                startResendCooldown();
            }
        } catch (err) {
            setError('Failed to resend email.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-gray-950">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
                    <color attach="background" args={[canvasBgColor]} />
                    <ambientLight intensity={0.5} />
                    {mounted && <AuthParticles count={150} isDark={isDark} />}
                </Canvas>
            </div>

            <div className="min-h-screen relative z-10 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 sm:p-10"
                    >
                        {step === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Email Verified!
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Your account is ready. Redirecting to dashboard...
                                </p>
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500 mx-auto" />
                            </motion.div>
                        ) : step === 'verify' ? (
                            <>
                                {/* Email Link Verification Step */}
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                                        <Mail className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        Check Your Email
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        We sent a verification link to<br />
                                        <span className="font-medium text-gray-900 dark:text-white">{email}</span>
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

                                {/* Instructions */}
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 mb-6">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        Next Steps:
                                    </h3>
                                    <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <li className="flex items-start gap-2">
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-semibold">1</span>
                                            <span>Open your email inbox</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-semibold">2</span>
                                            <span>Click the verification link in the email</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-semibold">3</span>
                                            <span>You'll be redirected to complete your setup</span>
                                        </li>
                                    </ol>
                                </div>

                                {/* Resend Email */}
                                <div className="text-center space-y-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Didn't receive the email?{' '}
                                        {resendCooldown > 0 ? (
                                            <span className="text-gray-500">
                                                Resend in {resendCooldown}s
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleResendEmail}
                                                disabled={isResending}
                                                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline inline-flex items-center gap-1"
                                            >
                                                {isResending ? (
                                                    <>
                                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    'Resend Email'
                                                )}
                                            </button>
                                        )}
                                    </p>

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Check your spam folder if you don't see it in your inbox
                                    </p>
                                </div>

                                {/* Back to signup */}
                                <button
                                    type="button"
                                    onClick={() => { setStep('signup'); setError(''); }}
                                    className="mt-6 w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    ← Use a different email
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Signup Form */}
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
                                <form onSubmit={handleSignup} className="space-y-5">
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
                                        label="Work Email"
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
                                            placeholder="Min. 6 characters"
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
                                        placeholder="Re-enter password"
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
                                        Continue with Email
                                        <ArrowRight className="h-5 w-5 ml-2" />
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

