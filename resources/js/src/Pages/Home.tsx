import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    ChevronDown,
    ArrowRight,
    Calendar,
    MapPin,
    Clock,
    Users,
} from "lucide-react";

import EnhancedBackground from "@/src/Components/UI/EnhancedBackground";
import Navigation from "@/src/Components/Layout/Navigation";
import Logo from "@/src/Components/UI/Logo";
import { Event } from "@/types/models";
import ImmersiveEventSection from "@/src/Components/Home/ImmersiveEventSection";
import { events as eventsData } from "@/src/Constants/events";
import TimeLine from "../Components/Home/TimeLine";

// Function removed in favor of configuring colors and mascots in the ImmersiveEventSection component

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

const Home: React.FC = () => {
    const { events, auth } = usePage().props as unknown as {
        events: Event[];
        auth: { user: any };
    };
    // Check if user is logged in
    const isLoggedIn = auth?.user !== null;

    return (
        <React.Fragment>
            <Head title="Home" />

            <div className="min-h-screen text-white overflow-hidden">
                {/* Enhanced animated background */}
                <EnhancedBackground />

                {/* Content container */}
                <div className="relative min-h-screen bg-[#121212]">
                    <EnhancedBackground />
                    <Navigation />

                    {/* Custom Hero Section */}
                    <section className="relative min-h-screen flex flex-col justify-center items-center px-4 z-10 overflow-hidden">
                        <div className="max-w-7xl w-full mx-auto text-center relative">
                            {/* Animated logo with pulsing effect */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="mb-8 sm:mb-10 relative"
                            >
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1E88E5]/20 to-[#D32F2F]/20 blur-3xl"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 0.8, 0.5],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                    }}
                                />
                                <Logo
                                    size="xxxl"
                                    showText={false}
                                    className="justify-center relative z-10"
                                />
                            </motion.div>

                            {/* Animated heading with enhanced gradient */}
                            <motion.h1
                                className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold mb-4 sm:mb-6 tracking-tight"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <span className="bg-gradient-to-r from-[#7ECEF4] via-[#1E88E5] to-[#D32F2F] bg-clip-text text-transparent font-airborne inline-block">
                                    COMPSPHERE
                                </span>
                            </motion.h1>

                            {/* Animated tagline with enhanced styling */}
                            <motion.div
                                className="relative mb-8 sm:mb-10"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl text-gray-200 font-light tracking-wide">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7ECEF4] to-[#1E88E5]">
                                        Accelerating
                                    </span>{" "}
                                    Innovation Through{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#D32F2F]">
                                        Intelligent
                                    </span>{" "}
                                    Technology
                                </p>
                            </motion.div>

                            {/* Description with enhanced typography */}
                            <motion.p
                                className="text-base sm:text-lg lg:text-xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                            >
                                Bergabunglah dengan para inovator, developer,
                                dan teknolog terdepan dalam event teknologi
                                terbesar tahun ini. Wujudkan masa depan melalui
                                kolaborasi dan inovasi yang tak terbatas.
                            </motion.p>

                            {/* CTA buttons - conditional based on login state */}
                            <motion.div
                                className="flex flex-col sm:flex-row gap-5 justify-center"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 1.0 }}
                            >
                                {isLoggedIn ? (
                                    <Link
                                        href="/dashboard"
                                        className="relative overflow-hidden group bg-gradient-to-r from-[#1E88E5] to-[#1E88E5] hover:from-[#1E88E5] hover:to-[#D32F2F] text-white font-medium py-3 px-8 rounded-lg transition-all duration-500 ease-in-out inline-flex items-center gap-2"
                                    >
                                        <span>Dashboard</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#1E88E5] to-[#D32F2F] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/register"
                                            className="relative overflow-hidden group bg-gradient-to-r from-[#1E88E5] to-[#1E88E5] hover:from-[#1E88E5] hover:to-[#D32F2F] text-white font-medium py-3 px-8 rounded-lg transition-all duration-500 ease-in-out inline-flex items-center gap-2"
                                        >
                                            <span className="relative z-10">
                                                Daftar Sekarang
                                            </span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#1E88E5] to-[#D32F2F] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                                        </Link>
                                        <Link
                                            href="/login"
                                            className="bg-transparent backdrop-blur-sm border border-[#7ECEF4]/20 hover:border-[#7ECEF4]/40 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300"
                                        >
                                            Login
                                        </Link>
                                    </>
                                )}
                            </motion.div>
                        </div>

                        {/* Scroll indicator */}
                        <motion.div
                            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer flex flex-col items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, y: [0, 10, 0] }}
                            transition={{
                                delay: 1,
                                duration: 1.5,
                                repeat: Infinity,
                            }}
                            onClick={() => {
                                const eventsSection =
                                    document.getElementById("events-section");
                                if (eventsSection) {
                                    eventsSection.scrollIntoView({
                                        behavior: "smooth",
                                    });
                                }
                            }}
                        >
                            <ChevronDown className="w-8 h-8 text-gray-400" />
                        </motion.div>
                    </section>

                    {/* Events Section with Immersive Experience */}
                    <section id="events-section" className="relative z-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1E88E5]/10 rounded-full blur-[120px]"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D32F2F]/10 rounded-full blur-[120px]"></div>

                        <motion.div
                            className="text-center mb-4 pt-24 pb-6"
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 tracking-tight">
                                <span className="bg-gradient-to-r from-[#7ECEF4] via-[#1E88E5] to-[#D32F2F] bg-clip-text text-transparent font-airborne">
                                    OUR SUB-EVENTS
                                </span>
                            </h2>

                            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 leading-relaxed">
                                Check out our sub-events and join us in
                                celebrating the latest in technology and
                                innovation.
                            </p>
                        </motion.div>

                        {/* Integrated Immersive Event Section */}
                        <ImmersiveEventSection
                            events={events}
                            isLoggedIn={auth.user !== null}
                        />
                    </section>

                    <TimeLine />

                    <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-20 mt-8">
                        <div className="max-w-7xl mx-auto relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                                <div className="text-center md:text-left">
                                    <Logo
                                        size="md"
                                        className="justify-center md:justify-start mb-4 sm:mb-6"
                                    />
                                    <p className="text-white/50 mb-6 text-sm sm:text-base leading-relaxed">
                                        Accelerating Innovation Through
                                        Intelligent Technology. Join us in
                                        shaping the future of technology.
                                    </p>
                                    <div className="flex items-center justify-center md:justify-start space-x-4">
                                        {[
                                            {
                                                icon: (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                                        <rect
                                                            x="2"
                                                            y="9"
                                                            width="4"
                                                            height="12"
                                                        ></rect>
                                                        <circle
                                                            cx="4"
                                                            cy="4"
                                                            r="2"
                                                        ></circle>
                                                    </svg>
                                                ),
                                            },
                                            {
                                                icon: (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                                    </svg>
                                                ),
                                            },
                                            {
                                                icon: (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <rect
                                                            x="2"
                                                            y="2"
                                                            width="20"
                                                            height="20"
                                                            rx="5"
                                                            ry="5"
                                                        ></rect>
                                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                                        <line
                                                            x1="17.5"
                                                            y1="6.5"
                                                            x2="17.51"
                                                            y2="6.5"
                                                        ></line>
                                                    </svg>
                                                ),
                                            },
                                        ].map((item, index) => (
                                            <motion.a
                                                key={index}
                                                href="#"
                                                className="bg-[#333333] hover:bg-[#666666] p-2 rounded-full text-[#666666] hover:text-white transition-all duration-300"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                {item.icon}
                                            </motion.a>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center md:text-left">
                                    <h3 className="text-lg font-bold mb-4 text-white">
                                        Quick Links
                                    </h3>
                                    <ul className="space-y-2">
                                        {[
                                            { text: "About Us", href: "#" },
                                            {
                                                text: "Our Events",
                                                href: "#events",
                                            },
                                            { text: "Schedule", href: "#" },
                                            { text: "Sponsors", href: "#" },
                                            { text: "Contact", href: "#" },
                                        ].map((item, index) => (
                                            <li key={index}>
                                                <a
                                                    href={item.href}
                                                    className="text-white/50 hover:text-[#7ECEF4] transition-colors duration-300"
                                                >
                                                    {item.text}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="text-center md:text-left">
                                    <h3 className="text-lg font-bold mb-4 text-white">
                                        Contact Us
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center justify-center md:justify-start text-white/50">
                                            <MapPin className="w-5 h-5 mr-2 text-[#7ECEF4]" />
                                            <span>
                                                President University, Cikarang
                                            </span>
                                        </li>
                                        <li className="flex items-center justify-center md:justify-start text-white/50">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="mr-2 text-[#7ECEF4]"
                                            >
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                            </svg>
                                            <span>+62 812 3456 7890</span>
                                        </li>
                                        <li className="flex items-center justify-center md:justify-start text-white/50">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="mr-2 text-[#7ECEF4]"
                                            >
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                <polyline points="22,6 12,13 2,6"></polyline>
                                            </svg>
                                            <span>info@compsphere.id</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-[#333333]/50 text-center">
                                <p className="text-[#666666] text-sm">
                                    2025 Compsphere. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Home;
