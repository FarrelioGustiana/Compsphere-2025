"use client";

import type React from "react";
import { Suspense, useMemo } from "react";
import {
    ChevronDown,
    ArrowRight,
    MapPin,
    Calendar,
    Clock,
    User,
} from "lucide-react";
import OptimizedBackground from "@/src/Components/UI/EnhancedBackground";
import Logo from "@/src/Components/UI/Logo";
import EventShowcase from "@/src/Components/Home/ImmersiveEventSection";
import Timeline from "@/src/Components/Home/TimeLine";
import { usePage } from "@inertiajs/react";
import { Event } from "@/types/models";
import Navigation from "../Components/Layout/Navigation";

// Mock data - replace with your actual data
const mockEvents = [
    {
        id: 1,
        event_name: "Hacksphere",
        event_code: "hacksphere",
        description:
            "Immerse yourself in a 48-hour coding marathon where the brightest minds collaborate to build innovative solutions.",
        start_date: "12-14 Oktober 2025",
    },
    {
        id: 2,
        event_name: "Talksphere",
        event_code: "talksphere",
        description:
            "Join visionary tech leaders and innovators for cutting-edge talks and panels.",
        start_date: "13 Oktober 2025",
    },
    {
        id: 3,
        event_name: "Festsphere",
        event_code: "festsphere",
        description:
            "Celebrate the fusion of technology, art, and culture at Festsphere!",
        start_date: "April 15-16, 2025",
    },
    {
        id: 4,
        event_name: "Exposphere",
        event_code: "exposphere",
        description:
            "Showcase of cutting-edge innovations, startups, and industry leaders.",
        start_date: "April 17, 2025",
    },
];

export const getColorAndIcon = (eventCode: string) => {
    const colors: Record<string, string> = {
        hacksphere: "from-[#D32F2F] to-[#FF5252]",
        talksphere: "from-[#1E88E5] to-[#7ECEF4]",
        festsphere: "from-[#7B1FA2] to-[#9C27B0]",
        exposphere: "from-[#2E7D32] to-[#4CAF50]",
    };
    const icons: Record<string, React.ReactNode> = {
        hacksphere: <Calendar className="w-6 h-6" />,
        talksphere: <MapPin className="w-6 h-6" />,
        festsphere: <Clock className="w-6 h-6" />,
        exposphere: <Calendar className="w-6 h-6" />,
    };
    return { color: colors[eventCode], icon: icons[eventCode] };
};

const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
    </div>
);

const Home: React.FC = () => {
    const { events, auth } = usePage().props as unknown as {
        events: Event[];
        auth: { user: any };
    };
    // Check if user is logged in
    const isLoggedIn = useMemo(() => auth?.user !== null, [auth?.user]);

    const scrollToEvents = () => {
        document
            .getElementById("events-section")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen text-white overflow-hidden bg-black">
            <OptimizedBackground />

            <div className="relative z-10">
                {/* Navigation - simplified */}
                <Navigation />

                {/* Hero Section */}
                <section className="min-h-screen flex flex-col justify-center items-center px-4 pt-24 sm:pt-32 lg:pt-40">
                    <div className="max-w-4xl text-center space-y-8">
                        {/* Logo */}
                        <div className="opacity-0 animate-fadeIn">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl" />
                                <Logo
                                    size="xl"
                                    className="justify-center relative z-10"
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold opacity-0 animate-fadeIn animation-delay-200">
                            <span className="bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
                                COMPSPHERE
                            </span>
                        </h1>

                        {/* Tagline */}
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 opacity-0 animate-fadeIn animation-delay-300">
                            <span className="text-blue-400">Accelerating</span>{" "}
                            Innovation Through{" "}
                            <span className="text-red-400">Intelligent</span>{" "}
                            Technology
                        </p>

                        {/* Description */}
                        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fadeIn animation-delay-400">
                            Bergabunglah dengan para inovator, developer, dan
                            teknolog terdepan dalam event teknologi terbesar
                            tahun ini.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fadeIn animation-delay-500">
                            {isLoggedIn ? (
                                <button
                                    onClick={() => {
                                        window.location.href = `/${auth?.user?.role}/dashboard`;
                                    }}
                                    className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 inline-flex items-center gap-2 hover:scale-105"
                                >
                                    <span>Dashboard</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            window.location.href = "/register";
                                        }}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 inline-flex items-center gap-2 hover:scale-105"
                                    >
                                        <span>Daftar Sekarang</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            window.location.href = "/login";
                                        }}
                                        className="bg-transparent border border-blue-400/20 hover:border-blue-400/40 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300"
                                    >
                                        Login
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <button
                        onClick={scrollToEvents}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow opacity-0 animate-fadeIn animation-delay-1000"
                    >
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                    </button>
                </section>

                {/* Events Section */}
                <section id="events-section" className="relative">
                    <div className="text-center py-16 opacity-0 animate-fadeInView">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-blue-500 to-red-500 bg-clip-text text-transparent">
                            OUR SUB-EVENTS
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto px-4">
                            Check out our sub-events and join us in celebrating
                            the latest in technology and innovation.
                        </p>
                    </div>

                    <Suspense fallback={<LoadingSpinner />}>
                        <EventShowcase
                            events={events}
                            isLoggedIn={isLoggedIn}
                        />
                    </Suspense>
                </section>

                {/* Timeline */}
                <div className="timeline-wrapper relative">
                    <Suspense fallback={<LoadingSpinner />}>
                        <Timeline />
                    </Suspense>
                </div>

                {/* Footer */}
                <footer className="relative py-16 px-4 border-t border-white/10">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8 mb-8">
                            <div className="text-center md:text-left">
                                <Logo
                                    size="md"
                                    className="justify-center md:justify-start mb-4"
                                />
                                <p className="text-gray-400 mb-6">
                                    Accelerating Innovation Through Intelligent
                                    Technology. Join us in shaping the future of
                                    technology.
                                </p>
                            </div>

                            <div className="text-center md:text-left">
                                <h3 className="text-lg font-bold mb-4 text-white">
                                    Quick Links
                                </h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-blue-400 transition-colors"
                                        >
                                            About Us
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#events"
                                            className="text-gray-400 hover:text-blue-400 transition-colors"
                                        >
                                            Our Events
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-blue-400 transition-colors"
                                        >
                                            Schedule
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-blue-400 transition-colors"
                                        >
                                            Contact
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="text-center md:text-left">
                                <h3 className="text-lg font-bold mb-4 text-white">
                                    Contact Us
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-center md:justify-start text-gray-400">
                                        <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                                        <span>
                                            President University, Cikarang
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/10 text-center">
                            <p className="text-gray-500">
                                2025 Compsphere. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Home;
