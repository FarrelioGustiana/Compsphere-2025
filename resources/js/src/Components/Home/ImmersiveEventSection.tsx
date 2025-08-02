import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Event } from "@/types/models";

interface ImmersiveEventSectionProps {
    events: Event[];
    isLoggedIn?: boolean;
}

interface MascotConfig {
    path: string;
    position: string;
    scale: string;
    translateY: string;
}

const getMascotConfig = (eventCode: string): MascotConfig => {
    const configs: Record<string, MascotConfig> = {
        hacksphere: {
            path: "https://exotic-scarlet-bedbug.myfilebase.com/ipfs/QmQbuSVn4QLpyWfgEPv4SMQTyhHreCVb4jEwzPQ23Z874j",
            position: "right-0 md:right-10 bottom-0",
            scale: "scale-75 md:scale-90 lg:scale-100",
            translateY: "translate-y-10 md:translate-y-16",
        },
        talksphere: {
            path: "https://exotic-scarlet-bedbug.myfilebase.com/ipfs/QmSrEBwEHL7qjqr9jUtLikLG9W9H1uQdAjoHxrVHiVctrJ",
            position: "right-0 md:right-10 bottom-0",
            scale: "scale-75 md:scale-90 lg:scale-100",
            translateY: "translate-y-10 md:translate-y-16",
        },
        festsphere: {
            path: "https://exotic-scarlet-bedbug.myfilebase.com/ipfs/QmcLQrwLwSuVcrhwtZyF86gpD87FRqeVAKaeZB5nVVbkL5",
            position: "right-0 md:right-10 bottom-0",
            scale: "scale-75 md:scale-90 lg:scale-100",
            translateY: "translate-y-10 md:translate-y-16",
        },
        exposphere: {
            path: "https://exotic-scarlet-bedbug.myfilebase.com/ipfs/QmVDvxvGTYBrAkPiqxuou9E668mu5Y78eQhir9RCstWaMK",
            position: "right-0 md:right-10 bottom-0",
            scale: "scale-75 md:scale-90 lg:scale-100",
            translateY: "translate-y-10 md:translate-y-16",
        },
    };

    return configs[eventCode] || configs.hacksphere;
};

// Custom gradient map for each event
const getEventGradient = (eventCode: string): string => {
    const gradients: Record<string, string> = {
        talksphere: "from-[#D32F2F] to-[#FF5252]",
        hacksphere: "from-[#1E88E5] to-[#7ECEF4]",
        festsphere: "from-[#7B1FA2] to-[#9C27B0]",
        exposphere: "from-[#2E7D32] to-[#4CAF50]",
    };

    return gradients[eventCode] || gradients.talksphere;
};

