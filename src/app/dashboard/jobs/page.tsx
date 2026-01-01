'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
    Upload, FileSpreadsheet, Plus, Trash2, Edit2, Eye, EyeOff,
    CheckCircle, AlertCircle, Download, ChevronLeft, Search, Filter
} from 'lucide-react';
import { getAllJobs, demoCompany } from '@/lib/data';
import type { Job } from '@/types';

interface ParsedJob {
    title: string;
    location: string;
    department: string;
    work_policy: string;
    employment_type: string;
    experience_level: string;
    job_type: string;
    salary_range: string;
}

export default function JobsManagementPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [parsedJobs, setParsedJobs] = useState<ParsedJob[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch jobs on mount
    React.useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('/api/jobs');
                const data = await response.json();
                setJobs(data.jobs || []);
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, []);

    // Get unique departments
    const departments = Array.from(new Set(jobs.map(j => j.department))).sort();

    // Filter jobs
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = !searchQuery ||
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = !selectedDepartment || job.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
    });

    // Parse CSV content (kept the same logic)
    const parseCSV = (content: string): ParsedJob[] => {
        const lines = content.split('\n');
        if (lines.length < 2) return [];
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));

        const parsedData: ParsedJob[] = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = line.split(',').map(v => v.trim());
            const job: any = {};

            headers.forEach((header, index) => {
                job[header] = values[index] || '';
            });

            parsedData.push({
                title: job.title || '',
                location: job.location || '',
                department: job.department || '',
                work_policy: job.work_policy || 'On-site',
                employment_type: job.employment_type || 'Full time',
                experience_level: job.experience_level || 'Mid-level',
                job_type: job.job_type || 'Permanent',
                salary_range: job.salary_range || '',
            });
        }

        return parsedData;
    };

    // Handle file upload
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            setUploadError('Please upload a CSV file.');
            return;
        }

        setIsUploading(true);
        setUploadError('');

        try {
            const content = await file.text();
            const parsed = parseCSV(content);

            if (parsed.length === 0) {
                setUploadError('No valid jobs found in the CSV.');
                setIsUploading(false);
                return;
            }

            setParsedJobs(parsed);
            setShowUploadModal(true);
            setIsUploading(false);
        } catch (error) {
            setUploadError('Failed to parse CSV file.');
            setIsUploading(false);
        }
    };

    // Confirm import
    const confirmImport = async () => {
        setIsUploading(true);
        const now = new Date();
        const newJobs = parsedJobs.map((job, index) => ({
            ...job,
            id: `imported-${Date.now()}-${index}`,
            company_id: demoCompany.id,
            slug: job.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
            description: `<p>${job.title} position in our ${job.department} team.</p>`,
            is_active: true,
            posted_at: now.toISOString(),
            updated_at: now.toISOString(),
        })) as Job[];

        // Simulate API call for import
        await fetch('/api/jobs', {
            method: 'POST',
            body: JSON.stringify({ action: 'import', jobs: newJobs }),
        });

        setJobs([...newJobs, ...jobs]);
        setShowUploadModal(false);
        setParsedJobs([]);
        setUploadSuccess(true);
        setIsUploading(false);
        setTimeout(() => setUploadSuccess(false), 3000);
    };

    // Toggle job active status
    const toggleJobStatus = async (jobId: string) => {
        const job = jobs.find(j => j.id === jobId);
        if (!job) return;

        const originalJobs = [...jobs];
        // Optimistic update
        setJobs(jobs.map(j => j.id === jobId ? { ...j, is_active: !j.is_active } : j));

        try {
            await fetch('/api/jobs', {
                method: 'POST',
                body: JSON.stringify({ action: 'update_status', jobId, is_active: !job.is_active }),
            });
        } catch (error) {
            setJobs(originalJobs);
            console.error('Failed to toggle status:', error);
        }
    };

    // Delete job
    const deleteJob = async (jobId: string) => {
        if (confirm('Are you sure you want to delete this job?')) {
            const originalJobs = [...jobs];
            setJobs(jobs.filter(job => job.id !== jobId));

            try {
                await fetch('/api/jobs', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'delete', jobId }),
                });
            } catch (error) {
                setJobs(originalJobs);
                console.error('Failed to delete job:', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <main className="pt-20 pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </Link>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    Manage Jobs
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {jobs.length} total positions
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                isLoading={isUploading}
                            >
                                <Upload className="h-4 w-4" />
                                Import CSV
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <Button size="sm" onClick={() => setShowAddModal(true)}>
                                <Plus className="h-4 w-4" />
                                Add Job
                            </Button>
                        </div>
                    </div>

                    {/* Add Job Modal */}
                    <AnimatePresence>
                        {showAddModal && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                                onClick={() => setShowAddModal(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-8"
                                >
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                        Post a New Position
                                    </h2>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.currentTarget);
                                        const newJob = {
                                            id: `job-${Date.now()}`,
                                            title: formData.get('title') as string,
                                            location: formData.get('location') as string,
                                            department: formData.get('department') as string,
                                            work_policy: formData.get('work_policy') as string,
                                            employment_type: 'Full time',
                                            experience_level: 'Mid-level',
                                            is_active: true,
                                            posted_at: new Date().toISOString(),
                                        } as Job;
                                        setJobs([newJob, ...jobs]);
                                        setShowAddModal(false);
                                    }} className="space-y-4">
                                        <Input name="title" label="Job Title" placeholder="e.g. Senior Product Designer" required />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input name="location" label="Location" placeholder="e.g. Remote" required />
                                            <Input name="department" label="Department" placeholder="e.g. Design" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Work Policy</label>
                                            <select name="work_policy" className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                                <option value="Remote">Remote</option>
                                                <option value="Hybrid">Hybrid</option>
                                                <option value="On-site">On-site</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-3 mt-8">
                                            <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)} type="button">
                                                Cancel
                                            </Button>
                                            <Button className="flex-1" type="submit">
                                                Create Job
                                            </Button>
                                        </div>
                                    </form>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Success/Error Messages */}
                    <AnimatePresence>
                        {uploadSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-center gap-3"
                            >
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <span className="text-green-700 dark:text-green-300">Jobs imported successfully!</span>
                            </motion.div>
                        )}
                        {uploadError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-center gap-3"
                            >
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                <span className="text-red-700 dark:text-red-300">{uploadError}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Input
                                placeholder="Search jobs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={<Search className="h-4 w-4" />}
                            />
                        </div>
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    {/* Jobs Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Job Title</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Location</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Department</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredJobs.slice(0, 50).map(job => (
                                            <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-4 py-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{job.title}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">{job.location}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                                                    {job.location}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                                                    {job.department}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        onClick={() => toggleJobStatus(job.id)}
                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${job.is_active
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                            }`}
                                                    >
                                                        {job.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                                        {job.is_active ? 'Active' : 'Hidden'}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                                                            aria-label="Edit job"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteJob(job.id)}
                                                            className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                                                            aria-label="Delete job"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredJobs.length > 50 && (
                                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                                    Showing 50 of {filteredJobs.length} jobs. Use filters to narrow results.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* CSV Template */}
                    <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                            <FileSpreadsheet className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                    Import Jobs from CSV
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                                    Your CSV should have columns: title, location, department, work_policy, employment_type, experience_level, job_type, salary_range
                                </p>
                                <button className="text-xs text-blue-600 dark:text-blue-400 underline hover:no-underline flex items-center gap-1">
                                    <Download className="h-3 w-3" />
                                    Download template
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Upload Confirmation Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => setShowUploadModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6"
                        >
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Import {parsedJobs.length} Jobs?
                            </h2>
                            <div className="max-h-60 overflow-y-auto mb-6">
                                <div className="space-y-2">
                                    {parsedJobs.slice(0, 10).map((job, i) => (
                                        <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                            <p className="font-medium text-gray-900 dark:text-white">{job.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {job.location} · {job.department}
                                            </p>
                                        </div>
                                    ))}
                                    {parsedJobs.length > 10 && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                                            ...and {parsedJobs.length - 10} more
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setShowUploadModal(false)}>
                                    Cancel
                                </Button>
                                <Button className="flex-1" onClick={confirmImport}>
                                    <CheckCircle className="h-4 w-4" />
                                    Import All
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
