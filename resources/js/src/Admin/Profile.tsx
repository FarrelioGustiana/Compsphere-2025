import React from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { User } from "@/types/models";

interface AdminProfileProps {
    user: User;
    adminProfile: any;
}

export default function Profile({ user, adminProfile }: AdminProfileProps) {
    return (
        <DashboardLayout>
            <Head title="Admin Profile" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-200">Admin Profile</h1>
                    <p className="mt-1 text-gray-400">
                        Your administrator account details.
                    </p>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-200">
                                Administrator Information
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-400">
                                Your personal details and administrative access.
                            </p>
                        </div>
                        <div className="border-t border-gray-700">
                            <dl>
                                <div className="bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-400">
                                        Full name
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2">
                                        {user.full_name}
                                    </dd>
                                </div>
                                <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-400">
                                        Email address
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2">
                                        {user.email}
                                    </dd>
                                </div>
                                <div className="bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-400">
                                        Role
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2 capitalize">
                                        {user.role}
                                    </dd>
                                </div>
                                <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-400">
                                        Admin Level
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            Full Access
                                        </span>
                                    </dd>
                                </div>
                                <div className="bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-400">
                                        Account Status
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
