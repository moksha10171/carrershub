'use client';

import React, { Suspense } from 'react';
import { SearchPageClient } from '@/components/search/SearchPageClient';

// Wrap in Suspense for useSearchParams
function SearchContent() {
    return (
        <SearchPageClient
            initialJobs={[]}
            initialCompanies={[]}
            initialQuery=""
        />
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
