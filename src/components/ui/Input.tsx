'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export function Input({
    label,
    error,
    icon,
    className,
    id,
    ...props
}: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={cn(
                        'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-all duration-200',
                        'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
                        'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500',
                        'dark:focus:border-primary-400 dark:focus:ring-primary-400/20',
                        icon && 'pl-10',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-500" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
