'use client';

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import FloatingParticles from './FloatingParticles';

interface InteractiveBackgroundProps {
    className?: string;
}

export default function InteractiveBackground({ className = '' }: InteractiveBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isReducedMotion, setIsReducedMotion] = useState(false);

    useEffect(() => {
        // Check for mobile device
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Check for reduced motion preference
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setIsReducedMotion(motionQuery.matches);

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fewer particles on mobile, respect motion preferences
    const particleCount = isReducedMotion ? 0 : isMobile ? 120 : 300;
    const repelRadius = isMobile ? 1.5 : 2.5;

    // Skip rendering if user prefers reduced motion
    if (isReducedMotion) {
        return (
            <div
                className={`absolute inset-0 z-0 ${className}`}
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.03) 0%, transparent 70%)',
                }}
            />
        );
    }

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 z-0 ${className}`}
            style={{ touchAction: 'none' }}
        >
            <Canvas
                camera={{
                    position: [0, 0, 12],
                    fov: 60,
                    near: 0.1,
                    far: 100,
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                }}
                dpr={[1, 1.5]} // Better quality on retina
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <FloatingParticles
                        count={particleCount}
                        repelRadius={repelRadius}
                        repelStrength={0.08}
                    />
                    {/* Subtle ambient light for visibility */}
                    <ambientLight intensity={0.5} />
                </Suspense>
            </Canvas>
        </div>
    );
}
