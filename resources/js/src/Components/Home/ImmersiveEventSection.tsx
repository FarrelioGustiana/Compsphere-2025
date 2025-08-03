"use client";

import type React from "react";
import { useState } from "react";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

interface Event {
    id: number;
    event_name: string;
    event_code: string;
    description: string;
    start_date: string;
}

interface EventShowcaseProps {
    events: Event[];
    isLoggedIn?: boolean;
}

const EventShowcase: React.FC<EventShowcaseProps> = ({
    events,
    isLoggedIn = false,
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeEvent = events[activeIndex];

    const eventConfigs = {
        hacksphere: {
            gradient: "from-blue-500 to-blue-600",
            mascot: "https://exotic-scarlet-bedbug.myfilebase.com/ipfs/QmQbuSVn4QLpyWfgEPv4SMQTyhHreCVb4jEwzPQ23Z874j",
            bgColor: "bg-blue-500/10",
            border: "shadow-blue-700/20 border border-blue-800/30",
        },
        talksphere: {
            gradient: "from-red-500 to-red-600",
            mascot: "https://exotic-scarlet-bedbug.myfilebase.com/ipfs/QmSrEBwEHL7qjqr9jUtLikLG9W9H1uQdAjoHxrVHiVctrJ",
            bgColor: "bg-red-500/10",
            border: "shadow-red-700/20 border border-red-800/30",
        },
        festsphere: {
            gradient: "from-purple-500 to-purple-600",
            mascot: "https://exotic-scarlet-bedbug.myfilebase.com/ipfs/QmcLQrwLwSuVcrhwtZyF86gpD87FRqeVAKaeZB5nVVbkL5",
            bgColor: "bg-purple-500/10",
            border: "shadow-purple-700/20 border border-purple-800/30",
        },
        exposphere: {
            gradient: "from-green-500 to-green-600",
            mascot: "https://exotic-scarlet-bedbug.myfilebase.com/ipfs/QmVDvxvGTYBrAkPiqxuou9E668mu5Y78eQhir9RCstWaMK",
            bgColor: "bg-green-500/10",
            border: "shadow-green-700/20 border border-green-800/30",
        },
    };

    const config =
        eventConfigs[
            activeEvent?.event_code?.toLowerCase() as keyof typeof eventConfigs
        ] || eventConfigs.hacksphere;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <section className="relative py-12 sm:py-16 md:py-20 min-h-screen flex items-center overflow-hidden px-4 sm:px-6 md:px-8">
            <div className="max-w-7xl mx-auto w-full">
                <div
                    key={activeEvent?.id}
                    className={`${config.border} bg-gradient-to-b shadow-2xl rounded-xl grid grid-cols-1 md:grid-cols-2 py-6 px-4 sm:py-8 sm:px-6 md:py-10 md:px-8 lg:py-12 lg:px-12 gap-6 md:gap-8 items-center opacity-0 animate-fadeIn`}
                >
                    {/* Content */}
                    <div className="space-y-4 sm:space-y-6">
                        <h2
                            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                        >
                            {activeEvent?.event_name?.toUpperCase()}
                        </h2>

                        <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed line-clamp-4 sm:line-clamp-none">
                            {activeEvent?.description}
                        </p>

                        {/* Event details */}
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-white/5 backdrop-blur-sm">
                                <div
                                    className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-r ${config.gradient}`}
                                >
                                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">
                                        Event Date
                                    </h3>
                                    <p className="text-gray-300">
                                        {formatDate(activeEvent?.start_date)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-white/5 backdrop-blur-sm">
                                <div
                                    className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-r ${config.gradient}`}
                                >
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">
                                        Location
                                    </h3>
                                    <p className="text-gray-300">
                                        President University, Cikarang
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA buttons */}
                        <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 sm:mt-4">
                            <button
                                onClick={() =>
                                    (window.location.href = `/events/${activeEvent?.event_code?.toLowerCase()}`)
                                }
                                className={`cursor-pointer bg-gradient-to-r ${config.gradient} text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium inline-flex items-center gap-1.5 sm:gap-2 hover:scale-105 transition-transform duration-300 text-sm sm:text-base`}
                            >
                                <span>Explore</span>
                                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Mascot - Order changed for mobile */}
                    <div className="relative flex justify-center md:order-2">
                        <div
                            className={`absolute inset-0 ${config.bgColor} rounded-full blur-3xl opacity-50 animate-pulse-slow`}
                        />
                        <div className="relative animate-float">
                            <img
                                src={config.mascot || "/placeholder.svg"}
                                alt={`${activeEvent?.event_name} Mascot`}
                                className="max-h-[30vh] xs:max-h-[35vh] sm:max-h-[40vh] md:max-h-[50vh] lg:max-h-[60vh] object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation buttons - Responsive positioning */}
            {/* Bottom navigation for small screens, sides for larger screens */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 md:hidden z-30">
                <button
                    onClick={() =>
                        setActiveIndex(
                            (prev) => (prev - 1 + events.length) % events.length
                        )
                    }
                    className="cursor-pointer w-10 h-10 rounded-full bg-blue-500/90 hover:bg-blue-500 flex items-center justify-center transition-colors duration-300 shadow-lg"
                    aria-label="Previous event"
                >
                    <ArrowRight className="w-4 h-4 text-white rotate-180" />
                </button>
                
                <button
                    onClick={() =>
                        setActiveIndex((prev) => (prev + 1) % events.length)
                    }
                    className="cursor-pointer w-10 h-10 rounded-full bg-red-500/90 hover:bg-red-500 flex items-center justify-center transition-colors duration-300 shadow-lg"
                    aria-label="Next event"
                >
                    <ArrowRight className="w-4 h-4 text-white" />
                </button>
            </div>
            
            {/* Side navigation for larger screens */}
            {/* Left (Previous) Button */}
            <button
                onClick={() =>
                    setActiveIndex(
                        (prev) => (prev - 1 + events.length) % events.length
                    )
                }
                className="cursor-pointer hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-blue-500/80 hover:bg-blue-500 items-center justify-center transition-colors duration-300 z-20 shadow-lg"
                aria-label="Previous event"
            >
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-white rotate-180" />
            </button>

            {/* Right (Next) Button */}
            <button
                onClick={() =>
                    setActiveIndex((prev) => (prev + 1) % events.length)
                }
                className="cursor-pointer hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-red-500/80 hover:bg-red-500 items-center justify-center transition-colors duration-300 z-20 shadow-lg"
                aria-label="Next event"
            >
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </button>
        </section>
    );
};

export default EventShowcase;
