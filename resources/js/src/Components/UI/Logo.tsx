"use client";

import type React from "react";
import { motion } from "framer-motion";

interface LogoProps {
    size?: "sm" | "md" | "lg" | "xl";
    showText?: boolean;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({
    size = "md",
    showText = true,
    className = "",
}) => {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-24 h-24",
        xl: "w-28 h-28",
    };

    const textSizeClasses = {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-3xl",
        xl: "text-4xl",
    };

    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            <motion.img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-25%20at%2023.34.30_70e63cda.jpg-IKAmYg9ycQLDlNnobovMrgj2zFWAri.jpeg"
                alt="Compsphere Logo"
                className={`${sizeClasses[size]} rounded-full shadow-2xl shadow-blue-500/20`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
            />
            {showText && (
                <span
                    className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent`}
                >
                    Compsphere
                </span>
            )}
        </div>
    );
};

export default Logo;
