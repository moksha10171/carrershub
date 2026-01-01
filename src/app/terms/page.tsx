import { Metadata } from 'next';

import { FileText, AlertTriangle, Scale, CreditCard, Ban, RefreshCw, Mail } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms of Service | CareerHub',
    description: 'CareerHub Terms of Service - Read our terms and conditions for using the platform.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">


            {/* Hero */}
            <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <FileText className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Terms of Service
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

                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 mb-8 not-prose">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
                                    By accessing or using CareerHub, you agree to be bound by these Terms of Service. Please read them carefully.
                                </p>
                            </div>
                        </div>

                        <h2 className="text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            By accessing and using CareerHub (&quot;the Service&quot;), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
                        </p>

                        <h2 className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Scale className="h-5 w-5 text-indigo-500" />
                            2. Description of Service
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            CareerHub provides a platform that allows companies (&quot;Recruiters&quot;) to create branded careers pages and enables job seekers (&quot;Candidates&quot;) to browse and discover open positions. The service includes:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                            <li>Careers page builder and customization tools</li>
                            <li>Job listing management</li>
                            <li>Branding and theme customization</li>
                            <li>Public careers page hosting</li>
                            <li>Analytics and insights (premium features)</li>
                        </ul>

                        <h2 className="text-gray-900 dark:text-white">3. User Accounts</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            To use certain features of the Service, you must create an account. You agree to:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                            <li>Provide accurate and complete registration information</li>
                            <li>Maintain the security of your password and account</li>
                            <li>Notify us immediately of any unauthorized use</li>
                            <li>Accept responsibility for all activities under your account</li>
                        </ul>

                        <h2 className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <CreditCard className="h-5 w-5 text-indigo-500" />
                            4. Billing and Payments
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            For paid features, you agree to pay all fees associated with your subscription plan. Fees are non-refundable except as required by law or as explicitly stated in our refund policy.
                        </p>

                        <h2 className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Ban className="h-5 w-5 text-indigo-500" />
                            5. Prohibited Uses
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            You may not use the Service to:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                            <li>Post false, misleading, or fraudulent job listings</li>
                            <li>Collect personal information without consent</li>
                            <li>Violate any applicable laws or regulations</li>
                            <li>Infringe on intellectual property rights</li>
                            <li>Transmit malware or harmful code</li>
                            <li>Attempt to gain unauthorized access</li>
                        </ul>

                        <h2 className="text-gray-900 dark:text-white">6. Content Ownership</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            You retain ownership of all content you submit to the Service. By posting content, you grant us a non-exclusive, worldwide license to use, display, and distribute that content for the purpose of providing the Service.
                        </p>

                        <h2 className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <RefreshCw className="h-5 w-5 text-indigo-500" />
                            7. Termination
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            We may terminate or suspend your account at any time for violations of these Terms. You may terminate your account at any time by contacting support.
                        </p>

                        <h2 className="text-gray-900 dark:text-white">8. Limitation of Liability</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            The Service is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.
                        </p>

                        <h2 className="text-gray-900 dark:text-white">9. Changes to Terms</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through the Service. Continued use after changes constitutes acceptance.
                        </p>

                        <h2 className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Mail className="h-5 w-5 text-indigo-500" />
                            10. Contact Information
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            For questions about these Terms, please contact us at:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300">
                            <li>Email: <a href="mailto:legal@careerhub.com" className="text-indigo-600 dark:text-indigo-400">legal@careerhub.com</a></li>
                            <li>Address: 123 Innovation Drive, San Francisco, CA 94107</li>
                        </ul>

                    </div>
                </div>
            </section>


        </div>
    );
}
