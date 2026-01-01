import { useEffect, useState } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * @returns boolean - true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        // Listen for changes
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return prefersReducedMotion;
}

/**
 * Get transition duration based on reduced motion preference
 * @param normalDuration - Duration in seconds when motion is allowed
 * @returns number - Duration adjusted for reduced motion (0 if reduced motion preferred)
 */
export function getTransitionDuration(normalDuration: number = 0.3): number {
    if (typeof window === 'undefined') return normalDuration;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prefersReducedMotion ? 0 : normalDuration;
}
