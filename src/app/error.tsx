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
        <div className="min-h-screen bg-gradient-to-b from-white dark:from-gray-950 to-gray-50 dark:to-gray-900 flex items-center justify-center p-6 sm:p-12">
            <div className="max-w-2xl w-full text-center space-y-8">
                <div className="relative">
                    <Image
                        src="/images/error-500.png"
                        alt="Server Error"
                        width={400}
                        height={300}
                        className="mx-auto drop-shadow-lg"
                        priority
                    />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Something Went Wrong
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto leading-relaxed">
                        We encountered an unexpected error. Don't worry, our team has been notified and we're working on it!
                    </p>
                    {error.digest && (
                        <p className="text-sm text-gray-400 dark:text-gray-500 font-mono bg-gray-100 dark:bg-gray-800 inline-block px-3 py-1 rounded">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button
                        size="lg"
                        onClick={reset}
                        className="w-full sm:w-auto shadow-sm"
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