const ImmersiveEventSection: React.FC<ImmersiveEventSectionProps> = ({
    events,
    isLoggedIn = false,
}) => {
    const [activeEventIndex, setActiveEventIndex] = useState(0);
    const activeEvent = events[activeEventIndex];

    const nextEvent = () => {
        setActiveEventIndex((prev) => (prev + 1) % events.length);
    };

    const prevEvent = () => {
        setActiveEventIndex(
            (prev) => (prev - 1 + events.length) % events.length
        );
    };

    const mascotConfig = getMascotConfig(activeEvent.event_code.toLowerCase());
    const eventGradient = getEventGradient(
        activeEvent.event_code.toLowerCase()
    );

    return (
        <section className="relative py-20 sm:py-32 overflow-hidden min-h-screen flex items-center">
            {/* Navigation dots */}
            <div className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4">
                {events.map((event, index) => (
                    <button
                        key={event.id}
                        onClick={() => setActiveEventIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === activeEventIndex
                                ? `bg-gradient-to-r ${getEventGradient(
                                      event.event_code.toLowerCase()
                                  )} scale-125`
                                : "bg-white/30"
                        }`}
                        aria-label={`View ${event.event_name}`}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeEvent.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6 }}
                        className="relative flex flex-col md:flex-row md:items-center"
                    >
                        {/* Text content */}
                        <div className="relative z-10 max-w-lg md:max-w-xl lg:max-w-2xl py-10 md:py-20 md:pr-8">
                            {/* Title with gradient */}
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
                                    <span
                                        className={`bg-gradient-to-r ${eventGradient} bg-clip-text text-transparent font-airborne inline-block`}
                                    >
                                        {activeEvent.event_name.toUpperCase()}
                                    </span>
                                </h2>
                            </motion.div>

                            {/* Description */}
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <p className="text-lg sm:text-xl text-gray-300 mb-6 leading-relaxed">
                                    {activeEvent.description}
                                </p>
                            </motion.div>

                            {/* Event details (animated on appear) */}
                            <motion.div
                                className="space-y-4 mb-8"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                {/* Date info with animated border */}
                                <motion.div
                                    className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border-l-4 border-transparent"
                                    whileHover={{
                                        borderLeftColor:
                                            "rgba(255,255,255,0.3)",
                                        backgroundColor:
                                            "rgba(255,255,255,0.07)",
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div
                                        className={`p-2 rounded-lg bg-gradient-to-br ${eventGradient}`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-white"
                                        >
                                            <rect
                                                width="18"
                                                height="18"
                                                x="3"
                                                y="4"
                                                rx="2"
                                                ry="2"
                                            ></rect>
                                            <line
                                                x1="16"
                                                x2="16"
                                                y1="2"
                                                y2="6"
                                            ></line>
                                            <line
                                                x1="8"
                                                x2="8"
                                                y1="2"
                                                y2="6"
                                            ></line>
                                            <line
                                                x1="3"
                                                x2="21"
                                                y1="10"
                                                y2="10"
                                            ></line>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">
                                            Tanggal Event
                                        </h3>
                                        <p className="text-gray-200">
                                            {activeEvent.start_date}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Location info */}
                                <motion.div
                                    className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border-l-4 border-transparent"
                                    whileHover={{
                                        borderLeftColor:
                                            "rgba(255,255,255,0.3)",
                                        backgroundColor:
                                            "rgba(255,255,255,0.07)",
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div
                                        className={`p-2 rounded-lg bg-gradient-to-br ${eventGradient}`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-white"
                                        >
                                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                            <circle
                                                cx="12"
                                                cy="10"
                                                r="3"
                                            ></circle>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">
                                            Lokasi
                                        </h3>
                                        <p className="text-gray-200">
                                            President University, Cikarang
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* CTA buttons */}
                            <motion.div
                                className="flex flex-wrap gap-4"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Link
                                    href={`/events/${activeEvent.event_code.toLowerCase()}`}
                                    className={`relative group overflow-hidden bg-gradient-to-r ${eventGradient} text-white py-3 px-6 rounded-lg font-medium inline-flex items-center space-x-2 hover:shadow-lg hover:shadow-${activeEvent.event_code.toLowerCase()}-500/20 transition-all duration-300`}
                                >
                                    <span>Jelajahi</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                    <span className="absolute inset-0 bg-black/20 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                                </Link>

                                {isLoggedIn ? (
                                    <Link
                                        href={`/participant/register/${activeEvent.event_code.toLowerCase()}`}
                                        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white py-3 px-6 rounded-lg font-medium inline-flex items-center space-x-2 transition-all duration-300 border border-white/10"
                                    >
                                        <span>Daftar Sekarang</span>
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white py-3 px-6 rounded-lg font-medium inline-flex items-center space-x-2 transition-all duration-300 border border-white/10"
                                    >
                                        <span>Login untuk Mendaftar</span>
                                    </Link>
                                )}
                            </motion.div>
                        </div>

                        {/* Mascot image with glow and floating animation */}
                        <motion.div
                            className={`absolute ${mascotConfig.position} ${mascotConfig.scale} ${mascotConfig.translateY} z-0 pointer-events-none transform`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: [0, -15, 0],
                            }}
                            transition={{
                                duration: 0.8,
                                delay: 0.3,
                                y: {
                                    duration: 4,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut",
                                },
                            }}
                            key={`mascot-${activeEvent.id}`}
                        >
                            {/* Glowing orb behind mascot */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-r ${eventGradient} rounded-full blur-[80px] opacity-40`}
                                style={{
                                    width: "80%",
                                    height: "80%",
                                    top: "10%",
                                    left: "10%",
                                    filter: "blur(40px)",
                                    animation:
                                        "pulse-glow 3s infinite alternate",
                                }}
                            />

                            {/* Animated particles around mascot */}
                            <motion.div
                                className="absolute inset-0 z-0"
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            >
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className={`absolute w-3 h-3 rounded-full bg-gradient-to-r ${eventGradient}`}
                                        style={{
                                            top: `${
                                                50 +
                                                35 * Math.sin(i * (Math.PI / 3))
                                            }%`,
                                            left: `${
                                                50 +
                                                35 * Math.cos(i * (Math.PI / 3))
                                            }%`,
                                            filter: "blur(2px)",
                                            opacity: 0.8,
                                        }}
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.4, 0.8, 0.4],
                                        }}
                                        transition={{
                                            duration: 3,
                                            delay: i * 0.2,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                        }}
                                    />
                                ))}
                            </motion.div>

                            <img
                                src={mascotConfig.path}
                                alt={`${activeEvent.event_name} Mascot`}
                                className="max-h-[70vh] object-contain relative z-10"
                                style={{
                                    filter: "drop-shadow(0 0 15px rgba(0,0,0,0.5))",
                                }}
                            />
                        </motion.div>

                        {/* Background effect specific to the event */}
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                            <motion.div
                                className={`absolute top-1/4 right-1/4 w-1/2 h-1/2 bg-gradient-to-br ${eventGradient} blur-[100px] rounded-full`}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.2, 0.3, 0.2],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                                key={`bg-effect-${activeEvent.id}`}
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation buttons */}
                <motion.div
                    className="absolute z-20 bottom-5 right-5 sm:bottom-10 sm:right-10 flex items-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <motion.div
                        className="flex items-center gap-2 px-3 py-1 bg-black/30 backdrop-blur-md rounded-full border border-white/10"
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.button
                            onClick={prevEvent}
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-[#1E88E5]/80 to-[#0D47A1]/80 hover:from-[#1E88E5] hover:to-[#0D47A1] flex items-center justify-center transition-all duration-300 shadow-lg shadow-blue-900/20 border border-white/10`}
                            aria-label="Previous event"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-white transform rotate-180" />
                        </motion.button>
                        <motion.button
                            onClick={nextEvent}
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-[#D32F2F]/80 to-[#B71C1C]/80 hover:from-[#D32F2F] hover:to-[#B71C1C] flex items-center justify-center transition-all duration-300 shadow-lg shadow-red-900/20 border border-white/10`}
                            aria-label="Next event"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default ImmersiveEventSection;
