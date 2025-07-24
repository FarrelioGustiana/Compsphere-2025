import React, { useState, useEffect } from "react";
import {
    User,
    Participant,
    Event,
    EventRegistration as EventRegistrationModel,
} from "@/types/models";
import HacksphereRegistration from "@/src/Components/Hacksphere/HacksphereRegistration";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { ArrowDownCircle } from "lucide-react";

// CountdownTimer component for Hacksphere event
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
        <div className="flex justify-center gap-6 my-8">
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
                        className="bg-gradient-to-b from-blue-900 to-indigo-900 w-24 h-24 rounded-lg 
                                 flex items-center justify-center border-2 border-blue-500 shadow-lg shadow-blue-500/30"
                    >
                        <span className="text-4xl font-bold text-white">
                            {item.value}
                        </span>
                    </div>
                    <span className="text-blue-400 mt-2 font-medium">
                        {item.label}
                    </span>
                </motion.div>
            ))}
        </div>
    );
};

interface HacksphereProps {
    event: Event;
    user?: User;
    participantDetails?: Participant | null;
    isRegistered: boolean;
    eventRegistration?: EventRegistrationModel;
}

const Hacksphere: React.FC<HacksphereProps> = ({
    event,
    user,
    participantDetails,
    isRegistered,
    eventRegistration,
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

    // Event date for countdown (August 15, 2025)
    const eventDate = new Date(2025, 7, 15, 18, 0, 0);

    const [showNikForm, setShowNikForm] = useState(false);
    const [showHacksphereRegistration, setShowHacksphereRegistration] =
        useState(false);
    const { data, setData, post, processing, errors } = useForm({
        nik: "",
    });

    // Check if profile is complete but NIK is missing
    const isProfileCompleteButNikMissing =
        participantDetails &&
        participantDetails.category &&
        participantDetails.phone_number &&
        participantDetails.date_of_birth &&
        !participantDetails.nik;

    // Check if profile is complete with all required fields
    const isProfileComplete =
        participantDetails &&
        participantDetails.category &&
        participantDetails.phone_number &&
        participantDetails.date_of_birth;

    const handleNikSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("participant.update-nik"), {
            onSuccess: () => {
                setShowNikForm(false);
                setShowHacksphereRegistration(true);
            },
        });
    };

    const handleRegisterClick = () => {
        if (isProfileCompleteButNikMissing) {
            setShowNikForm(true);
        } else if (isProfileComplete) {
            // Show the multi-step registration form
            setShowHacksphereRegistration(true);
        } else {
            // Handle incomplete profile
            alert("Please complete your profile before registering");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
            {/* Hero Section with fixed background */}
            <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-transparent"></div>
                <div className="relative z-20 min-h-screen flex items-center justify-center overflow-hidden">
                    {/* Hero Content */}
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 text-transparent bg-clip-text leading-tight font-airborne">
                                HACKSPHERE
                            </h1>
                        </motion.div>

                        <motion.p
                            className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-4xl mx-auto px-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            Where Innovation Meets Technology: Building
                            Tomorrow's Solutions Today
                        </motion.p>

                        {/* Countdown Timer */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        >
                            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-blue-300">
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
                        <ArrowDownCircle className="w-12 h-12 text-blue-400" />
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-900 to-transparent"></div>
            </div>

            {/* Spacer to push content below the hero height */}
            <div className="h-screen w-full"></div>

            {/* Content that scrolls over the hero - higher z-index */}
            <div className="relative z-10 bg-gray-900 pt-16 pb-20">
                {/* Registration Form Section */}
                {showHacksphereRegistration ? (
                    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mb-6"
                        >
                            <button
                                onClick={() =>
                                    setShowHacksphereRegistration(false)
                                }
                                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm sm:text-base"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 sm:h-5 sm:w-5 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Back to Event Details
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl shadow-blue-900/20 border border-blue-900/30"
                        >
                            <div className="mb-6 text-center">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
                                    Team Registration
                                </h2>
                                <p className="text-blue-300 text-sm sm:text-base">
                                    Complete all steps to register your team
                                </p>
                            </div>

                            <HacksphereRegistration
                                user={user}
                                participantDetails={participantDetails}
                                eventId={event.id}
                            />
                        </motion.div>
                    </div>
                ) : (
                    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                        {/* About Section */}
                        <motion.div
                            className="mb-16 sm:mb-20"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={0}
                            variants={fadeInUpVariant}
                        >
                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                                <div className="lg:w-1/2">
                                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                                        About Hacksphere
                                    </h2>
                                    <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6">
                                        Hacksphere is a 48-hour hackathon where
                                        teams of 3 participants collaborate to
                                        build innovative solutions using
                                        cutting-edge technology. This is your
                                        chance to showcase your coding skills,
                                        creativity, and problem-solving
                                        abilities!
                                    </p>
                                    <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8">
                                        This event welcomes high school
                                        students, university students, and
                                        industry professionals. Form a team and
                                        join us for an unforgettable tech
                                        experience.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                        <div className="flex items-center bg-blue-900/50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-blue-700/50">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <span className="text-sm sm:text-base">
                                                August 15-17, 2025
                                            </span>
                                        </div>

                                        <div className="flex items-center bg-blue-900/50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-blue-700/50">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                            </svg>
                                            <span className="text-sm sm:text-base">
                                                Jakarta, Indonesia
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:w-1/2 mt-8 lg:mt-0">
                                    <motion.div
                                        className="relative"
                                        animate={{
                                            y: [0, -10, 0],
                                        }}
                                        transition={{
                                            repeat: Number.POSITIVE_INFINITY,
                                            duration: 6,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <img
                                            src="/assets/hacksphere/kanan.png"
                                            alt="Hacksphere Illustration"
                                            className="w-full h-auto rounded-xl shadow-2xl shadow-blue-700/20 border border-blue-800/30"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-xl"></div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Features Section */}
                        <motion.div
                            className="mb-16 sm:mb-20"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={1}
                            variants={fadeInUpVariant}
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                                Why Participate?
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {[
                                    {
                                        icon: (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8 sm:h-10 sm:w-10"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                                />
                                            </svg>
                                        ),
                                        title: "Innovation",
                                        description:
                                            "Push the boundaries of technology and create solutions that can change the world.",
                                    },
                                    {
                                        icon: (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8 sm:h-10 sm:w-10"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                            </svg>
                                        ),
                                        title: "Networking",
                                        description:
                                            "Connect with industry leaders, mentors, and like-minded tech enthusiasts.",
                                    },
                                    {
                                        icon: (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8 sm:h-10 sm:w-10"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                                                />
                                            </svg>
                                        ),
                                        title: "Prizes",
                                        description:
                                            "Win exciting cash prizes, internship opportunities, and tech gadgets.",
                                    },
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-xl border border-blue-900/30 shadow-lg"
                                        whileHover={{
                                            y: -5,
                                            boxShadow:
                                                "0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)",
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                        }}
                                    >
                                        <div className="text-blue-400 mb-4">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-blue-300">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm sm:text-base">
                                            {feature.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Prizes Section */}
                        <motion.div
                            className="mb-16 sm:mb-20"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={2}
                            variants={fadeInUpVariant}
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                                Prizes & Rewards
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                <motion.div
                                    className="bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 p-6 sm:p-8 rounded-xl relative overflow-hidden border-2 border-yellow-500"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold py-1 px-3 sm:px-4 rounded-bl text-xs sm:text-sm">
                                        1ST PLACE
                                    </div>
                                    <div className="text-yellow-500 text-4xl sm:text-6xl font-bold mb-4 sm:mb-6 mt-6">
                                        🏆
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-yellow-400">
                                        Rp 10,000,000
                                    </h3>
                                    <ul className="text-gray-300 space-y-2 text-sm sm:text-base">
                                        <li className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-500 flex-shrink-0"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Internship opportunities
                                        </li>
                                        <li className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-500 flex-shrink-0"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Premium tech gadgets
                                        </li>
                                        <li className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-500 flex-shrink-0"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Media exposure
                                        </li>
                                    </ul>
                                </motion.div>

                                <motion.div
                                    className="bg-gradient-to-br from-gray-400/20 to-gray-600/20 p-6 sm:p-8 rounded-xl relative overflow-hidden border-2 border-gray-400"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="absolute top-0 right-0 bg-gray-400 text-black font-bold py-1 px-3 sm:px-4 rounded-bl text-xs sm:text-sm">
                                        2ND PLACE
                                    </div>
                                    <div className="text-gray-300 text-4xl sm:text-6xl font-bold mb-4 sm:mb-6 mt-6">
                                        🥈
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-300">
                                        Rp 7,500,000
                                    </h3>
                                    <ul className="text-gray-300 space-y-2 text-sm sm:text-base">
                                        <li className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-400 flex-shrink-0"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Tech gadgets
                                        </li>
                                        <li className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-400 flex-shrink-0"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Project mentorship
                                        </li>
                                        <li className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-400 flex-shrink-0"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Recognition certificates
                                        </li>
                                    </ul>
                                </motion.div>

                                <motion.div
                                    className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 p-6 sm:p-8 rounded-xl relative overflow-hidden border-2 border-amber-600 md:col-span-2 lg:col-span-1"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="absolute top-0 right-0 bg-amber-600 text-black font-bold py-1 px-3 sm:px-4 rounded-bl text-xs sm:text-sm">
                                        3RD PLACE
                                    </div>
                                    <div className="text-amber-500 text-4xl sm:text-6xl font-bold mb-4 sm:mb-6 mt-6">
                                        🥉
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-amber-400">
                                        Rp 5,000,000
                                    </h3>
                                    <ul className="text-gray-300 space-y-2 text-sm sm:text-base">
                                        <li className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-amber-600 flex-shrink-0"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Software licenses
                                        </li>
                                        <li className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-amber-600 flex-shrink-0"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Recognition certificates
                                        </li>
                                        <li className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-amber-600 flex-shrink-0"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Swag packs
                                        </li>
                                    </ul>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Registration Section */}
                        <motion.div
                            className="mb-12 sm:mb-16"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={3}
                            variants={fadeInUpVariant}
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                                Registration
                            </h2>
                            {isRegistered ? (
                                <motion.div
                                    className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border border-green-700/50 rounded-xl p-6 sm:p-8 shadow-lg"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
                                        <div className="bg-green-500/20 p-3 sm:p-4 rounded-full flex-shrink-0">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-10 w-10 sm:h-12 sm:w-12 text-green-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="text-center sm:text-left">
                                            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-blue-300">
                                                You're Registered!
                                            </h3>
                                            <p className="text-gray-300 text-sm sm:text-base">
                                                Thank you for registering for
                                                Hacksphere. We'll send you more
                                                details via email as the event
                                                approaches.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Payment information for registered users */}
                                    {eventRegistration &&
                                        eventRegistration.payment_status ===
                                            "pending" && (
                                            <motion.div
                                                className="mt-6 bg-gradient-to-br from-amber-800/20 to-amber-900/20 border border-amber-600/50 rounded-xl p-4 sm:p-6 shadow-lg"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    delay: 0.3,
                                                    duration: 0.5,
                                                }}
                                            >
                                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4">
                                                    <div className="bg-amber-500/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-8 w-8 sm:h-10 sm:w-10 text-amber-400"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="text-center sm:text-left">
                                                        <h4 className="text-lg sm:text-xl font-bold mb-2 text-amber-400">
                                                            Payment Required
                                                        </h4>
                                                        <p className="mb-2 text-gray-300 text-sm sm:text-base">
                                                            Your payment status
                                                            is currently{" "}
                                                            <span className="text-yellow-400 font-medium">
                                                                Pending
                                                                Verification
                                                            </span>
                                                            . Please complete
                                                            your payment of{" "}
                                                            <span className="font-semibold">
                                                                IDR 150,000
                                                            </span>{" "}
                                                            and send proof via
                                                            WhatsApp.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700/50 mb-4 sm:mb-6">
                                                    <p className="mb-2 flex items-start text-sm sm:text-base">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                        <span>
                                                            <strong>
                                                                Important:
                                                            </strong>{" "}
                                                            Each team member
                                                            must pay IDR 150,000
                                                            individually.
                                                        </span>
                                                    </p>
                                                    <p className="text-sm sm:text-base">
                                                        Remember to include your
                                                        name and team name in
                                                        your payment proof
                                                        message.
                                                    </p>
                                                </div>

                                                <a
                                                    href="https://wa.me/6281234567890?text=Hello%2C%20I%20want%20to%20submit%20my%20payment%20proof%20for%20Hacksphere%20registration."
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 text-sm sm:text-base"
                                                >
                                                    <svg
                                                        className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3"
                                                        fill="currentColor"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 448 512"
                                                    >
                                                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                                    </svg>
                                                    Send Payment Proof via
                                                    WhatsApp
                                                </a>
                                            </motion.div>
                                        )}

                                    {eventRegistration &&
                                        eventRegistration.payment_status ===
                                            "paid" && (
                                            <motion.div
                                                className="mt-6 bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-600/50 rounded-xl p-4 sm:p-6 shadow-lg"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    delay: 0.3,
                                                    duration: 0.5,
                                                }}
                                            >
                                                <div className="flex items-center gap-3 sm:gap-4">
                                                    <div className="bg-green-500/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-6 w-6 sm:h-8 sm:w-8 text-green-400"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg sm:text-xl font-bold mb-1 text-green-400">
                                                            Payment Complete
                                                        </h4>
                                                        <p className="text-gray-300 text-sm sm:text-base">
                                                            Your payment of{" "}
                                                            <span className="font-semibold">
                                                                IDR 150,000
                                                            </span>{" "}
                                                            has been{" "}
                                                            <span className="text-green-400 font-medium">
                                                                Verified
                                                            </span>
                                                            . Thank you for
                                                            completing your
                                                            registration!
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                </motion.div>
                            ) : showNikForm ? (
                                <motion.div
                                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 sm:p-8 border border-blue-900/30 shadow-xl max-w-2xl mx-auto"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-blue-300">
                                        Complete Your Profile
                                    </h3>
                                    <p className="mb-6 text-gray-300 text-sm sm:text-base">
                                        Please provide your NIK (National
                                        Identity Number) to complete your
                                        registration.
                                    </p>
                                    <form
                                        onSubmit={handleNikSubmit}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <label
                                                htmlFor="nik"
                                                className="block text-sm font-medium text-blue-400 mb-2"
                                            >
                                                NIK (16 digits)
                                            </label>
                                            <input
                                                id="nik"
                                                type="text"
                                                value={data.nik}
                                                onChange={(e) =>
                                                    setData(
                                                        "nik",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-700/80 text-white border border-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                                                required
                                                maxLength={16}
                                                minLength={16}
                                                placeholder="Enter your 16-digit NIK"
                                            />
                                            {errors.nik && (
                                                <div className="text-red-400 text-sm mt-2">
                                                    {errors.nik}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowNikForm(false)
                                                }
                                                className="order-2 sm:order-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="order-1 sm:order-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100 text-sm sm:text-base"
                                            >
                                                {processing
                                                    ? "Submitting..."
                                                    : "Submit"}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center"
                                >
                                    <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 p-6 sm:p-8 rounded-xl border border-blue-700/30 shadow-lg mb-8 max-w-2xl mx-auto">
                                        <p className="text-lg sm:text-xl text-gray-300 mb-6">
                                            Ready to showcase your skills? Join
                                            our hackathon and collaborate with
                                            fellow tech enthusiasts to build
                                            innovative solutions!
                                        </p>

                                        <button
                                            onClick={handleRegisterClick}
                                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
                                        >
                                            Register Your Team
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hacksphere;
