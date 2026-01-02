'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GeometricBackgroundProps {
    color?: string;
    isDark?: boolean;
}

export default function GeometricBackground({ color = '#4F46E5', isDark = false }: GeometricBackgroundProps) {
    const mesh = useRef<THREE.InstancedMesh>(null);

    // Grid settings
    const gridSize = 40;
    const separation = 1.2;
    const offset = (gridSize * separation) / 2;
    const count = gridSize * gridSize;

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!mesh.current) return;
        const time = state.clock.getElapsedTime() * 0.8; // Speed

        let i = 0;
        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                const xPos = x * separation - offset;
                const zPos = z * separation - offset;

                // Wave calculations
                // 1. Radial wave (slower, broader)
                const dist = Math.sqrt(xPos * xPos + zPos * zPos);
                const radialWave = Math.sin(dist * 0.25 - time * 0.8) * 1.5;

                // 2. Linear wave (diagonal flow)
                const linearWave = Math.sin(xPos * 0.3 + zPos * 0.2 + time * 1.2) * 1;

                // Combine
                const yPos = radialWave + linearWave;

                dummy.position.set(xPos, yPos - 5, zPos); // Push down slightly

                // Rotate based on height and time - smoother rotation
                dummy.rotation.x = Math.sin(time * 0.5 + xPos * 0.1) * 0.5;
                dummy.rotation.z = Math.cos(time * 0.5 + zPos * 0.1) * 0.5;

                // Scale based on height (peaks are larger)
                const scale = Math.max(0.2, (yPos + 4) * 0.18);
                dummy.scale.set(scale, scale, scale);

                dummy.updateMatrix();
                mesh.current.setMatrixAt(i++, dummy.matrix);
            }
        }
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group rotation={[Math.PI / 5, Math.PI / 4, 0]}>
            <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
                <dodecahedronGeometry args={[0.8, 0]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.1}
                    metalness={0.8}
                    emissive={color}
                    emissiveIntensity={isDark ? 0.4 : 0.2}
                    wireframe={false}
                />
            </instancedMesh>
        </group>
    );
}
