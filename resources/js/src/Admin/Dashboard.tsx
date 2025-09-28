import React from "react";
import { Head, Link } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { User, AdminProfile } from "@/types/models";
import { Users, Award, UserCheck, Settings, Shield, Plus } from "lucide-react";
import { route } from "ziggy-js";

interface UserStats {
    total: number;
    participants: number;
    judges: number;
    admins: number;
}

interface AdminDashboardProps {
    user: User;
    adminProfile: AdminProfile;
    userStats: UserStats;
}

export default function Dashboard({
    user,
    adminProfile,
    userStats,
}: AdminDashboardProps) {
    const statCards = [
        {
            title: "Total Users",
            value: userStats.total,
            icon: Users,
            color: "bg-blue-500",
        },
        {
            title: "Participants",
            value: userStats.participants,
            icon: UserCheck,
            color: "bg-green-500",
        },
        {
            title: "Judges",
            value: userStats.judges,
            icon: Award,
            color: "bg-purple-500",
        },
        {
            title: "Admins",
            value: userStats.admins,
            icon: Users,
            color: "bg-red-500",
        },
    ];

    // Check if user is super admin
    const isSuperAdmin = adminProfile?.admin_level === 'super_admin';

    return (
        <DashboardLayout>
            <Head title="Admin Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-200">
                                Admin Dashboard
                            </h1>
                            <p className="mt-1 text-gray-400">
                                Welcome back, {user.first_name}. Here's an overview of
                                the system.
                            </p>
                            {isSuperAdmin && (
                                <div className="mt-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        <Shield className="w-3 h-3 mr-1" />
                                        Super Admin
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {isSuperAdmin && (
                            <div>
                                <Link
                                    href={route('admin.user-management')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    User Management
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-gray-800 overflow-hidden shadow rounded-lg"
                            >
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div
                                            className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}
                                        >
                                            <stat.icon
                                                className="h-6 w-6 text-white"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-400 truncate">
                                                    {stat.title}
                                                </dt>
                                                <dd>
                                                    <div className="text-lg font-medium text-gray-200">
                                                        {stat.value}
                                                    </div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isSuperAdmin && (
                        <div className="mt-6">
                            <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <Settings className="h-8 w-8 text-blue-400" />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-medium text-gray-200">
                                                Super Admin Panel
                                            </h3>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Manage admin and judge accounts, system settings, and advanced configurations.
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            <Link
                                                href={route('admin.user-management')}
                                                className="inline-flex items-center px-3 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Access Panel
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
