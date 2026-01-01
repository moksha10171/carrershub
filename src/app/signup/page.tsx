'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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

    // OTP state
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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
            // Sign up with email OTP
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                    emailRedirectTo: undefined, // Don't send magic link
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                setIsLoading(false);
                return;
            }

            // Send OTP for verification
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: false, // User already created
                },
            });

            if (otpError) {
                // If OTP fails, still move to verify step (user was created)
                console.warn('OTP send failed, user may still verify via email link:', otpError);
            }

            setStep('verify');
            startResendCooldown();
            setIsLoading(false);
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

    const handleResendOtp = async () => {
        setIsResending(true);
        setError('');

        try {
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: false,
                },
            });

            if (otpError) {
                setError('Failed to resend code. Please try again.');
            } else {
                startResendCooldown();
            }
        } catch (err) {
            setError('Failed to resend code.');
        } finally {
            setIsResending(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only keep last digit
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);
        if (pastedData.length === 6) {
            otpRefs.current[5]?.focus();
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter the 6-digit code.');
            return;
        }

        setIsLoading(true);

        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token: otpCode,
                type: 'email',
            });

            if (verifyError) {
                setError('Invalid or expired code. Please try again.');
                setIsLoading(false);
                return;
            }

            setStep('success');

            // Redirect to dashboard after success animation
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err) {
            setError('Verification failed. Please try again.');
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
                                {/* OTP Verification Step */}
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                                        <Mail className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        Verify Your Email
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        We sent a 6-digit code to<br />
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

                                {/* OTP Input */}
                                <form onSubmit={handleVerifyOtp} className="space-y-6">
                                    <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => { otpRefs.current[index] = el; }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            />
                                        ))}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        isLoading={isLoading}
                                    >
                                        Verify Email
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </form>

                                {/* Resend Code */}
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Didn't receive the code?{' '}
                                        {resendCooldown > 0 ? (
                                            <span className="text-gray-500">
                                                Resend in {resendCooldown}s
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                disabled={isResending}
                                                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline inline-flex items-center gap-1"
                                            >
                                                {isResending ? (
                                                    <>
                                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    'Resend Code'
                                                )}
                                            </button>
                                        )}
                                    </p>
                                </div>

                                {/* Back to signup */}
                                <button
                                    type="button"
                                    onClick={() => { setStep('signup'); setError(''); }}
                                    className="mt-4 w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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

