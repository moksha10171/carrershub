'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CompanySettings } from '@/types';

export function ThemeSetup({ settings }: { settings: CompanySettings }) {
    const [isDark, setIsDark] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    // Initialize dark mode
    React.useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setIsDark(storedTheme === 'dark');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(settings.dark_mode_enabled && prefersDark);
        }
        setMounted(true);
    }, [settings.dark_mode_enabled]);

    // Apply dark mode class
    React.useEffect(() => {
        if (!mounted) return;
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark, mounted]);

    // Generate custom CSS variables for theming
    const customStyles = `
    :root {
      --primary-50: ${settings.primary_color}10;
      --primary-100: ${settings.primary_color}20;
      --primary-200: ${settings.primary_color}40;
      --primary-300: ${settings.primary_color}60;
      --primary-400: ${settings.primary_color}80;
      --primary-500: ${settings.primary_color};
      --primary-600: ${settings.secondary_color};
      --primary-700: ${settings.secondary_color}dd;
      --primary-800: ${settings.secondary_color}bb;
      --primary-900: ${settings.secondary_color}99;
    }
    `;

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    };

    if (!mounted) return null;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: customStyles }} />
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                onClick={toggleTheme}
                className="fixed top-24 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                <AnimatePresence mode="wait">
                    {isDark ? (
                        <motion.div
                            key="sun"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sun className="h-5 w-5 text-amber-500" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="moon"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Moon className="h-5 w-5 text-gray-700" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </>
    );
}
