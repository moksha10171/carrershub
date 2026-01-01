'use client';

import React from 'react';
import Link from 'next/link';
import { Newspaper, Calendar, Tag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function BlogPage() {
    const posts = [
        {
            title: 'Building Better Careers Pages',
            excerpt: 'Learn how to create careers pages that attract top talent and showcase your company culture.',
            date: 'Dec 15, 2025',
            category: 'Product',
            slug: 'building-better-careers-pages',
        },
        {
            title: 'The Future of Hiring',
            excerpt: 'Insights into how technology is transforming the recruitment landscape.',
            date: 'Dec 1, 2025',
            category: 'Industry',
            slug: 'future-of-hiring',
        },
        {
            title: 'Remote Work Best Practices',
            excerpt: 'Tips for building and managing distributed teams effectively.',
            date: 'Nov 20, 2025',
            category: 'Culture',
            slug: 'remote-work-best-practices',
        },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Hero */}
            <section className="pt-24 pb-16 bg-gradient-to-b from-purple-50 dark:from-purple-900/20 to-white dark:to-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-6">
                        <Newspaper className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Blog
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Insights, updates, and best practices for modern hiring.
                    </p>
                </div>
            </section>

            {/* Blog Posts */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {posts.map((post, idx) => (
                            <article
                                key={idx}
                                className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
                            >
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
                                        <Tag className="h-3 w-3" />
                                        {post.category}
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                                        <Calendar className="h-4 w-4" />
                                        {post.date}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    {post.excerpt}
                                </p>
                                <Button variant="ghost" size="sm">
                                    Read more
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
