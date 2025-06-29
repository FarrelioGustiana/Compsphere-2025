"use client";

import type React from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
    particleCount?: number;
    className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
    particleCount = 50,
    className = "",
}) => {
    return (
        <div className={`fixed inset-0 z-0 ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-red-900/20"></div>
            <div className="absolute inset-0">
                {[...Array(particleCount)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default AnimatedBackground;
