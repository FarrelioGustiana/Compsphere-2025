import React from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { User } from "@/types/models";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface Assignment {
    event: string;
    category: string;
    status: string;
    pending_count?: number;
    url?: string;
}

interface JudgeDashboardProps {
    user: User;
    judgeProfile: any;
    assignments: Assignment[];
    stats?: {
        totalSubmissions: number;
        evaluatedSubmissions: number;
        pendingSubmissions: number;
        completionPercentage: number;
    };
}

export default function Dashboard({ user, judgeProfile, assignments, stats }: JudgeDashboardProps) {
    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-400" />;
        }
    };

    return (
        <DashboardLayout>
            <Head title="Judge Dashboard" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-200">Judge Dashboard</h1>
                    <p className="mt-1 text-gray-400">
                        Welcome, {user.full_name}. Here are your judging assignments.
                    </p>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Your Assignments</h2>
                    
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-800 p-4 rounded-lg shadow">
                                <p className="text-sm text-gray-400">Total Submissions</p>
                                <p className="text-2xl font-bold text-white">{stats.totalSubmissions}</p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg shadow">
                                <p className="text-sm text-gray-400">Evaluated</p>
                                <p className="text-2xl font-bold text-green-500">{stats.evaluatedSubmissions}</p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg shadow">
                                <p className="text-sm text-gray-400">Pending</p>
                                <p className="text-2xl font-bold text-yellow-500">{stats.pendingSubmissions}</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-700">
                            {assignments.map((assignment, index) => (
                                <li key={index}>
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-blue-400 truncate">
                                                {assignment.event} - {assignment.category}
                                            </p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-200">
                                                    {assignment.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-400">
                                                    {getStatusIcon(assignment.status)}
                                                    <span className="ml-1">
                                                        {assignment.status === 'Pending' ? 'Awaiting submissions' : 'Status: ' + assignment.status}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0">
                                                <a
                                                    href={assignment.url}
                                                    className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300 focus:outline-none"
                                                >
                                                    View Submissions
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Your Profile</h2>
                    
                    <div className="bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-300 mb-2">Personal Information</h3>
                                <p className="text-gray-400">
                                    <span className="font-medium">Name:</span> {user.full_name}
                                </p>
                                <p className="text-gray-400">
                                    <span className="font-medium">Email:</span> {user.email}
                                </p>
                                <p className="text-gray-400">
                                    <span className="font-medium">Role:</span> Judge
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-300 mb-2">Expertise</h3>
                                <p className="text-gray-400">
                                    <span className="font-medium">Categories:</span> Web Development, Mobile Development
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
