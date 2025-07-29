import React, { useState } from "react";
import { User, Participant, Event } from "@/types/models";
import EventRegistration from "@/src/Components/Events/EventRegistration";
import { motion } from "framer-motion";
import { Link } from "lucide-react";
import { route } from "ziggy-js";
import { useForm } from "@inertiajs/react";
import EventLayout from "@/src/Components/Layout/EventLayout";

interface TalksphereProps {
    event: Event;
    user?: User;
    participantDetails?: Participant | null;
    isRegistered?: boolean;
}

const Talksphere: React.FC<TalksphereProps> = ({
    event,
    user,
    participantDetails,
    isRegistered = false,
}) => {
    const { post, processing } = useForm({});

    // Check if profile is complete
    const isProfileComplete =
        participantDetails &&
        participantDetails.category &&
        participantDetails.phone_number &&
        participantDetails.date_of_birth;

    const handleRegisterClick = () => {
        if (!user) {
            window.location.href = route("login");
        } else if (!isProfileComplete) {
            window.location.href = route("participant.profile");
        } else {
            // Standard registration behavior
            post(route("participant.register-event", event.id));
        }
    };

    return (
        <EventLayout>
            <div className="min-h-screen text-white">
                <div
                    className="relative h-screen overflow-hidden"
                    style={{
                        backgroundImage: `url('/assets/red-grid.png')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            style={{
                                backgroundImage: `url('/assets/talksphere/blue-icon.png')`,
                                backgroundSize: "contain",
                                backgroundPosition: "40% center",
                                backgroundRepeat: "no-repeat",
                                opacity: 0.4,
                                width: "100%",
                                height: "100%",
                            }}
                        ></div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                        <motion.h1
                            className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold mb-3 sm:mb-4 tracking-tight"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <span className="bg-gradient-to-r from-[#7ECEF4] via-[#1E88E5] to-[#D32F2F] bg-clip-text text-transparent font-airborne inline-block relative">
                                TALKSPHERE
                            </span>
                        </motion.h1>

                        <div className="flex space-x-6">
                            <button
                                className="border-2 border-white hover:bg-white hover:text-red-900 text-white font-airborne py-2 px-8 transition-colors duration-300 tracking-widest"
                                onClick={handleRegisterClick}
                                disabled={processing}
                            >
                                {processing ? "PROCESSING..." : "REGISTER"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* What is Talksphere Section */}
                <div
                    className="relative h-screen overflow-hidden"
                    style={{
                        backgroundImage: `url('/assets/blue-grid.png')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="container mx-auto px-4 md:px-16 lg:px-24 flex items-center justify-center h-full">
                            <div className="w-full border border-white/70 bg-black/30 p-6 md:p-10">
                                <div className="flex flex-col md:flex-row items-center justify-between">
                                    {/* Left side - Text content */}
                                    <div className="w-full md:w-1/2 mb-8 md:mb-0">
                                        <motion.h2
                                            className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-8 text-white font-airborne tracking-wider text-center md:text-left"
                                            initial={{ x: -50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{
                                                duration: 0.8,
                                                delay: 0.2,
                                            }}
                                        >
                                            WHAT IS TALKSPHERE?
                                        </motion.h2>

                                        <motion.div
                                            className="bg-gray-900/80 backdrop-blur-sm p-4 md:p-6 border border-gray-700"
                                            initial={{ x: -50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{
                                                duration: 0.8,
                                                delay: 0.4,
                                            }}
                                        >
                                            <p className="text-white text-base md:text-lg leading-relaxed">
                                                Talksphere is a series of
                                                talkshow and seminar sessions
                                                featuring notable speakers who
                                                share insights on the latest
                                                happenings in the technological
                                                world. This sub-event is
                                                designed to introduce and spread
                                                knowledge about the world of
                                                technology, aiming to keep
                                                participants informed and
                                                inspired by current trends,
                                                innovations, and future
                                                directions in the digital era.
                                            </p>
                                        </motion.div>
                                    </div>

                                    {/* Mobile mascot - only visible on small screens */}
                                    <div className="flex md:hidden items-center justify-center relative w-full mb-8">
                                        <div className="relative w-80 h-80 sm:w-96 sm:h-96">
                                            {/* Mascot (in front) */}
                                            <div className="absolute bottom-0 right-0 z-10">
                                                <img
                                                    src="/assets/talksphere/machino.png"
                                                    alt="Machino Talksphere"
                                                    className="w-80 sm:w-96 object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right side - Mascot and Logo (desktop) */}
                                    <div className="w-1/2 hidden md:flex items-center justify-center relative">
                                        <div className="relative w-[400px] h-[400px] lg:w-[550px] lg:h-[550px]">
                                            {/* Machino Mascot (in front) */}
                                            <motion.div
                                                className="absolute -bottom-10 -right-10 z-10"
                                                initial={{ y: 30, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{
                                                    duration: 0.8,
                                                    delay: 0.8,
                                                }}
                                            >
                                                <img
                                                    src="/assets/talksphere/machino.png"
                                                    alt="Machino Talksphere"
                                                    className="object-contain w-96 md:w-[400px] lg:w-[500px] xl:w-[600px]"
                                                />
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </EventLayout>
    );
};

export default Talksphere;
