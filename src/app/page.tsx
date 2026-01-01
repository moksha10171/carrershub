'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Briefcase, Sparkles, ArrowRight, CheckCircle2, Palette, Filter, Zap, Share2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Dynamically import Three.js background to avoid SSR issues
const InteractiveBackground = dynamic(
    () => import('@/components/three/InteractiveBackground'),
    { ssr: false }
);

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-20">
                {/* Three.js Interactive Particle Background */}
                <InteractiveBackground />

                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <img
                        src="/images/hero-bg.png"
                        alt="Background"
                        className="w-full h-full object-cover opacity-20 dark:opacity-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/60 to-white dark:from-gray-950/10 dark:via-gray-950/60 dark:to-gray-950" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto text-center py-12 sm:py-16 lg:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold tracking-wide border border-indigo-100 dark:border-indigo-800 shadow-sm"
                        >
                            <Sparkles className="h-4 w-4" />
                            REVOLUTIONIZING RECRUITMENT
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 text-gray-900 dark:text-white tracking-tight leading-[1.1]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Hiring made <span className="text-indigo-600 dark:text-indigo-400">Beautiful.</span>
                        </motion.h1>

                        <motion.p
                            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 px-4 leading-relaxed font-light"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            Create stunning, branded careers pages that showcase your company culture,
                            attract top talent, and streamline your hiring process.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link href="/techcorp/careers" className="w-full sm:w-auto">
                                <Button size="xl" className="w-full sm:w-auto group text-lg px-10 py-7 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                                    View Demo Page
                                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/login" className="w-full sm:w-auto">
                                <Button variant="outline" size="xl" className="w-full sm:w-auto text-lg px-10 py-7 rounded-2xl border-2 hover:bg-gray-50">
                                    Recruiter Portal
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Visual Section: Left-Right Layout */}
            <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
                        <motion.div
                            className="flex-1"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-block p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6 font-bold text-sm tracking-widest uppercase">
                                Visual Excellence
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                                Showcase your culture with <span className="text-indigo-600 dark:text-indigo-400">Elegance.</span>
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                Don't just list jobs. Tell a story. Our platform lets you build rich, media-heavy pages that reflect your true company identity.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Dynamic Content Sections',
                                    'Custom Branding & Colors',
                                    'Culture-driven Imagery',
                                    'Responsive Design'
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-gray-800 dark:text-gray-200 font-medium">
                                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div
                            className="flex-1 relative"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                                <img src="/images/about-team.png" alt="Team Collaboration" className="w-full h-auto scale-105 hover:scale-100 transition-transform duration-700" />
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-3xl -z-10" />
                        </motion.div>
                    </div>

                    <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                        <motion.div
                            className="flex-1"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-block p-3 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6 font-bold text-sm tracking-widest uppercase">
                                Professional Growth
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                                Attract talent that <span className="text-purple-600 dark:text-purple-400">Grows</span> with you.
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Highlight the benefits and career paths that matter most to today's top professionals. Build a bridge between roles and goals.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">150+</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 uppercase font-bold tracking-tighter">Live Jobs</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">24/7</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 uppercase font-bold tracking-tighter">Support</div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            className="flex-1 relative"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                                <img src="/images/growth.png" alt="Growth Illustration" className="w-full h-auto p-12 bg-gray-50" />
                            </div>
                            <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Feature Cards */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                            Everything you need to <span className="text-indigo-600 dark:text-indigo-400">Hire Better.</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            A complete toolkit to build, customize, and share your careers page.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Palette,
                                title: 'Brand Customization',
                                description: 'Match your brand perfectly with custom colors, logos, fonts, and layouts. Your page, your way.'
                            },
                            {
                                icon: Filter,
                                title: 'Smart Job Filters',
                                description: 'Let candidates filter by location, department, experience level, and more for the perfect fit.'
                            },
                            {
                                icon: Zap,
                                title: 'Lightning Fast',
                                description: 'Built for speed. Pages load instantly, ensuring candidates never wait and you never lose talent.'
                            },
                            {
                                icon: Share2,
                                title: 'Easy Sharing',
                                description: 'Share your careers page with a custom domain or embed it directly on your website.'
                            },
                            {
                                icon: CheckCircle2,
                                title: 'ATS Integration',
                                description: 'Connect with your existing applicant tracking system for a seamless recruitment workflow.'
                            },
                            {
                                icon: Briefcase,
                                title: 'Job Management',
                                description: 'Post, edit, and manage all your job listings from a single, intuitive dashboard.'
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="h-full"
                            >
                                <div className="group h-full p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                                    {/* Gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative z-10">
                                        <motion.div
                                            className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <feature.icon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl sm:text-5xl font-black text-white mb-8 tracking-tight">
                            Ready to hire with style?
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/techcorp/careers">
                                <Button
                                    variant="secondary"
                                    size="xl"
                                    className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-12 py-8 rounded-2xl"
                                >
                                    Explore Demo
                                    <ArrowRight className="h-6 w-6 ml-3" />
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button
                                    variant="outline"
                                    size="xl"
                                    className="border-2 border-white text-white hover:bg-white/10 text-lg px-12 py-8 rounded-2xl"
                                >
                                    Get Started Free
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
