'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import FloatingParticles from '@/components/three/FloatingParticles';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export function BlogHero() {
    return (
        <section className="relative h-[400px] sm:h-[500px] w-full overflow-hidden bg-gray-900 flex items-center justify-center">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                    <color attach="background" args={['#111827']} />
                    <ambientLight intensity={0.5} />
                    <FloatingParticles count={250} repelRadius={4} />
                </Canvas>
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">CareerHub</span> Blog
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Discussions on hiring, culture, and the future of work.
                            Explore our latest stories, tutorials, and updates.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative max-w-xl mx-auto mt-8"
                    >
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/20 transition-all"
                            placeholder="Search articles..."
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
