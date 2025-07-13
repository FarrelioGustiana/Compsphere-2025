import React from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { User } from "@/types/models";
import { Users, Award, UserCheck, Mic, Music } from "lucide-react";
import { route } from "ziggy-js";

interface UserStats {
    total: number;
    participants: number;
    judges: number;
    admins: number;
}

interface AdminDashboardProps {
    user: User;
    adminProfile: any;
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

    return (
        <DashboardLayout>
            <Head title="Admin Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-200">
                        Admin Dashboard
                    </h1>
                    <p className="mt-1 text-gray-400">
                        Welcome back, {user.first_name}. Here's an overview of
                        the system.
                    </p>
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
                </div>
            </div>
        </DashboardLayout>
    );
}
