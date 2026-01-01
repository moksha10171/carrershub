'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, ArrowRight, MapPin, Building2, Users, Heart, TrendingUp, Globe2, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CareersPage() {
    const testimonials = [
        {
            name: 'Sarah Chen',
            role: 'Senior Product Designer',
            avatar: '👩‍💼',
            quote: 'Joining CareerHub was the best career decision I\'ve made. The culture of innovation and the supportive team have helped me grow tremendously.',
            tenure: '2 years',
        },
        {
            name: 'Marcus Johnson',
            role: 'Engineering Lead',
            avatar: '👨‍💻',
            quote: 'The flexibility to work remotely and the focus on work-life balance make this an incredible place to work. Plus, the tech stack is cutting-edge!',
            tenure: '3 years',
        },
        {
            name: 'Priya Patel',
            role: 'Customer Success Manager',
            avatar: '👩‍🎓',
            quote: 'I love how much the company invests in professional development. I\'ve attended three conferences this year and completed two certifications.',
            tenure: '1.5 years',
        },
    ];

    const benefits = [
        { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive health, dental, and vision insurance. Mental health support and wellness stipend.' },
        { icon: Clock, title: 'Flexible Schedule', desc: 'Work when you\'re most productive. Core hours with flexible start/end times.' },
        { icon: Globe2, title: 'Remote-First', desc: 'Work from anywhere in the world. Home office setup budget included.' },
        { icon: TrendingUp, title: 'Learning Budget', desc: '$2,000/year for courses, conferences, and professional development.' },
        { icon: Award, title: 'Stock Options', desc: 'Competitive equity package. Everyone is an owner.' },
        { icon: Users, title: 'Team Events', desc: 'Annual company retreat. Monthly virtual socials and team activities.' },
    ];

    const careerPaths = [
        {
            level: 'Individual Contributor',
            roles: ['Junior', 'Mid-Level', 'Senior', 'Staff', 'Principal'],
            focus: 'Deep technical expertise and impact through engineering excellence',
        },
        {
            level: 'Management',
            roles: ['Team Lead', 'Manager', 'Senior Manager', 'Director', 'VP'],
            focus: 'People leadership and organizational impact through team development',
        },
    ];

    const hiringProcess = [
        { step: 1, title: 'Apply', desc: 'Submit your application through our careers page', time: '1 day' },
        { step: 2, title: 'Screening', desc: 'Quick chat with our recruiting team', time: '30 min' },
        { step: 3, title: 'Technical Interview', desc: 'Deep dive into your skills and experience', time: '1 hour' },
        { step: 4, title: 'Team Interview', desc: 'Meet your potential teammates', time: '1 hour' },
        { step: 5, title: 'Offer', desc: 'We make a decision within 48 hours', time: '2 days' },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-to-b from-indigo-50 dark:from-indigo-900/20 to-white dark:to-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6">
                            <Briefcase className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Build the Future with Us
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Join a team that's revolutionizing how companies build their careers pages.
                            We're remote-first, value-driven, and growing fast.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/techcorp/careers">
                                <Button size="lg">
                                    View Open Positions
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button size="lg" variant="outline">
                                    Learn About Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 border-y border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '50+', label: 'Team Members' },
                            { value: '20+', label: 'Countries' },
                            { value: '500+', label: 'Companies' },
                            { value: '4.9★', label: 'Glassdoor Rating' },
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Join Us */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
                            Why Join CareerHub?
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Building2,
                                    title: 'Remote-First Culture',
                                    desc: 'Work from anywhere in the world with flexible hours and async communication. We trust you to do your best work on your schedule.'
                                },
                                {
                                    icon: MapPin,
                                    title: 'Global Team',
                                    desc: 'Collaborate with talented people from over 20 countries. Diverse perspectives make us stronger and more creative.'
                                },
                                {
                                    icon: Briefcase,
                                    title: 'Growth Opportunities',
                                    desc: 'Clear career progression paths, continuous learning budget, and mentorship programs to help you reach your potential.'
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
                                    <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                                        <item.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
                            Hear From Our Team
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.map((person, idx) => (
                                <div key={idx} className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="text-4xl">{person.avatar}</div>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">{person.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{person.role}</div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                                        "{person.quote}"
                                    </p>
                                    <div className="text-sm text-indigo-600 dark:text-indigo-400">
                                        {person.tenure} at CareerHub
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
                            Benefits & Perks
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {benefits.map((benefit, idx) => (
                                <div key={idx} className="flex gap-4 p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                    <benefit.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {benefit.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Career Paths */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                            Career Growth Paths
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-12 text-center max-w-2xl mx-auto">
                            We support both technical and management career tracks. Choose the path that fits your goals.
                        </p>
                        <div className="space-y-6">
                            {careerPaths.map((path, idx) => (
                                <div key={idx} className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{path.level}</h3>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {path.roles.map((role, ridx) => (
                                            <span key={ridx} className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">{path.focus}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Hiring Process */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
                            Our Hiring Process
                        </h2>
                        <div className="space-y-4">
                            {hiringProcess.map((step) => (
                                <div key={step.step} className="flex gap-4 p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-bold">
                                        {step.step}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{step.time}</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-indigo-600 dark:bg-indigo-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Join Us?
                    </h2>
                    <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                        Explore our open positions and find the perfect role for you. We're excited to meet you!
                    </p>
                    <Link href="/techcorp/careers">
                        <Button size="lg" variant="outline" className="bg-white text-indigo-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-indigo-900 dark:hover:bg-white">
                            View Open Positions
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
