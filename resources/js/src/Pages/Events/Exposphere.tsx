import React, { useState, useEffect } from "react";
import {
    User,
    Participant,
    Event,
    EventRegistration as EventRegistrationModel,
    SubEvent,
} from "@/types/models";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { ArrowDownCircle, Calendar, MapPin, Users, Clock } from "lucide-react";
import EventLayout from "@/src/Components/Layout/EventLayout";
import StarGrid from "@/src/Components/StarGrid";

// CountdownTimer component for Exposphere event
const CountdownTimer: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
    const [days, setDays] = useState<number>(0);
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance > 0) {
                setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
                setHours(
                    Math.floor(
                        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    )
                );
                setMinutes(
                    Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
                );
                setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 my-6 sm:my-8">
            {[
                { value: days, label: "Days" },
                { value: hours, label: "Hours" },
                { value: minutes, label: "Minutes" },
                { value: seconds, label: "Seconds" },
            ].map((item, index) => (
                <motion.div
                    key={index}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div
                        className="bg-gradient-to-b from-green-900 to-emerald-900 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg 
                                 flex items-center justify-center border-2 border-green-500 shadow-lg shadow-green-500/30"
                    >
                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                            {item.value < 10 ? `0${item.value}` : item.value}
                        </span>
                    </div>
                    <span className="text-green-400 mt-2 text-xs sm:text-sm md:text-base font-medium">
                        {item.label}
                    </span>
                </motion.div>
            ))}
        </div>
    );
};

interface ExposphereProps {
    event: Event;
    user?: User;
    participantDetails?: Participant | null;
    isRegistered: boolean;
    eventRegistration?: EventRegistrationModel;
    subEvents: SubEvent[];
    userSubEventRegistrations: number[];
}

