import type React from "react";
import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu,
    X,
    User,
    LogOut,
    ChevronDown,
    Settings,
    Home,
} from "lucide-react";
import Logo from "@/src/Components/UI/Logo";

const Navigation: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { auth } = usePage().props as any;

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
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

    // Define event programs for dropdown
    const eventPrograms = [
        { href: "/events/hacksphere", label: "Hacksphere" },
        { href: "/events/talksphere", label: "Talksphere" },
        { href: "/events/festsphere", label: "Festsphere" },
        { href: "/events/exposphere", label: "Exposphere" },
    ];

    // Define navigation items based on authentication status
    const preLoginNavItems = [
        { href: "/", label: "Home", dropdown: false },
        {
            href: "#",
            label: "Events",
            dropdown: true,
            items: eventPrograms,
        },
    ];

    const postLoginNavItems = [
        {
            href: auth?.user?.role ? `/${auth?.user?.role}/dashboard` : "/",
            label: "Dashboard",
            dropdown: false,
        },
        {
            href: "#",
            label: "Event Overview",
            dropdown: true,
            items: eventPrograms,
        },
    ];

    // Use appropriate nav items based on auth status
    const navItems = auth.user ? postLoginNavItems : preLoginNavItems;

    // State for dropdown menus
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const handleNavClick = (href: string) => {
        setIsMenuOpen(false);
        setActiveDropdown(null);

        // Handle anchor links with smooth scroll
        if (href.startsWith("#")) {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    const toggleDropdown = (label: string) => {
        setActiveDropdown(activeDropdown === label ? null : label);
    };

    const handleClickOutside = (e: MouseEvent) => {
        // Check if the click target is a dropdown toggle button or inside a dropdown menu
        const target = e.target as HTMLElement;
        const isDropdownToggle = target.closest("[data-dropdown-toggle]");
        const isInsideDropdown = target.closest("[data-dropdown-content]");

        if (!isDropdownToggle && !isInsideDropdown) {
            setActiveDropdown(null);
        }
    };

    // Add click outside listener for dropdowns
    useEffect(() => {
        if (activeDropdown) {
            // Add a small delay to prevent the dropdown from closing immediately
            setTimeout(() => {
                document.addEventListener("click", handleClickOutside);
            }, 100);
        }
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [activeDropdown]);

    return (
        <>
            {/* Fixed Navigation Bar */}
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled || isMenuOpen
                        ? "bg-black/55 backdrop-blur-md border-b border-gray-800/50 shadow-[0_0_16px_2px_rgba(59,130,246,0.35)]"
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
                                <div
                                    key={item.href}
                                    className="relative"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {item.dropdown ? (
                                        <div className="relative">
                                            <motion.button
                                                className="flex items-center text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium"
                                                whileHover={{ scale: 1.05 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleDropdown(item.label);
                                                }}
                                                data-dropdown-toggle="true"
                                            >
                                                {item.label}
                                                <ChevronDown
                                                    className={`ml-1 w-4 h-4 transition-transform ${
                                                        activeDropdown ===
                                                        item.label
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                />
                                            </motion.button>

                                            {/* Dropdown Menu */}
                                            <AnimatePresence>
                                                {activeDropdown ===
                                                    item.label && (
                                                    <motion.div
                                                        initial={{
                                                            opacity: 0,
                                                            y: -10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: -10,
                                                        }}
                                                        transition={{
                                                            duration: 0.2,
                                                        }}
                                                        className="absolute top-full left-0 mt-2 w-48 rounded-lg bg-black/55 backdrop-blur-md border border-gray-800/50 shadow-xl z-50"
                                                        data-dropdown-content="true"
                                                    >
                                                        <div className="py-2">
                                                            {item.items?.map(
                                                                (subItem) => (
                                                                    <Link
                                                                        key={
                                                                            subItem.href
                                                                        }
                                                                        href={
                                                                            subItem.href
                                                                        }
                                                                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-blue-400 transition-colors duration-200"
                                                                        onClick={() =>
                                                                            setActiveDropdown(
                                                                                null
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            subItem.label
                                                                        }
                                                                    </Link>
                                                                )
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium"
                                        >
                                            <motion.span
                                                whileHover={{ scale: 1.05 }}
                                                className="inline-block"
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    setActiveDropdown(null);
                                                }}
                                            >
                                                {item.label}
                                            </motion.span>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            {auth.user ? (
                                <div className="flex items-center space-x-5">
                                    {/* Profile Dropdown */}
                                    <div
                                        className="relative"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <motion.button
                                            className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-800/50"
                                            whileHover={{ scale: 1.02 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDropdown("profile");
                                            }}
                                            data-dropdown-toggle="true"
                                        >
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-sm lg:text-base font-medium">
                                                {auth.user.first_name}
                                            </span>
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform ${
                                                    activeDropdown === "profile"
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        </motion.button>

                                        {/* Profile Dropdown Menu */}
                                        <AnimatePresence>
                                            {activeDropdown === "profile" && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: -10,
                                                    }}
                                                    transition={{
                                                        duration: 0.2,
                                                    }}
                                                    className="absolute top-full right-0 mt-2 w-56 rounded-lg bg-gray-900/95 backdrop-blur-md border border-gray-800/50 shadow-xl z-50"
                                                    data-dropdown-content="true"
                                                >
                                                    <div className="py-2">
                                                        <div className="px-4 py-3 border-b border-gray-800">
                                                            <p className="text-sm font-medium text-white">
                                                                {
                                                                    auth.user
                                                                        .first_name
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                {
                                                                    auth.user
                                                                        .email
                                                                }
                                                            </p>
                                                        </div>

                                                        <Link
                                                            href="/profile"
                                                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-blue-400 transition-colors duration-200"
                                                            onClick={() =>
                                                                setActiveDropdown(
                                                                    null
                                                                )
                                                            }
                                                        >
                                                            <User className="w-4 h-4 mr-2" />
                                                            My Profile
                                                        </Link>

                                                        <Link
                                                            href="/settings"
                                                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-blue-400 transition-colors duration-200"
                                                            onClick={() =>
                                                                setActiveDropdown(
                                                                    null
                                                                )
                                                            }
                                                        >
                                                            <Settings className="w-4 h-4 mr-2" />
                                                            Settings
                                                        </Link>

                                                        <div className="border-t border-gray-800 mt-1 pt-1">
                                                            <Link
                                                                href="/logout"
                                                                method="post"
                                                                className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-500 transition-colors duration-200"
                                                                onClick={() =>
                                                                    setActiveDropdown(
                                                                        null
                                                                    )
                                                                }
                                                            >
                                                                <LogOut className="w-4 h-4 mr-2" />
                                                                Logout
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
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
                                            className="border border-blue-500/50 text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm lg:text-md"
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
                                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm lg:text-md shadow-lg shadow-blue-500/25"
                                        >
                                            Register
                                        </Link>
                                    </motion.div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            className="cursor-pointer md:hidden relative z-50 p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-300"
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
                                        <div key={item.href}>
                                            {item.dropdown ? (
                                                <div className="mb-2">
                                                    <motion.button
                                                        className="cursor-pointer flex items-center justify-between w-full py-3 px-4 text-lg font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800/50 rounded-lg transition-all duration-300"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleDropdown(
                                                                item.label
                                                            );
                                                        }}
                                                        initial={{
                                                            x: -20,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            x: 0,
                                                            opacity: 1,
                                                        }}
                                                        transition={{
                                                            delay: index * 0.1,
                                                        }}
                                                        data-dropdown-toggle="true"
                                                    >
                                                        <span>
                                                            {item.label}
                                                        </span>
                                                        <ChevronDown
                                                            className={`w-5 h-5 transition-transform ${
                                                                activeDropdown ===
                                                                item.label
                                                                    ? "rotate-180"
                                                                    : ""
                                                            }`}
                                                        />
                                                    </motion.button>

                                                    <AnimatePresence>
                                                        {activeDropdown ===
                                                            item.label && (
                                                            <motion.div
                                                                initial={{
                                                                    height: 0,
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    height: "auto",
                                                                    opacity: 1,
                                                                }}
                                                                exit={{
                                                                    height: 0,
                                                                    opacity: 0,
                                                                }}
                                                                transition={{
                                                                    duration: 0.2,
                                                                }}
                                                                className="overflow-hidden ml-4 mt-1 s"
                                                                data-dropdown-content="true"
                                                            >
                                                                {item.items?.map(
                                                                    (
                                                                        subItem,
                                                                        subIndex
                                                                    ) => (
                                                                        <Link
                                                                            key={
                                                                                subItem.href
                                                                            }
                                                                            href={
                                                                                subItem.href
                                                                            }
                                                                            className="block py-2 px-4 text-base text-gray-300 hover:text-blue-400 hover:bg-gray-800/50 rounded-lg transition-all duration-300 border-l border-gray-800/50 ml-2 border-none"
                                                                            onClick={() =>
                                                                                setIsMenuOpen(
                                                                                    false
                                                                                )
                                                                            }
                                                                        >
                                                                            {
                                                                                subItem.label
                                                                            }
                                                                        </Link>
                                                                    )
                                                                )}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    className="block py-3 px-4 text-lg font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800/50 rounded-lg transition-all duration-300"
                                                >
                                                    <motion.span
                                                        onClick={() => {
                                                            setIsMenuOpen(
                                                                false
                                                            );
                                                        }}
                                                        initial={{
                                                            x: -20,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            x: 0,
                                                            opacity: 1,
                                                        }}
                                                        transition={{
                                                            delay: index * 0.1,
                                                        }}
                                                        className="block"
                                                    >
                                                        {item.label}
                                                    </motion.span>
                                                </Link>
                                            )}
                                        </div>
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
                                                        {auth.user.first_name}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Mobile Profile Links */}
                                            <div className="space-y-2">
                                                <Link
                                                    href="/dashboard"
                                                    className="flex items-center space-x-2 px-4 py-3 bg-gray-800/30 rounded-lg text-gray-300 hover:text-blue-400 transition-colors duration-200"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    <Home className="w-5 h-5" />
                                                    <span>Dashboard</span>
                                                </Link>

                                                <Link
                                                    href="/profile"
                                                    className="flex items-center space-x-2 px-4 py-3 bg-gray-800/30 rounded-lg text-gray-300 hover:text-blue-400 transition-colors duration-200"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    <User className="w-5 h-5" />
                                                    <span>My Profile</span>
                                                </Link>

                                                <Link
                                                    href="/settings"
                                                    className="flex items-center space-x-2 px-4 py-3 bg-gray-800/30 rounded-lg text-gray-300 hover:text-blue-400 transition-colors duration-200"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    <Settings className="w-5 h-5" />
                                                    <span>Settings</span>
                                                </Link>
                                            </div>

                                            <Link
                                                href="/logout"
                                                method="post"
                                                className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-3 rounded-lg font-semibold transition-all duration-300"
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                            >
                                                <LogOut className="w-5 h-5 mr-2" />
                                                <span>Logout</span>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Link
                                                href="/login"
                                                className="block w-full text-center border border-blue-500/50 text-blue-400 hover:bg-blue-500 hover:text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300"
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                            >
                                                Log in
                                            </Link>

                                            <Link
                                                href="/register"
                                                className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25"
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
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
        </>
    );
};

export default Navigation;
