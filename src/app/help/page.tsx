'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, Search, Book, MessageCircle, FileText, Video, ChevronDown, ChevronUp } from 'lucide-react';

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const categories = [
        {
            icon: Book,
            title: 'Getting Started',
            desc: 'Learn the basics of setting up your careers page',
            articles: 5,
        },
        {
            icon: FileText,
            title: 'Customization',
            desc: 'Customize your page to match your brand',
            articles: 8,
        },
        {
            icon: MessageCircle,
            title: 'Integrations',
            desc: 'Connect with your favorite tools',
            articles: 6,
        },
        {
            icon: Video,
            title: 'Video Tutorials',
            desc: 'Watch step-by-step guides',
            articles: 4,
        },
    ];

    const faqs = [
        {
            question: 'How do I create my first careers page?',
            answer: 'After signing up, navigate to the Dashboard and click "Create New Page". Follow the setup wizard to add your company information, customize the design, and publish your first job listing. The entire process takes about 10 minutes.',
        },
        {
            question: 'Can I customize the design to match my brand?',
            answer: 'Yes! You can fully customize colors, fonts, logos, and layouts. Go to Settings > Branding to upload your logo and set primary/secondary colors. Advanced users can also add custom CSS for complete control.',
        },
        {
            question: 'How do I add job listings?',
            answer: 'Go to Dashboard > Jobs > Add New Job. Fill in the job details including title, description, location, and requirements. You can save drafts and publish when ready. Use our AI assistant to help write compelling job descriptions.',
        },
        {
            question: 'Does it integrate with my ATS?',
            answer: 'Yes, we integrate with major ATS platforms including Greenhouse, Lever, Workday, and BambooHR. Go to Settings > Integrations to connect your ATS. Applications will automatically sync to your system.',
        },
        {
            question: 'Can I use a custom domain?',
            answer: 'Absolutely! On Professional and Enterprise plans, you can use your own domain (e.g., careers.yourcompany.com). Go to Settings > Domain to set this up. We provide step-by-step DNS configuration instructions.',
        },
        {
            question: 'How do applicants apply for jobs?',
            answer: 'Applicants can apply directly through your careers page. You can customize the application form fields, enable file uploads for resumes, and add screening questions. All applications are stored in your dashboard.',
        },
        {
            question: 'What analytics are available?',
            answer: 'Track page views, job views, application rates, time-to-hire, and source attribution. See which jobs perform best and where your applicants come from. Export data or connect to Google Analytics for deeper insights.',
        },
        {
            question: 'Is there a mobile app?',
            answer: 'While we don\'t have a native mobile app, our platform is fully responsive and works perfectly on all devices. Candidates can browse jobs and apply from their phones with an optimized mobile experience.',
        },
        {
            question: 'How do I manage my team\'s access?',
            answer: 'Go to Settings > Team to invite team members. You can assign roles (Admin, Editor, Viewer) with different permissions. Admins can manage billing and settings, Editors can manage jobs, and Viewers have read-only access.',
        },
        {
            question: 'What happens if I exceed my plan limits?',
            answer: 'You\'ll receive an email notification when approaching limits. You can either upgrade your plan or archive old jobs to stay within limits. We never unpublish your live jobs without prior notice.',
        },
        {
            question: 'How can candidates find my jobs?',
            answer: 'Besides your direct careers page URL, all published jobs are automatically indexed in our Global Search on the homepage. Candidates can search by company name or job title to find your open positions.',
        },
    ];

    const gettingStarted = [
        {
            step: 1,
            title: 'Create Your Account',
            desc: 'Sign up with your work email and complete the onboarding wizard.',
        },
        {
            step: 2,
            title: 'Add Company Information',
            desc: 'Upload your logo, set brand colors, and add company details.',
        },
        {
            step: 3,
            title: 'Post Your First Job',
            desc: 'Create a job listing with all the details candidates need.',
        },
        {
            step: 4,
            title: 'Customize Your Page',
            desc: 'Add sections about culture, benefits, and team.',
        },
        {
            step: 5,
            title: 'Publish & Share',
            desc: 'Launch your careers page! Your jobs are effectively indexed in our Global Search automatically.',
        },
    ];

    const troubleshooting = [
        {
            issue: 'Jobs not appearing on my page',
            solution: 'Make sure jobs are marked as "Published" and not "Draft". Check that your careers page is also published. Clear your browser cache and try again.',
        },
        {
            issue: 'Custom domain not working',
            solution: 'Verify DNS records are correctly configured. It can take up to 48 hours for DNS changes to propagate. Check our DNS setup guide for your domain provider.',
        },
        {
            issue: 'Applications not received',
            solution: 'Check your email notification settings and spam folder. Verify the application form is published and enabled. Test by submitting a test application yourself.',
        },
        {
            issue: 'Branding colors not updating',
            solution: 'Hard refresh your browser (Ctrl+Shift+R). If using custom CSS, check for conflicts. Colors may be cached - try incognito mode to verify changes.',
        },
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Hero */}
            <section className="pt-24 pb-16 bg-gradient-to-b from-amber-50 dark:from-amber-900/20 to-white dark:to-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
                        <HelpCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        How can we help?
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Find answers, guides, and resources to get the most out of CareerHub.
                    </p>
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for help..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Browse by Category
                    </h2>
                    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
                        {categories.map((cat, idx) => (
                            <div
                                key={idx}
                                className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <cat.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                            {cat.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                            {cat.desc}
                                        </p>
                                        <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                                            {cat.articles} articles →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Getting Started */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                            Getting Started in 5 Steps
                        </h2>
                        <div className="space-y-4">
                            {gettingStarted.map((step) => (
                                <div
                                    key={step.step}
                                    className="flex gap-4 p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-bold">
                                        {step.step}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {filteredFaqs.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800"
                                >
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900 dark:text-white pr-4">
                                            {faq.question}
                                        </span>
                                        {expandedFaq === idx ? (
                                            <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                        )}
                                    </button>
                                    {expandedFaq === idx && (
                                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {filteredFaqs.length === 0 && (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                No FAQs found matching "{searchQuery}"
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Troubleshooting */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                            Common Issues & Solutions
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {troubleshooting.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                >
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        {item.issue}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        {item.solution}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Still need help?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Our support team is here to help you.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all font-medium shadow-lg shadow-indigo-500/25"
                    >
                        <MessageCircle className="h-5 w-5" />
                        Contact Support
                    </Link>
                </div>
            </section>
        </div>
    );
}
