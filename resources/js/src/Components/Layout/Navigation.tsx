import type React from "react";
import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";
import Logo from "@/src/Components/UI/Logo";

const Navigation: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { auth } = usePage().props as any;

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu when clicking outside or pressing escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsMenuOpen(false);
        };

        if (isMenuOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isMenuOpen]);

    const navItems = [
        { href: "#events", label: "Events" },
        { href: "#schedule", label: "Schedule" },
        { href: "#contact", label: "Contact" },
    ];

    const handleNavClick = (href: string) => {
        setIsMenuOpen(false);
        // Smooth scroll to section
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            {/* Fixed Navigation Bar */}
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled || isMenuOpen
                        ? "bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50"
                        : "bg-transparent"
                }`}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        {/* Logo */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Logo size="md" showText={true} />
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {navItems.map((item) => (
                                <motion.a
                                    key={item.href}
                                    href={item.href}
                                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick(item.href);
                                    }}
                                >
                                    {item.label}
                                </motion.a>
                            ))}
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            {auth.user ? (
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2 text-gray-300">
                                        <User className="w-4 h-4" />
                                        <span className="text-sm lg:text-base font-medium">
                                            {auth.user.name}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            href="/login"
                                            className="border border-blue-500/50 text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm lg:text-base"
                                        >
                                            Log in
                                        </Link>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            href="/register"
                                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm lg:text-base shadow-lg shadow-blue-500/25"
                                        >
                                            Register
                                        </Link>
                                    </motion.div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            className="md:hidden relative z-50 p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-300"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait">
                                {isMenuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="w-6 h-6 text-white" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="w-6 h-6 text-white" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Mobile Menu */}
                        <motion.div
                            className="fixed top-16 left-0 right-0 bg-gray-900/98 backdrop-blur-md border-b border-gray-800/50 z-40 md:hidden"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <div className="max-w-7xl mx-auto px-4 py-6">
                                {/* Mobile Navigation Links */}
                                <div className="space-y-4 mb-6">
                                    {navItems.map((item, index) => (
                                        <motion.a
                                            key={item.href}
                                            href={item.href}
                                            className="block py-3 px-4 text-lg font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800/50 rounded-lg transition-all duration-300"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleNavClick(item.href);
                                            }}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            {item.label}
                                        </motion.a>
                                    ))}
                                </div>

                                {/* Mobile Auth Section */}
                                <motion.div
                                    className="pt-6 border-t border-gray-800"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {auth.user ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-800/50 rounded-lg">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {auth.user.name}
                                                    </p>
                                                    <p className="text-gray-400 text-sm">
                                                        {auth.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-3 rounded-lg font-semibold transition-all duration-300"
                                            >
                                                <LogOut className="w-5 h-5" />
                                                <span>Logout</span>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Link
                                                href="/login"
                                                className="block w-full text-center border border-blue-500/50 text-blue-400 hover:bg-blue-500 hover:text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300"
                                            >
                                                Log in
                                            </Link>

                                            <Link
                                                href="/register"
                                                className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25"
                                            >
                                                Register
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Spacer to prevent content from hiding behind fixed nav */}
            <div className="h-16 sm:h-20" />
        </>
    );
};

export default Navigation;
