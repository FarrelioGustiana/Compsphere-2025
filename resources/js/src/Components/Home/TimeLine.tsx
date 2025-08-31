"use client";

import type React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    ChevronUp,
    ChevronDown,
    Menu,
    X,
} from "lucide-react";

interface TimelineEvent {
    id: string;
    name: string;
    description: string;
    date: string;
    time: string;
    location: string;
    participants: string;
    gradient: string; // Tailwind class string
    cssGradient: string; // Direct CSS linear-gradient value
    bgColor: string;
}

const InteractiveTimeline: React.FC = () => {
    const [activeEvent, setActiveEvent] = useState<string>("hacksphere");
    const [scrollProgress, setScrollProgress] = useState(-1);
    const [visibleEvents, setVisibleEvents] = useState<Set<string>>(new Set());
    const timelineRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const events: TimelineEvent[] = [
        {
            id: "hacksphere",
            name: "Hacksphere",
            description:
                "Immerse yourself in a 48-hour coding marathon where the brightest minds collaborate to build innovative solutions. Connect with mentors, access cutting-edge technologies, and compete for stellar prizes.",
            date: "October 2-4, 2025",
            time: "Starts 12.00 WIB",
            location: "Fablab, President University",
            participants: "50+ Participants",
            gradient: "from-blue-500 to-blue-600",
            cssGradient: "linear-gradient(to right, #3b82f6, #2563eb)", // blue-500 to blue-600
            bgColor: "bg-blue-500/10",
        },
        {
            id: "talksphere",
            name: "Talksphere",
            description:
                "Join visionary tech leaders and innovators for cutting-edge talks and panels. Network with industry experts, gain insights into emerging technologies, and expand your knowledge horizons.",
            date: "October 2, 2025",
            time: "09.00 - 17.00 WIB",
            location: "Fablab, President University.",
            participants: "Open to Public",
            gradient: "from-red-500 to-red-600",
            cssGradient: "linear-gradient(to right, #ef4444, #dc2626)", // red-500 to red-600
            bgColor: "bg-red-500/10",
        },
        {
            id: "festsphere",
            name: "Festsphere",
            description:
                "Celebrate the fusion of technology, art, and culture at Festsphere! Enjoy live music, tech showcases, creative workshops, and vibrant community activities.",
            date: "October 4, 2025",
            time: "10:00 AM - 9:00 PM",
            location: "Charles Hirmawan Auditorium, President University.",
            participants: "Open to Public",
            gradient: "from-purple-500 to-purple-600",
            cssGradient: "linear-gradient(to right, #a855f7, #9333ea)", // purple-500 to purple-600
            bgColor: "bg-purple-500/10",
        },
        {
            id: "exposphere",
            name: "Exposphere",
            description:
                "Showcase of cutting-edge innovations, startups, and industry leaders shaping our technological future. Experience interactive demos and connect with tech disruptors.",
            date: "October 1 - 4, 2025",
            time: "9:00 AM - 6:00 PM",
            location: "President University Convention Center (PUCC)",
            participants: "50+ Exhibitors",
            gradient: "from-green-500 to-green-600",
            cssGradient: "linear-gradient(to right, #22c55e, #16a34a)", // green-500 to green-600
            bgColor: "bg-green-500/10",
        },
    ];

    // Throttled scroll handler for performance
    const handleScroll = useCallback(() => {
        if (!timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementHeight = rect.height;
        const elementTop = rect.top;

        const progress = Math.max(
            -1,
            Math.min(
                1,
                (windowHeight - elementTop) / (windowHeight + elementHeight)
            )
        );
        setScrollProgress(progress);
    }, []);

    // Intersection Observer for lazy loading and active event detection
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const eventId = entry.target.getAttribute("data-event-id");
                    if (!eventId) return;

                    if (entry.isIntersecting) {
                        setVisibleEvents((prev) => new Set(prev).add(eventId));

                        // Set active event based on intersection ratio
                        if (entry.intersectionRatio > 0.5) {
                            setActiveEvent(eventId);
                        }
                    } else {
                        setVisibleEvents((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(eventId);
                            return newSet;
                        });
                    }
                });
            },
            {
                threshold: [0, 0.5, 1],
                rootMargin: "-10% 0px -10% 0px",
            }
        );

        // Observe all event elements
        const eventElements = document.querySelectorAll("[data-event-id]");
        eventElements.forEach((el) => observerRef.current?.observe(el));

        return () => {
            observerRef.current?.disconnect();
        };
    }, []);

    // Throttled scroll listener
    useEffect(() => {
        let ticking = false;

        const scrollListener = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", scrollListener, { passive: true });
        handleScroll(); // Initial call

        return () => window.removeEventListener("scroll", scrollListener);
    }, [handleScroll]);

    const scrollToEvent = useCallback((eventId: string) => {
        const element = document.querySelector(`[data-event-id="${eventId}"]`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, []);

    const currentActiveEvent = events.find((e) => e.id === activeEvent);

    return (
        <section
            ref={timelineRef}
            className="relative py-12 sm:py-16 lg:py-20 px-4 overflow-hidden"
        >
            {/* Background effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-10 right-[10%] w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full bg-blue-500/20 blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-20 left-[15%] w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 rounded-full bg-red-500/20 blur-3xl animate-pulse-slow animation-delay-2000" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-red-500 bg-clip-text text-transparent">
                        TIMELINE
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
                        Discover the unique experiences that await you at
                        Compsphere 2025
                    </p>
                </div>

                {/* Timeline Layout */}
                <div className="grid grid-cols-[60px_1fr] lg:grid-cols-1 relative">
                    {/* Timeline bar */}
                    <div className="relative h-full lg:absolute lg:left-1/2 lg:-ml-1 z-20">
                        {/* Background line */}
                        <div className="w-1 h-full bg-white/20 rounded-full mx-auto"></div>

                        {/* Progress line */}
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-red-500 via-blue-500 to-green-500 rounded-full"
                            style={{ height: `${scrollProgress * 100}%` }}
                        ></div>

                        {/* Moving node */}
                        {currentActiveEvent && (
                            <div
                                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-lg flex items-center justify-center z-20 transition-colors duration-300"
                                style={{
                                    top: `${scrollProgress * 100}%`,
                                    background: currentActiveEvent.cssGradient,
                                }}
                            >
                                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white" />
                                <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-12 sm:space-y-16 lg:space-y-24 flex-grow lg:mx-auto lg:w-full">
                        {events.map((event, index) => (
                            <div
                                key={event.id}
                                data-event-id={event.id}
                                className={`relative transition-all duration-700 ${
                                    visibleEvents.has(event.id)
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"
                                }`}
                            >
                                <div
                                    className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center ${
                                        index % 2 === 0
                                            ? ""
                                            : "lg:grid-flow-col-dense"
                                    } relative lg:px-16`}
                                >
                                    {/* Content */}
                                    <div
                                        className={`${
                                            index % 2 === 0
                                                ? "lg:mr-4"
                                                : "lg:col-start-2 lg:ml-4"
                                        } px-2 sm:px-0`}
                                    >
                                        <div
                                            className={`${
                                                event.bgColor
                                            } backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-2xl border transition-all duration-500 hover:scale-105 cursor-pointer ${
                                                activeEvent === event.id
                                                    ? "border-white/30 shadow-2xl bg-opacity-20"
                                                    : "border-white/10 bg-opacity-10"
                                            }`}
                                            onClick={() =>
                                                scrollToEvent(event.id)
                                            }
                                        >
                                            {/* Event badge */}
                                            <div
                                                className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${event.gradient} text-white text-xs sm:text-sm font-medium mb-3 sm:mb-4`}
                                            >
                                                {event.name}
                                            </div>

                                            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">
                                                {event.name}
                                            </h3>

                                            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                                                {event.description}
                                            </p>

                                            {/* Event details grid - Responsive layout */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                                                <div className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-white/5">
                                                    <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400 flex-shrink-0" />
                                                    <div>
                                                        <div className="font-medium text-white text-xs sm:text-sm">
                                                            Date
                                                        </div>
                                                        <div className="text-gray-300 text-xs sm:text-sm">
                                                            {event.date}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-white/5">
                                                    <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-green-400 flex-shrink-0" />
                                                    <div>
                                                        <div className="font-medium text-white text-xs sm:text-sm">
                                                            Time
                                                        </div>
                                                        <div className="text-gray-300 text-xs sm:text-sm">
                                                            {event.time}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-white/5">
                                                    <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-red-400 flex-shrink-0" />
                                                    <div>
                                                        <div className="font-medium text-white text-xs sm:text-sm">
                                                            Location
                                                        </div>
                                                        <div className="text-gray-300 text-xs sm:text-sm">
                                                            {event.location}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-white/5">
                                                    <Users className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400 flex-shrink-0" />
                                                    <div>
                                                        <div className="font-medium text-white text-xs sm:text-sm">
                                                            Scale
                                                        </div>
                                                        <div className="text-gray-300 text-xs sm:text-sm">
                                                            {event.participants}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InteractiveTimeline;
