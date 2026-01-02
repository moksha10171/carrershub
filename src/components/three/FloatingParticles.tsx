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
    count = 300,
    repelRadius = 2.5,
    repelStrength = 0.08,
}: FloatingParticlesProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { mouse, viewport } = useThree();

    // Create particle data with smooth floating properties
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            // Spread particles across viewport with depth variation
            const x = (Math.random() - 0.5) * 30;
            const y = (Math.random() - 0.5) * 22;
            const z = (Math.random() - 0.5) * 6 - 3;

            // Random rotation for dash orientation
            const rotationX = Math.random() * Math.PI * 2;
            const rotationY = Math.random() * Math.PI * 2;
            const rotationZ = Math.random() * Math.PI * 2;

            temp.push({
                position: new THREE.Vector3(x, y, z),
                originalPosition: new THREE.Vector3(x, y, z),
                velocity: new THREE.Vector3(0, 0, 0),
                // Very small scale for delicate look (tiny dashes)
                scale: 0.015 + Math.random() * 0.025,
                // Width multiplier for dash shape
                widthScale: 0.3 + Math.random() * 0.4,
                // Slow, organic rotation
                rotationSpeed: (Math.random() - 0.5) * 0.3,
                rotation: new THREE.Euler(rotationX, rotationY, rotationZ),
                // Unique float parameters for organic movement
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeedX: 0.15 + Math.random() * 0.25,
                floatSpeedY: 0.2 + Math.random() * 0.3,
                floatAmplitudeX: 0.03 + Math.random() * 0.05,
                floatAmplitudeY: 0.04 + Math.random() * 0.06,
                // Autonomousslow drift
                driftX: (Math.random() - 0.5) * 0.002,
                driftY: (Math.random() - 0.5) * 0.001,
                // Color variation index
                colorIndex: Math.floor(Math.random() * 5),
                // Opacity for depth effect
                baseOpacity: 0.5 + Math.random() * 0.4,
            });
        }
        return temp;
    }, [count]);

    // Elegant blue color palette (matching reference)
    const colors = useMemo(() => {
        const palette = [
            new THREE.Color('#6366f1'), // Indigo
            new THREE.Color('#818cf8'), // Light indigo
            new THREE.Color('#a5b4fc'), // Lighter indigo
            new THREE.Color('#8b5cf6'), // Purple
            new THREE.Color('#7c3aed'), // Vivid purple
        ];
        return particles.map(p => palette[p.colorIndex]);
    }, [particles]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.elapsedTime;

        // Smooth mouse tracking with lerping
        const mouseX = (mouse.x * viewport.width) / 2;
        const mouseY = (mouse.y * viewport.height) / 2;

        particles.forEach((particle, i) => {
            // Calculate distance to mouse
            const dx = particle.position.x - mouseX;
            const dy = particle.position.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Smooth mouse repulsion with easing
            if (distance < repelRadius && distance > 0.01) {
                const normalizedDist = distance / repelRadius;
                // Smooth cubic falloff for natural feel
                const force = Math.pow(1 - normalizedDist, 3) * repelStrength;
                const angle = Math.atan2(dy, dx);
                particle.velocity.x += Math.cos(angle) * force;
                particle.velocity.y += Math.sin(angle) * force;
            }

            // Apply velocity with heavy damping for smoothness
            particle.position.x += particle.velocity.x;
            particle.position.y += particle.velocity.y;
            particle.velocity.x *= 0.96;
            particle.velocity.y *= 0.96;

            // Very soft spring back to original position
            const returnSpeed = 0.008;
            particle.position.x += (particle.originalPosition.x - particle.position.x) * returnSpeed;
            particle.position.y += (particle.originalPosition.y - particle.position.y) * returnSpeed;
            particle.position.z += (particle.originalPosition.z - particle.position.z) * returnSpeed * 0.5;

            // Gentle autonomous drift (makes particles feel alive)
            particle.originalPosition.x += particle.driftX;
            particle.originalPosition.y += particle.driftY;

            // Wrap around edges for infinite feel
            if (particle.originalPosition.x > 15) particle.originalPosition.x = -15;
            if (particle.originalPosition.x < -15) particle.originalPosition.x = 15;
            if (particle.originalPosition.y > 12) particle.originalPosition.y = -12;
            if (particle.originalPosition.y < -12) particle.originalPosition.y = 12;

            // Smooth floating animation with sine waves
            const floatX = Math.sin(time * particle.floatSpeedX + particle.floatOffset) * particle.floatAmplitudeX;
            const floatY = Math.sin(time * particle.floatSpeedY + particle.floatOffset * 1.3) * particle.floatAmplitudeY;
            const floatZ = Math.sin(time * 0.15 + particle.floatOffset) * 0.02;

            // Gentle rotation animation
            const rotX = particle.rotation.x + time * particle.rotationSpeed * 0.3;
            const rotY = particle.rotation.y + time * particle.rotationSpeed * 0.2;
            const rotZ = particle.rotation.z + time * particle.rotationSpeed * 0.4;

            // Update instance matrix
            dummy.position.set(
                particle.position.x + floatX,
                particle.position.y + floatY,
                particle.position.z + floatZ
            );

            // Elongated scale for dash shape
            dummy.scale.set(
                particle.scale * particle.widthScale,
                particle.scale * 3, // Elongated Y for dash/line look
                particle.scale * particle.widthScale
            );

            dummy.rotation.set(rotX, rotY, rotZ);
            dummy.updateMatrix();

            meshRef.current!.setMatrixAt(i, dummy.matrix);
            meshRef.current!.setColorAt(i, colors[i]);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            {/* Capsule geometry for smooth dash/line shape */}
            <capsuleGeometry args={[0.3, 1, 4, 8]} />
            <meshBasicMaterial
                transparent
                opacity={0.7}
                vertexColors
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    );
}
