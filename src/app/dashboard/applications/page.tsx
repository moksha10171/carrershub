'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Search, Filter, Mail, Calendar,
    MoreVertical, CheckCircle2, XCircle, Clock,
    Download, ExternalLink, ChevronRight, User
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { Company } from '@/types';

export default function ApplicationsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [applications, setApplications] = useState<any[]>([]);
    const [company, setCompany] = useState<Company | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data: companyData } = await supabase
                .from('companies')
                .select('id, name')
                .eq('user_id', user.id)
                .single();

            if (companyData) {
                setCompany(companyData as Company);
                fetchApplications(companyData.id);
            } else {
                router.push('/dashboard');
            }
        };
        init();
    }, []);

    const fetchApplications = async (companyId: string) => {
        try {
            const response = await fetch(`/api/applications?company_id=${companyId}`);
            const data = await response.json();
            if (data.success) {
                setApplications(data.applications);
            }
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (appId: string, newStatus: string) => {
        try {
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_status',
                    applicationId: appId,
                    status: newStatus
                })
            });
            const data = await response.json();
            if (data.success) {
                setApplications(apps => apps.map(a =>
                    a.id === appId ? { ...a, status: newStatus } : a
                ));
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const filteredApps = applications.filter(app => {
        const matchesSearch =
            app.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.applicant_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.jobs?.title.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="warning">Pending</Badge>;
            case 'reviewed': return <Badge variant="info">Reviewed</Badge>;
            case 'interviewed': return <Badge variant="primary">Interviewed</Badge>;
            case 'hired': return <Badge variant="success">Hired</Badge>;
            case 'rejected': return <Badge variant="danger">Rejected</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <main className="pt-24 pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                Candidates
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Manage and track job applications for {company?.name}.
                            </p>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-gray-500 mb-1">Total Applications</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{applications.length}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-yellow-600 mb-1">New/Pending</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {applications.filter(a => a.status === 'pending').length}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-green-600 mb-1">Hired</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {applications.filter(a => a.status === 'hired').length}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-indigo-600 mb-1">Interviewing</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {applications.filter(a => a.status === 'interviewed').length}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters & Search */}
                    <Card className="mb-8">
                        <CardContent className="p-6 pt-0">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by name, email, or job title..."
                                        className="pl-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="reviewed">Reviewed</option>
                                        <option value="interviewed">Interviewed</option>
                                        <option value="hired">Hired</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    <Button variant="outline" size="sm">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Tags
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Applications Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Candidate</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Applied For</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Applied Date</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {filteredApps.length > 0 ? (
                                            filteredApps.map((app) => (
                                                <motion.tr
                                                    key={app.id}
                                                    layout
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400">
                                                                <User className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900 dark:text-white">{app.applicant_name}</p>
                                                                <p className="text-sm text-gray-500">{app.applicant_email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="default">
                                                                {app.jobs?.title || 'Unknown Job'}
                                                            </Badge>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(app.status)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {new Date(app.created_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <select
                                                                className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-transparent"
                                                                value={app.status}
                                                                onChange={(e) => updateStatus(app.id, e.target.value)}
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="reviewed">Reviewed</option>
                                                                <option value="interviewed">Interviewed</option>
                                                                <option value="hired">Hired</option>
                                                                <option value="rejected">Rejected</option>
                                                            </select>
                                                            <Button variant="ghost" size="sm" className="p-1 px-2 h-auto text-indigo-600">
                                                                View
                                                                <ChevronRight className="h-4 w-4 ml-1" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                                    {searchQuery || statusFilter !== 'all' ? 'No matching candidates found.' : 'No applications received yet.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
