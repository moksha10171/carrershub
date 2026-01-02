'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
    count?: number;
    repelRadius?: number;
    repelStrength?: number;
}

export default function FloatingParticles({
    count = 400,
    repelRadius = 2.5,
    repelStrength = 0.08,
}: FloatingParticlesProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { mouse, viewport } = useThree();

    // Create particle data with smooth floating properties
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            // Spread particles across viewport
            const x = (Math.random() - 0.5) * 35;
            const y = (Math.random() - 0.5) * 35;
            const z = (Math.random() - 0.5) * 15 - 5;

            // Random rotation for dash orientation
            const rotationX = Math.random() * Math.PI * 2;
            const rotationY = Math.random() * Math.PI * 2;
            const rotationZ = Math.random() * Math.PI * 2;

            temp.push({
                position: new THREE.Vector3(x, y, z),
                originalPosition: new THREE.Vector3(x, y, z),
                velocity: new THREE.Vector3(0, 0, 0),
                // Scale for tiny dashes
                scale: 0.5 + Math.random() * 0.5,
                // Upward speed (liftoff)
                riseSpeed: 0.01 + Math.random() * 0.03,
                rotateSpeed: (Math.random() - 0.5) * 0.02,
                rotation: new THREE.Euler(rotationX, rotationY, rotationZ),
                colorIndex: Math.floor(Math.random() * 5),
                // Random offset for sine wave motion
                timeOffset: Math.random() * 100,
            });
        }
        return temp;
    }, [count]);

    // Project Indigo themed palette
    const colors = useMemo(() => {
        const palette = [
            new THREE.Color('#6366f1'), // primary-500
            new THREE.Color('#818cf8'), // primary-400
            new THREE.Color('#a5b4fc'), // primary-300
            new THREE.Color('#c7d2fe'), // primary-200
            new THREE.Color('#4f46e5'), // primary-600
        ];
        return particles.map(p => palette[p.colorIndex]);
    }, [particles]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Initialize instance colors once on mount
    useEffect(() => {
        if (!meshRef.current) return;

        // Set colors for all instances
        colors.forEach((color, i) => {
            meshRef.current!.setColorAt(i, color);
        });

        // Mark as needing update
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    }, [colors]);


    useFrame((state) => {
        if (!meshRef.current) return;

        // Smooth mouse tracking
        const mouseX = (mouse.x * viewport.width) / 2;
        const mouseY = (mouse.y * viewport.height) / 2;

        const time = state.clock.elapsedTime;

        particles.forEach((particle, i) => {
            // LIFTOFF MOVEMENT: Constant upward rise
            particle.position.y += particle.riseSpeed;

            // RESET LOGIC: If goes above top, reset to bottom
            if (particle.position.y > 20) {
                particle.position.y = -20;
                particle.position.x = (Math.random() - 0.5) * 35;
            }

            // Mouse Repulsion
            const dx = particle.position.x - mouseX;
            const dy = particle.position.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < repelRadius) {
                const force = (repelRadius - distance) / repelRadius;
                const angle = Math.atan2(dy, dx);
                particle.velocity.x += Math.cos(angle) * force * 0.05;
                particle.velocity.y += Math.sin(angle) * force * 0.05;
            }

            // Apply velocity and dampen
            particle.position.x += particle.velocity.x;
            particle.position.y += particle.velocity.y;
            particle.velocity.x *= 0.95;
            particle.velocity.y *= 0.95;

            // Gentle Sine Wave Drift
            particle.position.x += Math.sin(time * 0.5 + particle.timeOffset) * 0.005;

            // Rotate particles
            particle.rotation.x += particle.rotateSpeed;
            particle.rotation.y += particle.rotateSpeed;

            // Update dummy object
            dummy.position.copy(particle.position);

            // Scale: Thin dashes
            dummy.scale.set(
                particle.scale * 0.05, // Thin width
                particle.scale * 0.4,  // Long dash
                particle.scale * 0.05  // Thin depth
            );

            dummy.rotation.copy(particle.rotation);
            dummy.updateMatrix();

            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            {/* Capsule geometry for smooth rounded edges - radius, length, capSegments, radialSegments */}
            <capsuleGeometry args={[0.15, 0.6, 8, 12]} />
            <meshBasicMaterial
                transparent
                opacity={0.9}
                toneMapped={false}
            />
        </instancedMesh>
    );
}
