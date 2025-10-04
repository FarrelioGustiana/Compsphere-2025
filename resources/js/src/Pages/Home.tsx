"use client";

import type React from "react";
import { Suspense, useMemo } from "react";
import { ArrowRight, MapPin, Calendar, Clock, Instagram, Linkedin, Mail, ExternalLink } from "lucide-react";
import OptimizedBackground from "@/src/Components/UI/EnhancedBackground";
import Logo from "@/src/Components/UI/Logo";
import EventShowcase from "@/src/Components/Home/ImmersiveEventSection";
import Timeline from "@/src/Components/Home/TimeLine";
import { usePage } from "@inertiajs/react";
import { Event } from "@/types/models";
import Navigation from "../Components/Layout/Navigation";
import { partners } from "../Constants/partners";
import { sponsors } from "../Constants/sponsor";
import Sponsors from "../Components/Home/Sponsors";
import SponsorSection from "../Components/Home/SponsorSection";
import { FaTiktok } from "react-icons/fa";
import OneTimeNotification from "@/src/Components/Home/OneTimeNotification";

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
                <section className="min-h-screen flex flex-col justify-center items-center px-3 sm:px-4 pt-16 sm:pt-24 md:pt-32 lg:pt-40">
                    <div className="w-full max-w-4xl text-center space-y-4 sm:space-y-6 md:space-y-8">
                        {/* Logo */}
                        <div className="opacity-0 animate-fadeIn">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl" />
                                <Logo
                                    size="xxxl"
                                    className="justify-center relative z-10"
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl font-airborne sm:text-5xl md:text-6xl lg:text-7xl font-bold opacity-0 animate-fadeIn animation-delay-200">
                            <span className="bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
                                COMPSPHERE
                            </span>
                        </h1>

                        {/* Tagline */}
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 opacity-0 animate-fadeIn animation-delay-300">
                            <span className="text-blue-400">Empowering</span>{" "}
                            Intelligence to{" "}
                            <span className="text-red-400">Innovate</span>{" "}
                            Imagination
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center opacity-0 animate-fadeIn animation-delay-500">
                            {isLoggedIn ? (
                                <>
                                    <button
                                        onClick={() => {
                                            window.location.href = `/${auth?.user?.role}/dashboard`;
                                        }}
                                        className="cursor-pointer bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white font-medium text-sm sm:text-base py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-300 inline-flex items-center gap-2 hover:scale-105"
                                    >
                                        <span>Dashboard</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            window.location.href = "/voting/hacksphere";
                                        }}
                                        className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium text-sm sm:text-base py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-300 inline-flex items-center gap-2 hover:scale-105"
                                    >
                                        <span>Vote Hacksphere</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            window.location.href = "/register";
                                        }}
                                        className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm sm:text-base py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-300 inline-flex items-center gap-2 hover:scale-105 whitespace-nowrap mx-3 sm:mx-0"
                                    >
                                        <span>Daftar Sekarang</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            window.location.href = "/login";
                                        }}
                                        className="cursor-pointer bg-transparent border border-blue-400/20 hover:border-blue-400/40 text-white font-medium text-sm sm:text-base py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-300 whitespace-nowrap mx-3 sm:mx-0"
                                    >
                                        Login
                                    </button>
                                    {/* <button
                                        onClick={() => {
                                            window.location.href = "/voting/hacksphere";
                                        }}
                                        className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium text-sm sm:text-base py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-300 inline-flex items-center gap-2 hover:scale-105 whitespace-nowrap mx-3 sm:mx-0"
                                    >
                                        <span>Vote Hacksphere</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button> */}
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Sponsor Section */}
                <section className="py-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-blue-900/5 to-black/0 z-0"></div>
                    <div className="relative z-10">
                        <SponsorSection sponsors={sponsors} />
                    </div>
                </section>

                {/* Events Section */}
                <section id="events-section" className="relative">
                    <div className="text-center py-16 opacity-0 animate-fadeInView space-y-2">
                        <h1 className="text-2xl font-airborne sm:text-3xl md:text-4xl font-bold opacity-0 animate-fadeIn animation-delay-200">
                            <span className="bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
                                OUR SUB-EVENTS
                            </span>
                        </h1>
                        <p className="text-lg text-gray-300 max-w-3xl mx-auto px-4">
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

                {/* Sponsors or Partners */}
                <section className="py-16 sm:py-24 relative overflow-hidden">
                    <div className="relative z-10">
                        {/* Section heading with floating animation */}
                        <div className="text-center mb-16 relative">
                            <h2 className="text-3xl font-airborne sm:text-4xl md:text-5xl font-bold">
                                <span className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                                    OUR PARTNERS
                                </span>
                            </h2>
                            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 mx-auto mt-4 rounded-full"></div>
                            <p className="text-lg text-gray-300 max-w-3xl mx-auto mt-6">
                                Meet the visionary organizations powering the
                                future of technology with Compsphere
                            </p>
                        </div>

                        {/* Partner logos in a grid layout */}
                        <div className="relative py-8 mb-16 max-w-5xl mx-auto">
                            <div className="mask-sponsors">
                                <Sponsors sponsors={partners} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative py-8 sm:py-16 px-4 border-t border-white/10">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8 mb-8">
                            <div className="text-center md:text-left">
                                <Logo
                                    size="md"
                                    className="justify-center md:justify-start mb-4"
                                />
                                <p className="text-gray-400 mb-6">
                                    Empowering Intelligence to Innovate
                                    Imagination
                                </p>
                            </div>

                            <div className="text-center md:text-left">
                                <h3 className="text-lg font-bold mb-4 text-white">
                                    Quick Links
                                </h3>
                                <div className="space-y-2">
                                    <div>
                                        <a
                                            href="/feedback"
                                            className="text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            Share Feedback
                                        </a>
                                    </div>
                                    {isLoggedIn && (
                                        <div>
                                            <a
                                                href="/feedback/my-feedback"
                                                className="text-gray-400 hover:text-white transition-colors duration-200"
                                            >
                                                My Feedback
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-center md:text-left">
                                <h3 className="text-lg font-bold mb-4 text-white">
                                    Contact Us
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center md:justify-start text-gray-400">
                                        <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                                        <span>
                                            President University, Cikarang
                                        </span>
                                    </div>

                                    {/* Social Media Links */}
                                    <div className="mt-4">
                                        <p className="text-gray-400 mb-3">Follow us:</p>
                                        <div className="flex items-center justify-center md:justify-start space-x-4">
                                            {/* Instagram */}
                                            <a
                                                href="https://www.instagram.com/compsphere/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="social-icon-link group"
                                                aria-label="Instagram"
                                            >
                                                <Instagram className="w-5 h-5 text-white" />
                                            </a>

                                            {/* TikTok */}
                                            <a
                                                href="https://www.tiktok.com/@compsphere"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="social-icon-link group"
                                                aria-label="TikTok"
                                            >
                                                <FaTiktok className="w-5 h-5 text-white" />
                                            </a>

                                            {/* LinkedIn */}
                                            <a
                                                href="https://www.linkedin.com/company/compsphere"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="social-icon-link group"
                                                aria-label="LinkedIn"
                                            >
                                                <Linkedin className="w-5 h-5 text-white" />
                                            </a>

                                            {/* Email */}
                                            <a
                                                href="mailto:contact@compsphere.id"
                                                className="social-icon-link group"
                                                aria-label="Email"
                                            >
                                                <Mail className="w-5 h-5 text-white" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 sm:pt-8 border-t border-white/10 text-center flex flex-col md:flex-row items-center justify-center md:justify-between">
                            <p className="text-gray-500">
                                © 2025 Compsphere. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* One-time notification */}
            <OneTimeNotification
                storageKey="compsphere_registration_error_apology"
                title="Registration Update"
                message="Hi! We've noticed that there were some errors with the registration.<br />We at Jokey.it sincerely apologize for the inconvenience and have fixed the issues.<br />Happy Learning, Happy Competing, Happy Compsphere 2025!"
                duration={3000}
            />
        </div>
    );
};

export default Home;
