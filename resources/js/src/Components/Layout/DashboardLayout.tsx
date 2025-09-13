import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    User,
    LogOut,
    Menu,
    X,
    Users,
    ChevronDown,
    ChevronUp,
    Zap,
    Globe,
    Lightbulb,
    Shield,
} from "lucide-react";
import { PageProps } from "@/types";
import { route } from "ziggy-js";
import Logo from "@/src/Components/UI/Logo";

interface SubNavItem {
    name: string;
    href: string;
}

interface NavItem {
    name: string;
    href?: string;
    icon: React.ElementType;
    subNav?: SubNavItem[];
}

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { auth } = usePage<PageProps>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState<{
        [key: string]: boolean;
    }>({});
    
    // Effect to prevent body scrolling when mobile sidebar is open
    React.useEffect(() => {
        if (sidebarOpen) {
            // Lock scroll
            document.body.classList.add('overflow-hidden');
        } else {
            // Enable scroll
            document.body.classList.remove('overflow-hidden');
        }
        
        // Cleanup on unmount
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [sidebarOpen]);

    const userRole = auth.user?.role || "participant";
    const adminProfile = auth.user?.adminProfile;

    const toggleDropdown = (name: string) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    const navigation: Record<string, NavItem[]> = {
        participant: [
            {
                name: "Dashboard",
                href: route("participant.dashboard"),
                icon: Home,
            },
            { name: "Profile", href: route("participant.profile"), icon: User },
        ],
        admin: [
            { name: "Dashboard", href: route("admin.dashboard"), icon: Home },
            { name: "Users", href: route("admin.users"), icon: Users },
            { name: "Profile", href: route("admin.profile"), icon: User },
            ...(adminProfile && String(adminProfile.admin_level) === 'super_admin' ? [
                {
                    name: "User Management",
                    icon: Shield,
                    subNav: [
                        { name: "Admins", href: route("admin.manage.admins") },
                        { name: "Judges", href: route("admin.manage.judges") },
                    ],
                },
            ] : []),
            {
                name: "Hacksphere",
                icon: Zap,
                subNav: [
                    {
                        name: "Activities",
                        href: route("admin.hacksphere.activities"),
                    },
                    { name: "Teams", href: route("admin.hacksphere.teams") },
                ],
            },
            {
                name: "Talksphere",
                href: route("admin.talksphere.participants"),
                icon: Users,
            },
            {
                name: "Exposphere",
                href: route("admin.exposphere.participants"),
                icon: Globe,
            },
            {
                name: "Festsphere",
                href: route("admin.festsphere.participants"),
                icon: Lightbulb,
            },
        ],
        judge: [
            { name: "Dashboard", href: route("judge.dashboard"), icon: Home },
            { name: "Profile", href: route("judge.profile"), icon: User },
        ],     
    };

    const currentNavigation =
        navigation[userRole as keyof typeof navigation] ||
        navigation.participant;

    // Render navigation items function
    const renderNavigationItems = (isMobile: boolean) => {
        return currentNavigation.map((item) => (
            <div key={item.name}>
                {item.href ? (
                    <Link
                        href={item.href}
                        className={`group flex items-center px-3 py-3 font-medium rounded-md text-white transition-all duration-200 hover:bg-indigo-900/40 hover:translate-x-1 ${
                            isMobile ? "text-base" : "text-sm"
                        }`}
                    >
                        <item.icon className={`${isMobile ? "mr-4 h-6 w-6" : "mr-3 h-5 w-5"} text-indigo-400 group-hover:text-indigo-300 transition-colors duration-200`} />
                        {item.name}
                    </Link>
                ) : (
                    <div className="space-y-1">
                        <button
                            onClick={() => toggleDropdown(item.name)}
                            className={`w-full group flex items-center justify-between px-3 py-3 font-medium rounded-md text-white transition-all duration-200 hover:bg-indigo-900/40 hover:translate-x-1 ${
                                isMobile ? "text-base" : "text-sm"
                            }`}
                        >
                            <div className="flex items-center">
                                <item.icon className={`${isMobile ? "mr-4 h-6 w-6" : "mr-3 h-5 w-5"} text-indigo-400`} />
                                {item.name}
                            </div>
                            {openDropdowns[item.name] ? (
                                <ChevronUp className={`${isMobile ? "h-5 w-5" : "h-4 w-4"} text-gray-400`} />
                            ) : (
                                <ChevronDown className={`${isMobile ? "h-5 w-5" : "h-4 w-4"} text-gray-400`} />
                            )}
                        </button>
                        {openDropdowns[item.name] && item.subNav && (
                            <div className={`${isMobile ? "pl-10" : "pl-9"} space-y-1`}>
                                {item.subNav.map((subItem) => (
                                    <Link
                                        key={subItem.name}
                                        href={subItem.href}
                                        className={`group flex items-center px-2 py-2 font-medium rounded-md text-gray-300 transition-all duration-200 hover:text-white hover:bg-indigo-600/30 hover:translate-x-1 ${
                                            isMobile ? "text-sm" : "text-xs"
                                        }`}
                                    >
                                        {subItem.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className={`min-h-screen bg-gray-900 bg-[url('/assets/blue-grid.png')] bg-fixed bg-cover bg-blend-overlay ${sidebarOpen ? 'overflow-hidden' : ''} relative`}>
            {/* Overlay to prevent main content interaction when sidebar is open on mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-30 md:hidden" 
                    aria-hidden="true"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            {/* Mobile sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <div className="fixed inset-0 flex z-40 md:hidden sidebar">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-gray-900/50 backdrop-blur-md"
                            onClick={() => setSidebarOpen(false)}
                        />

                        {/* Sidebar panel */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="absolute bottom-0 top-0 left-0 flex w-full max-w-xs flex-col bg-gradient-to-b from-gray-800/95 via-gray-900/95 to-black/95 border-r border-indigo-900/30 shadow-xl"
                        >
                            {/* Close button */}
                            <div className="absolute right-0 top-0 -mr-12 pt-2">
                                <button
                                    type="button"
                                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="sr-only">Close sidebar</span>
                                    <X className="h-6 w-6 text-white" />
                                </button>
                            </div>

                            {/* Logo */}
                            <div className="flex shrink-0 items-center px-4 py-5 border-b border-indigo-900/30">
                                <div className="flex items-center space-x-2">
                                    <Logo />
                                    <div>
                                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                                            Compsphere 2025
                                        </span>

                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                                <nav className="flex-1 space-y-1 px-2">
                                    {renderNavigationItems(true)}
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="mt-4 w-full group flex items-center px-3 py-3 text-base font-medium rounded-md text-white transition-all duration-200 hover:bg-red-900/40 hover:translate-x-1"
                                    >
                                        <LogOut className="mr-4 h-6 w-6 text-red-400 group-hover:text-red-300 transition-colors duration-200" />
                                        Logout
                                    </Link>
                                </nav>
                            </div>

                            {/* User info */}
                            <div className="flex shrink-0 border-t border-gray-700 p-4">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                        <User className="h-6 w-6 text-gray-300" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-base font-medium text-white">
                                            {auth.user?.full_name}
                                        </p>
                                        <p className="text-sm font-medium text-gray-400 capitalize">
                                            {auth.user?.role === "admin" && adminProfile
                                                ? `${auth.user.role} (Level: ${adminProfile.admin_level || "Regular"})`
                                                : auth.user?.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Desktop sidebar */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col sidebar">
                <div className="flex h-full flex-col bg-gradient-to-b from-gray-800 via-gray-900 to-black border-r border-indigo-900/30 shadow-xl">
                    {/* Logo - Fixed at top */}
                    <div className="flex shrink-0 items-center px-4 py-5 border-b border-indigo-900/30 sticky top-0 z-10 bg-gray-900">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 to-transparent"></div>
                        <div className="flex items-center space-x-2 relative z-10">
                            <Logo />
                            <div>
                                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                                    Compsphere 2025
                                </span>

                            </div>
                        </div>
                    </div>

                    {/* Navigation - Scrollable middle section */}
                    <div className="flex-1 overflow-y-auto py-4 px-2">
                        <nav className="space-y-1">
                            {renderNavigationItems(false)}
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="mt-4 w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-white transition-all duration-200 hover:bg-red-900/40 hover:translate-x-1"
                            >
                                <LogOut className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-300 transition-colors duration-200" />
                                Logout
                            </Link>
                        </nav>
                    </div>

                    {/* User info - Fixed at bottom */}
                    <div className="flex shrink-0 border-t border-gray-700 p-4 sticky bottom-0 bg-gray-900 mt-auto">
                        <div className="flex items-center w-full">
                            <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-300" />
                            </div>
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">
                                    {auth.user?.full_name}
                                </p>
                                <p className="text-xs font-medium text-gray-400 capitalize truncate">
                                    {auth.user?.role === "admin" && adminProfile
                                        ? `${auth.user.role} (Level: ${adminProfile.admin_level || "Regular"})`
                                        : auth.user?.role}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile nav toggle button */}
            <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-900/80 backdrop-blur-sm">
                <button
                    type="button"
                    className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-300 hover:text-white hover:bg-indigo-600/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    onClick={() => setSidebarOpen(true)}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col md:pl-64">
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