const Exposphere: React.FC<ExposphereProps> = ({
    event,
    user,
    participantDetails,
    isRegistered,
    eventRegistration,
    subEvents,
    userSubEventRegistrations,
}) => {
    // Animation variants for sections
    const fadeInUpVariant = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: easeOut,
            },
        }),
    };

    // Event date for countdown (October 1, 2025 - Exposphere Day 1)
    const eventDate = new Date(2025, 9, 1, 8, 0, 0); // Month 9 = October

    const { post, processing } = useForm({});
    const { post: postSubEvent, processing: processingSubEvent } = useForm({});

    // Check if profile is complete
    const isProfileComplete =
        participantDetails &&
        participantDetails.category &&
        participantDetails.phone_number &&
        participantDetails.date_of_birth;

    const handleSubEventRegister = (subEventId: number) => {
        if (!user) {
            console.log('User not logged in, redirecting to login');
            window.location.href = route("login");
            return;
        }

        if (!isProfileComplete) {
            console.log('Profile incomplete, redirecting to profile');
            window.location.href = route("participant.profile");
            return;
        }

        console.log('Submitting sub-event registration request...');
        postSubEvent(route("participant.register-sub-event", subEventId), {
            method: 'post',
            onStart: () => {
                console.log('Request started');
            },
            onSuccess: (page) => {
                console.log('Registration successful:', page);
                // Redirect to the same page to refresh data
                window.location.href = window.location.href;
            },
            onError: (errors) => {
                console.error('Registration error:', errors);
                alert('Registration failed: ' + JSON.stringify(errors));
            },
            onFinish: () => {
                console.log('Request finished');
            }
        });
    };

    const formatDateTime = (dateTime: string) => {
        if (!dateTime) {
            return 'Invalid Date';
        }
        
        try {
            // Handle ISO 8601 format (2025-10-01T08:00:00.000000Z)
            const date = new Date(dateTime);
            
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
            
            // Convert to WIB (UTC+7) manually to avoid browser timezone issues
            const wibDate = new Date(date.getTime() + (7 * 60 * 60 * 1000));
            
            return wibDate.toLocaleString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'UTC' // Use UTC since we already converted to WIB
            });
        } catch (error) {
            console.error('Error formatting date:', dateTime, error);
            return 'Invalid Date';
        }
    };

    const getExposphereDayIcon = (dayName: string) => {
        if (dayName.includes('Day 1')) return '🚀';
        if (dayName.includes('Day 2')) return '💡';
        if (dayName.includes('Day 3')) return '🌱';
        return '🎯';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'registration_open':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'registration_not_open':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'registration_closed':
                return 'bg-red-500/20 text-red-300 border-red-500/30';
            case 'full':
                return 'bg-red-500/20 text-red-300 border-red-500/30';
            case 'ongoing':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'completed':
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'registration_open':
                return 'Registration Open';
            case 'registration_not_open':
                return 'Registration Not Open Yet';
            case 'registration_closed':
                return 'Registration Closed';
            case 'ongoing':
                return 'Event Ongoing';
            case 'completed':
                return 'Event Completed';
            default:
                return 'Unavailable';
        }
    };

    const handleRegisterClick = () => {
        // Check if user is logged in first
        if (!user) {
            // Redirect to login page
            window.location.href = route("login");
            return;
        }

        // If logged in, check profile completeness
        if (isProfileComplete) {
            // Direct registration for Exposphere
            post(route("participant.register-event", event.id));
        } else {
            // Handle incomplete profile
            alert("Please complete your profile before registering");
        }
    };

    return (
        <EventLayout>
            <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
                {/* Star Grid Background */}
                <StarGrid />

                {/* Hero Section with fixed background */}
                <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-transparent"></div>
                    <div className="relative z-20 min-h-screen flex items-center justify-center overflow-hidden">
                        {/* Hero Content */}
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: -30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 text-transparent bg-clip-text leading-tight font-airborne">
                                    EXPOSPHERE
                                </h1>
                            </motion.div>

                            <motion.p
                                className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-green-100 max-w-4xl mx-auto px-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                Showcasing Innovation Through Interactive
                                Exhibitions
                            </motion.p>

                            {/* Countdown Timer */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                            >
                                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-green-300">
                                    Event Starts In:
                                </h2>
                                <CountdownTimer targetDate={eventDate} />
                            </motion.div>
                        </div>

                        {/* Scroll indicator */}
                        <motion.div
                            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"
                            animate={{ y: [0, 10, 0] }}
                            transition={{
                                repeat: Number.POSITIVE_INFINITY,
                                duration: 2,
                            }}
                        >
                            <ArrowDownCircle className="w-12 h-12 text-green-400" />
                        </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-900 to-transparent"></div>
                </div>

                {/* Spacer to push content below the hero height */}
                <div className="h-screen w-full bottom-0"></div>

                {/* Content that scrolls over the hero - higher z-index */}
                <div className="relative z-20 bg-gray-900 pt-16 pb-20">
                    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                        {/* About Section */}
                        <section className="mb-16 sm:mb-20 lg:mb-24">
                            <motion.div
                                className="text-center mb-8 sm:mb-10"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                custom={0}
                                variants={fadeInUpVariant}
                            >
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-400 to-teal-400 text-transparent bg-clip-text">
                                    About Exposphere
                                </h2>
                                <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full"></div>
                            </motion.div>

                            <motion.div
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                custom={1}
                                variants={fadeInUpVariant}
                            >
                                <div className="space-y-4 sm:space-y-6">
                                    <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                                        Exposphere is an exhibition that
                                        showcases a wide range of innovative
                                        technology projects developed by
                                        students from the Faculty of Computer
                                        Science. Featuring works in IoT,
                                        Artificial Intelligence, Cybersecurity,
                                        Game Development, and more, this
                                        sub-event highlights creative and
                                        practical applications of technology.
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-green-500/10 rounded-2xl blur-xl"></div>
                                    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 border border-green-800/40 shadow-lg shadow-green-900/20 rounded-xl overflow-hidden">
                                        <img
                                            src="https://exotic-scarlet-bedbug.myfilebase.com/ipfs/QmVDvxvGTYBrAkPiqxuou9E668mu5Y78eQhir9RCstWaMK"
                                            alt="Exposphere Event"
                                            className="w-full h-auto object-cover rounded-xl"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </section>

                        {/* Features Section */}
                        <section className="mb-16 sm:mb-20 lg:mb-24">
                            <motion.div
                                className="text-center mb-8 sm:mb-10"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                custom={0}
                                variants={fadeInUpVariant}
                            >
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-400 to-teal-400 text-transparent bg-clip-text">
                                    What to Expect
                                </h2>
                                <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full"></div>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                                {[
                                    {
                                        title: "Interactive Exhibitions",
                                        description:
                                            "Engage with interactive displays showcasing the latest innovations across multiple industries.",
                                        color: "green",
                                    },
                                    {
                                        title: "Networking Opportunities",
                                        description:
                                            "Connect with industry professionals, experts, and fellow enthusiasts to exchange ideas and build relationships.",
                                        color: "teal",
                                    },
                                    {
                                        title: "Tech Demonstrations",
                                        description:
                                            "Witness live demonstrations of cutting-edge technologies and prototypes that are shaping the future.",
                                        color: "emerald",
                                    },
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        className={`bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-xl border border-${feature.color}-800/30 shadow-lg shadow-${feature.color}-900/10`}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{
                                            once: true,
                                            margin: "-100px",
                                        }}
                                        custom={index + 1}
                                        variants={fadeInUpVariant}
                                    >
                                        <div
                                            className={`bg-${feature.color}-500/20 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-4`}
                                        >
                                            <span
                                                className={`text-${feature.color}-400 text-2xl font-bold`}
                                            >
                                                {index + 1}
                                            </span>
                                        </div>
                                        <h3
                                            className={`text-xl sm:text-2xl font-semibold mb-3 text-${feature.color}-300`}
                                        >
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm sm:text-base">
                                            {feature.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Sub-Events Section */}
                        {subEvents && subEvents.length > 0 && (
                            <section className="mb-16 sm:mb-20 lg:mb-24">
                                <motion.div
                                    className="text-center mb-8 sm:mb-10"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-100px" }}
                                    custom={0}
                                    variants={fadeInUpVariant}
                                >
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-400 to-teal-400 text-transparent bg-clip-text">
                                        Choose Your Day
                                    </h2>
                                    <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full"></div>
                                    <p className="text-gray-300 text-base sm:text-lg mt-4 max-w-3xl mx-auto">
                                        Exposphere runs for 3 days with different themes each day. Register for the day(s) you want to attend. 
                                        Registration opens one day before each event day.
                                    </p>
                                </motion.div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                                    {subEvents.map((subEvent, index) => {
                                        const isRegistered = userSubEventRegistrations.includes(subEvent.id);
                                        const status = (subEvent as any).status || 'inactive';
                                        
                                        return (
                                            <motion.div
                                                key={subEvent.id}
                                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-green-800/30 shadow-lg p-6"
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: true, margin: "-100px" }}
                                                custom={index + 1}
                                                variants={fadeInUpVariant}
                                            >
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="text-3xl">{getExposphereDayIcon(subEvent.sub_event_name)}</span>
                                                    <h3 className="text-xl font-bold text-green-300">
                                                        {subEvent.sub_event_name}
                                                    </h3>
                                                </div>
                                                
                                                <p className="text-gray-300 text-sm mb-4">
                                                    {subEvent.description}
                                                </p>

                                                <div className="space-y-2 text-sm text-gray-300 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-green-400" />
                                                        {formatDateTime(subEvent.start_time)}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-green-400" />
                                                        {subEvent.location}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-green-400" />
                                                        Open for all participants
                                                    </div>
                                                </div>

                                                {/* Status Badge */}
                                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border mb-4 ${getStatusColor(status)}`}>
                                                    {getStatusText(status)}
                                                </div>

                                                {/* Action Buttons */}
                                                {user ? (
                                                    isRegistered ? (
                                                        <div className="bg-green-500/20 text-green-300 p-3 rounded-lg text-center">
                                                            ✅ Registered
                                                        </div>
                                                    ) : isProfileComplete ? (
                                                        status === 'registration_open' ? (
                                                            <button
                                                                onClick={() => handleSubEventRegister(subEvent.id)}
                                                                disabled={processingSubEvent}
                                                                className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-70"
                                                            >
                                                                {processingSubEvent ? 'Processing...' : 'Register Now'}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                disabled
                                                                className="w-full px-4 py-3 bg-gray-600 text-gray-400 font-medium rounded-lg cursor-not-allowed"
                                                            >
                                                                {status === 'registration_not_open' ? 'Registration Not Open Yet' :
                                                                 status === 'ongoing' ? 'Event Ongoing' :
                                                                 status === 'completed' ? 'Event Completed' :
                                                                 'Unavailable'}
                                                            </button>
                                                        )
                                                    ) : (
                                                        <a
                                                            href={route("participant.profile")}
                                                            className="block w-full px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg text-center transition-all duration-300"
                                                        >
                                                            Complete Profile First
                                                        </a>
                                                    )
                                                ) : (
                                                    <a
                                                        href={route("login")}
                                                        className="block w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg text-center transition-all duration-300"
                                                    >
                                                        Login to Register
                                                    </a>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Info Section */}
                        <section className="mb-8 sm:mb-10 lg:mb-16">
                            <motion.div
                                className="text-center mb-8 sm:mb-10"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                custom={0}
                                variants={fadeInUpVariant}
                            >
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-400 to-teal-400 text-transparent bg-clip-text">
                                    Important Information
                                </h2>
                                <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full"></div>
                            </motion.div>

                            <motion.div
                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-green-900/20 border border-green-900/30 max-w-4xl mx-auto"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                custom={1}
                                variants={fadeInUpVariant}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-green-300 flex items-center gap-2">
                                            <Clock className="h-5 w-5" />
                                            Registration Schedule
                                        </h3>
                                        <div className="space-y-3 text-sm text-gray-300">
                                            <div className="flex justify-between">
                                                <span>Day 1 Registration:</span>
                                                <span className="text-green-400">Sept 30 - Oct 1</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Day 2 Registration:</span>
                                                <span className="text-green-400">Oct 1 - Oct 2</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Day 3 Registration:</span>
                                                <span className="text-green-400">Oct 2 - Oct 3</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-green-300 flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            Event Details
                                        </h3>
                                        <div className="space-y-3 text-sm text-gray-300">
                                            <div className="flex justify-between">
                                                <span>Duration:</span>
                                                <span className="text-green-400">3 Days</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Capacity per day:</span>
                                                <span className="text-green-400">Unlimited</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Registration:</span>
                                                <span className="text-green-400">Per day basis</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <p className="text-blue-300 text-sm">
                                        <strong>Note:</strong> Each day has separate registration. You can register for multiple days, 
                                        but registration for each day opens only one day before the event day.
                                    </p>
                                </div>
                            </motion.div>
                        </section>
                    </div>
                </div>
            </div>
        </EventLayout>
    );
};

export default Exposphere;
