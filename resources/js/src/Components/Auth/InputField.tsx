import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    required?: boolean;
    autoComplete?: string;
    showPasswordToggle?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    icon,
    required = false,
    autoComplete,
    showPasswordToggle = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = showPasswordToggle
        ? showPassword
            ? "text"
            : "password"
        : type;

    return (
        <div className="space-y-2">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-300"
            >
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
            </label>

            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}

                <input
                    id={name}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full ${icon ? "pl-10" : "pl-4"} ${
                        showPasswordToggle ? "pr-12" : "pr-4"
                    } py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-gray-400 transition-all duration-300`}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required={required}
                />

                {showPasswordToggle && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm"
                >
                    {error}
                </motion.div>
            )}
        </div>
    );
};

export default InputField;
