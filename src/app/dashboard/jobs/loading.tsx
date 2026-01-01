import { JobListingSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="h-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"></div>

            <main className="pt-20 pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Header Skeleton */}
                    <div className="animate-pulse mb-6">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>

                    {/* Filters Skeleton */}
                    <div className="flex gap-4 mb-6 animate-pulse">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                    </div>

                    {/* Table Skeleton */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse">
                        <div className="p-4 space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                    <div className="flex-1">
                                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                                    </div>
                                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
