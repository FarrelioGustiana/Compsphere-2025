import React from "react";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { Users, ChevronRight, PieChart, BarChart3, Activity } from "lucide-react";
import { route } from "ziggy-js";

interface CategoryStats {
    [key: string]: number;
}

interface PaymentStats {
    paid: number;
    pending: number;
    failed: number;
}

interface TeamInfo {
    id: number;
    team_name: string;
    category: string;
    category_label: string;
    payment_status: string;
    leader_name: string;
}

interface DashboardProps {
    teamsByCategory: {
        [key: string]: number;
    };
    totalTeams: number;
    paymentStats: PaymentStats;
    recentTeams: TeamInfo[];
}

export default function Dashboard({ 
    teamsByCategory, 
    totalTeams, 
    paymentStats, 
    recentTeams 
}: DashboardProps) {
    
    // Calculate percentages for the pie chart
    const calculatePercentage = (value: number) => {
        return totalTeams > 0 ? Math.round((value / totalTeams) * 100) : 0;
    };
    
    // Get category colors
    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case "high school":
                return "bg-blue-500";
            case "university":
                return "bg-purple-500";
            case "non-academic":
                return "bg-green-500";
            default:
                return "bg-gray-500";
        }
    };
    
    // Get payment status color
    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "paid":
                return "bg-green-500";
            case "pending":
                return "bg-yellow-500";
            case "failed":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };
    
    // Get payment status badge
    const getPaymentStatusBadge = (status: string) => {
        switch (status) {
            case "paid":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                    </span>
                );
            case "failed":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Failed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Unknown
                    </span>
                );
        }
    };
    
    return (
        <DashboardLayout>
            <Head title="Hacksphere Dashboard" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-200">
                        Hacksphere Dashboard
                    </h1>
                    <p className="mt-1 text-gray-400">
                        Overview of Hacksphere teams and statistics
                    </p>
                </div>
                
                {/* Main Stats */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Total Teams Card */}
                        <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 rounded-md p-3 bg-blue-500">
                                        <Users className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-400 truncate">
                                                Total Teams
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-200">
                                                    {totalTeams}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-700 px-5 py-3">
                                <div className="text-sm">
                                    <Link
                                        href={route("admin.hacksphere.teams")}
                                        className="font-medium text-blue-400 hover:text-blue-300 flex items-center"
                                    >
                                        View all teams
                                        <ChevronRight size={16} className="ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        {/* Payments Card */}
                        <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 rounded-md p-3 bg-green-500">
                                        <Activity className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-400 truncate">
                                                Payment Status
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-200">
                                                    {paymentStats.paid} / {totalTeams} Paid
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-700 px-5 py-3">
                                <div className="text-sm">
                                    <Link
                                        href={route("admin.hacksphere.payments")}
                                        className="font-medium text-blue-400 hover:text-blue-300 flex items-center"
                                    >
                                        View payments
                                        <ChevronRight size={16} className="ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Category Stats */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <div className="bg-gray-800 shadow rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-700">
                            <h2 className="text-xl font-medium text-gray-200 flex items-center">
                                <PieChart className="h-5 w-5 mr-2 text-blue-400" />
                                Teams by Category
                            </h2>
                        </div>
                        
                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Category Chart */}
                                <div className="flex items-center justify-center">
                                    <div className="relative h-48 w-48">
                                        {/* Simple pie chart visualization */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-gray-200">{totalTeams}</div>
                                                <div className="text-sm text-gray-400">Total Teams</div>
                                            </div>
                                        </div>
                                        
                                        {/* Pie segments - we'll use a simple approach with colored segments */}
                                        <svg className="w-full h-full" viewBox="0 0 100 100">
                                            {/* This is a simplified pie chart - in a real app, you'd calculate actual segments */}
                                            {Object.entries(teamsByCategory).length > 0 ? (
                                                <>
                                                    {/* This is just a placeholder - in a real implementation you'd calculate actual angles */}
                                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4f46e5" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="0" />
                                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="125.6" />
                                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="188.4" />
                                                </>
                                            ) : (
                                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#374151" strokeWidth="20" />
                                            )}
                                        </svg>
                                    </div>
                                </div>
                                
                                {/* Category Legend */}
                                <div>
                                    <div className="space-y-4">
                                        {Object.entries(teamsByCategory).map(([category, count]) => (
                                            <div key={category} className="flex items-center">
                                                <div className={`w-4 h-4 rounded-full ${getCategoryColor(category)} mr-3`}></div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-300">{category}</span>
                                                        <span className="text-sm text-gray-400">{count} teams</span>
                                                    </div>
                                                    <div className="mt-1 w-full bg-gray-700 rounded-full h-1.5">
                                                        <div 
                                                            className={`${getCategoryColor(category)} h-1.5 rounded-full`} 
                                                            style={{ width: `${calculatePercentage(count)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {Object.entries(teamsByCategory).length === 0 && (
                                            <div className="text-center text-gray-400 py-4">
                                                No category data available
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Recent Teams */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <div className="bg-gray-800 shadow rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-700">
                            <h2 className="text-xl font-medium text-gray-200 flex items-center">
                                <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                                Recent Teams
                            </h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Team Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Leader
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Payment
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {recentTeams.length > 0 ? (
                                        recentTeams.map((team) => (
                                            <tr key={team.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-200">
                                                        {team.team_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className={`w-2 h-2 rounded-full ${getCategoryColor(team.category_label)} mr-2`}></div>
                                                        <div className="text-sm text-gray-300">
                                                            {team.category_label}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-300">
                                                        {team.leader_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getPaymentStatusBadge(team.payment_status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <Link
                                                        href={route("admin.hacksphere.team.details", { team_id: team.id })}
                                                        className="text-blue-400 hover:text-blue-300 text-sm"
                                                    >
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                                                No teams found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="bg-gray-700 px-5 py-3">
                            <div className="text-sm">
                                <Link
                                    href={route("admin.hacksphere.teams")}
                                    className="font-medium text-blue-400 hover:text-blue-300 flex items-center"
                                >
                                    View all teams
                                    <ChevronRight size={16} className="ml-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
