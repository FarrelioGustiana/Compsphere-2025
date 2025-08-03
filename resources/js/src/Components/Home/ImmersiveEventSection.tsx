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
        },
        talksphere: {
            gradient: "from-red-500 to-red-600",
            mascot: "https://exotic-scarlet-bedbug.myfilebase.com/ipfs/QmSrEBwEHL7qjqr9jUtLikLG9W9H1uQdAjoHxrVHiVctrJ",
            bgColor: "bg-red-500/10",
        },
        festsphere: {
            gradient: "from-purple-500 to-purple-600",
            mascot: "https://exotic-scarlet-bedbug.myfilebase.com/ipfs/QmcLQrwLwSuVcrhwtZyF86gpD87FRqeVAKaeZB5nVVbkL5",
            bgColor: "bg-purple-500/10",
        },
        exposphere: {
            gradient: "from-green-500 to-green-600",
            mascot: "https://exotic-scarlet-bedbug.myfilebase.com/ipfs/QmVDvxvGTYBrAkPiqxuou9E668mu5Y78eQhir9RCstWaMK",
            bgColor: "bg-green-500/10",
        },
    };

    const config =
        eventConfigs[
            activeEvent?.event_code?.toLowerCase() as keyof typeof eventConfigs
        ] || eventConfigs.hacksphere;

    return (
        <section className="relative py-20 min-h-screen flex items-center overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 w-full">
                <div
                    key={activeEvent?.id}
                    className="grid md:grid-cols-2 gap-8 items-center opacity-0 animate-fadeIn"
                >
                    {/* Content */}
                    <div className="space-y-6">
                        <h2
                            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                        >
                            {activeEvent?.event_name?.toUpperCase()}
                        </h2>

                        <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                            {activeEvent?.description}
                        </p>

                        {/* Event details */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm">
                                <div
                                    className={`p-2 rounded-lg bg-gradient-to-r ${config.gradient}`}
                                >
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">
                                        Event Date
                                    </h3>
                                    <p className="text-gray-300">
                                        {activeEvent?.start_date}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm">
                                <div
                                    className={`p-2 rounded-lg bg-gradient-to-r ${config.gradient}`}
                                >
                                    <MapPin className="w-5 h-5 text-white" />
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
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() =>
                                    (window.location.href = `/events/${activeEvent?.event_code?.toLowerCase()}`)
                                }
                                className={`bg-gradient-to-r ${config.gradient} text-white py-3 px-6 rounded-lg font-medium inline-flex items-center gap-2 hover:scale-105 transition-transform duration-300`}
                            >
                                <span>Explore</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Mascot */}
                    <div className="relative flex justify-center">
                        <div
                            className={`absolute inset-0 ${config.bgColor} rounded-full blur-3xl opacity-50 animate-pulse-slow`}
                        />
                        <div className="relative animate-float">
                            <img
                                src={config.mascot || "/placeholder.svg"}
                                alt={`${activeEvent?.event_name} Mascot`}
                                className="max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh] object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

           {/* Navigation buttons - Left and Right positioning */}
            {/* Left (Previous) Button */}
            <button
                onClick={() =>
                    setActiveIndex(
                        (prev) => (prev - 1 + events.length) % events.length
                    )
                }
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/80 hover:bg-blue-500 flex items-center justify-center transition-colors duration-300 z-20"
                aria-label="Previous event"
            >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white rotate-180" />
            </button>
            
            {/* Right (Next) Button */}
            <button
                onClick={() =>
                    setActiveIndex((prev) => (prev + 1) % events.length)
                }
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors duration-300 z-20"
                aria-label="Next event"
            >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
        </section>
    );
};

export default EventShowcase;
