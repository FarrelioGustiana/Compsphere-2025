import React from "react";
import Logo from "@/src/Components/UI/Logo";
import { ArrowRight, Calendar, Clock, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { usePage } from "@inertiajs/react";

const TimeLine = () => {
    const { auth } = usePage().props as any;
    return (
        <section className="relative z-10 px-4 sm:px-6 py-20 sm:py-28 overflow-hidden">
            {/* Animated cosmic background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-10 right-[10%] w-64 h-64 rounded-full bg-[#1E88E5]/20 blur-[80px] animate-pulse-slow"></div>
                <div className="absolute bottom-20 left-[15%] w-80 h-80 rounded-full bg-[#D32F2F]/20 blur-[100px] animate-pulse-slow animation-delay-2000"></div>
                <div className="absolute top-[40%] left-[5%] w-40 h-40 rounded-full bg-[#7B1FA2]/20 blur-[70px] animate-float animation-delay-1000"></div>

                {/* Star field */}
                {[...Array(40)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full animate-twinkle"
                        style={{
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            opacity: Math.random() * 0.7 + 0.3,
                        }}
                    ></div>
                ))}

                {/* Cosmic dust particles */}
                <div className="absolute inset-0 bg-[url('/assets/images/noise.png')] opacity-[0.03] mix-blend-screen"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    className="mb-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="inline-block mb-4"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            delay: 0.2,
                        }}
                        viewport={{ once: true }}
                    >
                        <div className="relative w-16 h-16 mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#7ECEF4] to-[#1E88E5] rounded-full blur-md animate-pulse-slow"></div>
                            <div className="absolute inset-2 bg-black rounded-full"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-[#7ECEF4]"
                                >
                                    <path
                                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                        <span className="bg-gradient-to-r from-[#7ECEF4] via-[#1E88E5] to-[#D32F2F] bg-clip-text text-transparent font-airborne">
                            COSMIC JOURNEY
                        </span>
                    </h2>

                    <motion.p
                        className="max-w-2xl mx-auto text-gray-300 text-lg sm:text-xl"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        Discover the unique celestial experiences that await you
                        at Compsphere 2025
                    </motion.p>
                </motion.div>

                {/* Cosmic Journey Path */}
                <div className="relative mb-24">
                    {/* Connecting orbital line */}
                    <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-1 bg-gradient-four-colors rounded-full opacity-70 glow-sm hidden sm:block"></div>

                    {/* Celestial milestones */}
                    <div className="space-y-32">
                        {/* Milestone 1: Hacksphere */}
                        <div className="relative">
                            <motion.div
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <motion.div
                                    className="order-2 lg:order-1"
                                    initial={{ x: -50, opacity: 0 }}
                                    whileInView={{
                                        x: 0,
                                        opacity: 1,
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        delay: 0.2,
                                    }}
                                    viewport={{ once: true }}
                                >
                                    <div className="relative bg-gray-900/50 backdrop-blur-xl p-6 sm:p-8 rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/10">
                                        {/* Decorative orbit elements */}
                                        <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full border border-blue-500/20 opacity-40"></div>
                                        <div className="absolute -right-8 -top-8 w-16 h-16 rounded-full border border-blue-500/30 opacity-50"></div>

                                        <h3 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-[#1E88E5] to-[#7ECEF4] bg-clip-text text-transparent">
                                            Hacksphere Experience
                                        </h3>

                                        <p className="text-gray-300 mb-6 leading-relaxed">
                                            Immerse yourself in a 48-hour coding
                                            marathon where the brightest minds
                                            collaborate to build innovative
                                            solutions. Connect with mentors,
                                            access cutting-edge technologies,
                                            and compete for stellar prizes.
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="text-blue-400 w-4 h-4" />
                                                <span className="text-gray-200">
                                                    12-14 Oktober 2025
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="text-blue-400 w-4 h-4" />
                                                <span className="text-gray-200">
                                                    Starts 12.00 WIB
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="text-blue-400 w-4 h-4" />
                                                <span className="text-gray-200">
                                                    President University
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="text-blue-400 w-4 h-4" />
                                                <span className="text-gray-200">
                                                    500+ Participants
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="order-1 lg:order-2 flex justify-center items-center"
                                    initial={{ x: 50, opacity: 0 }}
                                    whileInView={{
                                        x: 0,
                                        opacity: 1,
                                    }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="relative">
                                        {/* Orbit ring animation */}
                                        <div className="absolute inset-0 -m-8 rounded-full border border-blue-500/30 animate-spin-slow"></div>
                                        <div className="absolute inset-0 -m-16 rounded-full border border-blue-500/20 animate-spin-slow animation-delay-2000"></div>
                                        <div className="absolute inset-0 -m-24 rounded-full border border-blue-500/10 animate-spin-slow animation-delay-3000"></div>

                                        {/* Planet image */}
                                        <motion.div
                                            className="relative w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-blue-900 to-blue-600 glow-lg shadow-lg shadow-blue-500/20"
                                            whileHover={{
                                                scale: 1.05,
                                            }}
                                            transition={{
                                                duration: 0.5,
                                            }}
                                        >
                                            <div className="absolute inset-0 opacity-80 mix-blend-overlay">
                                                <img
                                                    src="/assets/hacksphere/planet-texture.png"
                                                    alt="Hacksphere Planet"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
                                            <div className="absolute bottom-0 w-full p-4 text-center">
                                                <span className="text-xs font-bold tracking-wider text-blue-200 uppercase">
                                                    Hacksphere
                                                </span>
                                            </div>
                                        </motion.div>

                                        {/* Orbital dot */}
                                        <motion.div
                                            className="absolute rounded-full w-3 h-3 bg-blue-400 shadow-md shadow-blue-400/50 glow-sm"
                                            animate={{
                                                x: [0, 20, 0, -20, 0],
                                                y: [0, 20, 0, -20, 0],
                                            }}
                                            transition={{
                                                duration: 10,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            style={{
                                                top: "15%",
                                                right: "20%",
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Journey connection node */}
                            <div className="absolute top-1/2 left-8 lg:left-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-500 glow-md shadow-lg shadow-blue-500/50 items-center justify-center z-10 sm:flex hidden">
                                <div className="w-4 h-4 rounded-full bg-white"></div>
                            </div>
                        </div>

                        {/* Milestone 2: Talksphere */}
                        <div className="relative">
                            <motion.div
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <motion.div
                                    className="order-2"
                                    initial={{ x: 50, opacity: 0 }}
                                    whileInView={{
                                        x: 0,
                                        opacity: 1,
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        delay: 0.2,
                                    }}
                                    viewport={{ once: true }}
                                >
                                    <div className="relative bg-gray-900/50 backdrop-blur-xl p-6 sm:p-8 rounded-2xl overflow-hidden border border-red-500/20 shadow-lg shadow-red-500/10">
                                        {/* Decorative orbit elements */}
                                        <div className="absolute -left-16 -top-16 w-32 h-32 rounded-full border border-red-500/20 opacity-40"></div>
                                        <div className="absolute -left-8 -top-8 w-16 h-16 rounded-full border border-red-500/30 opacity-50"></div>

                                        <h3 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-[#D32F2F] to-[#FF5252] bg-clip-text text-transparent">
                                            Talksphere Sessions
                                        </h3>

                                        <p className="text-gray-300 mb-6 leading-relaxed">
                                            Join visionary tech leaders and
                                            innovators for cutting-edge talks
                                            and panels. Network with industry
                                            experts, gain insights into emerging
                                            technologies, and expand your
                                            knowledge horizons.
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="text-red-400 w-4 h-4" />
                                                <span className="text-gray-200">
                                                    13 Oktober 2025
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="text-red-400 w-4 h-4" />
                                                <span className="text-gray-200">
                                                    09.00 - 17.00 WIB
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="text-red-400 w-4 h-4" />
                                                <span className="text-gray-200">
                                                    Auditorium Center
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="text-red-400 w-4 h-4" />
                                                <span className="text-gray-200">
                                                    20+ Speakers
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="order-1 flex justify-center items-center"
                                    initial={{ x: -50, opacity: 0 }}
                                    whileInView={{
                                        x: 0,
                                        opacity: 1,
                                    }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="relative">
                                        {/* Orbit ring animation */}
                                        <div className="absolute inset-0 -m-8 rounded-full border border-red-500/30 animate-spin-slow"></div>
                                        <div className="absolute inset-0 -m-16 rounded-full border border-red-500/20 animate-spin-slow animation-delay-1000 animation-reverse"></div>
                                        <div className="absolute inset-0 -m-24 rounded-full border border-red-500/10 animate-spin-slow animation-delay-2000"></div>

                                        {/* Planet image */}
                                        <motion.div
                                            className="relative w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-red-900 to-red-600 glow-lg shadow-lg shadow-red-500/20"
                                            whileHover={{
                                                scale: 1.05,
                                            }}
                                            transition={{
                                                duration: 0.5,
                                            }}
                                        >
                                            <div className="absolute inset-0 opacity-80 mix-blend-overlay">
                                                <img
                                                    src="/assets/talksphere/planet-texture.png"
                                                    alt="Talksphere Planet"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-transparent"></div>
                                            <div className="absolute bottom-0 w-full p-4 text-center">
                                                <span className="text-xs font-bold tracking-wider text-red-200 uppercase">
                                                    Talksphere
                                                </span>
                                            </div>
                                        </motion.div>

                                        {/* Orbital dot */}
                                        <motion.div
                                            className="absolute rounded-full w-3 h-3 bg-red-400 shadow-md shadow-red-400/50 glow-sm"
                                            animate={{
                                                x: [0, 15, 0, -15, 0],
                                                y: [0, -15, 0, 15, 0],
                                            }}
                                            transition={{
                                                duration: 8,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            style={{
                                                top: "70%",
                                                left: "15%",
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Journey connection node */}
                            <div className="absolute top-1/2 left-8 lg:left-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-500 glow-md shadow-lg shadow-red-500/50 items-center justify-center z-10 sm:flex hidden">
                                <div className="w-4 h-4 rounded-full bg-white"></div>
                            </div>
                        </div>

                        {/* Milestone 3: Festsphere */}
                        <div className="relative">
                            <motion.div
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <motion.div
                                    className="order-2 lg:order-1"
                                    initial={{ x: -50, opacity: 0 }}
                                    whileInView={{
                                        x: 0,
                                        opacity: 1,
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        delay: 0.2,
                                    }}
                                    viewport={{ once: true }}
                                >
                                    <div className="relative bg-gray-900/50 backdrop-blur-xl p-6 sm:p-8 rounded-2xl overflow-hidden border border-purple-500/20 shadow-lg shadow-purple-500/10">
                                        {/* Decorative orbit elements */}
                                        <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full border border-purple-500/20 opacity-40"></div>
                                        <div className="absolute -right-8 -top-8 w-16 h-16 rounded-full border border-purple-500/30 opacity-50"></div>

                                        <h3 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-[#A259F7] to-[#F7B7F7] bg-clip-text text-transparent">
                                            Festsphere Experience
                                        </h3>

                                        <p className="text-purple-100 mb-6 leading-relaxed">
                                            Celebrate the fusion of technology,
                                            art, and culture at Festsphere!
                                            Enjoy live music, tech showcases,
                                            creative workshops, and vibrant
                                            community activities. Whether you're
                                            a tech enthusiast, artist, or simply
                                            looking for inspiration, Festsphere
                                            brings everyone together for an
                                            unforgettable festival.
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="text-purple-400 w-4 h-4" />
                                                <span className="text-purple-200">
                                                    April 15-16, 2025
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="text-purple-400 w-4 h-4" />
                                                <span className="text-purple-200">
                                                    10:00 AM - 9:00 PM
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="text-purple-400 w-4 h-4" />
                                                <span className="text-purple-200">
                                                    Grand Tech Plaza
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="text-purple-400 w-4 h-4" />
                                                <span className="text-purple-200">
                                                    500+ Participants
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="order-1 lg:order-2 flex justify-center items-center"
                                    initial={{ x: 50, opacity: 0 }}
                                    whileInView={{
                                        x: 0,
                                        opacity: 1,
                                    }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="relative">
                                        {/* Orbit ring animation */}
                                        <div className="absolute inset-0 -m-8 rounded-full border border-purple-500/30 animate-spin-slow"></div>
                                        <div className="absolute inset-0 -m-16 rounded-full border border-purple-500/20 animate-spin-slow animation-delay-2000"></div>
                                        <div className="absolute inset-0 -m-24 rounded-full border border-purple-500/10 animate-spin-slow animation-delay-3000"></div>

                                        {/* Planet image */}
                                        <motion.div
                                            className="relative w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-purple-900/80 to-purple-700/30 glow-lg shadow-lg shadow-purple-500/20"
                                            whileHover={{
                                                scale: 1.05,
                                            }}
                                            transition={{
                                                duration: 0.5,
                                            }}
                                        >
                                            <div className="absolute inset-0 opacity-80 mix-blend-overlay">
                                                <img
                                                    src="/img/planet-texture-3.webp"
                                                    alt="Festsphere Planet"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent"></div>
                                            <div className="absolute bottom-0 w-full p-4 text-center">
                                                <span className="text-xs font-bold tracking-wider text-purple-200 uppercase">
                                                    Festsphere
                                                </span>
                                            </div>
                                        </motion.div>

                                        {/* Orbital dot */}
                                        <motion.div
                                            className="absolute rounded-full w-3 h-3 bg-purple-400 shadow-md shadow-purple-400/50 glow-sm"
                                            animate={{
                                                x: [0, 20, 0, -20, 0],
                                                y: [0, 20, 0, -20, 0],
                                            }}
                                            transition={{
                                                duration: 10,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            style={{
                                                top: "15%",
                                                right: "20%",
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Journey connection node */}
                            <div className="absolute top-1/2 left-8 lg:left-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-purple-500 glow-md shadow-lg shadow-purple-500/50 items-center justify-center z-10 sm:flex hidden">
                                <div className="w-4 h-4 rounded-full bg-white"></div>
                            </div>
                        </div>

                        {/* Milestone 4: Exposphere */}

                        <div className="relative">
                            <motion.div
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <motion.div
                                    className="order-2"
                                    initial={{ x: -50, opacity: 0 }}
                                    whileInView={{
                                        x: 0,
                                        opacity: 1,
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        delay: 0.2,
                                    }}
                                    viewport={{ once: true }}
                                >
                                    <div className="relative bg-gray-900/50 backdrop-blur-xl p-6 sm:p-8 rounded-2xl overflow-hidden border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                        {/* Decorative orbit elements */}
                                        <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full border border-emerald-500/20 opacity-40"></div>
                                        <div className="absolute -right-8 -top-8 w-16 h-16 rounded-full border border-emerald-500/30 opacity-50"></div>

                                        <h3 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-[#43e97b] to-[#38f9d7] bg-clip-text text-transparent">
                                            Exposphere Showcase
                                        </h3>

                                        <p className="text-emerald-100 mb-6 leading-relaxed">
                                            Showcase of cutting-edge
                                            innovations, startups, and industry
                                            leaders shaping our technological
                                            future. Experience interactive
                                            demos, meet the minds behind
                                            breakthrough products, and connect
                                            with the next wave of tech
                                            disruptors.
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="text-emerald-400 w-4 h-4" />
                                                <span className="text-emerald-200">
                                                    April 17, 2025
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="text-emerald-400 w-4 h-4" />
                                                <span className="text-emerald-200">
                                                    9:00 AM - 6:00 PM
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="text-emerald-400 w-4 h-4" />
                                                <span className="text-emerald-200">
                                                    Innovation Center
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="text-emerald-400 w-4 h-4" />
                                                <span className="text-emerald-200">
                                                    50+ Exhibitors
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="order-1 flex justify-center items-center"
                                    initial={{ x: 50, opacity: 0 }}
                                    whileInView={{
                                        x: 0,
                                        opacity: 1,
                                    }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="relative">
                                        {/* Orbit ring animation */}
                                        <div className="absolute inset-0 -m-8 rounded-full border border-emerald-500/30 animate-spin-slow"></div>
                                        <div className="absolute inset-0 -m-16 rounded-full border border-emerald-500/20 animate-spin-slow animation-delay-2000"></div>
                                        <div className="absolute inset-0 -m-24 rounded-full border border-emerald-500/10 animate-spin-slow animation-delay-3000"></div>

                                        {/* Planet image */}
                                        <motion.div
                                            className="relative w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-green-900/80 to-emerald-700/30 glow-lg shadow-lg shadow-emerald-500/20"
                                            whileHover={{
                                                scale: 1.05,
                                            }}
                                            transition={{
                                                duration: 0.5,
                                            }}
                                        >
                                            <div className="absolute inset-0 opacity-80 mix-blend-overlay">
                                                <img
                                                    src="/img/planet-texture-4.webp"
                                                    alt="Exposphere Planet"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent"></div>
                                            <div className="absolute bottom-0 w-full p-4 text-center">
                                                <span className="text-xs font-bold tracking-wider text-emerald-200 uppercase">
                                                    Exposphere
                                                </span>
                                            </div>
                                        </motion.div>

                                        {/* Orbital dot */}
                                        <motion.div
                                            className="absolute rounded-full w-3 h-3 bg-emerald-400 shadow-md shadow-emerald-400/50 glow-sm"
                                            animate={{
                                                x: [0, 20, 0, -20, 0],
                                                y: [0, 20, 0, -20, 0],
                                            }}
                                            transition={{
                                                duration: 10,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            style={{
                                                top: "15%",
                                                right: "20%",
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Journey connection node */}
                            <div className="absolute top-1/2 left-8 lg:left-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-500 glow-md shadow-lg shadow-emerald-500/50 items-center justify-center z-10 sm:flex hidden">
                                <div className="w-4 h-4 rounded-full bg-white"></div>
                            </div>
                        </div>

                        {/* Ending cosmic element - finale */}
                        <div className="relative ml-8 lg:ml-1/2 mb-16">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                transition={{
                                    duration: 1,
                                    delay: 0.6,
                                }}
                                viewport={{ once: true }}
                                className="relative flex flex-col items-center justify-center ml-8 lg:ml-0 w-[calc(100%-2rem)] lg:w-[450px]"
                            >
                                {/* Final celestial glow */}
                                {!auth.user && (
                                    <>
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80 filter blur-xl animate-pulse-slow"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-lg font-semibold text-white text-center px-6 py-3 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                                                Join us on this cosmic journey
                                                through innovation
                                            </span>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>

                {!auth.user && (
                    <motion.div
                        className="relative lg:col-span-2"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -8 }}
                    >
                        <div className="bg-gradient-to-br from-[#333333]/80 to-[#000000]/90 backdrop-blur-md border border-[#666666]/50 rounded-2xl p-8 sm:p-10 text-center shadow-xl relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#1E88E5]/10 rounded-full blur-[80px]"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#D32F2F]/10 rounded-full blur-[80px]"></div>

                            <div className="relative z-10">
                                <div className="inline-block bg-gradient-to-br from-[#1E88E5] to-[#D32F2F] p-4 rounded-2xl mb-6 shadow-lg">
                                    <Logo
                                        size="lg"
                                        showText={false}
                                        className="justify-center"
                                    />
                                </div>

                                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 bg-gradient-to-r from-[#7ECEF4] to-[#1E88E5] bg-clip-text text-transparent">
                                    Ready to Join?
                                </h3>

                                <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                                    Jangan lewatkan kesempatan untuk menjadi
                                    bagian dari revolusi teknologi
                                </p>

                                <button className="w-full group relative overflow-hidden bg-gradient-to-r from-[#1E88E5] to-[#0D47A1] hover:from-[#0D47A1] hover:to-[#1E88E5] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg">
                                    <span className="relative z-10 flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
                                        Register Now
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default TimeLine;
