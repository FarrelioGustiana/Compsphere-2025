import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const StarGrid: React.FC = () => {
    const [stars, setStars] = useState<
        { id: number; top: number; left: number; size: number; delay: number }[]
    >([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Generate random stars
        const generateStars = () => {
            if (!containerRef.current) return;

            const { width, height } =
                containerRef.current.getBoundingClientRect();
            const newStars = [];

            // Generate between 30-50 stars
            const starCount = Math.floor(Math.random() * 20) + 30;

            for (let i = 0; i < starCount; i++) {
                newStars.push({
                    id: i,
                    top: Math.random() * height,
                    left: Math.random() * width,
                    size: Math.floor(Math.random() * 8) + 2, // Size between 2-10px
                    delay: Math.random() * 10, // Random delay for animation
                });
            }

            setStars(newStars);
        };

        generateStars();

        // Regenerate stars every 20 seconds
        const interval = setInterval(generateStars, 20000);

        // Handle window resize
        const handleResize = () => {
            generateStars();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-0 overflow-hidden"
            style={{
                backgroundImage: "url('/assets/blue-grid.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Animated stars */}
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-sm bg-blue-200"
                    style={{
                        top: `${star.top}px`,
                        left: `${star.left}px`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.5, 1],
                        boxShadow: [
                            "0 0 0 rgba(59, 130, 246, 0)",
                            "0 0 15px rgba(59, 130, 246, 0.8)",
                            "0 0 0 rgba(59, 130, 246, 0)",
                        ],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

export default StarGrid;
