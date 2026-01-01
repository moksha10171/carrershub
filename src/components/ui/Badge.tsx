import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
    icon?: React.ReactNode;
}

export function Badge({ children, variant = 'default', className, icon }: BadgeProps) {
    const variants: Record<BadgeVariant, string> = {
        default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
        primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
        success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                variants[variant],
                className
            )}
        >
            {icon}
            {children}
        </span>
    );
}

// Specialized badges for common use cases
export function WorkPolicyBadge({ policy }: { policy: string }) {
    const variant: BadgeVariant =
        policy === 'Remote' ? 'success' :
            policy === 'Hybrid' ? 'info' : 'default';

    return <Badge variant={variant}>{policy}</Badge>;
}

export function EmploymentTypeBadge({ type }: { type: string }) {
    const variant: BadgeVariant =
        type === 'Full time' ? 'primary' :
            type === 'Part time' ? 'warning' : 'default';

    return <Badge variant={variant}>{type}</Badge>;
}

export function ExperienceBadge({ level }: { level: string }) {
    return <Badge variant="default">{level}</Badge>;
}
