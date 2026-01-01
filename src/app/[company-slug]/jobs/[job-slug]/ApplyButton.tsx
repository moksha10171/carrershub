'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApplyButtonProps {
    jobTitle: string;
    companyName: string;
    description?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ApplyButton({ jobTitle, companyName, description = 'Apply Now', className, size = 'lg' }: ApplyButtonProps) {
    const [isApplied, setIsApplied] = useState(false);
    const [isApplying, setIsApplying] = useState(false);

    const handleApply = async () => {
        setIsApplying(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsApplying(false);
        setIsApplied(true);

        // Reset after 3 seconds so they can see the button again? 
        // Or keep it applied. For demo, keeping it applied is better feedback.
    };

    if (isApplied) {
        return (
            <Button
                size={size}
                className={`bg-green-600 hover:bg-green-700 text-white cursor-default ${className}`}
                disabled
            >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Application Sent
            </Button>
        );
    }

    return (
        <Button
            size={size}
            className={className}
            onClick={handleApply}
            isLoading={isApplying}
        >
            {description}
            <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
    );
}
