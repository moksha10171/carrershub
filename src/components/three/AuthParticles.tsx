'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface AuthParticlesProps {
    count?: number;
    isDark?: boolean;
}

export default function AuthParticles({
    count = 200,
    isDark = false,
}: AuthParticlesProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { viewport } = useThree();

    // Create particle data with smooth floating properties
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            // Spread particles across viewport - more spread out
            const x = (Math.random() - 0.5) * 40;
            const y = (Math.random() - 0.5) * 40;
            const z = (Math.random() - 0.5) * 20 - 8;

            temp.push({
                position: new THREE.Vector3(x, y, z),
                // Scale for tiny dots/spheres
                scale: 0.3 + Math.random() * 0.6,
                // Upward speed (gentle liftoff)
                riseSpeed: 0.005 + Math.random() * 0.015,
                // Random offset for sine wave motion
                timeOffset: Math.random() * 100,
                // Slight horizontal drift
                driftSpeed: (Math.random() - 0.5) * 0.01,
                // Opacity variation
                opacity: 0.4 + Math.random() * 0.4,
            });
        }
        return temp;
    }, [count]);

    // Theme-aware color palette
    const colors = useMemo(() => {
        const lightPalette = [
            new THREE.Color('#6366f1'), // indigo-500
            new THREE.Color('#4f46e5'), // indigo-600
            new THREE.Color('#4338ca'), // indigo-700
            new THREE.Color('#818cf8'), // indigo-400
            new THREE.Color('#a855f7'), // purple-500
        ];
        const darkPalette = [
            new THREE.Color('#818cf8'), // indigo-400
            new THREE.Color('#a5b4fc'), // indigo-300
            new THREE.Color('#c4b5fd'), // violet-300
            new THREE.Color('#c7d2fe'), // indigo-200
            new THREE.Color('#ddd6fe'), // violet-200
        ];
        const palette = isDark ? darkPalette : lightPalette;
        return particles.map(() => palette[Math.floor(Math.random() * palette.length)]);
    }, [particles, isDark]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Initialize instance colors once on mount
    useEffect(() => {
        if (!meshRef.current) return;

        colors.forEach((color, i) => {
            meshRef.current!.setColorAt(i, color);
        });

        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    }, [colors]);

    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.elapsedTime;

        particles.forEach((particle, i) => {
            // LIFTOFF MOVEMENT: Gentle upward rise
            particle.position.y += particle.riseSpeed;

            // Horizontal drift with sine wave
            particle.position.x += Math.sin(time * 0.3 + particle.timeOffset) * 0.002 + particle.driftSpeed;

            // RESET LOGIC: If goes above top, reset to bottom
            if (particle.position.y > 22) {
                particle.position.y = -22;
                particle.position.x = (Math.random() - 0.5) * 40;
            }

            // Update dummy object
            dummy.position.copy(particle.position);

            // Small spheres with slight size variation based on depth
            const depthScale = 1 + (particle.position.z + 8) * 0.03;
            const size = particle.scale * depthScale * 0.15;
            dummy.scale.set(size, size, size);

            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial
                transparent
                opacity={isDark ? 0.8 : 0.6}
                toneMapped={false}
            />
        </instancedMesh>
    );
}
