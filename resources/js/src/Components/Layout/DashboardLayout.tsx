import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Home,
    User,
    LogOut,
    Menu,
    X,
    Users,
    Award,
    Settings,
    ChevronDown,
    ChevronUp,
    Zap,
    Globe,
    Lightbulb,
} from "lucide-react";
import { PageProps } from "@/types";
import { route } from "ziggy-js";

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
            {
                name: "Hacksphere",
                icon: Zap,
                subNav: [
                    { name: "Activities", href: route("admin.hacksphere.activities") },
                    { name: "Teams", href: route("admin.hacksphere.teams") },
                ],
            },
            { name: "Talksphere", href: "#", icon: Users },
            { name: "Exposphere", href: "#", icon: Globe },
            { name: "Festsphere", href: "#", icon: Lightbulb },
        ],
        judge: [
            { name: "Dashboard", href: route("judge.dashboard"), icon: Home },
            { name: "Profile", href: route("judge.profile"), icon: User },
        ],
    };

    const currentNavigation =
        navigation[userRole as keyof typeof navigation] ||
        navigation.participant;

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Mobile sidebar */}
            <div
                className={`fixed inset-0 flex z-40 md:hidden ${
                    sidebarOpen ? "" : "hidden"
                }`}
            >
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75"
                    onClick={() => setSidebarOpen(false)}
                ></div>

                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="sr-only">Close sidebar</span>
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>

                    <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                        <div className="flex-shrink-0 flex items-center px-4">
                            <span className="text-xl font-bold text-white">
                                Compsphere 2025
                            </span>
                        </div>
                        <nav className="mt-5 px-2 space-y-1">
                            {currentNavigation.map((item) => (
                                <div key={item.name}>
                                    {item.href ? (
                                        <Link
                                            href={item.href}
                                            className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700"
                                        >
                                            <item.icon className="mr-4 h-6 w-6 text-gray-400" />
                                            {item.name}
                                        </Link>
                                    ) : (
                                        <div className="space-y-1">
                                            <button
                                                onClick={() =>
                                                    toggleDropdown(item.name)
                                                }
                                                className="w-full group flex items-center justify-between px-2 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700"
                                            >
                                                <div className="flex items-center">
                                                    <item.icon className="mr-4 h-6 w-6 text-gray-400" />
                                                    {item.name}
                                                </div>
                                                {openDropdowns[item.name] ? (
                                                    <ChevronUp className="h-5 w-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                                )}
                                            </button>
                                            {openDropdowns[item.name] &&
                                                item.subNav && (
                                                    <div className="pl-10 space-y-1">
                                                        {item.subNav.map(
                                                            (
                                                                subItem: SubNavItem
                                                            ) => (
                                                                <Link
                                                                    key={
                                                                        subItem.name
                                                                    }
                                                                    href={
                                                                        subItem.href
                                                                    }
                                                                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
                                                                >
                                                                    {
                                                                        subItem.name
                                                                    }
                                                                </Link>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700"
                            >
                                <LogOut className="mr-4 h-6 w-6 text-gray-400" />
                                Logout
                            </Link>
                        </nav>
                    </div>

                    <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
                        <div className="flex-shrink-0 group block">
                            <div className="flex items-center">
                                <div>
                                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                        <User className="h-6 w-6 text-gray-300" />
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-base font-medium text-white">
                                        {auth.user?.full_name}
                                    </p>
                                    <p className="text-sm font-medium text-gray-400 capitalize">
                                        {auth.user?.role === "admin" &&
                                        adminProfile
                                            ? `${auth.user.role} (Level: ${adminProfile.admin_level})`
                                            : auth.user?.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <span className="text-xl font-bold text-white">
                                Compsphere 2025
                            </span>
                        </div>
                        <nav className="mt-5 flex-1 px-2 space-y-1">
                            {currentNavigation.map((item) => (
                                <div key={item.name}>
                                    {item.href ? (
                                        <Link
                                            href={item.href}
                                            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-gray-700"
                                        >
                                            <item.icon className="mr-3 h-6 w-6 text-gray-400" />
                                            {item.name}
                                        </Link>
                                    ) : (
                                        <div className="space-y-1">
                                            <button
                                                onClick={() =>
                                                    toggleDropdown(item.name)
                                                }
                                                className="w-full group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-gray-700"
                                            >
                                                <div className="flex items-center">
                                                    <item.icon className="mr-3 h-6 w-6 text-gray-400" />
                                                    {item.name}
                                                </div>
                                                {openDropdowns[item.name] ? (
                                                    <ChevronUp className="h-4 w-4 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                                )}
                                            </button>
                                            {openDropdowns[item.name] &&
                                                item.subNav && (
                                                    <div className="pl-9 space-y-1">
                                                        {item.subNav.map(
                                                            (
                                                                subItem: SubNavItem
                                                            ) => (
                                                                <Link
                                                                    key={
                                                                        subItem.name
                                                                    }
                                                                    href={
                                                                        subItem.href
                                                                    }
                                                                    className="group flex items-center px-2 py-2 text-xs font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
                                                                >
                                                                    {
                                                                        subItem.name
                                                                    }
                                                                </Link>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-gray-700"
                            >
                                <LogOut className="mr-3 h-6 w-6 text-gray-400" />
                                Logout
                            </Link>
                        </nav>
                    </div>

                    <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
                        <div className="flex-shrink-0 w-full group block">
                            <div className="flex items-center">
                                <div>
                                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                        <User className="h-6 w-6 text-gray-300" />
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-white">
                                        {auth.user?.full_name}
                                    </p>
                                    <p className="text-xs font-medium text-gray-400 capitalize">
                                        {auth.user?.role === "admin" &&
                                        adminProfile
                                            ? `${auth.user.role} (Level: ${adminProfile.admin_level})`
                                            : auth.user?.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:pl-64 flex flex-col flex-1">
                <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-900">
                    <button
                        type="button"
                        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
