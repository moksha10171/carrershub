'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white dark:from-gray-950 to-gray-50 dark:to-gray-900 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                <div className="mb-8">
                    <Image
                        src="/images/error-500.png"
                        alt="Server Error"
                        width={400}
                        height={300}
                        className="mx-auto"
                        priority
                    />
                </div>

                <h1 className="text-6xl sm:text-7xl font-extrabold text-gray-900 dark:text-white mb-4">
                    Oops!
                </h1>

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Something Went Wrong
                </h2>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                    We encountered an unexpected error. Don't worry, our team has been notified and we're working on it!
                </p>

                {error.digest && (
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 font-mono">
                        Error ID: {error.digest}
                    </p>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        size="lg"
                        onClick={reset}
                        className="w-full sm:w-auto"
                    >
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            <Home className="h-5 w-5 mr-2" />
                            Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
