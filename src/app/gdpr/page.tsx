'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, CheckCircle, Lock, Eye, Users, FileText } from 'lucide-react';

export default function GDPRPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Hero Section */}
            <section className="pt-24 pb-12 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                            <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            GDPR Compliance
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Your data rights under the General Data Protection Regulation
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Your Rights */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Data Rights</h2>
                            <div className="grid gap-6">
                                {[
                                    { icon: Eye, title: 'Right to Access', desc: 'Request access to your personal data' },
                                    { icon: FileText, title: 'Right to Rectification', desc: 'Request correction of inaccurate data' },
                                    { icon: Lock, title: 'Right to Erasure', desc: 'Request deletion of your personal data' },
                                    { icon: Users, title: 'Right to Portability', desc: 'Receive your data in a structured format' },
                                ].map((right, idx) => (
                                    <div key={idx} className="flex gap-4 p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                                <right.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{right.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-300">{right.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                            <h2>Our Commitment to GDPR</h2>
                            <p>
                                We are committed to protecting your personal data and respecting your privacy rights under the
                                General Data Protection Regulation (GDPR).
                            </p>

                            <h2>How We Protect Your Data</h2>
                            <ul>
                                <li>We use encryption to protect data in transit and at rest</li>
                                <li>We implement strict access controls and authentication</li>
                                <li>We conduct regular security audits and assessments</li>
                                <li>We train our staff on data protection best practices</li>
                            </ul>

                            <h2>Data Processing</h2>
                            <p>
                                We process your personal data only for specific, explicit, and legitimate purposes. We do not
                                collect more data than necessary and do not keep it longer than required.
                            </p>

                            <h2>Contact Our Data Protection Officer</h2>
                            <p>
                                If you have questions about our GDPR compliance or wish to exercise your rights, please{' '}
                                <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                    contact us
                                </Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
