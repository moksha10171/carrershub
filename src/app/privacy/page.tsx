import { Metadata } from 'next';

import { Shield, Eye, Cookie, Scale, Globe, Mail } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy | CareerHub',
    description: 'CareerHub Privacy Policy - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">


            {/* Hero */}
            <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <Shield className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Last updated: December 30, 2024
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">

                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8 not-prose">
                            <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                                <strong>Your privacy matters to us.</strong> This policy explains how CareerHub collects, uses, and protects your personal information when you use our platform.
                            </p>
                        </div>

                        <h2 className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Eye className="h-5 w-5 text-indigo-500" />
                            Information We Collect
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            We collect information you provide directly to us, including:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                            <li><strong>Account Information:</strong> Name, email address, company name, and password when you create an account.</li>
                            <li><strong>Company Data:</strong> Branding assets, content, and job listings you add to your careers page.</li>
                            <li><strong>Usage Data:</strong> How you interact with our platform, features used, and time spent.</li>
                            <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers.</li>
                        </ul>

                        <h2 className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Scale className="h-5 w-5 text-indigo-500" />
                            How We Use Your Information
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            We use the information we collect to:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Process transactions and send related information</li>
                            <li>Send technical notices, updates, and support messages</li>
                            <li>Respond to your comments, questions, and requests</li>
                            <li>Monitor and analyze trends, usage, and activities</li>
                            <li>Detect, investigate, and prevent security incidents</li>
                        </ul>

                        <h2 className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Globe className="h-5 w-5 text-indigo-500" />
                            Information Sharing
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            We do not sell your personal information. We may share your information with:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                            <li><strong>Service Providers:</strong> Third parties that perform services on our behalf (hosting, analytics).</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
                            <li><strong>Business Transfers:</strong> In connection with any merger or acquisition.</li>
                        </ul>

                        <h2 className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Cookie className="h-5 w-5 text-indigo-500" />
                            Cookies and Tracking
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            We use cookies and similar technologies to:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                            <li>Keep you logged in and remember your preferences</li>
                            <li>Analyze how you use our platform</li>
                            <li>Improve our services based on your usage patterns</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-300">
                            You can control cookies through your browser settings. Note that disabling cookies may affect functionality.
                        </p>

                        <h2 className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Shield className="h-5 w-5 text-indigo-500" />
                            Data Security
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            We implement appropriate security measures to protect your personal information, including:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                            <li>Encryption of data in transit and at rest</li>
                            <li>Regular security assessments and audits</li>
                            <li>Access controls and authentication</li>
                            <li>Employee training on data protection</li>
                        </ul>

                        <h2 className="text-gray-900 dark:text-white">Your Rights</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            You have the right to:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate data</li>
                            <li>Delete your account and data</li>
                            <li>Export your data in a portable format</li>
                            <li>Opt out of marketing communications</li>
                        </ul>

                        <h2 className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Mail className="h-5 w-5 text-indigo-500" />
                            Contact Us
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            If you have questions about this Privacy Policy, please contact us at:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                            <li>Email: <a href="mailto:privacy@careerhub.com" className="text-indigo-600 dark:text-indigo-400">privacy@careerhub.com</a></li>
                            <li>Address: 123 Innovation Drive, San Francisco, CA 94107</li>
                        </ul>

                    </div>
                </div>
            </section>


        </div>
    );
}
