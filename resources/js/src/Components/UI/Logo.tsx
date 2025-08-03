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

    return (
        <div
            className={`flex items-center space-x-3 cursor-pointer ${className}`}
            onClick={() => (window.location.href = "/")}
        >
            <motion.img
                src="/assets/compsphere.png"
                alt="Compsphere Logo"
                className={`${sizeClasses[size]}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
            />
        </div>
    );
};

export default Logo;
