'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function GlobalError() {
    return (
        <html>
            <body>
                <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
                    <div className="max-w-2xl w-full text-center">
                        <div className="mb-8">
                            <Image
                                src="/images/error-500.png"
                                alt="Critical Error"
                                width={400}
                                height={300}
                                className="mx-auto"
                                priority
                            />
                        </div>

                        <h1 className="text-6xl sm:text-7xl font-extrabold text-gray-900 mb-4">
                            500
                        </h1>

                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                            Critical Server Error
                        </h2>

                        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                            We're experiencing technical difficulties. Please try refreshing the page or come back later.
                        </p>

                        <Link href="/">
                            <Button size="lg">
                                <Home className="h-5 w-5 mr-2" />
                                Return Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    );
}
