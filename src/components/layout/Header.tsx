'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

import { createClient } from '@/lib/supabase/client';

interface HeaderProps {
    variant?: 'transparent' | 'solid';
    showDarkModeToggle?: boolean;
}

export function Header({ variant = 'solid', showDarkModeToggle = true }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);

        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        checkAuth();

        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Initialize dark mode from localStorage or system preference
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

            setIsDark(shouldBeDark);
            document.documentElement.classList.toggle('dark', shouldBeDark);
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleDarkMode = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        document.documentElement.classList.toggle('dark', newDark);
        localStorage.setItem('theme', newDark ? 'dark' : 'light');
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/search', label: 'Search' },
        { href: '/blog', label: 'Blog' },
        { href: '/contact', label: 'Contact' },
    ];

    const isTransparent = variant === 'transparent' && !isScrolled;

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isTransparent
                    ? 'bg-transparent'
                    : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm'
            )}
        >
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-18">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <img
                            src="/logo.png"
                            alt="CareerHub"
                            className="h-8 w-8 rounded-lg"
                        />
                        <span className={cn(
                            'text-lg sm:text-xl font-bold transition-colors',
                            isTransparent ? 'text-white' : 'text-gray-900 dark:text-white'
                        )}>
                            CareerHub
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6 lg:gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400',
                                    isTransparent
                                        ? 'text-white/90 hover:text-white'
                                        : 'text-gray-600 dark:text-gray-300'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Search Button */}
                        <Link href="/search" className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Search">
                            <Search className="h-5 w-5" />
                        </Link>

                        {showDarkModeToggle && (
                            <button
                                onClick={toggleDarkMode}
                                className={cn(
                                    'p-2 rounded-lg transition-colors',
                                    isTransparent
                                        ? 'text-white/90 hover:bg-white/10'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                )}
                                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                        )}

                        {!loading && user ? (
                            <div className="hidden sm:flex items-center gap-3">
                                <Link href="/dashboard">
                                    <Button variant={isTransparent ? 'secondary' : 'primary'} size="sm">
                                        Dashboard
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-3">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className={isTransparent ? 'text-white hover:bg-white/20' : ''}>
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button variant={isTransparent ? 'secondary' : 'primary'} size="sm">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={cn(
                                'md:hidden p-2 rounded-lg transition-colors',
                                isTransparent
                                    ? 'text-white hover:bg-white/10'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                            aria-label="Toggle menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                        >
                            <div className="py-4 space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-4 py-2.5 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="px-4 pt-2">
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full">Get Started</Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}
