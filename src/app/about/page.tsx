import { Metadata } from 'next';
import Link from 'next/link';
import { Users, Target, Heart, Award, Zap, Globe, Briefcase, Smile } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
    title: 'About Us | CareerHub',
    description: 'Learn about CareerHub - the modern careers page builder helping companies attract top talent.',
};

const values = [
    {
        icon: Target,
        title: 'Mission-Driven',
        description: 'We believe every company deserves a beautiful careers page that tells their story.',
    },
    {
        icon: Heart,
        title: 'People-First',
        description: 'We put recruiters and candidates at the center of everything we build.',
    },
    {
        icon: Zap,
        title: 'Innovation',
        description: 'We constantly push boundaries to deliver cutting-edge hiring solutions.',
    },
    {
        icon: Award,
        title: 'Excellence',
        description: 'We strive for quality in every pixel, every feature, every interaction.',
    },
];

const stats = [
    { value: '500+', label: 'Companies Trust Us', icon: Users },
    { value: '10K+', label: 'Jobs Posted', icon: Briefcase },
    { value: '1M+', label: 'Candidates Reached', icon: Globe },
    { value: '98%', label: 'Customer Satisfaction', icon: Smile },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Hero */}
            <section className="pt-24 pb-16 sm:pt-32 sm:pb-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            About <span className="text-indigo-600 dark:text-indigo-400">CareerHub</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                            We&apos;re on a mission to help companies build beautiful, branded careers pages
                            that attract top talent and showcase their unique culture.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    Our Story
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                    CareerHub was born from a simple observation: most companies struggle to
                                    create careers pages that truly reflect their brand and culture.
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                    We built CareerHub to change that. Our platform empowers recruiters to
                                    create stunning, mobile-friendly careers pages without any technical skills.
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Today, we help hundreds of companies worldwide attract and engage
                                    the best talent through beautiful, branded hiring experiences.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
                                <Globe className="h-12 w-12 mb-4 opacity-80" />
                                <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
                                <p className="text-white/80 leading-relaxed">
                                    Companies in over 50 countries use CareerHub to power their
                                    hiring pages and reach candidates worldwide.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center group">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                    <stat.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Our Values
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            These principles guide everything we do at CareerHub.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {values.map((value) => (
                            <div
                                key={value.title}
                                className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-4">
                                    <value.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA & Join Team */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            Ready to transform your hiring?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                            Join hundreds of companies building their dream teams with CareerHub.
                            Or join us and help build the future of hiring.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/onboarding">
                                <Button size="lg" className="min-w-[200px] h-14 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 shadow-lg shadow-indigo-500/25">
                                    Start Hiring Now
                                </Button>
                            </Link>
                            <Link href="/techcorp/careers">
                                <Button variant="outline" size="lg" className="min-w-[200px] h-14 text-lg flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Join Our Team
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
