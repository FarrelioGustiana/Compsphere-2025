import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import {
    CheckCircle,
    XCircle,
    Search,
    Filter,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

interface Activity {
    id: number;
    name: string;
    description: string;
    activity_code: string;
    is_active: boolean;
    teams_completed: number;
    total_teams: number;
    progress_percentage: number;
}

interface Team {
    id: number;
    team_name: string;
    leader_name: string;
    activity_statuses: {
        [key: number]: {
            status: string;
            verified_at: string | null;
            verified_by: string | null;
        };
    };
}

interface HacksphereActivitiesProps {
    activities: Activity[];
    teams: Team[];
}

export default function Activities({
    activities,
    teams,
}: HacksphereActivitiesProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedActivity, setSelectedActivity] = useState<number | null>(
        activities.length > 0 ? activities[0].id : null
    );
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: "asc" | "desc";
    }>({ key: "team_name", direction: "asc" });

    // Get the selected activity
    const currentActivity = activities.find(
        (activity) => activity.id === selectedActivity
    );

    // Filter teams based on search term and status
    const filteredTeams = teams.filter((team) => {
        const matchesSearch =
            team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.leader_name.toLowerCase().includes(searchTerm.toLowerCase());

        if (statusFilter === "all") {
            return matchesSearch;
        } else if (statusFilter === "verified" && selectedActivity) {
            return (
                matchesSearch &&
                team.activity_statuses[selectedActivity].status === "verified"
            );
        } else if (statusFilter === "not_verified" && selectedActivity) {
            return (
                matchesSearch &&
                team.activity_statuses[selectedActivity].status ===
                    "not_verified"
            );
        }

        return matchesSearch;
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
        } else if (sortConfig.key === "status" && selectedActivity) {
            const statusA = a.activity_statuses[selectedActivity].status;
            const statusB = b.activity_statuses[selectedActivity].status;
            return sortConfig.direction === "asc"
                ? statusA.localeCompare(statusB)
                : statusB.localeCompare(statusA);
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
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <DashboardLayout>
            <Head title="Hacksphere Activities" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-200">
                        Hacksphere Activities
                    </h1>
                    <p className="mt-1 text-gray-400">
                        Track teams' progress through Hacksphere activities
                    </p>
                </div>

                {/* Activity Overview Cards */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <h2 className="text-xl font-medium text-gray-200 mb-4">
                        Activity Overview
                    </h2>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                className={`bg-gray-800 overflow-hidden shadow rounded-lg cursor-pointer border-2 ${
                                    selectedActivity === activity.id
                                        ? "border-blue-500"
                                        : "border-transparent"
                                }`}
                                onClick={() => setSelectedActivity(activity.id)}
                            >
                                <div className="p-5">
                                    <h3 className="text-lg font-medium text-gray-200 mb-2">
                                        {activity.name}
                                    </h3>
                                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                        {activity.description}
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>Teams Completed:</span>
                                        <span className="font-medium text-gray-200">
                                            {activity.teams_completed} /{" "}
                                            {activity.total_teams}
                                        </span>
                                    </div>
                                    <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{
                                                width: `${activity.progress_percentage}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Status Table */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <div className="bg-gray-800 shadow rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-700">
                            <h2 className="text-xl font-medium text-gray-200">
                                {currentActivity
                                    ? `Teams for ${currentActivity.name}`
                                    : "Select an Activity"}
                            </h2>
                        </div>

                        {/* Table Filters */}
                        <div className="p-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search
                                        size={18}
                                        className="text-gray-400"
                                    />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full bg-gray-700 border-gray-600 rounded-md pl-10 pr-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search teams..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Filter
                                        size={18}
                                        className="text-gray-400"
                                    />
                                </div>
                                <select
                                    className="block w-full bg-gray-700 border-gray-600 rounded-md pl-10 pr-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="verified">Verified</option>
                                    <option value="not_verified">
                                        Not Verified
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Team Status Table */}
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
                                                requestSort("status")
                                            }
                                        >
                                            <div className="flex items-center">
                                                Status
                                                {getSortIcon("status")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                                        >
                                            Verified At
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                                        >
                                            Verified By
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {selectedActivity &&
                                    sortedTeams.length > 0 ? (
                                        sortedTeams.map((team) => {
                                            const activityStatus =
                                                team.activity_statuses[
                                                    selectedActivity
                                                ];
                                            return (
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
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                activityStatus.status ===
                                                                "verified"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {activityStatus.status ===
                                                            "verified" ? (
                                                                <>
                                                                    <CheckCircle
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="mr-1"
                                                                    />
                                                                    Verified
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="mr-1"
                                                                    />
                                                                    Not Verified
                                                                </>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {formatDate(
                                                            activityStatus.verified_at
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {activityStatus.verified_by ||
                                                            "-"}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-4 text-center text-gray-400"
                                            >
                                                {selectedActivity
                                                    ? "No teams found matching your filters."
                                                    : "Select an activity to view team status."}
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
