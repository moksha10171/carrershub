import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Calendar, Tag, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getPostBySlug, blogPosts } from '@/lib/blog-data';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} | CareerHub Blog`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Mock related posts (just filter out current one and take 2)
    const relatedPosts = blogPosts
        .filter(p => p.slug !== slug)
        .slice(0, 2);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Progress Bar could go here */}

            <div className="pt-24 pb-8 sm:pt-32 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                    <Link href="/blog">
                        <Button variant="ghost" size="sm" className="mb-8 hover:bg-white/50 dark:hover:bg-gray-800/50">
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back to Blog
                        </Button>
                    </Link>

                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-4 text-sm font-medium">
                            <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400">
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <Calendar className="h-4 w-4" />
                                {post.date}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <Clock className="h-4 w-4" />
                                {post.readTime}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-center gap-3 pt-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm">
                                <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900 dark:text-white">{post.author}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Senior Editor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-12 sm:py-20">
                <article className="prose prose-lg sm:prose-xl dark:prose-invert prose-indigo mx-auto prose-img:rounded-2xl prose-headings:font-bold prose-a:text-indigo-600 hover:prose-a:text-indigo-500">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                {/* Share & Tags */}
                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">Share:</span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="rounded-full w-10 h-10 p-0">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                                </Button>
                                <Button size="sm" variant="outline" className="rounded-full w-10 h-10 p-0">
                                    <span className="sr-only">LinkedIn</span>
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                            Read Next
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-8">
                            {relatedPosts.map((related) => (
                                <Link key={related.slug} href={`/blog/${related.slug}`} className="group block">
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl h-48 mb-4 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors" />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                                        {related.title}
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                        {related.excerpt}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
