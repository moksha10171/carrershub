'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
    count?: number;
    repelRadius?: number;
    repelStrength?: number;
}

export default function FloatingParticles({
    count = 200,
    repelRadius = 3,
    repelStrength = 0.12,
}: FloatingParticlesProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { mouse, viewport } = useThree();

    // Create particle data
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            // Spread particles across a wider area
            const x = (Math.random() - 0.5) * 25;
            const y = (Math.random() - 0.5) * 18;
            const z = (Math.random() - 0.5) * 8 - 2; // Push back slightly

            temp.push({
                position: new THREE.Vector3(x, y, z),
                originalPosition: new THREE.Vector3(x, y, z),
                velocity: new THREE.Vector3(0, 0, 0),
                scale: 0.08 + Math.random() * 0.18,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeed: 0.3 + Math.random() * 0.4,
            });
        }
        return temp;
    }, [count]);

    // Create colors for particles
    const colors = useMemo(() => {
        const palette = [
            new THREE.Color('#6366f1'), // Indigo
            new THREE.Color('#8b5cf6'), // Purple
            new THREE.Color('#a855f7'), // Lighter purple
            new THREE.Color('#818cf8'), // Light indigo
            new THREE.Color('#c084fc'), // Pink-purple
        ];
        return particles.map(() => palette[Math.floor(Math.random() * palette.length)]);
    }, [particles]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Convert mouse to world coordinates
        const mouseX = (mouse.x * viewport.width) / 2;
        const mouseY = (mouse.y * viewport.height) / 2;
        const mousePos = new THREE.Vector3(mouseX, mouseY, 0);

        const time = state.clock.elapsedTime;

        particles.forEach((particle, i) => {
            // Calculate distance to mouse
            const dx = particle.position.x - mousePos.x;
            const dy = particle.position.y - mousePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Mouse repulsion effect
            if (distance < repelRadius && distance > 0.01) {
                const force = Math.pow((repelRadius - distance) / repelRadius, 2);
                const angle = Math.atan2(dy, dx);
                particle.velocity.x += Math.cos(angle) * force * repelStrength;
                particle.velocity.y += Math.sin(angle) * force * repelStrength;
            }

            // Apply velocity with damping
            particle.position.x += particle.velocity.x;
            particle.position.y += particle.velocity.y;
            particle.velocity.x *= 0.92;
            particle.velocity.y *= 0.92;

            // Return to original position (spring effect)
            const returnSpeed = 0.02;
            particle.position.x += (particle.originalPosition.x - particle.position.x) * returnSpeed;
            particle.position.y += (particle.originalPosition.y - particle.position.y) * returnSpeed;
            particle.position.z += (particle.originalPosition.z - particle.position.z) * returnSpeed;

            // Gentle floating animation
            const floatY = Math.sin(time * particle.floatSpeed + particle.floatOffset) * 0.15;
            const floatX = Math.cos(time * particle.floatSpeed * 0.7 + particle.floatOffset) * 0.08;

            // Update instance matrix
            dummy.position.set(
                particle.position.x + floatX,
                particle.position.y + floatY,
                particle.position.z
            );
            dummy.scale.setScalar(particle.scale);
            dummy.rotation.x = time * particle.rotationSpeed;
            dummy.rotation.y = time * particle.rotationSpeed * 1.3;
            dummy.updateMatrix();

            meshRef.current!.setMatrixAt(i, dummy.matrix);

            // Set color per instance
            meshRef.current!.setColorAt(i, colors[i]);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshBasicMaterial
                transparent
                opacity={0.5}
                vertexColors
            />
        </instancedMesh>
    );
}
