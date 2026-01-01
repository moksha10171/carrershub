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

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <Link href="/blog">
                    <Button variant="ghost" size="sm" className="mb-8 pl-0 hover:pl-0 hover:bg-transparent hover:text-indigo-600">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to all posts
                    </Button>
                </Link>

                <article>
                    <div className="mb-8">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
                                <Tag className="h-3 w-3" />
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                                <Calendar className="h-4 w-4" />
                                {post.date}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                                <Clock className="h-4 w-4" />
                                {post.readTime}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-3 pb-8 border-b border-gray-200 dark:border-gray-800">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{post.author}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Author</p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="prose prose-lg dark:prose-invert max-w-none hover:prose-a:text-indigo-600"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </div>
        </div>
    );
}
