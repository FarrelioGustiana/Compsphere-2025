"use client";

import type React from "react";
import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "../UI/Logo";

const Navigation: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { auth } = usePage().props as any;

    const navItems = [
        { href: "#events", label: "Events" },
        { href: "#schedule", label: "Schedule" },
        { href: "#contact", label: "Contact" },
    ];

    return (
        <motion.nav
            className="relative z-10 p-4 sm:p-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Logo size="md" showText={true} />

                {/* Desktop Navigation */}
                <div className="hidden lg:flex space-x-8">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="hover:text-blue-400 transition-colors duration-300"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                    {auth.user ? (
                        <div className="flex items-center space-x-4">
                            <p className="text-white capitalize text-sm lg:text-base">
                                Welcome, {auth.user.name}
                            </p>
                            <Link
                                href="/logout"
                                method="post"
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-3 lg:px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm lg:text-base"
                            >
                                Logout
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link
                                href="/login"
                                className="border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-3 lg:px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm lg:text-base"
                            >
                                Log in
                            </Link>

                            <Link
                                href="/register"
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-3 lg:px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm lg:text-base"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="md:hidden absolute top-full left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 p-4"
                >
                    <div className="space-y-4">
                        {/* Mobile Navigation Links */}
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="block py-2 hover:text-blue-400 transition-colors duration-300"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </a>
                        ))}

                        {/* Mobile Auth Section */}
                        <div className="pt-4 border-t border-gray-700">
                            {auth.user ? (
                                <div className="space-y-3">
                                    <p className="text-white capitalize">
                                        Welcome, {auth.user.name}
                                    </p>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        className="block w-full text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Link
                                        href="/login"
                                        className="block w-full text-center border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                                    >
                                        Log in
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navigation;
