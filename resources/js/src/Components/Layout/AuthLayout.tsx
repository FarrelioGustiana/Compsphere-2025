import type React from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import SpaceBackground from "@/src/Components/UI/SpaceBackground";
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
                <SpaceBackground particleCount={40} density="medium" />

                <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12">
                    {/* Cosmic rays effect */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-[80px]"></div>
                    <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-400/10 rounded-full blur-[100px]"></div>
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
                        <div className="mb-4 sm:mb-6 flex justify-center relative">
                            {/* Logo glow effect */}
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg"></div>
                            <Logo size="lg" showText={false} className="relative z-10" />
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
                        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-500">
                            {/* Card highlight effect */}
                            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
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
                            className="text-gray-400 hover:text-white hover:scale-105 transition-all duration-300 flex items-center text-sm sm:text-base"
                        >
                            <span className="mr-1.5">←</span> Back to Compsphere
                        </Link>
                    </motion.div>
                    
                    {/* Floating decorative space elements */}
                    <div className="absolute top-10 right-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse-slow"></div>
                    <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse-slow animation-delay-1000"></div>
                </div>
            </div>
        </>
    );
};

export default AuthLayout;
