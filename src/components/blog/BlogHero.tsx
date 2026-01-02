'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Search } from 'lucide-react';
import GeometricBackground from '@/components/three/GeometricBackground';
import { useTheme } from 'next-themes';

export function BlogHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Theme handling
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');
    // Colors: Indigo-600 for light, Indigo-400 for dark (passed to 3D)
    const particleColor = isDark ? '#818cf8' : '#4f46e5';

    return (
        <section ref={containerRef} className="relative h-[500px] w-full overflow-hidden bg-gray-50 dark:bg-gray-950 flex items-center justify-center transition-colors duration-300">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 10, 20], fov: 45 }}>
                    <color attach="background" args={[isDark ? '#030712' : '#f9fafb']} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4f46e5" />

                    {mounted && <GeometricBackground color={particleColor} isDark={isDark} />}
                </Canvas>

                {/* Gradients for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-950 via-transparent to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 dark:from-gray-950 via-transparent to-transparent opacity-60" />
            </div>

            {/* Content */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center"
            >
                <div className="max-w-3xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium text-sm mb-6 border border-indigo-200 dark:border-indigo-800">
                            Engineering & Design
                        </span>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                            Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Updates</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Discover stories, thinking, and expertise from writers on any topic.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="relative max-w-xl mx-auto"
                    >
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search articles..."
                                className="block w-full pl-11 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent shadow-lg shadow-gray-200/50 dark:shadow-none transition-all"
                            />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
