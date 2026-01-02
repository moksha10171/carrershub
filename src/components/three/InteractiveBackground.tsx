'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';

// Dynamically import FloatingParticles to avoid SSR issues
const FloatingParticles = dynamic(() => import('./FloatingParticles'), {
    ssr: false,
});

interface InteractiveBackgroundProps {
    className?: string;
}

export default function InteractiveBackground({ className = '' }: InteractiveBackgroundProps) {
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        setIsMobile(window.innerWidth < 768);
        setPrefersReducedMotion(
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        );

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Don't render on server or if user prefers reduced motion
    if (!mounted || prefersReducedMotion) {
        return (
            <div className={`absolute inset-0 z-0 ${className}`}>
                {/* Static fallback gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-pink-50/10 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-pink-950/10" />
            </div>
        );
    }

    const particleCount = isMobile ? 80 : 200;
    const repelRadius = isMobile ? 2 : 3;

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 z-0 ${className}`}
            style={{ touchAction: 'none' }}
        >
            <Canvas
                camera={{ position: [0, 0, 12], fov: 75 }}
                dpr={[1, 1.5]}
                gl={{
                    antialias: false,
                    alpha: true,
                    powerPreference: 'high-performance',
                }}
                style={{
                    background: 'transparent',
                }}
                eventSource={typeof document !== 'undefined' ? document.body : undefined}
                eventPrefix="page"
            >
                <Suspense fallback={null}>
                    <FloatingParticles
                        count={particleCount}
                        repelRadius={repelRadius}
                        repelStrength={0.12}
                    />
                    <ambientLight intensity={0.6} />
                </Suspense>
            </Canvas>
        </div>
    );
}
