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
import RegistrationSection from "@/src/Components/Hacksphere/RegistrationSection";
import AboutSection from "@/src/Components/Hacksphere/AboutSection";
import FeaturesSection from "@/src/Components/Hacksphere/FeaturesSection";
import PrizesSection from "@/src/Components/Hacksphere/PrizesSection";

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

    // Event date for countdown (October 12, 2025)
    const eventDate = new Date(2025, 9, 12, 18, 0, 0);

    const [showNikForm, setShowNikForm] = useState(false);
    const [showHacksphereRegistration, setShowHacksphereRegistration] =
        useState(false);
    const [showTwibbonEditMode, setShowTwibbonEditMode] = useState(false);
    const [twibbonMessage, setTwibbonMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        nik: "",
    });

    const twibbonForm = useForm({
        twibbon_link: "",
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
                        <AboutSection fadeInUpVariant={fadeInUpVariant} />
                        <FeaturesSection fadeInUpVariant={fadeInUpVariant} />
                        <PrizesSection fadeInUpVariant={fadeInUpVariant} />

                        <RegistrationSection
                            fadeInUpVariant={fadeInUpVariant}
                            isRegistered={isRegistered}
                            eventRegistration={eventRegistration}
                            event={event}
                            showTwibbonEditMode={showTwibbonEditMode}
                            setShowTwibbonEditMode={setShowTwibbonEditMode}
                            twibbonForm={twibbonForm}
                            twibbonMessage={twibbonMessage}
                            setTwibbonMessage={setTwibbonMessage}
                            showNikForm={showNikForm}
                            setShowNikForm={setShowNikForm}
                            handleNikSubmit={handleNikSubmit}
                            processing={processing}
                            errors={errors}
                            handleRegisterClick={handleRegisterClick}
                            data={data}
                            setData={setData}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hacksphere;
