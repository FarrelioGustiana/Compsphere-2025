import { Head, Link, router } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import {
    User,
    Users,
    Calendar,
    CheckCircle,
    XCircle,
    ArrowLeft,
    Mail,
    MapPin,
    Briefcase,
    CreditCard,
    Clock,
    Link as Url,
    ClipboardCheck,
} from "lucide-react";
import { route } from "ziggy-js";
import { useState } from "react";

interface TeamInfo {
    id: number;
    team_name: string;
    team_code: string;
    profile_picture: string | null;
    created_at: string;
    payment_amount?: number;
    payment_status?: string;
    invoice_id?: string;
    registration_status?: string;
}

interface TeamMember {
    id: number;
    full_name: string;
    email: string;
    role: string;
    nik: string;
    category: string;
    domicile: string;
    payment_status?: string;
    payment_date?: string | null;
    twibbon_link?: string;
}

interface ActivityStatus {
    id: number;
    name: string;
    description: string;
    status: string;
    verified_at: string | null;
    verified_by: string | null;
}

interface TeamDetailsProps {
    team: TeamInfo;
    members: TeamMember[];
    activities: ActivityStatus[];
}

export default function TeamDetails({
    team,
    members,
    activities,
}: TeamDetailsProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount: number) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const verifyTeamPayment = (teamId: number) => {
        router.post(
            route("admin.hacksphere.verify-team-payment", { team_id: teamId })
        );
    };

    const rejectTeamPayment = (teamId: number) => {
        router.post(
            route("admin.hacksphere.reject-team-payment", { team_id: teamId })
        );
    };

    const changeTeamRegistrationStatus = (teamId: number, status: string) => {
        router.post(route("admin.hacksphere.change-team-registration-status"), {
            team_id: teamId,
            status: status,
        });
    };

    const [registrationStatus, setRegistrationStatus] = useState<string>(
        team.registration_status || "pending"
    );

    const teamLeader = members.find((member) => member.role === "Leader");

    const teamMembers = members.filter((member) => member.role !== "Leader");

    return (
        <DashboardLayout>
            <Head title={`Team Details - ${team.team_name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center mb-6">
                        <Link
                            href={route("admin.hacksphere.teams")}
                            className="flex items-center text-sm text-blue-400 hover:text-blue-300 mr-4"
                        >
                            <ArrowLeft size={16} className="mr-1" />
                            Back to Teams
                        </Link>

                        <h1 className="text-2xl font-semibold text-gray-200">
                            Team: {team.team_name}
                        </h1>
                    </div>

                    {/* Team Overview Card */}
                    <div className="bg-gray-800 shadow rounded-lg overflow-hidden mb-8">
                        <div className="p-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    {team.profile_picture ? (
                                        <img
                                            src={team.profile_picture}
                                            alt={team.team_name}
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center">
                                            <Users className="h-12 w-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="ml-6">
                                    <h2 className="text-xl font-bold text-gray-200">
                                        {team.team_name}
                                    </h2>
                                    <div className="mt-1 flex items-center text-sm text-gray-400">
                                        <span className="bg-gray-700 px-2 py-1 rounded text-gray-300 text-xs font-medium">
                                            {team.team_code}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-400">
                                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        <span>
                                            Registered on{" "}
                                            {formatDate(team.created_at)}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-400">
                                        <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        <span>
                                            {members.length} Team Members
                                        </span>
                                    </div>
                                    {team.payment_amount && (
                                        <div className="mt-2 flex items-center text-sm">
                                            <CreditCard className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                            <span className="text-gray-400">
                                                Team Payment Amount:
                                            </span>
                                            <span className="ml-1 text-gray-300">
                                                Rp{" "}
                                                {formatCurrency(
                                                    team.payment_amount ||
                                                        100019
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {team.payment_amount && (
                                        <div className="mt-2 flex items-center text-sm">
                                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                            <span className="text-gray-400">
                                                Team Payment Status:
                                            </span>
                                            <span
                                                className={`ml-1 text-gray-300 capitalize ${
                                                    team.payment_status ===
                                                    "paid"
                                                        ? "text-green-500"
                                                        : team.payment_status ===
                                                          "pending"
                                                        ? "text-yellow-500"
                                                        : team.payment_status ===
                                                          "rejected"
                                                        ? "text-red-500"
                                                        : "text-gray-300"
                                                }`}
                                            >
                                                {team.payment_status}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Team Payment Verification Buttons */}
                        <div className="mt-4 p-4 border-t border-gray-700">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-200">
                                        Team Payment Verification
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Verify or reject payment for the entire
                                        team at once
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3 mt-3 sm:mt-0">
                                    <button
                                        onClick={() =>
                                            verifyTeamPayment(team.id)
                                        }
                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center"
                                    >
                                        <CheckCircle
                                            size={16}
                                            className="mr-2"
                                        />
                                        Verify Team Payment
                                    </button>
                                    <button
                                        onClick={() =>
                                            rejectTeamPayment(team.id)
                                        }
                                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center"
                                    >
                                        <XCircle size={16} className="mr-2" />
                                        Reject Team Payment
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Team Verified Registration */}
                        <div className="mt-4 p-4 border-t border-gray-700">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-200">
                                        Team Registration Status
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Change registration status for the
                                        entire team
                                    </p>
                                    <div className="mt-2">
                                        <span className="text-sm text-gray-400">
                                            Current Status:{" "}
                                        </span>
                                        <span
                                            className={`text-sm font-medium ${
                                                team.registration_status ===
                                                "registered"
                                                    ? "text-green-500"
                                                    : team.registration_status ===
                                                      "rejected"
                                                    ? "text-red-500"
                                                    : "text-yellow-500"
                                            }`}
                                        >
                                            {team.registration_status ||
                                                "pending"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 mt-3 sm:mt-0">
                                    <select
                                        value={registrationStatus}
                                        onChange={(e) =>
                                            setRegistrationStatus(
                                                e.target.value
                                            )
                                        }
                                        className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="registered">
                                            Registered
                                        </option>
                                        <option value="cancelled">
                                            Cancelled
                                        </option>
                                    </select>
                                    <button
                                        onClick={() =>
                                            changeTeamRegistrationStatus(
                                                team.id,
                                                registrationStatus
                                            )
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
                                    >
                                        <ClipboardCheck
                                            size={16}
                                            className="mr-2"
                                        />
                                        Update Status
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Members Section */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-200 mb-4">
                                Team Members
                            </h2>

                            {/* Team Leader */}
                            {teamLeader && (
                                <div className="bg-gray-800 shadow rounded-lg overflow-hidden">
                                    <div className="p-4 border-b border-gray-700">
                                        <h3 className="text-lg font-medium text-gray-200 flex items-center">
                                            <User className="h-5 w-5 text-blue-400 mr-2" />
                                            Team Leader
                                        </h3>
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-3">
                                            <div className="text-base font-medium text-gray-200">
                                                {teamLeader.full_name}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-400 mt-1">
                                                <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <span>{teamLeader.email}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 mt-4">
                                            <div className="flex items-center text-sm">
                                                <CreditCard className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <span className="text-gray-400">
                                                    NIK:
                                                </span>
                                                <span className="ml-1 text-gray-300">
                                                    {teamLeader.nik}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <span className="text-gray-400">
                                                    Category:
                                                </span>
                                                <span className="ml-1 text-gray-300 capitalize">
                                                    {teamLeader.category}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <span className="text-gray-400">
                                                    Domicile:
                                                </span>
                                                <span className="ml-1 text-gray-300">
                                                    {teamLeader.domicile}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <Url className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <span className="text-gray-400">
                                                    Twibbon Link:
                                                </span>
                                                <a
                                                    href={
                                                        teamLeader?.twibbon_link ||
                                                        ""
                                                    }
                                                    target="_blank"
                                                    className="ml-1 text-gray-300"
                                                >
                                                    {teamLeader.twibbon_link ||
                                                        "Haven't uploaded"}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Team Members */}
                            {teamMembers.map((member, index) => (
                                <div
                                    key={member.id}
                                    className="bg-gray-800 shadow rounded-lg overflow-hidden"
                                >
                                    <div className="p-4 border-b border-gray-700">
                                        <h3 className="text-lg font-medium text-gray-200 flex items-center">
                                            <User className="h-5 w-5 text-green-400 mr-2" />
                                            Team Member {index + 1}
                                        </h3>
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-3">
                                            <div className="text-base font-medium text-gray-200">
                                                {member.full_name}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-400 mt-1">
                                                <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <span>{member.email}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 mt-4">
                                            <div className="flex items-center text-sm">
                                                <CreditCard className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <span className="text-gray-400">
                                                    NIK:
                                                </span>
                                                <span className="ml-1 text-gray-300">
                                                    {member.nik}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <span className="text-gray-400">
                                                    Category:
                                                </span>
                                                <span className="ml-1 text-gray-300 capitalize">
                                                    {member.category}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <span className="text-gray-400">
                                                    Domicile:
                                                </span>
                                                <span className="ml-1 text-gray-300">
                                                    {member.domicile}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <Url className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <span className="text-gray-400">
                                                    Twibbon Link:
                                                </span>
                                                <Link
                                                    href={
                                                        member?.twibbon_link ||
                                                        ""
                                                    }
                                                    className="ml-1 text-gray-300"
                                                >
                                                    {member.twibbon_link ||
                                                        "Haven't uploaded"}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Activities Status */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-200 mb-4">
                                Activity Status
                            </h2>

                            <div className="bg-gray-800 shadow rounded-lg overflow-hidden">
                                <div className="divide-y divide-gray-700">
                                    {activities.map((activity) => (
                                        <div key={activity.id} className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-200">
                                                        {activity.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-400">
                                                        {activity.description}
                                                    </p>
                                                </div>
                                                <div className="ml-4">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            activity.status ===
                                                            "Completed"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {activity.status ===
                                                        "Completed" ? (
                                                            <>
                                                                <CheckCircle
                                                                    size={12}
                                                                    className="mr-1"
                                                                />
                                                                {
                                                                    activity.status
                                                                }
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle
                                                                    size={12}
                                                                    className="mr-1"
                                                                />
                                                                {
                                                                    activity.status
                                                                }
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {activity.status ===
                                                "Completed" && (
                                                <div className="mt-3 text-xs text-gray-400">
                                                    <div>
                                                        <span className="font-medium">
                                                            Verified at:
                                                        </span>{" "}
                                                        {formatDate(
                                                            activity.verified_at ||
                                                                ""
                                                        )}
                                                    </div>
                                                    {activity.verified_by && (
                                                        <div>
                                                            <span className="font-medium">
                                                                Verified by:
                                                            </span>{" "}
                                                            {
                                                                activity.verified_by
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
