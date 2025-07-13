import { Head } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { Event, Participant, User } from "@/types/models";
import EventCard from "@/src/Components/Home/EventCard";
import { getColorAndIcon } from "@/src/Pages/Home";
import { Link } from "@inertiajs/react";
import { Users } from "lucide-react";

interface ParticipantDashboardProps {
    user: User;
    participantDetails: any | Participant;
    allEvents: Event[];
    registeredEvents: Event[];
    hacksphereTeam: {
        id: number;
        team_name: string;
        team_code: string;
        is_leader: boolean;
    } | null;
}

export default function Dashboard({
    user,
    participantDetails,
    allEvents,
    registeredEvents,
    hacksphereTeam,
}: ParticipantDashboardProps) {
    return (
        <DashboardLayout>
            <Head title="Participant Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-200">
                        Welcome, {user.first_name + " " + user.last_name}!
                    </h1>
                    <p className="mt-1 text-gray-400">
                        This is your participant dashboard for Compsphere 2025.
                    </p>
                </div>

                {/* Profile Completion Warning */}
                {(!participantDetails ||
                    !participantDetails.category ||
                    !participantDetails.phone_number ||
                    !participantDetails.date_of_birth) && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-6 ">
                        <div className="bg-yellow-900 border-l-4 border-yellow-500 text-yellow-200 p-4 rounded">
                            <div className="font-semibold mb-1">
                                Complete Your Profile
                            </div>
                            <div>
                                You must complete your participant profile
                                before you can register for events.{" "}
                                <a
                                    href="/participant/profile"
                                    className="underline text-yellow-300"
                                >
                                    Go to your profile
                                </a>
                                .
                            </div>
                        </div>
                    </div>
                )}

                {/* Hacksphere Team Card */}
                {hacksphereTeam && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-lg p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-2 flex items-center">
                                        <Users className="mr-2 h-5 w-5" />
                                        Your Hacksphere Team
                                    </h2>
                                    <p className="text-blue-200 mb-4">
                                        {hacksphereTeam.team_name} {hacksphereTeam.is_leader && <span className="bg-yellow-600 text-yellow-100 text-xs px-2 py-0.5 rounded ml-2">Team Leader</span>}
                                    </p>
                                    <p className="text-sm text-blue-300">
                                        Team Code: <span className="font-mono">{hacksphereTeam.team_code}</span>
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0 flex space-x-3">
                                    <Link
                                        href={`/participant/team/${hacksphereTeam.id}`}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:border-blue-800 focus:ring focus:ring-blue-300 transition"
                                    >
                                        Team Dashboard
                                    </Link>
                                    <Link
                                        href={`/participant/teams/${hacksphereTeam.id}/qr-codes/`}
                                        className="inline-flex items-center px-4 py-2 bg-gray-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-600 active:bg-gray-800 focus:outline-none focus:border-gray-800 focus:ring focus:ring-gray-300 transition"
                                    >
                                        Team QR Codes
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">
                        Registered Events
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {registeredEvents.map((event, index) => (
                            <EventCard
                                key={index}
                                event={event}
                                index={index}
                                icon={getColorAndIcon(event.event_code).icon}
                                color={getColorAndIcon(event.event_code).color}
                                isRegistered={true}
                            />
                        ))}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">
                        Available Events
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allEvents.map((event, index) => (
                            <EventCard
                                key={index}
                                event={event}
                                index={index}
                                icon={getColorAndIcon(event.event_code).icon}
                                color={getColorAndIcon(event.event_code).color}
                            />
                        ))}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">
                        Your Profile
                    </h2>

                    <div className="bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-300 mb-2">
                                    Personal Information
                                </h3>
                                <p className="text-gray-400">
                                    <span className="font-medium">Name:</span>{" "}
                                    {user.first_name + " " + user.last_name}
                                </p>
                                <p className="text-gray-400">
                                    <span className="font-medium">Email:</span>{" "}
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
