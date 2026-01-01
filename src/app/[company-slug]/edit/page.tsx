'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
    Palette, Image, Type, Video, GripVertical, Plus, Trash2, Eye,
    Save, ChevronLeft, Check, AlertCircle, Upload, Link as LinkIcon
} from 'lucide-react';
import { demoCompany, demoSettings, demoSections } from '@/lib/data';
import { createClient } from '@/lib/supabase/client';

interface ContentSectionEdit {
    id: string;
    title: string;
    type: string;
    content: string;
    is_visible: boolean;
}

export default function EditPage({ params }: { params: { 'company-slug': string } }) {
    const companySlug = params['company-slug'];
    const router = useRouter();
    const supabase = createClient();
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
        companyName: demoCompany.name,
        tagline: demoCompany.tagline || '',
        website: demoCompany.website || '',
        primaryColor: demoSettings.primary_color,
        secondaryColor: demoSettings.secondary_color,
        accentColor: demoSettings.accent_color,
        logoUrl: demoCompany.logo_url || '',
        bannerUrl: demoCompany.banner_url || '',
        cultureVideoUrl: demoSettings.culture_video_url || '',
    });

    // Content sections state
    const [sections, setSections] = useState<ContentSectionEdit[]>(
        demoSections.map(s => ({
            id: s.id,
            title: s.title,
            type: s.type,
            content: s.content || '',
            is_visible: s.is_visible,
        }))
    );

    const [activeTab, setActiveTab] = useState<'branding' | 'content' | 'seo'>('branding');

    // Show loading state while checking auth
    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Fetch data on mount - try LocalStorage first, then API
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Check LocalStorage first
                const savedData = localStorage.getItem(`company_${companySlug}`);
                if (savedData) {
                    const data = JSON.parse(savedData);
                    setBrandSettings({
                        companyName: data.company.name,
                        tagline: data.company.tagline || '',
                        website: data.company.website || '',
                        primaryColor: data.settings.primary_color,
                        secondaryColor: data.settings.secondary_color,
                        accentColor: data.settings.accent_color,
                        logoUrl: data.company.logo_url || '',
                        bannerUrl: data.company.banner_url || '',
                        cultureVideoUrl: data.settings.culture_video_url || '',
                    });
                    setSections(data.sections || []);
                    return;
                }

                // Fallback to API/demo data
                const response = await fetch(`/api/companies?slug=${companySlug}`);
                const apiData = await response.json();
                if (apiData.success && apiData.data) {
                    const { company, settings, sections: apiSections } = apiData.data;
                    setBrandSettings({
                        companyName: company.name,
                        tagline: company.tagline || '',
                        website: company.website || '',
                        primaryColor: settings.primary_color,
                        secondaryColor: settings.secondary_color,
                        accentColor: settings.accent_color,
                        logoUrl: company.logo_url || '',
                        bannerUrl: company.banner_url || '',
                        cultureVideoUrl: settings.culture_video_url || '',
                    });
                    setSections(apiSections.map((s: any) => ({
                        id: s.id,
                        title: s.title,
                        type: s.type,
                        content: s.content || '',
                        is_visible: s.is_visible,
                    })));
                }
            } catch (error) {
                console.error('Failed to fetch company data:', error);
            }
        };
        fetchData();
    }, [companySlug]);

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
            content: '<p>Add your content here...</p>',
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
        setIsSaving(true);
        try {
            // Save to LocalStorage for demo mode
            const companyData = {
                company: {
                    name: brandSettings.companyName,
                    tagline: brandSettings.tagline,
                    website: brandSettings.website,
                    logo_url: brandSettings.logoUrl,
                    banner_url: brandSettings.bannerUrl,
                },
                settings: {
                    primary_color: brandSettings.primaryColor,
                    secondary_color: brandSettings.secondaryColor,
                    accent_color: brandSettings.accentColor,
                    culture_video_url: brandSettings.cultureVideoUrl,
                },
                sections: sections.map((s, idx) => ({
                    ...s,
                    display_order: idx + 1,
                })),
            };

            // Save to LocalStorage
            localStorage.setItem(`company_${companySlug}`, JSON.stringify(companyData));

            // Optionally, also try to save to backend (will gracefully fail in demo mode)
            await fetch('/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_company',
                    slug: companySlug,
                    ...companyData,
                }),
            }).catch(() => {
                // Silently fail - we're in demo mode
                console.log('Backend update skipped - demo mode');
            });

            setSaveSuccess(true);
            setHasChanges(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to save changes:', error);
            alert('Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'branding', label: 'Branding', icon: Palette },
        { id: 'content', label: 'Content', icon: Type },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <main className="pt-20 pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </Link>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    Edit Careers Page
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Customize your company&apos;s careers page
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/techcorp/preview">
                                <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                    Preview
                                </Button>
                            </Link>
                            <Button
                                size="sm"
                                onClick={handleSave}
                                isLoading={isSaving}
                                disabled={!hasChanges}
                            >
                                {saveSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                                {saveSuccess ? 'Saved!' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>

                    {/* Unsaved Changes Alert */}
                    {hasChanges && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-2"
                        >
                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <span className="text-sm text-amber-700 dark:text-amber-300">You have unsaved changes</span>
                        </motion.div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
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
                    {activeTab === 'branding' && (
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
                                    <div className="grid grid-cols-3 gap-4">
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
                                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                                                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500">Click or drag to upload</p>
                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
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
                                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                                                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500">1920x600 recommended</p>
                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
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
                    )}

                    {/* Content Tab */}
                    {activeTab === 'content' && (
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
                                        <Card className="cursor-move">
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                        <GripVertical className="h-5 w-5" />
                                                    </div>

                                                    <div className="flex-1 space-y-4">
                                                        <div className="flex items-center gap-4">
                                                            <Input
                                                                value={section.title}
                                                                onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                                                                placeholder="Section Title"
                                                                className="font-medium"
                                                            />
                                                            <select
                                                                value={section.type}
                                                                onChange={(e) => handleSectionChange(section.id, 'type', e.target.value)}
                                                                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                                                            >
                                                                <option value="about">About</option>
                                                                <option value="culture">Culture</option>
                                                                <option value="benefits">Benefits</option>
                                                                <option value="values">Values</option>
                                                                <option value="team">Team</option>
                                                                <option value="custom">Custom</option>
                                                            </select>
                                                        </div>

                                                        <textarea
                                                            value={section.content}
                                                            onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
                                                            placeholder="Section content (HTML supported)..."
                                                            rows={4}
                                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none font-mono text-sm"
                                                        />
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <label className="flex items-center gap-2 cursor-pointer">
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
                                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
                    )}

                    {/* Demo Notice */}
                    <div className="mt-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                            <strong>Demo Mode:</strong> Changes are saved locally. In production, data would persist to Supabase.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
