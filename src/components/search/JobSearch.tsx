'use client';

import React, { useState, useMemo } from 'react';
import { Search, MapPin, Briefcase, Filter, X } from 'lucide-react';
import type { Job } from '@/types';

interface JobSearchProps {
    jobs: Job[];
    onSearch?: (filteredJobs: Job[]) => void;
}

export function JobSearch({ jobs, onSearch }: JobSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedWorkPolicy, setSelectedWorkPolicy] = useState('');
    const [selectedExperience, setSelectedExperience] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Extract unique filter options
    const locations = useMemo(() =>
        Array.from(new Set(jobs.map(j => j.location))).sort(),
        [jobs]
    );

    const departments = useMemo(() =>
        Array.from(new Set(jobs.map(j => j.department))).sort(),
        [jobs]
    );

    const workPolicies = useMemo(() =>
        Array.from(new Set(jobs.map(j => j.work_policy))).sort(),
        [jobs]
    );

    const experienceLevels = useMemo(() =>
        Array.from(new Set(jobs.map(j => j.experience_level))).sort(),
        [jobs]
    );

    // Filter jobs based on search and filters
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesSearch = !searchQuery ||
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (job.skills_required && job.skills_required.some(skill =>
                    skill.toLowerCase().includes(searchQuery.toLowerCase())
                ));

            const matchesLocation = !selectedLocation || job.location === selectedLocation;
            const matchesDepartment = !selectedDepartment || job.department === selectedDepartment;
            const matchesWorkPolicy = !selectedWorkPolicy || job.work_policy === selectedWorkPolicy;
            const matchesExperience = !selectedExperience || job.experience_level === selectedExperience;

            return matchesSearch && matchesLocation && matchesDepartment &&
                matchesWorkPolicy && matchesExperience;
        });
    }, [jobs, searchQuery, selectedLocation, selectedDepartment, selectedWorkPolicy, selectedExperience]);

    // Call onSearch callback when filtered jobs change
    React.useEffect(() => {
        if (onSearch) {
            onSearch(filteredJobs);
        }
    }, [filteredJobs, onSearch]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedLocation('');
        setSelectedDepartment('');
        setSelectedWorkPolicy('');
        setSelectedExperience('');
    };

    const activeFilterCount = [
        selectedLocation,
        selectedDepartment,
        selectedWorkPolicy,
        selectedExperience,
    ].filter(Boolean).length;

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search jobs by title, department, location, or skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${showFilters || activeFilterCount > 0
                            ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                >
                    <Filter className="h-5 w-5" />
                    <span className="font-medium">Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-bold">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Filter Jobs</h3>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Location Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <MapPin className="h-4 w-4 inline mr-1" />
                                Location
                            </label>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none"
                            >
                                <option value="">All Locations</option>
                                {locations.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        {/* Department Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Briefcase className="h-4 w-4 inline mr-1" />
                                Department
                            </label>
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none"
                            >
                                <option value="">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        {/* Work Policy Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Work Policy
                            </label>
                            <select
                                value={selectedWorkPolicy}
                                onChange={(e) => setSelectedWorkPolicy(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none"
                            >
                                <option value="">All Policies</option>
                                {workPolicies.map(policy => (
                                    <option key={policy} value={policy}>{policy}</option>
                                ))}
                            </select>
                        </div>

                        {/* Experience Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Experience Level
                            </label>
                            <select
                                value={selectedExperience}
                                onChange={(e) => setSelectedExperience(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none"
                            >
                                <option value="">All Levels</option>
                                {experienceLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                    {searchQuery && ` matching "${searchQuery}"`}
                </span>
            </div>
        </div>
    );
}
