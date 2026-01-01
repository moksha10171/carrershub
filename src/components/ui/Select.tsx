'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
    icon?: React.ReactNode;
}

export function Select({
    label,
    options,
    icon,
    className,
    id,
    ...props
}: SelectProps) {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {icon}
                    </div>
                )}
                <select
                    id={selectId}
                    className={cn(
                        'w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-gray-900 transition-all duration-200',
                        'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
                        'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100',
                        'dark:focus:border-primary-400 dark:focus:ring-primary-400/20',
                        icon && 'pl-10',
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
