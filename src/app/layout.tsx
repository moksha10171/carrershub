import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "CareerHub - Build Your Branded Careers Page",
    description: "Create stunning, branded careers pages that help you attract top talent. Customize your company story and showcase open positions.",
    keywords: ["careers page", "job board", "recruitment", "hiring", "ATS"],
    icons: '/logo.png',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <a href="#main-content" className="skip-link">
                    Skip to main content
                </a>
                <Header />
                <main id="main-content">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
