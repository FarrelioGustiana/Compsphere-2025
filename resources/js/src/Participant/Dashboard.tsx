import { Head } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { Event, Participant, User, EventRegistration } from "@/types/models";
import EventCard from "@/src/Components/Home/EventCard";
import { getColorAndIcon } from "@/src/Pages/Home";
import { Link } from "@inertiajs/react";
import {
    Users,
    Award,
    User as UserIcon,
    Calendar,
    Bell,
    Zap,
} from "lucide-react";
import VerificationReminder from "@/src/Components/UI/VerificationReminder";
import { motion } from "framer-motion";

interface ParticipantDashboardProps {
    user: User;
    participantDetails: any | Participant;
    allEvents: Event[];
    registeredEvents: Event[];
    userSubEventRegistrations: EventRegistration[];
    hacksphereTeam: {
        id: number;
        team_name: string;
        team_code: string;
        is_leader: boolean;
    } | null;
    auth: {
        user: User & {
            email_verified: boolean;
        };
    };
}

// Animation variants for staggered animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
        },
    },
};

export default function Dashboard({
    user,
    participantDetails,
    allEvents,
    registeredEvents,
    userSubEventRegistrations,
    hacksphereTeam,
    auth,
}: ParticipantDashboardProps) {
    return (
        <DashboardLayout>
            <Head title="Participant Dashboard" />

            <div className="py-6">
                {/* Hero Section with Gradient Background */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 max-w-7xl mx-2 sm:mx-6 lg:mx-8  mb-8 rounded-xl shadow-xl">
                    <div className="absolute inset-0 bg-[url('/assets/blue-grid.png')] opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center sm:text-left"
                        >
                            <h1 className="text-4xl font-extrabold text-white tracking-tight">
                                Welcome,{" "}
                                {user.first_name + " " + user.last_name}!
                            </h1>
                            <p className="mt-3 max-w-3xl text-xl text-blue-100">
                                Your Compsphere 2025 journey starts here
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Profile Completion Warning */}
                {(!participantDetails ||
                    !participantDetails.category ||
                    !participantDetails.phone_number ||
                    !participantDetails.date_of_birth) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-6"
                    >
                        <div className="bg-gradient-to-r from-amber-700 to-yellow-900 border-l-4 border-yellow-400 shadow-lg p-5 rounded-lg flex items-start gap-4">
                            <div className="p-2 bg-yellow-800 rounded-full">
                                <Bell className="h-6 w-6 text-yellow-200" />
                            </div>
                            <div>
                                <div className="font-bold text-lg text-yellow-100 mb-1">
                                    Complete Your Profile
                                </div>
                                <div className="text-yellow-200">
                                    You must complete your participant profile
                                    before you can register for events.{" "}
                                    <Link
                                        href="/participant/profile"
                                        className="font-medium text-yellow-300 hover:text-white transition-colors underline underline-offset-4"
                                    >
                                        Go to your profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8"
                >
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-cyan-800/50 rounded-md mr-3">
                            <Zap className="h-5 w-5 text-cyan-200" />
                        </div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
                            Hacksphere Team
                        </h2>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-sm border border-cyan-500/20 rounded-xl shadow-xl overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/assets/blue-grid.png')] opacity-5"></div>
                        <div className="px-6 py-6 sm:px-8 sm:py-8 relative z-10">
                            {hacksphereTeam ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-col md:flex-row justify-between items-start gap-6"
                                >
                                    <div className="flex-1">
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-4">
                                            {hacksphereTeam.is_leader
                                                ? "Team Leader"
                                                : "Team Member"}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {hacksphereTeam.team_name}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="text-gray-300 text-sm">
                                                Team Code:
                                            </div>
                                            <div className="bg-cyan-900/50 px-3 py-1 rounded-md border border-cyan-700/50 font-mono text-cyan-300">
                                                {hacksphereTeam.team_code}
                                            </div>
                                        </div>
                                        <p className="text-gray-300 mb-5">
                                            Your team is registered for the
                                            Hacksphere hackathon. Make sure all
                                            team members are prepared for this
                                            exciting challenge!
                                        </p>
                                        <Link
                                            href={`/participant/team/${hacksphereTeam.id}`}
                                            className="inline-flex items-center px-5 py-2.5 border border-cyan-400/30 shadow-lg text-sm font-medium rounded-lg text-white bg-cyan-600 hover:bg-cyan-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-cyan-900"
                                        >
                                            <Users className="mr-2 h-4 w-4" />
                                            View Team Details
                                        </Link>
                                    </div>
                                    <div className="flex-shrink-0 bg-gradient-to-br from-cyan-800/40 to-blue-900/30 p-5 rounded-lg border border-cyan-600/20 shadow-lg">
                                        <h4 className="text-cyan-200 font-medium mb-3 flex items-center">
                                            <Award className="mr-2 h-4 w-4" />{" "}
                                            Team Status
                                        </h4>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center text-sm">
                                                <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                                                <span className="text-gray-200">
                                                    Registration Complete
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                                                <span className="text-gray-200">
                                                    Team Formed
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <div className="h-2 w-2 rounded-full bg-amber-400 mr-2"></div>
                                                <span className="text-gray-200">
                                                    Waiting for Event Start
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-col md:flex-row items-center justify-between gap-6"
                                >
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-3">
                                            Join Hacksphere Hackathon
                                        </h3>
                                        <p className="text-gray-300 mb-5">
                                            You're not part of a Hacksphere team
                                            yet. Form a team of talented
                                            developers and register for our
                                            premiere hackathon event!
                                        </p>
                                        <Link
                                            href="/events/hacksphere"
                                            className="inline-flex items-center px-5 py-2.5 border border-cyan-400/30 shadow-lg text-sm font-medium rounded-lg text-white bg-cyan-600 hover:bg-cyan-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-cyan-900"
                                        >
                                            <Zap className="mr-2 h-4 w-4" />
                                            Register for Hacksphere
                                        </Link>
                                    </div>
                                    <div className="flex-shrink-0 hidden md:block">
                                        <div className="w-48 h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 rounded-full flex items-center justify-center">
                                            <Users className="h-20 w-20 text-cyan-300/50" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8"
                >
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-purple-800/50 rounded-md mr-3">
                            <Calendar className="h-5 w-5 text-purple-200" />
                        </div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-400">
                            Events
                        </h2>
                    </div>

                    {allEvents.map((event, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="mb-6 last:mb-0"
                        >
                            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm border border-purple-500/20 rounded-xl shadow-xl overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/assets/blue-grid.png')] opacity-5"></div>
                                <div className="px-6 py-6 sm:px-8 sm:py-8 relative z-10">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                        <div className="flex-1">
                                            {/* Check if user is registered for this event */}
                                            {registeredEvents.some(
                                                (regEvent) =>
                                                    regEvent.id === event.id
                                            ) && (
                                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-900/50 border border-green-500/30 text-green-300 text-xs font-medium mb-4">
                                                    Registered
                                                </div>
                                            )}
                                            <h3 className="text-2xl font-bold text-white mb-2">
                                                {event.event_name}
                                            </h3>
                                            <p className="text-gray-300 mb-5">
                                                {/* Different description based on event type */}
                                                {event.event_code ===
                                                "hacksphere"
                                                    ? "Form a team of talented developers and participate in our premiere hackathon event!"
                                                    : `Join this exciting ${
                                                          event.event_code
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          event.event_code.slice(
                                                              1
                                                          )
                                                      } event and showcase your skills!`}
                                            </p>
                                            {/* Conditional rendering based on event registration status */}
                                            {registeredEvents.some(
                                                (regEvent) => regEvent.id === event.id
                                            ) ? (
                                                <div className="flex flex-wrap gap-3">
                                                    {/* View Details button */}
                                                    <Link
                                                        href={`/events/${event.event_code}`}
                                                        className="inline-flex items-center px-5 py-2.5 border border-purple-400/30 shadow-lg text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-purple-900"
                                                    >
                                                        <Users className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Link>
                                                    
                                                    {/* QR Code button for Festsphere and Exposphere only (Talksphere has individual sub-event QR codes) */}
                                                    {(event.event_code === 'festsphere' || event.event_code === 'exposphere') && (
                                                        <Link
                                                            href={`/participant/event-registration/qr-code/${event.event_code}`}
                                                            className="inline-flex items-center px-5 py-2.5 border border-green-400/30 shadow-lg text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-green-900"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <rect x="3" y="3" width="7" height="7"></rect>
                                                                <rect x="14" y="3" width="7" height="7"></rect>
                                                                <rect x="14" y="14" width="7" height="7"></rect>
                                                                <rect x="3" y="14" width="7" height="7"></rect>
                                                            </svg>
                                                            View QR Code
                                                        </Link>
                                                    )}
                                                </div>
                                            ) : (
                                                <Link
                                                    href={`/events/${event.event_code}`}
                                                    className="inline-flex items-center px-5 py-2.5 border border-purple-400/30 shadow-lg text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-purple-900"
                                                >
                                                    <Zap className="mr-2 h-4 w-4" />
                                                    Register Now
                                                </Link>
                                            )}
                                            
                                            {/* Sub-events section */}
                                            {registeredEvents.some((regEvent) => regEvent.id === event.id) && 
                                             userSubEventRegistrations?.filter(reg => reg.event?.id === event.id).length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-purple-600/20">
                                                    <h4 className="text-purple-200 font-medium mb-3">Your Sub-Events</h4>
                                                    <div className="space-y-2">
                                                        {userSubEventRegistrations
                                                            .filter(reg => reg.event?.id === event.id)
                                                            .map((registration, idx) => (
                                                                <div key={idx} className="bg-purple-800/30 p-3 rounded-lg border border-purple-600/20">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <span className="text-purple-200 font-medium text-sm">
                                                                            {registration.sub_event?.sub_event_name}
                                                                        </span>
                                                                        <span className="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded-full border border-green-500/30">
                                                                            Registered
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="text-xs text-gray-300">
                                                                            📅 {new Date(registration.sub_event?.start_time || '').toLocaleDateString('id-ID')}
                                                                        </div>
                                                                        <Link
                                                                            href={`/participant/sub-event/qr-code/${registration.sub_event?.id}`}
                                                                            className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-3 w-3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                <rect x="3" y="3" width="7" height="7"></rect>
                                                                                <rect x="14" y="3" width="7" height="7"></rect>
                                                                                <rect x="14" y="14" width="7" height="7"></rect>
                                                                                <rect x="3" y="14" width="7" height="7"></rect>
                                                                            </svg>
                                                                            QR Code
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-shrink-0 bg-gradient-to-br from-purple-800/40 to-indigo-900/30 p-5 rounded-lg border border-purple-600/20 shadow-lg">
                                            <h4 className="text-purple-200 font-medium mb-3 flex items-center">
                                                <Award className="mr-2 h-4 w-4" />{" "}
                                                Event Info
                                            </h4>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center text-sm">
                                                    <div className="h-2 w-2 rounded-full bg-purple-400 mr-2"></div>
                                                    <span className="text-gray-200">
                                                        {event.event_code ===
                                                        "hacksphere"
                                                            ? "Team Event"
                                                            : "Individual Event"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <div className="h-2 w-2 rounded-full bg-purple-400 mr-2"></div>
                                                    <span className="text-gray-200">
                                                        {new Date(
                                                            event.start_date
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <div className="h-2 w-2 rounded-full bg-purple-400 mr-2"></div>
                                                    <span className="text-gray-200">
                                                        {event.location ||
                                                            "Online"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {allEvents.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm border border-purple-500/20 rounded-xl shadow-xl overflow-hidden"
                        >
                            <div className="px-6 py-10 text-center">
                                <p className="text-purple-200 text-lg">
                                    No upcoming events at this time. Check back
                                    later!
                                </p>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-12"
                >
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-indigo-800/50 rounded-md mr-3">
                            <UserIcon className="h-5 w-5 text-indigo-200" />
                        </div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-blue-400">
                            Your Profile
                        </h2>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-indigo-950 rounded-xl shadow-xl border border-indigo-500/10">
                        <div className="absolute inset-0 bg-[url('/assets/blue-grid.png')] opacity-5"></div>
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-indigo-600 rounded-full opacity-10 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-40 h-40 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
                        <div className="relative p-6 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="bg-indigo-900/30 backdrop-blur-sm p-6 rounded-lg border border-indigo-500/20 shadow-lg"
                                >
                                    <h3 className="text-lg font-semibold text-indigo-200 flex items-center gap-2 mb-4">
                                        <UserIcon className="h-5 w-5" />{" "}
                                        Personal Information
                                    </h3>
                                    <div className="mt-4 space-y-5">
                                        <div className="border-b border-indigo-800/40 pb-3">
                                            <div className="text-sm font-medium text-indigo-400">
                                                Full Name
                                            </div>
                                            <div className="text-lg font-medium text-white mt-1">
                                                {user.first_name +
                                                    " " +
                                                    user.last_name}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-indigo-400">
                                                Email Address
                                            </div>
                                            <div className="text-base text-indigo-100 mt-1 flex items-center gap-2">
                                                {user.email}
                                                {auth?.user &&
                                                    auth.user.email_verified ===
                                                        true && (
                                                        <span className="inline-flex items-center bg-green-900/50 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/30">
                                                            Verified
                                                        </span>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="bg-indigo-900/30 backdrop-blur-sm p-6 rounded-lg border border-indigo-500/20 shadow-lg"
                                >
                                    <h3 className="text-lg font-semibold text-indigo-200 flex items-center gap-2 mb-4">
                                        <Users className="h-5 w-5" />{" "}
                                        Participant Details
                                    </h3>
                                    <div className="mt-4 space-y-5">
                                        {participantDetails ? (
                                            <>
                                                <div className="border-b border-indigo-800/40 pb-3">
                                                    <div className="text-sm font-medium text-indigo-400">
                                                        Category
                                                    </div>
                                                    <div className="text-base text-indigo-100 mt-1">
                                                        {
                                                            participantDetails.category
                                                        }
                                                    </div>
                                                </div>
                                                {participantDetails.date_of_birth && (
                                                    <div className="border-b border-indigo-800/40 pb-3">
                                                        <div className="text-sm font-medium text-indigo-400">
                                                            Date of Birth
                                                        </div>
                                                        <div className="text-base text-indigo-100 mt-1">
                                                            {
                                                                participantDetails.date_of_birth
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                                {participantDetails.phone_number && (
                                                    <div>
                                                        <div className="text-sm font-medium text-indigo-400">
                                                            Phone Number
                                                        </div>
                                                        <div className="text-base text-indigo-100 mt-1">
                                                            {
                                                                participantDetails.phone_number
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-40 text-center">
                                                <div className="text-yellow-300 mb-4">
                                                    Complete your profile to see
                                                    participant details
                                                </div>
                                                <Link
                                                    href="/participant/profile"
                                                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
                                                >
                                                    Update Profile
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* End of Dashboard Content */}
            </div>
        </DashboardLayout>
    );
}
