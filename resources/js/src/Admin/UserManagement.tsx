import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { User, UserManagementStats } from "@/types/models";
import { Users, UserPlus, Award, Shield, UserCheck } from "lucide-react";
import { CreateModeratorForm, CreateJudgeForm, RecentUsersList } from "./Components";

interface UserManagementProps {
    user: User;
    stats: UserManagementStats;
    recentAdmins: User[];
    recentJudges: User[];
}

type ActiveTab = 'overview' | 'create-moderator' | 'create-judge' | 'manage-admins' | 'manage-judges';

export default function UserManagement({
    user,
    stats,
    recentAdmins,
    recentJudges,
}: UserManagementProps) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('create-moderator');

    const statCards = [
        {
            title: "Total Admins",
            value: stats.total_admins,
            icon: Users,
            color: "bg-blue-500",
        },
        {
            title: "Super Admins",
            value: stats.super_admins,
            icon: Shield,
            color: "bg-red-500",
        },
        {
            title: "Moderators",
            value: stats.moderators,
            icon: UserCheck,
            color: "bg-green-500",
        },
        {
            title: "Judges",
            value: stats.judges,
            icon: Award,
            color: "bg-purple-500",
        },
    ];

    const tabs = [
        { id: 'create-moderator' as ActiveTab, label: 'Create Moderator', icon: UserPlus },
        { id: 'create-judge' as ActiveTab, label: 'Create Judge', icon: Award },
       
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        {/* Statistics Cards */}
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

                        {/* Recent Lists */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <RecentUsersList 
                                title="Recent Admins"
                                users={recentAdmins}
                                type="admin"
                            />
                            <RecentUsersList 
                                title="Recent Judges"
                                users={recentJudges}
                                type="judge"
                            />
                        </div>
                    </div>
                );

            case 'create-moderator':
                return <CreateModeratorForm />;

            case 'create-judge':
                return <CreateJudgeForm />;

            default:
                return null;
        }
    };

    return (
        <DashboardLayout>
            <Head title="User Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-200">
                            User Management
                        </h1>
                        <p className="mt-1 text-gray-400">
                            Manage admin and judge accounts. Only accessible to super admins.
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="mb-6">
                        <div className="border-b border-gray-700">
                            <nav className="-mb-px flex space-x-8">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            flex items-center py-4 px-1 border-b-2 font-medium text-sm
                                            ${
                                                activeTab === tab.id
                                                    ? 'border-blue-500 text-blue-400'
                                                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                                            }
                                        `}
                                    >
                                        <tab.icon className="h-5 w-5 mr-2" />
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-96">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
