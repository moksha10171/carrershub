import { JobListingSkeleton, ContentSectionSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Hero Skeleton */}
            <div className="relative min-h-[70vh] bg-gradient-to-br from-indigo-50 dark:from-indigo-900/20 to-white dark:to-gray-950 flex items-center justify-center">
                <div className="container mx-auto px-4 text-center">
                    <div className="animate-pulse space-y-6">
                        <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-2xl mx-auto"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto"></div>
                        <div className="flex gap-4 justify-center">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-32"></div>
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-32"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Sections Skeleton */}
            <ContentSectionSkeleton />
            <ContentSectionSkeleton />

            {/* Jobs Section Skeleton */}
            <div className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-8 animate-pulse"></div>
                    <JobListingSkeleton count={4} />
                </div>
            </div>
        </div>
    );
}
