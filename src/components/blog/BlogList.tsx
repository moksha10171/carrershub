'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { BlogPost } from '@/lib/blog-data';

interface BlogListProps {
    posts: BlogPost[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function BlogList({ posts }: BlogListProps) {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
            {posts.map((post) => (
                <motion.article
                    key={post.slug}
                    variants={item}
                    whileHover={{ y: -5 }}
                    className="group flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                    {/* Image Placeholder or Actual Image */}
                    <div className="h-48 w-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
                        {/* Decorative Pattern */}
                        <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400 via-gray-200 to-transparent" />

                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-gray-900/90 text-indigo-600 dark:text-indigo-400 backdrop-blur-sm shadow-sm">
                                {post.category}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 p-6 flex flex-col">
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {post.date}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {post.readTime}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            <Link href={`/blog/${post.slug}`}>
                                {post.title}
                            </Link>
                        </h3>

                        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 text-sm flex-1">
                            {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                    <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {post.author}
                                </span>
                            </div>

                            <Link href={`/blog/${post.slug}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </motion.article>
            ))}
        </motion.div>
    );
}
