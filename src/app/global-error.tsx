'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function GlobalError() {
    return (
        <html lang="en">
            <body>
                <div className="min-h-screen bg-gradient-to-b from-white dark:from-gray-950 to-gray-50 dark:to-gray-900 flex items-center justify-center p-6 sm:p-12">
                    <div className="max-w-2xl w-full text-center space-y-8">
                        <div className="relative">
                            <Image
                                src="/images/error-500.png"
                                alt="Critical Error"
                                width={400}
                                height={300}
                                className="mx-auto drop-shadow-lg"
                                priority
                            />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                500
                            </h1>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
                                Critical Server Error
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto leading-relaxed">
                                We're experiencing technical difficulties. Please refresh the page or try again later.
                            </p>
                        </div>

                        <div className="pt-4">
                            <Link href="/">
                                <Button size="lg" className="w-full sm:w-auto shadow-sm">
                                    <Home className="h-5 w-5 mr-2" />
                                    Return Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
