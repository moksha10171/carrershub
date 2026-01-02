export default function BlogPostLoading() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                {/* Back Button Skeleton */}
                <div className="w-32 h-10 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />

                {/* Header Skeleton */}
                <div className="text-center mb-12 space-y-6">
                    <div className="flex justify-center gap-4">
                        <div className="w-20 h-6 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
                        <div className="w-24 h-6 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
                    </div>

                    <div className="h-12 w-3/4 mx-auto bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                    <div className="h-12 w-1/2 mx-auto bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />

                    <div className="flex justify-center items-center gap-3 pt-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                        <div className="w-32 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6 animate-pulse" />

                    <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse my-8" />

                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-4/5 animate-pulse" />
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full animate-pulse" />
                </div>
            </div>
        </div>
    );
}
