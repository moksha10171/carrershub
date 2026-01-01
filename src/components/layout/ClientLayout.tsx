'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main id="main-content">
                {children}
            </main>
            <Footer />
        </>
    );
}
