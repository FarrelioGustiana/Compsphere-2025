import type React from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import AnimatedBackground from "../UI/AnimatedBackground";
import Logo from "@/src/Components/UI/Logo";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    status?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    subtitle,
    status,
}) => {
    return (
        <>
            <Head title={`${title} - Compsphere 2025`} />

            <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
                <AnimatedBackground particleCount={30} />

                <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12">
                    {/* Status Message */}
                    {status && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-green-600/20 border border-green-500/50 rounded-lg text-green-400 text-center max-w-md w-full"
                        >
                            {status}
                        </motion.div>
                    )}

                    {/* Header */}
                    <motion.div
                        className="text-center mb-6 sm:mb-8"
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="mb-4 sm:mb-6 flex justify-center">
                            <Logo size="lg" showText={false} />
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent mb-2">
                            {title}
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base">
                            {subtitle}
                        </p>
                    </motion.div>

                    {/* Form Container */}
                    <motion.div
                        className="w-full max-w-sm sm:max-w-md"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
                            {children}
                        </div>
                    </motion.div>

                    {/* Back to Home */}
                    <motion.div
                        className="mt-6 sm:mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Link
                            href="/"
                            className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center text-sm sm:text-base"
                        >
                            ← Back to Compsphere
                        </Link>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default AuthLayout;
