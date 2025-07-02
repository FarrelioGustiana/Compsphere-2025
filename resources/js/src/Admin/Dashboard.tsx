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

export default function Dashboard({ user, adminProfile, userStats }: AdminDashboardProps) {
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
                    <h1 className="text-2xl font-semibold text-gray-200">Admin Dashboard</h1>
                    <p className="mt-1 text-gray-400">
                        Welcome back, {user.first_name}. Here's an overview of the system.
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
                                        <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                                            <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
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
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Quick Links</h2>
                    
                    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-700">
                            <li>
                                <a href={route('admin.users')} className="block hover:bg-gray-750">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-blue-400 truncate">
                                                Manage Users
                                            </p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    View All
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-400">
                                                    <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                    View and manage all users in the system
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href={route('admin.event.participants', { eventCode: 'talksphere' })} className="block hover:bg-gray-750">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-cyan-400 truncate">
                                                Talksphere Participants
                                            </p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-100 text-cyan-800">
                                                    View All
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-400">
                                                    <Mic className="flex-shrink-0 mr-1.5 h-5 w-5 text-cyan-400" />
                                                    View and manage Talksphere registrations
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href={route('admin.event.participants', { eventCode: 'festsphere' })} className="block hover:bg-gray-750">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-purple-400 truncate">
                                                Festsphere Participants
                                            </p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                    View All
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-400">
                                                    <Music className="flex-shrink-0 mr-1.5 h-5 w-5 text-purple-400" />
                                                    View and manage Festsphere registrations
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
