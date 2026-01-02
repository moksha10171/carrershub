import { Metadata } from 'next';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogList } from '@/components/blog/BlogList';
import { blogPosts } from '@/lib/blog-data';

export const metadata: Metadata = {
    title: 'Blog | CareerHub',
    description: 'Insights, updates, and best practices for modern hiring and recruitment technology.',
    openGraph: {
        title: 'CareerHub Blog',
        description: 'Insights for modern hiring.',
        type: 'website',
    },
};

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24">
            <BlogHero />

            <section className="py-20 -mt-10 relative z-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <BlogList posts={blogPosts} />
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-20 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-4 text-center max-w-2xl">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Stay in the loop
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Join 10,000+ recruiters getting the latest hiring trends delivered to their inbox.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
