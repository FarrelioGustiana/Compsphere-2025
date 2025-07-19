import React, { useState } from "react";
import { EventRegistration, Event } from "@/types/models";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

interface ParticipantTableProps {
    registrations: EventRegistration[];
    event: Event;
}

const ParticipantTable: React.FC<ParticipantTableProps> = ({
    registrations,
    event,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<
        keyof EventRegistration | "name" | "email"
    >("registration_date");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    // Handle sorting
    const handleSort = (field: keyof EventRegistration | "name" | "email") => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Filter registrations based on search term
    const filteredRegistrations = registrations.filter((registration) => {
        const searchTermLower = searchTerm.toLowerCase();
        const userData = registration.participant?.user;

        return (
            userData?.full_name?.toLowerCase().includes(searchTermLower) ||
            userData?.email?.toLowerCase().includes(searchTermLower) ||
            registration.participant?.job_or_institution
                ?.toLowerCase()
                .includes(searchTermLower) ||
            registration.participant?.domicile
                ?.toLowerCase()
                .includes(searchTermLower) ||
            registration.participant?.category
                ?.toLowerCase()
                .includes(searchTermLower)
        );
    });

    // Sort registrations based on sort field and direction
    const sortedRegistrations = [...filteredRegistrations].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortField === "name") {
            aValue = a.participant?.user?.full_name || "";
            bValue = b.participant?.user?.full_name || "";
        } else if (sortField === "email") {
            aValue = a.participant?.user?.email || "";
            bValue = b.participant?.user?.email || "";
        } else {
            aValue = a[sortField] || "";
            bValue = b[sortField] || "";
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Get registration status badge color
    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "registered":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Get payment status badge color
    const getPaymentBadgeColor = (status: string | null) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "failed":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 bg-white">
                <div className="flex items-center mb-4">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                            placeholder="Search for participants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("name")}
                                >
                                    <div className="flex items-center">
                                        Name
                                        {sortField === "name" && (
                                            <span className="ml-1">
                                                {sortDirection === "asc" ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("email")}
                                >
                                    <div className="flex items-center">
                                        Email
                                        {sortField === "email" && (
                                            <span className="ml-1">
                                                {sortDirection === "asc" ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Institution
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() =>
                                        handleSort("registration_date")
                                    }
                                >
                                    <div className="flex items-center">
                                        Reg. Date
                                        {sortField === "registration_date" && (
                                            <span className="ml-1">
                                                {sortDirection === "asc" ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() =>
                                        handleSort("registration_status")
                                    }
                                >
                                    <div className="flex items-center">
                                        Status
                                        {sortField ===
                                            "registration_status" && (
                                            <span className="ml-1">
                                                {sortDirection === "asc" ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                {event.is_paid_event && (
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() =>
                                            handleSort("payment_status")
                                        }
                                    >
                                        <div className="flex items-center">
                                            Payment
                                            {sortField === "payment_status" && (
                                                <span className="ml-1">
                                                    {sortDirection === "asc" ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedRegistrations.length > 0 ? (
                                sortedRegistrations.map((registration) => (
                                    <tr key={registration.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">
                                                {registration.participant?.user
                                                    ?.first_name +
                                                    " " +
                                                    registration.participant
                                                        ?.user?.last_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-gray-500">
                                                {
                                                    registration.participant
                                                        ?.user?.email
                                                }
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-gray-500">
                                                {registration.participant
                                                    ?.job_or_institution ||
                                                    "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-gray-500">
                                                {formatDate(
                                                    registration.registration_date
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                                                    registration.registration_status
                                                )}`}
                                            >
                                                {
                                                    registration.registration_status
                                                }
                                            </span>
                                        </td>
                                        {event.is_paid_event && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {registration.event
                                                    ?.is_paid_event && (
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentBadgeColor(
                                                            registration.payment_status
                                                        )}`}
                                                    >
                                                        {registration.payment_status ||
                                                            "N/A"}
                                                    </span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                                    >
                                        No registrations found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ParticipantTable;
