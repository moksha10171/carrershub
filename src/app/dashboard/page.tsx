'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
    Briefcase, Users, Eye, Settings, Palette, Copy, Check,
    BarChart3, TrendingUp, Globe, ExternalLink, Edit, Plus, Building
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [company, setCompany] = useState<any>(null);
    const [hasCompany, setHasCompany] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const [stats, setStats] = useState([
        { label: 'Open Positions', value: '0', icon: Briefcase, change: 'Loading...', color: 'indigo' },
        { label: 'Departments', value: '0', icon: Users, change: 'Loading...', color: 'purple' },
        { label: 'Locations', value: '0', icon: Globe, change: 'Loading...', color: 'blue' },
        { label: 'Remote Jobs', value: '0', icon: Eye, change: 'Loading...', color: 'green' },
    ]);
    const [recentJobs, setRecentJobs] = useState<any[]>([]);
    const [analyticsData, setAnalyticsData] = useState<any>(null);

    // Check authentication and fetch company
    useEffect(() => {
        const checkAuthAndFetchCompany = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);

            // Fetch user's company
            const { data: companyData, error } = await supabase
                .from('companies')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (companyData && !error) {
                setCompany(companyData);
                setHasCompany(true);
            } else {
                // No company yet - show onboarding
                setHasCompany(false);
            }
            setIsLoading(false);
        };
        checkAuthAndFetchCompany();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    // Fetch stats when company is available
    useEffect(() => {
        if (!company) return;

        const fetchStats = async () => {
            try {
                const response = await fetch(`/api/companies?slug=${company.slug}`);
                const data = await response.json();
                if (data.success && data.data.stats) {
                    const s = data.data.stats;
                    setStats([
                        { label: 'Open Positions', value: s.totalJobs.toString(), icon: Briefcase, change: 'Active listings', color: 'indigo' },
                        { label: 'Departments', value: s.departments.toString(), icon: Users, change: 'Hiring teams', color: 'purple' },
                        { label: 'Locations', value: s.locations.toString(), icon: Globe, change: 'Global reach', color: 'blue' },
                        { label: 'Remote Jobs', value: s.remoteJobs.toString(), icon: Eye, change: 'Work anywhere', color: 'green' },
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };

        const fetchRecentJobs = async () => {
            try {
                const response = await fetch(`/api/jobs?company_id=${company.id}&limit=3`);
                const data = await response.json();
                if (data.jobs) {
                    setRecentJobs(data.jobs.slice(0, 3));
                }
            } catch (error) {
                console.error('Failed to fetch recent jobs:', error);
            }
        };

        const fetchAnalytics = async () => {
            try {
                const response = await fetch(`/api/analytics?company_id=${company.id}&range=7d`);
                const data = await response.json();
                if (data.success && data.data) {
                    setAnalyticsData(data.data.overview);
                }
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            }
        };

        fetchStats();
        fetchRecentJobs();
        fetchAnalytics();
    }, [company]);

    // Dynamic quick actions based on company
    const quickActions = (company && company.slug) ? [
        { label: 'Edit Branding', href: `/${company.slug}/edit`, icon: Palette, description: 'Colors, logo, banner' },
        { label: 'Preview Page', href: `/${company.slug}/preview`, icon: Eye, description: 'See how it looks' },
        { label: 'Edit Content', href: `/${company.slug}/edit?tab=content`, icon: Edit, description: 'About, Culture, Benefits' },
        { label: 'Manage Jobs', href: '/dashboard/jobs', icon: Briefcase, description: 'Post and edit jobs' },
        { label: 'Candidates', href: '/dashboard/applications', icon: Users, description: 'Manage job applications' },
        { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, description: 'View traffic & insights' },
        { label: 'Account Settings', href: '/dashboard/settings', icon: Settings, description: 'Password & Security' },
    ] : [];

    const [publicUrl, setPublicUrl] = useState('');

    // Set public URL on client side only
    useEffect(() => {
        if (company && typeof window !== 'undefined') {
            setPublicUrl(`${window.location.origin}/${company.slug}/careers`);
        }
    }, [company]);

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // Show onboarding if user has no company
    if (!hasCompany) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                <main className="pt-20 pb-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl mx-auto text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-6">
                                <Building className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Welcome to CareerHub!
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                Let's set up your company's careers page. It only takes a minute.
                            </p>
                            <Link href="/onboarding">
                                <Button size="lg" className="px-8">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Create Your Careers Page
                                </Button>
                            </Link>

                        </motion.div>
                    </div>
                </main>
            </div>
        );
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <main className="pt-24 pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                {company?.name || 'Dashboard'}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Welcome back! Manage your careers page here.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link href={`/${company?.slug || ''}/preview`}>
                                <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                    Preview
                                </Button>
                            </Link>
                            <Link href={`/${company?.slug || ''}/edit`}>
                                <Button size="sm">
                                    <Edit className="h-4 w-4" />
                                    Edit Page
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Public URL Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-indigo-100 text-sm mb-1">Your Public Careers Page</p>
                                <p className="font-mono text-sm sm:text-base break-all">{publicUrl}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={copyToClipboard}
                                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                                >
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </Button>
                                <Link href={`/${company?.slug || ''}/careers`} target="_blank">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="bg-white text-indigo-600 hover:bg-gray-100 border-0"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        Open
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full">
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                                                <stat.icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                            </div>
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                        </div>
                                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                            {stat.value}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                            {stat.label}
                                        </p>
                                        <p className="text-xs text-green-600 dark:text-green-400">
                                            {stat.change}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickActions.map((action, index) => (
                                <motion.div
                                    key={action.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                >
                                    <Link href={action.href}>
                                        <Card className="h-full hover:border-indigo-500/50 transition-colors group cursor-pointer">
                                            <CardContent className="p-4 sm:p-6 text-center">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                                                    <action.icon className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                                                </div>
                                                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                                                    {action.label}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {action.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-indigo-500" />
                                    Recent Job Listings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <div className="space-y-4">
                                    {recentJobs.length > 0 ? (
                                        recentJobs.map((job) => (
                                            <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{job.title}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{job.location}</p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${job.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                    {job.is_active ? 'Active' : 'Hidden'}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                            <p>No jobs posted yet.</p>
                                            <Link href="/dashboard/jobs" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">Post your first job →</Link>
                                        </div>
                                    )}
                                </div>
                                <Link href="/dashboard/jobs">
                                    <Button variant="ghost" className="w-full mt-4">
                                        View All Jobs
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-indigo-500" />
                                    Page Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <div className="space-y-4">
                                    {analyticsData ? (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Page Views (7 days)</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900 dark:text-white">{analyticsData.totalViews?.toLocaleString() || '0'}</span>
                                                    <span className="text-xs text-green-600 dark:text-green-400">{analyticsData.viewsChange || '+0%'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Unique Visitors</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900 dark:text-white">{analyticsData.uniqueVisitors?.toLocaleString() || '0'}</span>
                                                    <span className="text-xs text-green-600 dark:text-green-400">{analyticsData.visitorsChange || '+0%'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Time on Page</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900 dark:text-white">{analyticsData.avgTimeOnPage || '0s'}</span>
                                                    <span className="text-xs text-green-600 dark:text-green-400">{analyticsData.timeChange || '+0%'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Applications</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900 dark:text-white">{analyticsData.totalApplications?.toLocaleString() || '0'}</span>
                                                    <span className="text-xs text-green-600 dark:text-green-400">{analyticsData.applicationsChange || '+0%'}</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                            <p>Loading analytics...</p>
                                        </div>
                                    )}
                                </div>
                                <Link href="/dashboard/analytics">
                                    <Button variant="ghost" className="w-full mt-4">
                                        View Full Analytics
                                        <BarChart3 className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>


                </div>
            </main>
        </div>
    );
}
