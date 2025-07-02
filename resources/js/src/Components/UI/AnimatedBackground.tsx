import type React from "react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedBackgroundProps {
    particleCount?: number;
    className?: string;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    duration: number;
    delay: number;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
    particleCount = 60,
    className = "",
}) => {
    const [particles, setParticles] = useState<Particle[]>([]);
    
    useEffect(() => {
        // Generate particles with varied properties for a more dynamic effect
        const newParticles = Array.from({ length: particleCount }, (_, i) => {
            const colors = [
                'bg-[#7ECEF4]/20',
                'bg-[#1E88E5]/20',
                'bg-[#0D47A1]/20',
                'bg-[#FF5252]/20',
                'bg-[#D32F2F]/20',
                'bg-[#B71C1C]/20'
            ];
            
            return {
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: 1 + Math.random() * 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                duration: 3 + Math.random() * 7,
                delay: Math.random() * 2
            };
        });
        
        setParticles(newParticles);
    }, [particleCount]);

    return (
        <div className={`fixed inset-0 z-0 overflow-hidden ${className}`}>
            {/* Modern gradient background with subtle color shifts */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#1E88E5]/30 to-[#0D47A1]/20"></div>
            
            {/* Subtle grid overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjMuNSAzLjIgMS4zLjkuOSAxLjMgMiAxLjMgMy4yIDAgMS4yLS41IDIuMy0xLjMgMy4yLS45LjktMiAxLjMtMy4yIDEuM3MtMi4zLS41LTMuMi0xLjNjLS45LS45LTEuMy0yLTEuMy0zLjIgMC0xLjIuNS0yLjMgMS4zLTMuMi45LS45IDItMS4zIDMuMi0xLjN6IiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgY3g9IjYiIGN5PSI2IiByPSI2Ii8+PGNpcmNsZSBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBjeD0iNTQiIGN5PSI1NCIgcj0iNiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
            
            {/* Animated particles */}
            <div className="absolute inset-0">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className={`absolute rounded-full ${particle.color}`}
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                        }}
                        animate={{
                            opacity: [0.2, 0.8, 0.2],
                            scale: [1, 1.5, 1],
                            x: [0, Math.random() * 20 - 10, 0],
                            y: [0, Math.random() * 20 - 10, 0],
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: particle.delay,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
            
            {/* Subtle glow effects */}
            <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-blue-500/5 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 right-1/4 w-1/2 h-1/3 bg-indigo-500/5 blur-[100px] rounded-full"></div>
            <div className="absolute top-1/3 right-0 w-1/3 h-1/3 bg-purple-500/5 blur-[100px] rounded-full"></div>
        </div>
    );
};

export default AnimatedBackground;
