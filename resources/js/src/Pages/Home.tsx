import type React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    Calendar,
    MapPin,
    Clock,
    ArrowRight,
    Zap,
    Users,
    Lightbulb,
    Globe,
} from "lucide-react";

import AnimatedBackground from "@/src/Components/UI/AnimatedBackground";
import Navigation from "@/src/Components/Layout/Navigation";
import HeroSection from "@/src/Components/Home/HeroSection";
import CountDownTimer from "@/src/Components/Home/CountDownTimer";
import Logo from "@/src/Components/UI/Logo";
import { Event } from "@/types/models";
import EventCard from "@/src/Components/Home/EventCard";

export const getColorAndIcon = (
    event_code: string
): { color: string; icon: any } => {
    switch (event_code) {
        case "hacksphere":
            return { color: "from-red-500 to-pink-500", icon: <Zap /> };
        case "talksphere":
            return { color: "from-blue-500 to-cyan-500", icon: <Users /> };
        case "exposphere":
            return { color: "from-green-500 to-teal-500", icon: <Globe /> };
        case "festsphere":
            return {
                color: "from-purple-500 to-indigo-500",
                icon: <Lightbulb />,
            };
        default:
            return { color: "bg-gray-500", icon: <Globe /> };
    }
};

const Home: React.FC = () => {
    const { events } = usePage().props as unknown as { events: Event[] };

    return (
        <>
            <Head title="Compsphere 2025 - Accelerating Innovation Through Intelligent Technology" />

            <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
                <AnimatedBackground />
                <Navigation />

                <HeroSection />
                <CountDownTimer />

                {/* Events Section */}
                <section
                    id="events"
                    className="relative z-10 px-4 sm:px-6 py-12 sm:py-20"
                >
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            className="text-center mb-12 sm:mb-16"
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                                <span className="bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
                                    Our Events
                                </span>
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-4">
                                Empat event utama yang akan menghadirkan
                                pengalaman teknologi tak terlupakan
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                            {events.map((event, index) => (
                                <EventCard
                                    key={index}
                                    event={event}
                                    index={index}
                                    icon={
                                        getColorAndIcon(event.event_code).icon
                                    }
                                    color={
                                        getColorAndIcon(event.event_code).color
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Event Info Section */}
                <section className="relative z-10 px-4 sm:px-6 py-12 sm:py-20 bg-gradient-to-r from-blue-900/20 to-red-900/20">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                        >
                            <div>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                                    <span className="bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
                                        Event Information
                                    </span>
                                </h2>
                                <div className="space-y-4 sm:space-y-6">
                                    {[
                                        {
                                            icon: (
                                                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                                            ),
                                            title: "Tanggal Event",
                                            content: "12-14 Oktober 2025",
                                            subtitle:
                                                "Hacksphere dimulai 12 Oktober, pukul 12.00 WIB",
                                            bgColor: "bg-blue-600",
                                        },
                                        {
                                            icon: (
                                                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                                            ),
                                            title: "Lokasi",
                                            content: "President University",
                                            subtitle:
                                                "Venue utama untuk Hacksphere dan event lainnya",
                                            bgColor: "bg-red-600",
                                        },
                                        {
                                            icon: (
                                                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                                            ),
                                            title: "Durasi",
                                            content: "3 Hari Penuh",
                                            subtitle:
                                                "Pengalaman teknologi yang komprehensif",
                                            bgColor: "bg-purple-600",
                                        },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start space-x-3 sm:space-x-4"
                                        >
                                            <div
                                                className={`${item.bgColor} p-2 sm:p-3 rounded-lg flex-shrink-0`}
                                            >
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm sm:text-base">
                                                    {item.content}
                                                </p>
                                                <p className="text-xs sm:text-sm text-blue-400">
                                                    {item.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="bg-gradient-to-br from-blue-600/20 to-red-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 sm:p-8 text-center">
                                    <Logo
                                        size="lg"
                                        showText={false}
                                        className="justify-center mb-4 sm:mb-6"
                                    />
                                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                                        Ready to Join?
                                    </h3>
                                    <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                                        Jangan lewatkan kesempatan untuk menjadi
                                        bagian dari revolusi teknologi
                                    </p>
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                                        Register Now
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative z-10 px-4 sm:px-6 py-8 sm:py-12 border-t border-gray-800">
                    <div className="max-w-7xl mx-auto text-center">
                        <Logo
                            size="sm"
                            className="justify-center mb-4 sm:mb-6"
                        />
                        <p className="text-gray-400 mb-2 sm:mb-4 text-sm sm:text-base">
                            Accelerating Innovation Through Intelligent
                            Technology
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                            © 2025 Compsphere. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Home;
