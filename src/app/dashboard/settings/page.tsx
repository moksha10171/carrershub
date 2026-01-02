'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { User, Lock, Mail, ChevronLeft, LogOut, CheckCircle, AlertCircle, Trash2, Building } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [updatingName, setUpdatingName] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [nameMessage, setNameMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [company, setCompany] = useState<any>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);
            setFullName(user.user_metadata?.full_name || '');

            // Fetch user's company
            const { data: companyData } = await supabase
                .from('companies')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (companyData) {
                setCompany(companyData);
            }

            setLoading(false);
        };
        getUser();
    }, [router, supabase.auth]);

    const handleNameUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setNameMessage(null);

        if (!fullName.trim()) {
            setNameMessage({ type: 'error', text: 'Name cannot be empty.' });
            return;
        }

        setUpdatingName(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });

            if (error) throw error;

            setNameMessage({ type: 'success', text: 'Name updated successfully.' });
            // Update local user object
            setUser({ ...user, user_metadata: { ...user.user_metadata, full_name: fullName } });
        } catch (error: any) {
            setNameMessage({ type: 'error', text: error.message || 'Failed to update name.' });
        } finally {
            setUpdatingName(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (passwords.new.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
            return;
        }

        if (passwords.new !== passwords.confirm) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        setUpdating(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwords.new
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Password updated successfully.' });
            setPasswords({ new: '', confirm: '' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update password.' });
        } finally {
            setUpdating(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleDeleteCompany = async () => {
        if (!company || deleteConfirmText !== company.name) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'delete_company',
                    company_id: company.id,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to delete company');
            }

            // Redirect to onboarding after successful deletion
            router.push('/onboarding');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete company.' });
            setShowDeleteModal(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [deleteAccountConfirmText, setDeleteAccountConfirmText] = useState('');
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    const handleDeleteAccount = async () => {
        if (deleteAccountConfirmText !== 'DELETE') return;

        setIsDeletingAccount(true);
        try {
            const response = await fetch('/api/user', {
                method: 'DELETE',
            });
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to delete account');
            }

            // Sign out and redirect
            await supabase.auth.signOut();
            router.push('/login');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete account.' });
            setShowDeleteAccountModal(false);
        } finally {
            setIsDeletingAccount(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <main className="pt-24 pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/dashboard">
                            <Button variant="outline" size="sm" aria-label="Back to dashboard">
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                            <p className="text-gray-600 dark:text-gray-400">Manage your profile and security</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Profile Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-indigo-500" />
                                    Profile Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={handleNameUpdate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="Your full name"
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    {nameMessage && (
                                        <div className={`p-3 rounded-md flex items-center gap-2 ${nameMessage.type === 'success'
                                            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {nameMessage.type === 'success' ? (
                                                <CheckCircle className="h-4 w-4" />
                                            ) : (
                                                <AlertCircle className="h-4 w-4" />
                                            )}
                                            <span className="text-sm">{nameMessage.text}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={updatingName}>
                                            {updatingName ? 'Updating...' : 'Update Name'}
                                        </Button>
                                    </div>
                                </form>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            value={user?.email || ''}
                                            disabled
                                            className="pl-10 bg-gray-50 dark:bg-gray-800"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Email cannot be changed directly. Contact support for assistance.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-indigo-500" />
                                    Security
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                type="password"
                                                value={passwords.new}
                                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                                placeholder="Enter new password"
                                                required
                                                minLength={6}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                type="password"
                                                value={passwords.confirm}
                                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                                placeholder="Confirm new password"
                                                required
                                                minLength={6}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    {message && (
                                        <div className={`p-3 rounded-md flex items-center gap-2 ${message.type === 'success'
                                            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {message.type === 'success' ? (
                                                <CheckCircle className="h-4 w-4" />
                                            ) : (
                                                <AlertCircle className="h-4 w-4" />
                                            )}
                                            <span className="text-sm">{message.text}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={updating}>
                                            {updating ? 'Updating...' : 'Update Password'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Sign Out */}
                        <Card className="border-red-200 dark:border-red-900/30">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">Sign Out</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Sign out of your account on this device
                                        </p>
                                    </div>
                                    <Button variant="outline" onClick={handleSignOut} className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Danger Zone - Delete Company */}
                        {company && (
                            <Card className="border-red-500 dark:border-red-700">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                        <Trash2 className="h-5 w-5" />
                                        Danger Zone
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-medium text-red-800 dark:text-red-200">
                                                    Delete Company Page
                                                </h4>
                                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                                    This will permanently delete your company page <strong>{company.name}</strong> and all associated data including jobs, settings, and content sections. This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowDeleteModal(true)}
                                            className="text-red-600 border-red-500 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Company
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Danger Zone - Delete Account */}
                        <Card className="border-red-500 dark:border-red-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <User className="h-5 w-5" />
                                    Delete Account
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-red-800 dark:text-red-200">
                                                Delete User Account
                                            </h4>
                                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                                This will permanently delete your user account, login credentials, and all associated data. This action is irreversible.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowDeleteAccountModal(true)}
                                        className="text-red-600 border-red-500 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Delete Company Confirmation Modal */}
            {showDeleteModal && company && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowDeleteModal(false)}>
                    <div
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Delete Company?
                            </h2>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            This will permanently delete <strong className="text-gray-900 dark:text-white">{company.name}</strong> and all its data. This action cannot be undone.
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Type <strong>{company.name}</strong> to confirm:
                            </label>
                            <Input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder={company.name}
                                className="border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmText('');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleDeleteCompany}
                                disabled={deleteConfirmText !== company.name || isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Forever'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Confirmation Modal */}
            {showDeleteAccountModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowDeleteAccountModal(false)}>
                    <div
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Delete User Account?
                            </h2>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            This will permanently delete your login and all associated data. This action cannot be undone.
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Type <strong>DELETE</strong> to confirm:
                            </label>
                            <Input
                                type="text"
                                value={deleteAccountConfirmText}
                                onChange={(e) => setDeleteAccountConfirmText(e.target.value)}
                                placeholder="DELETE"
                                className="border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setShowDeleteAccountModal(false);
                                    setDeleteAccountConfirmText('');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleDeleteAccount}
                                disabled={deleteAccountConfirmText !== 'DELETE' || isDeletingAccount}
                            >
                                {isDeletingAccount ? 'Deleting...' : 'Delete Forever'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
