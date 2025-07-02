import type React from "react";
import { motion } from "framer-motion";

interface LogoProps {
    size?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
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
        xxl: "w-32 h-32",
        xxxl: "w-36 h-36",
    };

    const textSizeClasses = {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-3xl",
        xl: "text-4xl",
        xxl: "text-5xl",
        xxxl: "text-6xl",
    };

    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            <motion.img
                src="/assets/compsphere.png"
                alt="Compsphere Logo"
                className={`${sizeClasses[size]}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
            />
            {showText && (
                <span
                    className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent font-orbitron`}
                >
                    Compsphere
                </span>
            )}
        </div>
    );
};

export default Logo;
