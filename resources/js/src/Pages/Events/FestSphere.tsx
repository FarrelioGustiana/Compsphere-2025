import React from "react";
import { User, Participant, Event } from "@/types/models";
import EventRegistration from "@/src/Components/Events/EventRegistration";
import { useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { route } from "ziggy-js";
import EventLayout from "@/src/Components/Layout/EventLayout";

interface FestSphereProps {
    event: Event;
    user?: User;
    participantDetails?: Participant | null;
    isRegistered?: boolean;
}

const FestSphere: React.FC<FestSphereProps> = ({
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
                                backgroundImage: `url('/assets/festsphere/blue-icon.png')`,
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                opacity: 0.3,
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
                                FESTSPHERE
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

                {/* What is Festsphere Section */}
                <div
                    className="relative min-h-screen overflow-hidden py-10 md:py-0"
                    style={{
                        backgroundImage: `url('/assets/blue-grid.png')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="container mx-auto px-4 md:px-16 lg:px-24 flex items-center justify-center h-full">
                            <div className="w-full border border-white/70 bg-black/30 p-6 md:p-10 flex flex-col relative">
                                {/* Mobile Layout (Description → Date & Location → Mascot) */}
                                <div className="md:hidden flex flex-col">
                                    {/* Description Box - Mobile */}
                                    <motion.div
                                        className="border border-white/70 p-6 mb-8"
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.6,
                                        }}
                                    >
                                        <p className="text-white text-base">
                                            Festsphere is a vibrant festival
                                            that celebrates the talents and
                                            accomplishments of the Faculty of
                                            Computer Science through mesmerizing
                                            performances and awarding sessions.
                                            Designed to offer a space for
                                            enjoyment and meaningful
                                            interaction, Festsphere brings
                                            together students, lecturers, and
                                            guests in a lively and memorable
                                            atmosphere that highlights the
                                            spirit and creativity of the
                                            compsphere.
                                        </p>
                                    </motion.div>

                                    {/* Date & Location - Mobile */}
                                    <motion.div
                                        className="w-full text-center mb-8"
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.8,
                                        }}
                                    >
                                        <h2 className="text-2xl font-airborne tracking-wide mb-4">
                                            DATE & LOCATION
                                        </h2>
                                        <div className="space-y-2">
                                            <p className="text-base">
                                                <span className="font-semibold">
                                                    Date & Time:
                                                </span>{" "}
                                                4 October 2025
                                            </p>
                                            <p className="text-base">
                                                <span className="font-semibold">
                                                    Location:
                                                </span>{" "}
                                                Charles Hermawan Auditorium,
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Mascot - Mobile */}
                                    <div className="flex justify-center items-center">
                                        <motion.div
                                            className="relative"
                                            initial={{ y: 30, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                duration: 0.8,
                                                delay: 1.0,
                                            }}
                                        >
                                            <img
                                                src="/assets/festsphere/machino.png"
                                                alt="Machino Festsphere"
                                                className="object-contain w-[300px]"
                                            />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Desktop Layout (Mascot + Description with Date & Location at bottom) */}
                                <div className="hidden md:block">
                                    <div className="flex flex-row">
                                        {/* Left Section with Mascot - Desktop */}
                                        <div className="w-1/2 flex items-center justify-center relative">
                                            <div className="relative w-[500px] h-[500px] lg:w-[650px] lg:h-[650px]">
                                                {/* Machino Mascot (in front) */}
                                                <motion.div
                                                    className="absolute -top-20 -right-20 z-10"
                                                    initial={{
                                                        y: 30,
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        y: 0,
                                                        opacity: 1,
                                                    }}
                                                    transition={{
                                                        duration: 0.8,
                                                        delay: 0.8,
                                                    }}
                                                >
                                                    <img
                                                        src="/assets/festsphere/machino.png"
                                                        alt="Machino Festsphere"
                                                        className="object-contain w-[500px] md:w-[600px] lg:w-[700px] xl:w-[800px]"
                                                    />
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Right Section with Text - Desktop */}
                                        <div className="w-1/2 flex flex-col mt-18 md:mt-24">
                                            {/* Description Box */}
                                            <motion.div
                                                className="border border-white/70 p-6"
                                                initial={{ x: 50, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{
                                                    duration: 0.8,
                                                    delay: 0.6,
                                                }}
                                            >
                                                <p className="text-white text-lg">
                                                    Festsphere is a vibrant
                                                    festival that celebrates the
                                                    talents and accomplishments
                                                    of the Faculty of Computer
                                                    Science through mesmerizing
                                                    performances and awarding
                                                    sessions. Designed to offer
                                                    a space for enjoyment and
                                                    meaningful interaction,
                                                    Festsphere brings together
                                                    students, lecturers, and
                                                    guests in a lively and
                                                    memorable atmosphere that
                                                    highlights the spirit and
                                                    creativity of the
                                                    compsphere.
                                                </p>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Date & Location - Desktop */}
                                    <motion.div
                                        className="w-full relative text-center -mt-56 mb-2"
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.8,
                                        }}
                                    >
                                        <h2 className="text-2xl md:text-3xl font-airborne tracking-wide mb-4">
                                            DATE & LOCATION
                                        </h2>
                                        <div className="space-y-2">
                                            <p className="text-lg">
                                                <span className="font-semibold">
                                                    Date & Time:
                                                </span>{" "}
                                                4 October 2025
                                            </p>
                                            <p className="text-lg">
                                                <span className="font-semibold">
                                                    Location:
                                                </span>{" "}
                                                Charles Hermawan Auditorium,
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </EventLayout>
    );
};

export default FestSphere;
