'use client';

import React from 'react';
import Link from 'next/link';
import { Cookie, Shield, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Hero Section */}
            <section className="pt-24 pb-12 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6">
                            <Cookie className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Cookie Policy
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Last updated: January 1, 2026
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
                        <h2>What Are Cookies?</h2>
                        <p>
                            Cookies are small text files that are placed on your computer or mobile device when you visit our website.
                            They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
                        </p>

                        <h2>Types of Cookies We Use</h2>

                        <h3>Essential Cookies</h3>
                        <p>
                            These cookies are necessary for the website to function properly. They enable core functionality such as
                            security, network management, and accessibility.
                        </p>

                        <h3>Analytics Cookies</h3>
                        <p>
                            We use analytics cookies to understand how visitors interact with our website. This helps us improve our
                            service and user experience.
                        </p>

                        <h3>Preference Cookies</h3>
                        <p>
                            These cookies allow our website to remember choices you make (such as your user name, language, or the region
                            you are in) and provide enhanced, more personal features.
                        </p>

                        <h2>Managing Cookies</h2>
                        <p>
                            You can control and/or delete cookies as you wish. You can delete all cookies that are already on your
                            computer and you can set most browsers to prevent them from being placed.
                        </p>

                        <h2>Contact Us</h2>
                        <p>
                            If you have any questions about our Cookie Policy, please <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">contact us</Link>.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
