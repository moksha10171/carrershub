export default function BlogLoading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-32 pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Skeleton */}
                <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
                    <div className="h-12 w-3/4 mx-auto bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                    <div className="h-6 w-1/2 mx-auto bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                </div>

                {/* Grid Skeleton */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 h-[400px]">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                            <div className="p-6 space-y-4">
                                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
