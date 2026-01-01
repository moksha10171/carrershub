'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
    return (
        <div
            className={cn(
                'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm',
                hover && 'transition-all duration-200 hover:shadow-lg hover:border-primary-500/50 cursor-pointer hover:-translate-y-0.5',
                onClick && 'cursor-pointer',
                className
            )}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
    return (
        <div className={cn('mb-4', className)}>
            {children}
        </div>
    );
}

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export function CardTitle({ children, className, as: Component = 'h3' }: CardTitleProps) {
    return (
        <Component className={cn('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}>
            {children}
        </Component>
    );
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
    return (
        <div className={cn('text-gray-600 dark:text-gray-300', className)}>
            {children}
        </div>
    );
}
