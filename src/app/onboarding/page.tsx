'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Building, Globe, ArrowRight, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
    const [companyName, setCompanyName] = useState('');
    const [slug, setSlug] = useState('');
    const [website, setWebsite] = useState('');
    const [tagline, setTagline] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [error, setError] = useState('');
    const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
    const [isCheckingSlug, setIsCheckingSlug] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    // Check if user is authenticated and doesn't already have a company
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            // Check if user already has a company
            const { data: existingCompany } = await supabase
                .from('companies')
                .select('slug')
                .eq('user_id', user.id)
                .single();

            if (existingCompany) {
                // Already has a company, redirect to dashboard
                router.push('/dashboard');
                return;
            }

            setIsCheckingAuth(false);
        };
        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    // Auto-generate slug from company name
    useEffect(() => {
        if (companyName) {
            const generatedSlug = companyName
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .slice(0, 50);
            setSlug(generatedSlug);
        }
    }, [companyName]);

    // Check slug availability with debounce
    useEffect(() => {
        if (!slug || slug.length < 3) {
            setSlugAvailable(null);
            return;
        }

        const checkSlug = async () => {
            setIsCheckingSlug(true);
            const { data } = await supabase
                .from('companies')
                .select('id')
                .eq('slug', slug)
                .single();

            setSlugAvailable(!data);
            setIsCheckingSlug(false);
        };

        const timer = setTimeout(checkSlug, 500);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!companyName.trim()) {
            setError('Please enter your company name.');
            return;
        }

        if (!slug || slug.length < 3) {
            setError('URL slug must be at least 3 characters.');
            return;
        }

        if (slugAvailable === false) {
            setError('This URL is already taken. Please choose another.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create_company',
                    name: companyName,
                    slug,
                    website: website || null,
                    tagline: tagline || null,
                }),
            });

            const result = await response.json();

            if (!result.success) {
                setError(result.error || 'Failed to create company. Please try again.');
                setIsLoading(false);
                return;
            }

            // Success! Redirect to edit page
            router.push(`/${slug}/edit`);
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12">
                <div className="w-full max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Set Up Your Careers Page
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Let's get your company looking great for candidates
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
                                label="Company Name"
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Acme Inc."
                                icon={<Building className="h-5 w-5" />}
                                required
                            />

                            {/* Custom URL Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Your Careers Page URL
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                                        careerhub.app/
                                    </span>
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                            placeholder="acme"
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {slug.length >= 3 && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                {isCheckingSlug ? (
                                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
                                                ) : slugAvailable ? (
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">/careers</span>
                                </div>
                                {slug.length >= 3 && !isCheckingSlug && (
                                    <p className={`text-xs mt-1 ${slugAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                        {slugAvailable ? '✓ This URL is available' : '✗ This URL is taken'}
                                    </p>
                                )}
                            </div>

                            <Input
                                label="Tagline (optional)"
                                type="text"
                                value={tagline}
                                onChange={(e) => setTagline(e.target.value)}
                                placeholder="Building the future of work"
                            />

                            <Input
                                label="Website (optional)"
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="https://acme.com"
                                icon={<Globe className="h-5 w-5" />}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                                disabled={slug.length < 3 || slugAvailable === false}
                            >
                                Create Careers Page
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </form>

                        {/* Footer note */}
                        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
                            You can customize colors, logo, and content after setup
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
