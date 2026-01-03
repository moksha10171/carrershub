'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
    Palette, Image, Type, Video, GripVertical, Plus, Trash2, Eye,
    Save, ChevronLeft, Check, AlertCircle, Upload, LinkIcon, CheckCircle, Clock
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PublishConfirmModal } from '@/components/edit/PublishConfirmModal';
import { formatTimestamp } from '@/lib/utils/formatTimestamp';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useHeartbeat } from '@/hooks/useHeartbeat';

interface ContentSectionEdit {
    id: string;
    title: string;
    type: string;
    content: string;
    is_visible: boolean;
}

export default function EditPage() {
    const params = useParams();
    const rawSlug = params['company-slug'] as string;
    const companySlug = rawSlug === 'undefined' || rawSlug === 'null' ? null : rawSlug;
    const router = useRouter();
    const supabase = createClient();

    // Redirect if slug is invalid
    useEffect(() => {
        if (!companySlug && typeof window !== 'undefined') {
            router.replace('/dashboard');
        }
    }, [companySlug, router]);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);
            setIsAuthLoading(false);
        };
        checkAuth();
    }, [router, supabase.auth]);

    // Brand settings state
    const [brandSettings, setBrandSettings] = useState({
        companyName: '',
        tagline: '',
        website: '',
        primaryColor: '#6366F1',
        secondaryColor: '#4F46E5',
        accentColor: '#10B981',
        logoUrl: '',
        bannerUrl: '',
        cultureVideoUrl: '',
    });

    // Content sections state
    const [sections, setSections] = useState<ContentSectionEdit[]>([]);

    const [activeTab, setActiveTab] = useState<'branding' | 'content' | 'seo'>('branding');
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [publishSuccess, setPublishSuccess] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(null);
    const [draftUpdatedAt, setDraftUpdatedAt] = useState<string | null>(null);
    const [conflictDetected, setConflictDetected] = useState(false);
    const [conflictData, setConflictData] = useState<any>(null);

    // Auto-save hook (saves every 30 seconds if there are changes)
    const { lastSaved: autoSaveTime, isSaving: isAutoSaving } = useAutoSave(
        hasChanges,
        async () => {
            if (companyId) {
                await handleSave();
            }
        },
        { interval: 30000, enabled: !!companyId }
    );

    // Heartbeat hook (tracks concurrent editors)
    const { activeEditors } = useHeartbeat({
        companyId,
        interval: 30000,
        enabled: !!companyId
    });

    // Keyboard shortcuts (Ctrl+S to save)
    // Use ref to prevent stale closure issues
    const saveStateRef = useRef({ hasChanges, isSaving });
    saveStateRef.current = { hasChanges, isSaving };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                const { hasChanges: hasChangesNow, isSaving: isSavingNow } = saveStateRef.current;
                if (hasChangesNow && !isSavingNow) {
                    // Trigger save via form submission or manual call
                    document.getElementById('save-button')?.click();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Navigation guard - warn before leaving with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasChanges]);

    // Fetch data on mount
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                if (!companySlug) return;

                if (!companySlug) return;

                // For real companies, ALWAYS fetch from API first to avoid stale data logic
                const response = await fetch(`/api/companies?slug=${companySlug}`);
                const apiData = await response.json();

                if (apiData.success && apiData.data) {
                    const { company, settings, sections: apiSections } = apiData.data;

                    // Verify ownership (double check)
                    if (company.user_id !== user.id) {
                        // Strict redirect for unauthorized users
                        console.error('Unauthorized access to company');
                        router.replace('/dashboard');
                        return;
                    }

                    // Store company ID for later use
                    setCompanyId(company.id);

                    // Check if draft exists
                    const draftResponse = await fetch(`/api/companies/save?company_id=${company.id}`);
                    const draftData = await draftResponse.json();

                    // If no draft exists, create initial draft from published data
                    if (!draftData.draft) {
                        console.log('No draft found, creating initial draft from published data');
                        try {
                            await fetch('/api/companies/save', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    company,
                                    settings,
                                    sections: apiSections
                                })
                            });
                            // Fetch the newly created draft
                            const newDraftResponse = await fetch(`/api/companies/save?company_id=${company.id}`);
                            const newDraftData = await newDraftResponse.json();
                            if (newDraftData.success && newDraftData.draft) {
                                draftData.draft = newDraftData.draft;
                            }
                        } catch (error) {
                            console.error('Failed to create initial draft:', error);
                        }
                    }

                    // Use draft data if available, otherwise use live data
                    const dataToUse = draftData.success && draftData.draft
                        ? draftData.draft
                        : { company_data: company, settings_data: settings, sections_data: apiSections };

                    const companyToUse = dataToUse.company_data || company;
                    const settingsToUse = dataToUse.settings_data || settings;
                    const sectionsToUse = dataToUse.sections_data || apiSections;

                    // Store timestamps if draft exists
                    if (draftData.success && draftData.draft) {
                        setDraftUpdatedAt(draftData.draft.updated_at);
                        setLastPublishedAt(draftData.draft.last_published_at);
                    }

                    setBrandSettings({
                        companyName: companyToUse.name,
                        tagline: companyToUse.tagline || '',
                        website: companyToUse.website || '',
                        primaryColor: settingsToUse?.primary_color || '#6366F1',
                        secondaryColor: settingsToUse?.secondary_color || '#4F46E5',
                        accentColor: settingsToUse?.accent_color || '#10B981',
                        logoUrl: companyToUse.logo_url || '',
                        bannerUrl: companyToUse.banner_url || '',
                        cultureVideoUrl: settingsToUse?.culture_video_url || '',
                    });

                    if (sectionsToUse && Array.isArray(sectionsToUse)) {
                        setSections(sectionsToUse.map((s: any) => ({
                            id: s.id,
                            title: s.title,
                            type: s.type,
                            content: s.content || '',
                            is_visible: s.is_visible,
                        })));
                    }
                } else {
                    console.error('Failed to load company data:', apiData.error);
                }
            } catch (error) {
                console.error('Failed to fetch company data:', error);
            }
        };
        fetchData();
    }, [companySlug, user]);

    // Handle Image Upload
    const handleImageUpload = async (file: File, field: 'logoUrl' | 'bannerUrl') => {
        if (!user) return;

        // Optimistic preview
        const objectUrl = URL.createObjectURL(file);
        handleBrandChange(field, objectUrl);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${companySlug}-${field}-${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('company-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('company-assets')
                .getPublicUrl(filePath);

            // Update with real URL
            handleBrandChange(field, publicUrl);
        } catch (error) {
            console.error('Upload failed:', error);
            // Revert to original or show error (for now just keeping the objectUrl or empty)
            // Ideally we'd show a toast here
        }
    };

    const handleBrandChange = (field: string, value: string) => {
        setBrandSettings({ ...brandSettings, [field]: value });
        setHasChanges(true);
    };

    const handleSectionChange = (id: string, field: string, value: string | boolean) => {
        setSections(sections.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        ));
        setHasChanges(true);
    };

    const addSection = () => {
        const newSection: ContentSectionEdit = {
            id: `section-${Date.now()}`,
            title: 'New Section',
            type: 'custom',
            content: `<div class="flex flex-col md:flex-row items-center gap-8 py-8">
  <div class="flex-1">
    <h3>New Section</h3>
    <p>Describe your section here...</p>
  </div>
  <div class="flex-1">
     <!-- Replace with your image URL -->
    <img src="https://placehold.co/600x400/e2e8f0/64748b?text=Image" alt="Placeholder" class="rounded-2xl shadow-lg w-full object-cover" />
  </div>
</div>`,
            is_visible: true,
        };
        setSections([...sections, newSection]);
        setHasChanges(true);
    };

    const removeSection = (id: string) => {
        setSections(sections.filter(s => s.id !== id));
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (!companyId) {
            setSaveError('Company ID not found');
            return;
        }

        setIsSaving(true);
        try {
            const companyData = {
                id: companyId,
                name: brandSettings.companyName,
                tagline: brandSettings.tagline,
                website: brandSettings.website,
                logo_url: brandSettings.logoUrl,
                banner_url: brandSettings.bannerUrl,
            };

            const settingsData = {
                primary_color: brandSettings.primaryColor,
                secondary_color: brandSettings.secondaryColor,
                accent_color: brandSettings.accentColor,
                culture_video_url: brandSettings.cultureVideoUrl,
            };

            const sectionsData = sections.map((s, idx) => ({
                ...s,
                display_order: idx,
            }));

            // Save to draft
            const response = await fetch('/api/companies/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company: companyData,
                    settings: settingsData,
                    sections: sectionsData,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save draft');
            }

            const result = await response.json();
            if (result.updatedAt) {
                setDraftUpdatedAt(result.updatedAt);
            }

            setSaveSuccess(true);
            setSaveError('');
            setHasChanges(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error: any) {
            console.error('Failed to save draft:', error);
            setSaveError(`Error: ${error.message || 'Failed to save draft'} `);
            setSaveSuccess(false);
            setTimeout(() => setSaveError(''), 5000);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!companyId) {
            setSaveError('Company ID not found');
            return;
        }

        // Close modal
        setShowPublishModal(false);

        // Auto-save if there are unsaved changes
        if (hasChanges) {
            await handleSave();
        }

        setIsPublishing(true);
        try {
            const response = await fetch('/api/companies/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_id: companyId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to publish changes');
            }

            const result = await response.json();
            if (result.publishedAt) {
                setLastPublishedAt(result.publishedAt);
            }

            setPublishSuccess(true);
            setSaveError('');
            setTimeout(() => setPublishSuccess(false), 3000);
        } catch (error: any) {
            console.error('Failed to publish:', error);
            setSaveError(`Error: ${error.message || 'Failed to publish'}`);
            setPublishSuccess(false);
            setTimeout(() => setSaveError(''), 5000);
        } finally {
            setIsPublishing(false);
        }
    };

    const tabs = [
        { id: 'branding', label: 'Branding', icon: Palette },
        { id: 'content', label: 'Content', icon: Type },
    ];

    // Show loading state while checking auth
    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <main className="pt-24 pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" aria-label="Back to dashboard">
                                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                        Edit Careers Page
                                    </h1>
                                    <span className="px-2 py-0.5 text-xs font-mono bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-md">
                                        /{companySlug}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {brandSettings.companyName || 'Customize your company\'s careers page'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link href={`/${companySlug}/preview`}>
                                <Button variant="outline" size="sm" aria-label="Preview careers page">
                                    <Eye className="h-4 w-4" />
                                    Preview
                                </Button>
                            </Link>
                            <Button
                                id="save-button"
                                size="sm"
                                variant="outline"
                                onClick={handleSave}
                                isLoading={isSaving}
                                disabled={!hasChanges}
                                aria-label={hasChanges ? 'Save draft (Ctrl+S)' : 'No changes to save'}
                                title="Ctrl+S - Save as Draft"
                            >
                                {saveSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                                {saveSuccess ? 'Saved Draft' : 'Save Draft'}
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => setShowPublishModal(true)}
                                isLoading={isPublishing}
                                aria-label="Publish changes to live site"
                                title="Publish to Live Site"
                            >
                                {publishSuccess ? <CheckCircle className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                                {publishSuccess ? 'Published!' : 'Publish'}
                            </Button>
                        </div >
                    </div>

                    {/* Draft Status Section */}
                    {(draftUpdatedAt || lastPublishedAt) && (
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                            {draftUpdatedAt && (
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Clock className="h-4 w-4" />
                                    <span>Draft saved: <strong className="text-gray-900 dark:text-gray-200">{formatTimestamp(draftUpdatedAt)}</strong></span>
                                </div>
                            )}
                            {lastPublishedAt && (
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Published: <strong className="text-green-700 dark:text-green-300">{formatTimestamp(lastPublishedAt)}</strong></span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Unsaved Changes Alert */}
                    {
                        hasChanges && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-2"
                            >
                                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                <span className="text-sm text-amber-700 dark:text-amber-300">You have unsaved changes</span>
                            </motion.div>
                        )
                    }

                    {/* Save Success/Error Messages */}
                    <AnimatePresence>
                        {saveSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-center gap-2"
                            >
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <span className="text-sm text-green-700 dark:text-green-300">Changes saved successfully!</span>
                            </motion.div>
                        )}
                        {saveError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-center gap-2"
                            >
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <span className="text-sm text-red-700 dark:text-red-300">{saveError}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>


                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700" role="tablist" aria-label="Editor tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                aria-controls={`panel-${tab.id}`}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${activeTab === tab.id
                                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Branding Tab */}
                    {
                        activeTab === 'branding' && (
                            <div className="grid lg:grid-cols-2 gap-6">
                                {/* Company Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Company Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Input
                                            label="Company Name"
                                            value={brandSettings.companyName}
                                            onChange={(e) => handleBrandChange('companyName', e.target.value)}
                                            placeholder="Your Company Name"
                                        />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                                Tagline
                                            </label>
                                            <textarea
                                                value={brandSettings.tagline}
                                                onChange={(e) => handleBrandChange('tagline', e.target.value)}
                                                placeholder="A short description of your company..."
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none"
                                            />
                                        </div>
                                        <Input
                                            label="Website URL"
                                            value={brandSettings.website}
                                            onChange={(e) => handleBrandChange('website', e.target.value)}
                                            placeholder="https://yourcompany.com"
                                            icon={<LinkIcon className="h-4 w-4" />}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Colors */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Palette className="h-5 w-5 text-indigo-500" />
                                            Brand Colors
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                                    Primary
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={brandSettings.primaryColor}
                                                        onChange={(e) => handleBrandChange('primaryColor', e.target.value)}
                                                        className="w-10 h-10 rounded cursor-pointer border-0"
                                                    />
                                                    <Input
                                                        value={brandSettings.primaryColor}
                                                        onChange={(e) => handleBrandChange('primaryColor', e.target.value)}
                                                        className="font-mono text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                                    Secondary
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={brandSettings.secondaryColor}
                                                        onChange={(e) => handleBrandChange('secondaryColor', e.target.value)}
                                                        className="w-10 h-10 rounded cursor-pointer border-0"
                                                    />
                                                    <Input
                                                        value={brandSettings.secondaryColor}
                                                        onChange={(e) => handleBrandChange('secondaryColor', e.target.value)}
                                                        className="font-mono text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                                    Accent
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={brandSettings.accentColor}
                                                        onChange={(e) => handleBrandChange('accentColor', e.target.value)}
                                                        className="w-10 h-10 rounded cursor-pointer border-0"
                                                    />
                                                    <Input
                                                        value={brandSettings.accentColor}
                                                        onChange={(e) => handleBrandChange('accentColor', e.target.value)}
                                                        className="font-mono text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Color Preview */}
                                        <div className="mt-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-gray-500 mb-3">Preview</p>
                                            <div className="flex gap-2">
                                                <div
                                                    className="w-20 h-10 rounded"
                                                    style={{ backgroundColor: brandSettings.primaryColor }}
                                                />
                                                <div
                                                    className="w-20 h-10 rounded"
                                                    style={{ backgroundColor: brandSettings.secondaryColor }}
                                                />
                                                <div
                                                    className="w-20 h-10 rounded"
                                                    style={{ backgroundColor: brandSettings.accentColor }}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Media */}
                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Image className="h-5 w-5 text-indigo-500" />
                                            Media Assets
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid sm:grid-cols-3 gap-6">
                                            {/* Logo */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                                    Company Logo
                                                </label>
                                                <div
                                                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer relative overflow-hidden group"
                                                    onClick={() => document.getElementById('logo-upload')?.click()}
                                                >
                                                    {brandSettings.logoUrl ? (
                                                        <div className="flex flex-col items-center">
                                                            <img src={brandSettings.logoUrl} alt="Logo preview" className="h-16 w-16 object-contain mb-2" />
                                                            <p className="text-xs text-indigo-600 dark:text-indigo-400">Click to replace</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                                            <p className="text-sm text-gray-500">Click or drag to upload</p>
                                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                                                        </>
                                                    )}
                                                    <input
                                                        id="logo-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleImageUpload(file, 'logoUrl');
                                                        }}
                                                    />
                                                </div>
                                                <Input
                                                    placeholder="Or paste image URL..."
                                                    value={brandSettings.logoUrl}
                                                    onChange={(e) => handleBrandChange('logoUrl', e.target.value)}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Banner */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                                    Hero Banner
                                                </label>
                                                <div
                                                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer relative overflow-hidden group"
                                                    onClick={() => document.getElementById('banner-upload')?.click()}
                                                >
                                                    {brandSettings.bannerUrl ? (
                                                        <div className="flex flex-col items-center">
                                                            <img src={brandSettings.bannerUrl} alt="Banner preview" className="h-20 w-full object-cover rounded mb-2 opacity-70" />
                                                            <p className="text-xs text-indigo-600 dark:text-indigo-400">Click to replace</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                                            <p className="text-sm text-gray-500">1920x600 recommended</p>
                                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                                        </>
                                                    )}
                                                    <input
                                                        id="banner-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleImageUpload(file, 'bannerUrl');
                                                        }}
                                                    />
                                                </div>
                                                <Input
                                                    placeholder="Or paste image URL..."
                                                    value={brandSettings.bannerUrl}
                                                    onChange={(e) => handleBrandChange('bannerUrl', e.target.value)}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Culture Video */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                                    Culture Video
                                                </label>
                                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                                                    <Video className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                                    <p className="text-sm text-gray-500">YouTube or Vimeo</p>
                                                    <p className="text-xs text-gray-400 mt-1">Embed URL</p>
                                                </div>
                                                <Input
                                                    placeholder="Paste video embed URL..."
                                                    value={brandSettings.cultureVideoUrl}
                                                    onChange={(e) => handleBrandChange('cultureVideoUrl', e.target.value)}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )
                    }

                    {/* Content Tab */}
                    {
                        activeTab === 'content' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Drag sections to reorder. Toggle visibility for each section.
                                    </p>
                                    <Button variant="outline" size="sm" onClick={addSection}>
                                        <Plus className="h-4 w-4" />
                                        Add Section
                                    </Button>
                                </div>

                                <Reorder.Group
                                    axis="y"
                                    values={sections}
                                    onReorder={(newOrder) => {
                                        setSections(newOrder);
                                        setHasChanges(true);
                                    }}
                                    className="space-y-4"
                                >
                                    {sections.map((section) => (
                                        <Reorder.Item key={section.id} value={section}>
                                            <Card className="cursor-move hover:shadow-md transition-shadow">
                                                <CardContent className="p-4 sm:p-6">
                                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                                        {/* Drag Handle */}
                                                        <div
                                                            className="hidden sm:flex p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
                                                            title="Drag to reorder"
                                                            aria-label="Drag to reorder section"
                                                        >
                                                            <GripVertical className="h-5 w-5" />
                                                        </div>

                                                        {/* Main Content */}
                                                        <div className="flex-1 space-y-4">
                                                            {/* Header Row */}
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                                <Input
                                                                    value={section.title}
                                                                    onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                                                                    placeholder="Section Title"
                                                                    className="font-medium flex-1"
                                                                    aria-label="Section title"
                                                                />
                                                                <select
                                                                    value={section.type}
                                                                    onChange={(e) => handleSectionChange(section.id, 'type', e.target.value)}
                                                                    className="w-full sm:w-auto px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500"
                                                                    aria-label="Section type"
                                                                >
                                                                    <option value="about">About</option>
                                                                    <option value="culture">Culture</option>
                                                                    <option value="benefits">Benefits</option>
                                                                    <option value="values">Values</option>
                                                                    <option value="team">Team</option>
                                                                    <option value="custom">Custom</option>
                                                                </select>
                                                            </div>

                                                            {/* Templates / Snippets Toolbar */}
                                                            <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                                                                <button
                                                                    onClick={() => {
                                                                        const template = `
<div class="flex flex-col md:flex-row items-center gap-8 py-8">
  <div class="flex-1">
    <h3>Title Here</h3>
    <p>Add your text here...</p>
  </div>
  <div class="flex-1">
    <img src="https://via.placeholder.com/600x400" alt="Description" class="rounded-2xl shadow-lg w-full object-cover" />
  </div>
</div>`;
                                                                        handleSectionChange(section.id, 'content', section.content + template);
                                                                    }}
                                                                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md whitespace-nowrap"
                                                                >
                                                                    + Text Left / Img Right
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const template = `
<div class="flex flex-col md:flex-row-reverse items-center gap-8 py-8">
  <div class="flex-1">
    <h3>Title Here</h3>
    <p>Add your text here...</p>
  </div>
  <div class="flex-1">
    <img src="https://via.placeholder.com/600x400" alt="Description" class="rounded-2xl shadow-lg w-full object-cover" />
  </div>
</div>`;
                                                                        handleSectionChange(section.id, 'content', section.content + template);
                                                                    }}
                                                                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md whitespace-nowrap"
                                                                >
                                                                    + Img Left / Text Right
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const template = `
<div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl mb-6">
  <h3 class="mb-2">Highlight Box</h3>
  <p class="mb-0">Important information goes here...</p>
</div>`;
                                                                        handleSectionChange(section.id, 'content', section.content + template);
                                                                    }}
                                                                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md whitespace-nowrap"
                                                                >
                                                                    + Highlight Box
                                                                </button>
                                                            </div>

                                                            {/* Content Textarea */}
                                                            <div className="relative">
                                                                <textarea
                                                                    value={section.content}
                                                                    onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
                                                                    placeholder="Section content (HTML supported)..."
                                                                    rows={8}
                                                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-y font-mono text-sm min-h-[200px]"
                                                                    aria-label="Section content"
                                                                />
                                                                <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                                                                    {section.content.length} chars
                                                                </span>
                                                            </div>

                                                            {/* Mobile Controls Row */}
                                                            <div className="flex items-center justify-between sm:hidden">
                                                                <label className="flex items-center gap-2 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={section.is_visible}
                                                                        onChange={(e) => handleSectionChange(section.id, 'is_visible', e.target.checked)}
                                                                        className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                    />
                                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Visible</span>
                                                                </label>
                                                                <button
                                                                    onClick={() => removeSection(section.id)}
                                                                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                                                    aria-label="Delete section"
                                                                    title="Delete section"
                                                                >
                                                                    <Trash2 className="h-5 w-5" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Desktop Controls */}
                                                        <div className="hidden sm:flex flex-col gap-2">
                                                            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={section.is_visible}
                                                                    onChange={(e) => handleSectionChange(section.id, 'is_visible', e.target.checked)}
                                                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                />
                                                                <span className="text-xs text-gray-500">Visible</span>
                                                            </label>
                                                            <button
                                                                onClick={() => removeSection(section.id)}
                                                                className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                                                aria-label="Delete section"
                                                                title="Delete section"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>

                                {sections.length === 0 && (
                                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                                        <Type className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500 dark:text-gray-400">No content sections yet</p>
                                        <Button variant="outline" size="sm" onClick={addSection} className="mt-4">
                                            <Plus className="h-4 w-4" />
                                            Add Your First Section
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div >
            </main >

            {/* Publish Confirmation Modal */}
            <PublishConfirmModal
                isOpen={showPublishModal}
                onClose={() => setShowPublishModal(false)}
                onConfirm={handlePublish}
                hasUnsavedChanges={hasChanges}
                lastPublishedAt={lastPublishedAt}
                isPublishing={isPublishing}
            />
        </div >
    );
}
