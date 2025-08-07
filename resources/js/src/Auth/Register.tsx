import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import {
    User,
    Mail,
    Lock,
    Rocket,
    ShieldAlert,
    Star,
    CircleAlert,
    UserPlus,
    BadgeCheck,
    Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { route } from "ziggy-js";
import AuthLayout from "@/src/Components/Layout/AuthLayout";
import InputField from "@/src/Components/Auth/InputField";
import Button from "@/src/Components/UI/Button";

export default function Register() {
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [activeField, setActiveField] = useState<string | null>(null);

    // Stars animation config
    const starVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: { opacity: 1, scale: 1 },
    };
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    // Simple password strength checker
    useEffect(() => {
        if (!data.password) {
            setPasswordStrength(0);
            return;
        }

        let strength = 0;
        // Length check
        if (data.password.length >= 8) strength += 1;
        // Contains number
        if (/\d/.test(data.password)) strength += 1;
        // Contains uppercase
        if (/[A-Z]/.test(data.password)) strength += 1;
        // Contains special char
        if (/[^A-Za-z0-9]/.test(data.password)) strength += 1;

        setPasswordStrength(strength);
    }, [data.password]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("register"));
    };

    const handleFocus = (field: string) => {
        setActiveField(field);
    };

    const handleBlur = () => {
        setActiveField(null);
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0:
                return "bg-gray-600";
            case 1:
                return "bg-red-500";
            case 2:
                return "bg-yellow-500";
            case 3:
                return "bg-blue-500";
            case 4:
                return "bg-green-500";
            default:
                return "bg-gray-600";
        }
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0:
                return "";
            case 1:
                return "Weak";
            case 2:
                return "Fair";
            case 3:
                return "Good";
            case 4:
                return "Strong";
            default:
                return "";
        }
    };

    return (
        <AuthLayout title="Sign Up" subtitle="Create your account">
            {/* Glowing orb behind form */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    className="w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                />
            </div>

            <motion.form
                onSubmit={submit}
                className="space-y-4 sm:space-y-6 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
                        activeField === "first_name" ? "scale-105" : ""
                    } transition-transform duration-300`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="relative">
                        {activeField === "first_name" && (
                            <motion.div
                                className="absolute inset-0 rounded-xl bg-blue-500/10 -z-10 blur-md"
                                layoutId="activeFieldGlow"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            />
                        )}
                        <div className="relative z-10">
                            <InputField
                                label="First Name"
                                name="first_name"
                                type="text"
                                value={data.first_name}
                                onChange={(value) =>
                                    setData("first_name", value)
                                }
                                error={errors.first_name}
                                placeholder="Enter first name"
                                icon={
                                    <motion.div
                                        animate={
                                            activeField === "first_name"
                                                ? { rotate: 360 }
                                                : { rotate: 0 }
                                        }
                                        transition={{ duration: 0.5 }}
                                    >
                                        <User className="w-5 h-5 text-blue-400" />
                                    </motion.div>
                                }
                                autoComplete="given-name"
                                required
                                onFocus={() => handleFocus("first_name")}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>
                    <div className="relative">
                        {activeField === "last_name" && (
                            <motion.div
                                className="absolute inset-0 rounded-xl bg-blue-500/10 -z-10 blur-md"
                                layoutId="activeFieldGlow"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            />
                        )}
                        <div className="relative z-10">
                            <InputField
                                label="Last Name"
                                name="last_name"
                                type="text"
                                value={data.last_name}
                                onChange={(value) =>
                                    setData("last_name", value)
                                }
                                error={errors.last_name}
                                placeholder="Enter last name"
                                icon={
                                    <motion.div
                                        animate={
                                            activeField === "last_name"
                                                ? { rotate: 360 }
                                                : { rotate: 0 }
                                        }
                                        transition={{ duration: 0.5 }}
                                    >
                                        <User className="w-5 h-5 text-purple-400" />
                                    </motion.div>
                                }
                                autoComplete="family-name"
                                required
                                onFocus={() => handleFocus("last_name")}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>
                </motion.div>
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
                                    animate={
                                        activeField === "email"
                                            ? {
                                                  rotateY: 180,
                                                  scale: [1, 1.2, 1],
                                              }
                                            : { rotateY: 0, scale: 1 }
                                    }
                                    transition={{ duration: 0.5 }}
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
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
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
                                transition={{ duration: 0.2 }}
                            />
                        )}
                        <div className="relative z-10">
                            <InputField
                                label="Password"
                                name="password"
                                type="password"
                                value={data.password}
                                onChange={(value) => setData("password", value)}
                                error={errors.password}
                                placeholder="Create password"
                                icon={
                                    <motion.div
                                        animate={
                                            activeField === "password"
                                                ? {
                                                      rotateY: 180,
                                                      scale: [1, 1.2, 1],
                                                  }
                                                : { rotateY: 0, scale: 1 }
                                        }
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Lock className="w-5 h-5 text-purple-400" />
                                    </motion.div>
                                }
                                autoComplete="new-password"
                                showPasswordToggle
                                required
                                onFocus={() => handleFocus("password")}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>

                    {/* Enhanced password strength indicator */}
                    {data.password && (
                        <motion.div
                            className="mt-3"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="text-xs text-blue-300">
                                    Password Strength
                                </div>
                                <div
                                    className="text-xs font-medium"
                                    style={{
                                        color:
                                            passwordStrength > 0
                                                ? getPasswordStrengthColor().replace(
                                                      "bg-",
                                                      "text-"
                                                  )
                                                : "text-gray-400",
                                    }}
                                >
                                    {getPasswordStrengthText()}
                                </div>
                            </div>
                            <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                                <motion.div
                                    className={`h-full ${getPasswordStrengthColor()} transition-all duration-300 relative`}
                                    style={{
                                        width: `${passwordStrength * 25}%`,
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${passwordStrength * 25}%`,
                                    }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {passwordStrength > 2 && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className={`relative ${
                        activeField === "password_confirmation"
                            ? "scale-105"
                            : ""
                    } transition-transform duration-300`}
                >
                    <div className="relative">
                        {activeField === "password_confirmation" && (
                            <motion.div
                                className="absolute inset-0 rounded-xl bg-purple-500/10 -z-10 blur-md"
                                layoutId="activeFieldGlow"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            />
                        )}
                        <div className="relative z-10">
                            <InputField
                                label="Confirm Password"
                                name="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(value) =>
                                    setData("password_confirmation", value)
                                }
                                error={errors.password_confirmation}
                                placeholder="Confirm your password"
                                icon={
                                    <motion.div
                                        animate={
                                            activeField ===
                                            "password_confirmation"
                                                ? {
                                                      rotateY: 180,
                                                      scale: [1, 1.2, 1],
                                                  }
                                                : { rotateY: 0, scale: 1 }
                                        }
                                        transition={{ duration: 0.5 }}
                                    >
                                        <BadgeCheck className="w-5 h-5 text-green-400" />
                                    </motion.div>
                                }
                                autoComplete="new-password"
                                showPasswordToggle
                                required
                                onFocus={() =>
                                    handleFocus("password_confirmation")
                                }
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="w-full relative"
                >
                    {/* Animated background glow for button */}
                    <motion.div
                        className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-blue-600/30 opacity-70 blur-md"
                        animate={{
                            background: [
                                "linear-gradient(90deg, rgba(37, 99, 235, 0.3) 0%, rgba(124, 58, 237, 0.3) 50%, rgba(37, 99, 235, 0.3) 100%)",
                                "linear-gradient(180deg, rgba(37, 99, 235, 0.3) 0%, rgba(124, 58, 237, 0.3) 50%, rgba(37, 99, 235, 0.3) 100%)",
                                "linear-gradient(270deg, rgba(37, 99, 235, 0.3) 0%, rgba(124, 58, 237, 0.3) 50%, rgba(37, 99, 235, 0.3) 100%)",
                                "linear-gradient(0deg, rgba(37, 99, 235, 0.3) 0%, rgba(124, 58, 237, 0.3) 50%, rgba(37, 99, 235, 0.3) 100%)",
                                "linear-gradient(90deg, rgba(37, 99, 235, 0.3) 0%, rgba(124, 58, 237, 0.3) 50%, rgba(37, 99, 235, 0.3) 100%)",
                            ],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    <motion.div
                        className="relative z-10"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            type="submit"
                            variant="custom"
                            size="lg"
                            disabled={processing}
                            loading={processing}
                            className="w-full bg-gradient-to-br from-blue-600 via-purple-700 to-blue-700 text-white font-bold relative overflow-hidden group h-14 shadow-lg shadow-blue-900/30"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <div className="w-full h-[200%] bg-gradient-to-b from-transparent via-white/10 to-transparent animate-shine"></div>
                            </div>

                            <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                                {!processing && (
                                    <motion.div
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="relative"
                                    >
                                        <Rocket className="w-6 h-6" />
                                        <motion.div
                                            className="absolute -bottom-1 -z-10 w-4 h-4 bg-orange-400/70 blur-md rounded-full"
                                            animate={{
                                                opacity: [0.4, 0.8, 0.4],
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                            }}
                                        />
                                    </motion.div>
                                )}
                                <span>Sign Up</span>
                            </span>
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Sign in link with enhanced cosmic styling */}
                <div className="relative mt-2">
                    {/* Cosmic divider */}
                    <div className="relative h-px">
                        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-700/50 to-transparent"></div>
                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-blue-400 rounded-full w-1 h-1"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute left-1/3 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-purple-400 rounded-full w-1 h-1"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: 0.5,
                            }}
                        />
                        <motion.div
                            className="absolute left-2/3 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-blue-400 rounded-full w-1 h-1"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                delay: 1,
                            }}
                        />
                    </div>

                    <div className="text-center pt-5 relative z-10">
                        <motion.div
                            className="inline-flex items-center gap-2 text-gray-300 text-sm sm:text-base"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <span>Already have an account?</span>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="relative"
                            >
                                <Link
                                    href={route("login")}
                                    className="text-blue-400 hover:text-blue-300 font-medium group relative"
                                >
                                    <span>Sign In</span>
                                    <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Terms agreement with cosmic styling */}
                <motion.div
                    className="text-center text-xs text-gray-400 mt-2 pb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                >
                    <div className="flex items-center justify-center gap-1">
                        <span>
                            By signing up, you agree to our{" "}
                            <a
                                href="#"
                                className="text-blue-400 hover:text-blue-300 transition-colors duration-300 relative inline-block group"
                            >
                                <span>Terms of Service</span>
                                <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-blue-400/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </a>{" "}
                            and{" "}
                            <a
                                href="#"
                                className="text-blue-400 hover:text-blue-300 transition-colors duration-300 relative inline-block group"
                            >
                                <span>Privacy Policy</span>
                                <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-blue-400/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </a>
                        </span>
                    </div>
                </motion.div>
            </motion.form>
        </AuthLayout>
    );
}
