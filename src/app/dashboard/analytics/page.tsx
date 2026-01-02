'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    BarChart3, Users, FileText, Clock, TrendingUp, TrendingDown,
    Calendar, Download, ArrowUpRight, ArrowDownRight, Eye
} from 'lucide-react';
import { ViewsChart, SourcesChart, DevicesChart } from '@/components/dashboard/AnalyticsCharts';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [timeRange, setTimeRange] = useState('30d');
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Get company ID
                const { data: company } = await supabase
                    .from('companies')
                    .select('id')
                    .eq('user_id', user.id)
                    .single();

                if (company) {
                    try {
                        const res = await fetch(`/api/analytics?company_id=${company.id}&range=${timeRange}`);
                        const json = await res.json();
                        if (json.success) {
                            setData(json.data);
                        }
                    } catch (err) {
                        console.error('Failed to fetch analytics:', err);
                    }
                }
            }
            setLoading(false);
        };

        fetchData();
    }, [timeRange]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-500">Failed to load analytics data.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Track your careers page performance and job applications
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                        </select>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <OverviewCard
                        title="Total Page Views"
                        value={data.overview.totalViews.toLocaleString()}
                        change={data.overview.viewsChange}
                        icon={<Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
                    />
                    <OverviewCard
                        title="Unique Visitors"
                        value={data.overview.uniqueVisitors.toLocaleString()}
                        change={data.overview.visitorsChange}
                        icon={<Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                    />
                    <OverviewCard
                        title="Job Applications"
                        value={data.overview.totalApplications.toLocaleString()}
                        change={data.overview.applicationsChange}
                        icon={<FileText className="h-5 w-5 text-green-600 dark:text-green-400" />}
                    />
                    <OverviewCard
                        title="Avg. Time on Page"
                        value={data.overview.avgTimeOnPage}
                        change={data.overview.timeChange}
                        icon={<Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
                    />
                </div>

                {/* Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Traffic Chart - Takes up 2 columns */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">Traffic Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ViewsChart data={data.viewsOverTime} />
                        </CardContent>
                    </Card>

                    {/* Sources Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">Traffic Sources</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SourcesChart data={data.trafficSources} />
                        </CardContent>
                    </Card>
                </div>

                {/* Secondary Charts & Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Top Jobs Table - Takes up 2 columns */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">Top Performing Jobs</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Job Title</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Views</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applications</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conv. Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {data.topJobs.map((job: any, i: number) => (
                                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{job.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">{job.views.toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">{job.applications}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">{job.conversion}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Device Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">Devices</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DevicesChart data={data.deviceBreakdown} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function OverviewCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
    const isPositive = change.startsWith('+');

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {icon}
                    </div>
                    <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                        {change}
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
                </div>
            </CardContent>
        </Card>
    );
}
