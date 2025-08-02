import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import {
    Users,
    Search,
    ChevronDown,
    ChevronUp,
    Eye,
    Calendar,
    BarChart,
} from "lucide-react";
import { route } from "ziggy-js";

interface Team {
    id: number;
    team_name: string;
    team_code: string;
    leader_name: string;
    member_count: number;
    progress_percentage: number;
    created_at: string;
}

interface TeamsPageProps {
    teams: Team[];
    total_teams: number;
}

export default function Teams({ teams, total_teams }: TeamsPageProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: "asc" | "desc";
    }>({ key: "team_name", direction: "asc" });

    // Filter teams based on search term
    const filteredTeams = teams.filter((team) => {
        return (
            team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.leader_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.team_code.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Sort teams based on sort config
    const sortedTeams = [...filteredTeams].sort((a, b) => {
        if (sortConfig.key === "team_name") {
            return sortConfig.direction === "asc"
                ? a.team_name.localeCompare(b.team_name)
                : b.team_name.localeCompare(a.team_name);
        } else if (sortConfig.key === "leader_name") {
            return sortConfig.direction === "asc"
                ? a.leader_name.localeCompare(b.leader_name)
                : b.leader_name.localeCompare(a.leader_name);
        } else if (sortConfig.key === "team_code") {
            return sortConfig.direction === "asc"
                ? a.team_code.localeCompare(b.team_code)
                : b.team_code.localeCompare(a.team_code);
        } else if (sortConfig.key === "progress_percentage") {
            return sortConfig.direction === "asc"
                ? a.progress_percentage - b.progress_percentage
                : b.progress_percentage - a.progress_percentage;
        } else if (sortConfig.key === "created_at") {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortConfig.direction === "asc"
                ? dateA - dateB
                : dateB - dateA;
        }
        return 0;
    });

    // Toggle sort direction
    const requestSort = (key: string) => {
        setSortConfig((prevConfig) => {
            if (prevConfig.key === key) {
                return {
                    key,
                    direction: prevConfig.direction === "asc" ? "desc" : "asc",
                };
            }
            return { key, direction: "asc" };
        });
    };

    const getSortIcon = (key: string) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === "asc" ? (
            <ChevronUp size={16} />
        ) : (
            <ChevronDown size={16} />
        );
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <DashboardLayout>
            <Head title="Hacksphere Teams" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-200">
                        Hacksphere Teams
                    </h1>
                    <p className="mt-1 text-gray-400">
                        Manage teams participating in the Hacksphere hackathon
                    </p>
                </div>

                {/* Teams Overview Stats */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 rounded-md p-3 bg-blue-500">
                                    <Users
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-400 truncate">
                                            Total Teams Registered
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-200">
                                                {total_teams}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Teams Table */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <div className="bg-gray-800 shadow rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-700">
                            <h2 className="text-xl font-medium text-gray-200">
                                Teams
                            </h2>
                        </div>

                        {/* Search Filter */}
                        <div className="p-4">
                            <div className="relative max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search
                                        size={18}
                                        className="text-gray-400"
                                    />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full bg-gray-700 border-gray-600 rounded-md pl-10 pr-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search teams by name, code or leader..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Teams Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                            onClick={() =>
                                                requestSort("team_name")
                                            }
                                        >
                                            <div className="flex items-center">
                                                Team Name
                                                {getSortIcon("team_name")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                            onClick={() =>
                                                requestSort("leader_name")
                                            }
                                        >
                                            <div className="flex items-center">
                                                Team Leader
                                                {getSortIcon("leader_name")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                            onClick={() =>
                                                requestSort(
                                                    "progress_percentage"
                                                )
                                            }
                                        >
                                            <div className="flex items-center">
                                                Progress
                                                {getSortIcon(
                                                    "progress_percentage"
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                            onClick={() =>
                                                requestSort("created_at")
                                            }
                                        >
                                            <div className="flex items-center">
                                                Registered On
                                                {getSortIcon("created_at")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {sortedTeams.length > 0 ? (
                                        sortedTeams.map((team) => (
                                            <tr key={team.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-200">
                                                        {team.team_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-300">
                                                        {team.leader_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2 flex-grow max-w-[100px]">
                                                            <div
                                                                className="bg-blue-500 h-2.5 rounded-full"
                                                                style={{
                                                                    width: `${team.progress_percentage}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm text-gray-300">
                                                            {Math.round(
                                                                team.progress_percentage
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-300 flex items-center">
                                                        <Calendar
                                                            size={14}
                                                            className="mr-1 text-gray-400"
                                                        />
                                                        {formatDate(
                                                            team.created_at
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                                    <Link
                                                        href={route(
                                                            "admin.hacksphere.team.details",
                                                            { team_id: team.id }
                                                        )}
                                                        className="text-blue-400 hover:text-blue-300 flex items-center justify-center"
                                                    >
                                                        <Eye
                                                            size={16}
                                                            className="mr-1"
                                                        />
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-4 text-center text-gray-400"
                                            >
                                                No teams found matching your
                                                search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
