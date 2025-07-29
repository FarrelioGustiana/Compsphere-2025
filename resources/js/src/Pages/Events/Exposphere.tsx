import React from "react";
import { motion } from "framer-motion";
import { User, Participant, Event } from "@/types/models";
import EventRegistration from "@/src/Components/Events/EventRegistration";
import EventLayout from "@/src/Components/Layout/EventLayout";

interface ExposphereProps {
    event: Event;
    user?: User;
    participantDetails?: Participant | null;
    isRegistered: boolean;
}

const Exposphere: React.FC<ExposphereProps> = ({
    event,
    user,
    participantDetails,
    isRegistered,
}) => {
    return (
        <EventLayout>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-teal-500 text-white p-8">
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
                                backgroundImage: `url('/assets/exposphere/blue-icon.png')`,
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
                                EXPOSPHERE
                            </span>
                        </motion.h1>

                        <div className="flex space-x-6">
                            <button className="border-2 border-white hover:bg-white hover:text-red-900 text-white font-airborne py-2 px-8 transition-colors duration-300 tracking-widest">
                                NO REGISTER REQUIRED
                            </button>
                        </div>
                    </div>
                </div>

                {isRegistered ? (
                    <div className="mt-8 text-center">
                        <div className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg">
                            You are registered for this event!
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 text-center">
                        <div className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg">
                            You are registered for this event!
                        </div>
                    </div>
                )}
            </div>
        </EventLayout>
    );
};

export default Exposphere;
