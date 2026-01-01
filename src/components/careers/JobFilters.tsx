'use client';

import React from 'react';
import { Search, MapPin, Building2, Briefcase, Filter, X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { WORK_POLICIES, EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from '@/lib/constants';
import type { JobFilters } from '@/types';

interface JobFiltersProps {
    filters: JobFilters;
    onFilterChange: (filters: JobFilters) => void;
    locations: string[];
    departments: string[];
    totalJobs: number;
    filteredCount: number;
}

export function JobFiltersComponent({
    filters,
    onFilterChange,
    locations,
    departments,
    totalJobs,
    filteredCount,
}: JobFiltersProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const handleChange = (key: keyof JobFilters, value: string) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        onFilterChange({
            search: '',
            location: '',
            department: '',
            work_policy: '',
            employment_type: '',
            experience_level: '',
        });
        setIsExpanded(false);
    };

    const activeFilterCount = [
        filters.location,
        filters.department,
        filters.work_policy,
        filters.employment_type,
        filters.experience_level,
    ].filter(Boolean).length;

    const hasActiveFilters = activeFilterCount > 0 || filters.search;

    const locationOptions = [
        { value: '', label: 'All Locations' },
        ...locations.map(loc => ({ value: loc, label: loc })),
    ];

    const departmentOptions = [
        { value: '', label: 'All Departments' },
        ...departments.map(dept => ({ value: dept, label: dept })),
    ];

    const workPolicyOptions = [
        { value: '', label: 'All Work Policies' },
        ...WORK_POLICIES.map(policy => ({ value: policy, label: policy })),
    ];

    const employmentOptions = [
        { value: '', label: 'All Types' },
        ...EMPLOYMENT_TYPES.map(type => ({ value: type, label: type })),
    ];

    const experienceOptions = [
        { value: '', label: 'All Levels' },
        ...EXPERIENCE_LEVELS.map(level => ({ value: level, label: level })),
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Main Search Bar */}
            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <Input
                            placeholder="Search by job title..."
                            value={filters.search}
                            onChange={(e) => handleChange('search', e.target.value)}
                            icon={<Search className="h-5 w-5" />}
                            aria-label="Search jobs"
                            className="h-12"
                        />
                    </div>

                    {/* Desktop filters inline */}
                    <div className="hidden lg:flex gap-3">
                        <Select
                            options={locationOptions}
                            value={filters.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            icon={<MapPin className="h-4 w-4" />}
                            aria-label="Filter by location"
                            className="w-48"
                        />
                        <Select
                            options={departmentOptions}
                            value={filters.department}
                            onChange={(e) => handleChange('department', e.target.value)}
                            icon={<Building2 className="h-4 w-4" />}
                            aria-label="Filter by department"
                            className="w-48"
                        />
                    </div>

                    {/* Mobile/Tablet filter toggle */}
                    <div className="flex gap-2 lg:hidden">
                        <Button
                            variant="outline"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex-1 sm:flex-none h-12"
                            aria-expanded={isExpanded}
                            aria-controls="filter-panel"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            <span>Filters</span>
                            {activeFilterCount > 0 && (
                                <span className="ml-1 px-2 py-0.5 text-xs bg-primary-500 text-white rounded-full">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                        {hasActiveFilters && (
                            <Button variant="ghost" onClick={clearFilters} className="h-12 px-3">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Expandable Filter Panel */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        id="filter-panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-200 dark:border-gray-700 overflow-hidden lg:hidden"
                    >
                        <div className="p-4 sm:p-6 pt-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Select
                                    label="Location"
                                    options={locationOptions}
                                    value={filters.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    icon={<MapPin className="h-4 w-4" />}
                                    aria-label="Filter by location"
                                />
                                <Select
                                    label="Department"
                                    options={departmentOptions}
                                    value={filters.department}
                                    onChange={(e) => handleChange('department', e.target.value)}
                                    icon={<Building2 className="h-4 w-4" />}
                                    aria-label="Filter by department"
                                />
                                <Select
                                    label="Work Policy"
                                    options={workPolicyOptions}
                                    value={filters.work_policy}
                                    onChange={(e) => handleChange('work_policy', e.target.value)}
                                    aria-label="Filter by work policy"
                                />
                                <Select
                                    label="Employment Type"
                                    options={employmentOptions}
                                    value={filters.employment_type}
                                    onChange={(e) => handleChange('employment_type', e.target.value)}
                                    icon={<Briefcase className="h-4 w-4" />}
                                    aria-label="Filter by employment type"
                                />
                                <Select
                                    label="Experience Level"
                                    options={experienceOptions}
                                    value={filters.experience_level}
                                    onChange={(e) => handleChange('experience_level', e.target.value)}
                                    aria-label="Filter by experience level"
                                    className="sm:col-span-2"
                                />
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-sm text-gray-500">
                                    {filteredCount} of {totalJobs} jobs
                                </span>
                                {hasActiveFilters && (
                                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                                        Clear all filters
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop additional filters */}
            <div className="hidden lg:block border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-3">
                        <Select
                            options={workPolicyOptions}
                            value={filters.work_policy}
                            onChange={(e) => handleChange('work_policy', e.target.value)}
                            aria-label="Filter by work policy"
                            className="w-40"
                        />
                        <Select
                            options={employmentOptions}
                            value={filters.employment_type}
                            onChange={(e) => handleChange('employment_type', e.target.value)}
                            aria-label="Filter by employment type"
                            className="w-36"
                        />
                        <Select
                            options={experienceOptions}
                            value={filters.experience_level}
                            onChange={(e) => handleChange('experience_level', e.target.value)}
                            aria-label="Filter by experience level"
                            className="w-36"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                            Showing <strong className="text-gray-700 dark:text-gray-300">{filteredCount}</strong> of {totalJobs} positions
                        </span>
                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                <X className="h-4 w-4" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
