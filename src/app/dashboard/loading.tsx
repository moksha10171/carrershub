import { DashboardStatSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header Skeleton */}
            <div className="h-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"></div>

            <main className="pt-24 pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header Skeleton */}
                    <div className="animate-pulse mb-8">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
                    </div>

                    {/* URL Banner Skeleton */}
                    <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-8 animate-pulse"></div>

                    {/* Stats Grid Skeleton */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        <DashboardStatSkeleton />
                        <DashboardStatSkeleton />
                        <DashboardStatSkeleton />
                        <DashboardStatSkeleton />
                    </div>

                    {/* Quick Actions Skeleton */}
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-40 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse"></div>
                        ))}
                    </div>

                    {/* Recent Activity Skeleton */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {[1, 2].map(i => (
                            <div key={i} className="h-64 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
