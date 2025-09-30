import React, { useState, useEffect } from "react";
import {
    User,
    Participant,
    Event,
    SubEvent,
    EventRegistration as EventRegistrationModel,
} from "@/types/models";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { ArrowDownCircle } from "lucide-react";
import EventLayout from "@/src/Components/Layout/EventLayout";
import StarGrid from "@/src/Components/StarGrid";

// CountdownTimer component for Talksphere event
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
                        className="bg-gradient-to-b from-red-800 to-red-900 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg 
                                 flex items-center justify-center border-2 border-red-500 shadow-lg shadow-red-500/30"
                    >
                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                            {item.value < 10 ? `0${item.value}` : item.value}
                        </span>
                    </div>
                    <span className="text-red-400 mt-2 text-xs sm:text-sm md:text-base font-medium">
                        {item.label}
                    </span>
                </motion.div>
            ))}
        </div>
    );
};

interface TalksphereProps {
    event: Event;
    user?: User;
    participantDetails?: Participant | null;
    isRegistered: boolean;
    eventRegistration?: EventRegistrationModel;
    subEvents: SubEvent[];
    userSubEventRegistrations: number[];
}

const Talksphere: React.FC<TalksphereProps> = ({
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

    // Event date for countdown (December 5, 2025)
    const eventDate = new Date(2025, 9, 1, 9, 0, 0);


    const { post, processing } = useForm({});
    const { post: postSubEvent, processing: processingSubEvent } = useForm({});

    // Check if profile is complete
    const isProfileComplete =
        participantDetails &&
        participantDetails.category &&
        participantDetails.phone_number &&
        participantDetails.date_of_birth;

    const handleRegisterClick = () => {
        // Check if user is logged in first
        if (!user) {
            // Redirect to login page
            window.location.href = route("login");
            return;
        }

        // If logged in, check profile completeness
        if (isProfileComplete) {
            // Direct registration for Talksphere
            post(route("participant.register-event", event.id));
        } else {
            // Handle incomplete profile
            alert("Please complete your profile before registering");
        }
    };

    const handleSubEventRegister = (subEventId: number) => {
        console.log('Attempting to register for sub-event:', subEventId);
        
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

        console.log('Submitting registration request...');
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
            
            // For Indonesian timezone, treat the stored time as local time
            // Since we're storing Indonesian local times directly in the database
            return date.toLocaleString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Jakarta' // Explicitly use Indonesian timezone
            });
        } catch (error) {
            console.error('Error formatting date:', dateTime, error);
            return 'Invalid Date';
        }
    };

    const getSubEventIcon = (subEventName: string) => {
        switch (subEventName.toLowerCase()) {
            case 'seminar':
                return '🎓';
            case 'talkshow':
                return '🎤';
            case 'workshop':
                return '🛠️';
            default:
                return '📅';
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
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-red-400 via-rose-300 to-red-400 text-transparent bg-clip-text leading-tight font-airborne">
                                    TALKSPHERE
                                </h1>
                            </motion.div>

                            <motion.p
                                className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-red-100 max-w-4xl mx-auto px-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                Introducing and spreading knowledge related to
                                the latest technological advancements.
                            </motion.p>

                            {/* Countdown Timer */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                            >
                                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-red-300">
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
                            <ArrowDownCircle className="w-12 h-12 text-red-400" />
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
                                <h2 className=" text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-red-400 to-rose-500 text-transparent bg-clip-text">
                                    About Talksphere
                                </h2>
                                <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-red-500 to-rose-600 mx-auto rounded-full"></div>
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
                                        Talksphere is a premier tech conference
                                        featuring industry leaders, innovative
                                        thinkers, and technology experts sharing
                                        insights on cutting-edge developments.
                                        This dynamic event brings together
                                        professionals, enthusiasts, and students
                                        to engage in thought-provoking
                                        discussions about the latest trends and
                                        future directions in technology.
                                    </p>
                                    <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                                        Through keynote presentations, panel
                                        discussions, and interactive Q&A
                                        sessions, Talksphere provides
                                        participants with valuable knowledge,
                                        networking opportunities, and
                                        inspiration to drive innovation and
                                        address the technological challenges of
                                        tomorrow.
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-red-500/10 rounded-2xl blur-xl"></div>
                                    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 border border-red-800/40 shadow-lg shadow-red-900/20 rounded-xl overflow-hidden">
                                        <img
                                            src="https://exotic-scarlet-bedbug.myfilebase.com/ipfs/QmSrEBwEHL7qjqr9jUtLikLG9W9H1uQdAjoHxrVHiVctrJ"
                                            alt="Talksphere Event"
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
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-red-400 to-rose-500 text-transparent bg-clip-text">
                                    What to Expect
                                </h2>
                                <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-red-500 to-rose-600 mx-auto rounded-full"></div>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                                {[
                                    {
                                        title: "Expert Speakers",
                                        description:
                                            "Learn from renowned industry leaders and visionaries sharing insights on emerging technologies and digital transformation.",
                                        color: "red",
                                    },
                                    {
                                        title: "Interactive Sessions",
                                        description:
                                            "Participate in engaging discussions, Q&A panels, and collaborative problem-solving workshops with tech experts.",
                                        color: "rose",
                                    },
                                    {
                                        title: "Networking Opportunities",
                                        description:
                                            "Connect with like-minded professionals, potential collaborators, and industry recruiters to expand your professional network.",
                                        color: "pink",
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
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-red-400 to-rose-500 text-transparent bg-clip-text">
                                        Choose Your Experience
                                    </h2>
                                    <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-red-500 to-rose-600 mx-auto rounded-full"></div>
                                </motion.div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                                    {subEvents.map((subEvent, index) => {
                                        const isRegistered = userSubEventRegistrations.includes(subEvent.id);
                                        
                                        return (
                                            <motion.div
                                                key={subEvent.id}
                                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-red-800/30 shadow-lg p-6"
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: true, margin: "-100px" }}
                                                custom={index + 1}
                                                variants={fadeInUpVariant}
                                            >
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="text-3xl">{getSubEventIcon(subEvent.sub_event_name)}</span>
                                                    <h3 className="text-xl font-bold text-red-300">
                                                        {subEvent.sub_event_name}
                                                    </h3>
                                                </div>
                                                
                                                <p className="text-gray-300 text-sm mb-4">
                                                    {subEvent.description}
                                                </p>

                                                <div className="space-y-2 text-sm text-gray-300 mb-6">
                                                    <div>📅 {formatDateTime(subEvent.start_time)}</div>
                                                    <div>📍 {subEvent.location}</div>
                                                    {subEvent.max_participants && (
                                                        <div>👥 Max: {subEvent.max_participants} participants</div>
                                                    )}
                                                </div>

                                                {user ? (
                                                    isRegistered ? (
                                                        <div className="bg-green-500/20 text-green-300 p-3 rounded-lg text-center">
                                                            ✅ Registered
                                                        </div>
                                                    ) : isProfileComplete ? (
                                                        <button
                                                            onClick={() => handleSubEventRegister(subEvent.id)}
                                                            disabled={processingSubEvent}
                                                            className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-70"
                                                        >
                                                            {processingSubEvent ? 'Processing...' : 'Register Now'}
                                                        </button>
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
                                                        className="block w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg text-center transition-all duration-300"
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

                        {/* Info Section - No more general registration */}
                        <section className="mb-8 sm:mb-10 lg:mb-16">
                            <motion.div
                                className="text-center mb-8 sm:mb-10"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                custom={0}
                                variants={fadeInUpVariant}
                            >
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-red-400 to-rose-500 text-transparent bg-clip-text">
                                    How to Join Talksphere
                                </h2>
                                <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-red-500 to-rose-600 mx-auto rounded-full"></div>
                            </motion.div>

                            <motion.div
                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-red-900/20 border border-red-900/30 max-w-3xl mx-auto"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                custom={1}
                                variants={fadeInUpVariant}
                            >
                                <div className="text-center space-y-4 sm:space-y-6 w-full">
                                    <h3 className="text-xl sm:text-2xl font-semibold text-white">
                                        Choose Your Experience Above
                                    </h3>
                                    <p className="text-gray-300 text-sm sm:text-base">
                                        Talksphere offers three distinct experiences: <strong>Seminar</strong>, <strong>Talkshow</strong>, and <strong>Workshop</strong>. 
                                        Each event has its own registration and QR code for verification. Simply scroll up to the "Choose Your Experience" section 
                                        and register for the events that interest you most. You can register for multiple sub-events!
                                    </p>

                                    <div className="mt-6 bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-200 p-4 rounded-lg border border-red-700/30">
                                        <p className="font-medium text-center">
                                            🎯 Ready to join? Scroll up and choose your preferred sub-events!
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </section>
                    </div>
                </div>
            </div>
        </EventLayout>
    );
};

export default Talksphere;
