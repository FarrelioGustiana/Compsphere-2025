import type React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "outline" | "gradient" | "custom";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    onClick,
    type = "button",
    className = "",
}) => {
    const baseClasses =
        "font-semibold rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        secondary:
            "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
        outline:
            "border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white focus:ring-blue-500",
        gradient:
            "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-blue-500 shadow-lg shadow-blue-500/25",
        custom: "", // Empty class to allow fully custom styling via className prop
    };

    const sizeClasses = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    const disabledClasses =
        disabled || loading
            ? "opacity-50 cursor-not-allowed transform-none"
            : "hover:scale-105 active:scale-95";

    return (
        <motion.button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className} cursor-pointer`}
            whileHover={disabled || loading ? {} : { scale: 1.02 }}
            whileTap={disabled || loading ? {} : { scale: 0.98 }}
        >
            {loading ? (
                <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Loading...
                </div>
            ) : (
                children
            )}
        </motion.button>
    );
};

export default Button;
