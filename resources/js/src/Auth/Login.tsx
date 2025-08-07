import type React from "react";
import { useEffect, useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import {
    Mail,
    Lock,
    LogIn,
    Star,
    CircleAlert,
    Rocket,
    Moon,
    Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { route } from "ziggy-js";
import InputField from "@/src/Components/Auth/InputField";
import AuthLayout from "@/src/Components/Layout/AuthLayout";
import Button from "@/src/Components/UI/Button";

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
}

export default function Login({
    status,
    canResetPassword = false,
}: LoginProps) {
    const [loginAttempted, setLoginAttempted] = useState(false);
    const [activeField, setActiveField] = useState<string | null>(null);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<{
        email: string;
        password: string;
    }>({
        email: "",
        password: "",
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    // Stars animation config
    const starVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: { opacity: 1, scale: 1 },
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginAttempted(true);
        post(route("login"));
    };

    // Focus handlers for enhanced field interactions
    const handleFocus = (fieldName: string) => {
        setActiveField(fieldName);
    };

    const handleBlur = () => {
        setActiveField(null);
    };

    return (
        <AuthLayout title="Sign In" subtitle="Welcome back" status={status}>
            {/* Glowing orb behind form */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-900/20 to-purple-800/20 blur-3xl opacity-30 -z-10"></div>

            <motion.form
                onSubmit={submit}
                className="relative z-10 space-y-6 sm:space-y-7 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                {/* Form title */}

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className={`relative ${
                        activeField === "email" ? "scale-105" : ""
                    } transition-transform duration-300`}
                >
                    <div className="relative">
                        {activeField === "email" && (
                            <motion.div
                                className="absolute inset-0 rounded-xl bg-blue-500/10 -z-10 blur-md"
                                layoutId="activeFieldGlow"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            />
                        )}
                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={(value) => setData("email", value)}
                            error={errors.email}
                            placeholder="Enter your email"
                            icon={
                                <motion.div
                                    whileHover={{ rotate: 15 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                    }}
                                >
                                    <Mail className="w-5 h-5 text-blue-400" />
                                </motion.div>
                            }
                            autoComplete="username"
                            required
                            onFocus={() => handleFocus("email")}
                            onBlur={handleBlur}
                        />
                    </div>
                    {errors.email && (
                        <motion.div
                            className="flex items-center gap-1.5 mt-1 text-xs text-red-400 pl-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <CircleAlert className="w-3.5 h-3.5" />
                            <span>{errors.email}</span>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className={`relative ${
                        activeField === "password" ? "scale-105" : ""
                    } transition-transform duration-300`}
                >
                    <div className="relative">
                        {activeField === "password" && (
                            <motion.div
                                className="absolute inset-0 rounded-xl bg-purple-500/10 -z-10 blur-md"
                                layoutId="activeFieldGlow"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        )}
                        <InputField
                            label="Password"
                            name="password"
                            type="password"
                            value={data.password}
                            onChange={(value) => setData("password", value)}
                            error={errors.password}
                            placeholder="Enter your password"
                            icon={
                                <motion.div
                                    whileHover={{ rotate: -15 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                    }}
                                >
                                    <Lock className="w-5 h-5 text-purple-400" />
                                </motion.div>
                            }
                            autoComplete="current-password"
                            showPasswordToggle
                            required
                            onFocus={() => handleFocus("password")}
                            onBlur={handleBlur}
                        />
                    </div>
                    {errors.password && (
                        <motion.div
                            className="flex items-center gap-1.5 mt-1 text-xs text-red-400 pl-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <CircleAlert className="w-3.5 h-3.5" />
                            <span>{errors.password}</span>
                        </motion.div>
                    )}
                </motion.div>

                {/* Remember me and Forgot Password row */}
                <motion.div
                    className="flex justify-between items-center text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <motion.div
                        className="flex items-center space-x-2 group"
                        whileHover={{ x: 3 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                        }}
                        onClick={() => setRememberMe(!rememberMe)}
                    >
                        <div className="relative w-5 h-5 flex items-center justify-center cursor-pointer">
                            <motion.div
                                className={`absolute inset-0 rounded-md ${
                                    rememberMe
                                        ? "bg-blue-500"
                                        : "border-2 border-gray-600"
                                }`}
                                animate={{
                                    backgroundColor: rememberMe
                                        ? "rgba(59, 130, 246, 1)"
                                        : "rgba(0, 0, 0, 0)",
                                    borderColor: rememberMe
                                        ? "rgba(59, 130, 246, 1)"
                                        : "rgba(75, 85, 99, 1)",
                                }}
                            />
                            {rememberMe && (
                                <motion.svg
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </motion.svg>
                            )}
                        </div>
                        <label
                            htmlFor="remember_me"
                            className="text-gray-300 cursor-pointer group-hover:text-blue-300 transition-colors"
                        >
                            Remember me
                        </label>
                    </motion.div>

                    {canResetPassword && (
                        <motion.div
                            whileHover={{ x: -3 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 10,
                            }}
                        >
                            <Link
                                href={route("password.request")}
                                className="text-blue-400 hover:text-blue-300 transition-colors duration-300 inline-flex items-center gap-1 hover:gap-2"
                            >
                                <span>Forgot password?</span>
                            </Link>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="w-full mt-8"
                >
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="relative w-full h-12 sm:h-14"
                    >
                        {/* Animated border */}
                        <div className="absolute inset-0 rounded-xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-x"></div>
                        </div>

                        {/* Button with glass effect */}
                        <Button
                            type="submit"
                            variant="custom"
                            disabled={processing}
                            loading={processing}
                            className={`w-full h-full rounded-xl relative overflow-hidden ${
                                !processing &&
                                "bg-gradient-to-br from-blue-900/80 to-purple-900/80 hover:from-blue-800/80 hover:to-purple-800/80"
                            } backdrop-blur-sm border border-white/10 text-white shadow-lg transition-all duration-300 flex items-center justify-center`}
                        >
                            <motion.div
                                className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-1000"
                                animate={{
                                    scale: processing ? 1 : [0.9, 1.1, 0.9],
                                    opacity: processing ? 0.3 : [0.1, 0.2, 0.1],
                                }}
                                transition={{ repeat: Infinity, duration: 3 }}
                            />
                            <motion.div className="relative z-10 flex items-center justify-center gap-3 font-bold text-base sm:text-lg">
                                {!processing && (
                                    <motion.div
                                        animate={{ rotate: [0, 10, 0] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 3,
                                            repeatType: "reverse",
                                        }}
                                    >
                                        <Rocket className="w-5 h-5 text-blue-300" />
                                    </motion.div>
                                )}
                                <span className="text-white">
                                    {processing ? "Signing In..." : "Sign In"}
                                </span>
                            </motion.div>
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Sign up link */}
                <motion.div
                    className="relative mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.7 }}
                >
                    <div className="relative py-4">
                        <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-700/50"></div>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-300 text-sm sm:text-base">
                            Don't have an account?{" "}
                            <Link
                                href={route("register")}
                                className="text-blue-400 hover:text-blue-300 font-medium transition-all duration-300"
                            >
                                <span>Sign Up</span>
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </motion.form>
        </AuthLayout>
    );
}
