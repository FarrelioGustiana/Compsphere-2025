import type React from "react";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface SpaceBackgroundProps {
    particleCount?: number;
    density?: "low" | "medium" | "high";
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
    opacity: number;
}

const SpaceBackground: React.FC<SpaceBackgroundProps> = ({
    particleCount = 50,
    density = "medium",
    className = "",
}) => {
    // Adjust particle count based on density for performance
    const actualParticleCount = useMemo(() => {
        const counts = {
            low: Math.floor(particleCount * 0.5),
            medium: particleCount,
            high: Math.floor(particleCount * 1.5)
        };
        return counts[density];
    }, [particleCount, density]);
    
    const [particles, setParticles] = useState<Particle[]>([]);
    
    useEffect(() => {
        // Generate particles with varied properties for a more dynamic space effect
        const newParticles = Array.from({ length: actualParticleCount }, (_, i) => {
            // Space-themed color palette
            const colors = [
                'bg-white',           // Stars
                'bg-blue-200',        // Blue stars
                'bg-blue-300',        // Bright blue stars
                'bg-purple-200',      // Purple stars
                'bg-red-200',         // Red stars
                'bg-yellow-100',      // Yellow stars
            ];
            
            // Randomize opacity for depth effect
            const opacity = 0.3 + Math.random() * 0.7;
            
            return {
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: 1 + Math.random() * 2.5,  // Slightly smaller for better performance
                color: colors[Math.floor(Math.random() * colors.length)],
                duration: 5 + Math.random() * 10,
                delay: Math.random() * 2,
                opacity
            };
        });
        
        setParticles(newParticles);
    }, [actualParticleCount]);

    return (
        <div className={`fixed inset-0 z-0 overflow-hidden ${className}`}>
            {/* Deep space gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/30 to-black"></div>
            
            {/* Subtle grid overlay - space coordinate system */}
            <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                }}
            />
            
            {/* Distant star clusters and nebula effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-float animation-delay-1000"></div>
            
            {/* Animated star particles */}
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
                            opacity: particle.opacity,
                        }}
                        animate={{
                            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
                            scale: [1, 1.2, 1],
                            filter: ["blur(0px)", "blur(1px)", "blur(0px)"],
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
            
            {/* Subtle cosmic dust effect */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')] opacity-10"></div>
            
            {/* Cosmic ray light effect */}
            <div className="absolute top-0 -left-20 w-40 h-[200%] bg-blue-400/5 rotate-12 blur-3xl transform -translate-x-full animate-aurora"></div>
        </div>
    );
};

export default SpaceBackground;
