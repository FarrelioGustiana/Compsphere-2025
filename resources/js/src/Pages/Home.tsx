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
                    className="relative z-10 px-4 sm:px-6 py-16 sm:py-24"
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#1E88E5]/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D32F2F]/10 rounded-full blur-[100px]"></div>
                    
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            className="text-center mb-12 sm:mb-16"
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <motion.div 
                                className="inline-block mb-3"
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <span className="px-4 py-1.5 rounded-full bg-[#1E88E5]/10 border border-[#1E88E5]/20 text-[#7ECEF4] text-sm font-medium">
                                    Compsphere 2025
                                </span>
                            </motion.div>
                            
                            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 tracking-tight">
                                <span className="bg-gradient-to-r from-[#7ECEF4] via-[#1E88E5] to-[#D32F2F] bg-clip-text text-transparent">
                                    Our Events
                                </span>
                            </h2>
                            
                            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 leading-relaxed">
                                Empat event utama yang akan menghadirkan
                                pengalaman teknologi tak terlupakan dengan inovasi terkini
                            </p>
                        </motion.div>

                        {/* Desktop View - Modern Bento Layout */}
                        <div className="hidden md:block">
                            <motion.div 
                                className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-2xl p-8 border border-gray-700/30 shadow-xl relative overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1E88E5]/10 rounded-full blur-[80px]"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D32F2F]/10 rounded-full blur-[80px]"></div>
                                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjMuNSAzLjIgMS4zLjkuOSAxLjMgMiAxLjMgMy4yIDAgMS4yLS41IDIuMy0xLjMgMy4yLS45LjktMiAxLjMtMy4yIDEuM3MtMi4zLS41LTMuMi0xLjNjLS45LS45LTEuMy0yLTEuMy0zLjIgMC0xLjIuNS0yLjMgMS4zLTMuMi45LS45IDItMS4zIDMuMi0xLjN6IiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgY3g9IjYiIGN5PSI2IiByPSI2Ii8+PGNpcmNsZSBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBjeD0iNTQiIGN5PSI1NCIgcj0iNiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
                                
                                <div className="grid grid-cols-12 gap-6 relative z-10">
                                    {/* First card - Large (spans 2 rows and 6 columns) */}
                                    {events.length > 0 && (
                                        <motion.div 
                                            className="col-span-12 md:col-span-6 lg:col-span-6 row-span-2"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5, delay: 0.1 }}
                                            viewport={{ once: true }}
                                            whileHover={{ y: -5 }}
                                        >
                                            <EventCard
                                                key={`desktop-0`}
                                                event={events[0]}
                                                index={0}
                                                icon={getColorAndIcon(events[0].event_code).icon}
                                                color={getColorAndIcon(events[0].event_code).color}
                                                isLarge={true}
                                            />
                                        </motion.div>
                                    )}
                                    
                                    {/* Second card - Medium (spans 1 row and 6 columns) */}
                                    {events.length > 1 && (
                                        <motion.div 
                                            className="col-span-12 md:col-span-6 lg:col-span-6"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                            viewport={{ once: true }}
                                            whileHover={{ y: -5 }}
                                        >
                                            <EventCard
                                                key={`desktop-1`}
                                                event={events[1]}
                                                index={1}
                                                icon={getColorAndIcon(events[1].event_code).icon}
                                                color={getColorAndIcon(events[1].event_code).color}
                                                isLarge={false}
                                            />
                                        </motion.div>
                                    )}
                                    
                                    {/* Third card - Medium (spans 1 row and 3 columns) */}
                                    {events.length > 2 && (
                                        <motion.div 
                                            className="col-span-12 md:col-span-3 lg:col-span-3"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                            viewport={{ once: true }}
                                            whileHover={{ y: -5 }}
                                        >
                                            <EventCard
                                                key={`desktop-2`}
                                                event={events[2]}
                                                index={2}
                                                icon={getColorAndIcon(events[2].event_code).icon}
                                                color={getColorAndIcon(events[2].event_code).color}
                                                isLarge={false}
                                            />
                                        </motion.div>
                                    )}
                                    
                                    {/* Fourth card - Medium (spans 1 row and 3 columns) */}
                                    {events.length > 3 && (
                                        <motion.div 
                                            className="col-span-12 md:col-span-3 lg:col-span-3"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                            viewport={{ once: true }}
                                            whileHover={{ y: -5 }}
                                        >
                                            <EventCard
                                                key={`desktop-3`}
                                                event={events[3]}
                                                index={3}
                                                icon={getColorAndIcon(events[3].event_code).icon}
                                                color={getColorAndIcon(events[3].event_code).color}
                                                isLarge={false}
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                        
                        {/* Mobile View - Enhanced Slider Layout */}
                        <div className="md:hidden relative">
                            <motion.div 
                                className="overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory flex space-x-5 px-1"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                {events.map((event, index) => (
                                    <motion.div 
                                        key={`mobile-${index}`}
                                        className="snap-center flex-shrink-0 w-[85%] first:ml-4 last:mr-4"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <EventCard
                                            event={event}
                                            index={index}
                                            icon={getColorAndIcon(event.event_code).icon}
                                            color={getColorAndIcon(event.event_code).color}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                            
                            {/* Enhanced indicator dots */}
                            <div className="flex justify-center mt-6 space-x-3">
                                {events.map((_, index) => (
                                    <motion.div 
                                        key={`dot-${index}`}
                                        className="h-2.5 w-2.5 rounded-full bg-gray-600 hover:bg-gray-400 transition-colors duration-300"
                                        whileHover={{ scale: 1.2 }}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                    />
                                ))}
                            </div>
                            
                            {/* Scroll hint */}
                            <motion.div 
                                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs font-medium tracking-wide"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 2, repeat: 3, repeatDelay: 1 }}
                            >
                                Swipe untuk melihat event lainnya
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Event Info Section */}
                <section className="relative z-10 px-4 sm:px-6 py-20 sm:py-28">
                    {/* Decorative elements */}
                    {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1E88E5]/10 to-[#D32F2F]/10 backdrop-blur-sm"></div>
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#333333] to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#333333] to-transparent"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-[#1E88E5]/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-20 left-10 w-72 h-72 bg-[#D32F2F]/10 rounded-full blur-[100px]"></div> */}
                    
                    <div className="max-w-7xl mx-auto relative z-10">
                        <motion.div
                            className="mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <motion.div 
                                className="inline-block mb-3"
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <span className="px-4 py-1.5 rounded-full bg-[#1E88E5]/10 border border-[#1E88E5]/20 text-[#7ECEF4] text-sm font-medium">
                                    Event Details
                                </span>
                            </motion.div>
                            
                            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                                <span className="bg-gradient-to-r from-[#7ECEF4] via-[#1E88E5] to-[#D32F2F] bg-clip-text text-transparent">
                                    Event Information
                                </span>
                            </h2>
                        </motion.div>
                        
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12 items-start"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                        >
                            <div className="lg:col-span-3">
                                <div className="space-y-6 sm:space-y-8">
                                    {[
                                        {
                                            icon: <Calendar className="w-6 h-6 sm:w-7 sm:h-7" />,
                                            title: "Tanggal Event",
                                            content: "12-14 Oktober 2025",
                                            subtitle: "Hacksphere dimulai 12 Oktober, pukul 12.00 WIB",
                                            bgColor: "from-[#1E88E5] to-[#7ECEF4]",
                                            delay: 0.1
                                        },
                                        {
                                            icon: <MapPin className="w-6 h-6 sm:w-7 sm:h-7" />,
                                            title: "Lokasi",
                                            content: "President University",
                                            subtitle: "Venue utama untuk Hacksphere dan event lainnya",
                                            bgColor: "from-[#0D47A1] to-[#1E88E5]",
                                            delay: 0.2
                                        },
                                        {
                                            icon: <Clock className="w-6 h-6 sm:w-7 sm:h-7" />,
                                            title: "Durasi",
                                            content: "3 Hari Penuh",
                                            subtitle: "Pengalaman teknologi yang komprehensif",
                                            bgColor: "from-[#B71C1C] to-[#D32F2F]",
                                            delay: 0.3
                                        },
                                    ].map((item, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-start space-x-5 bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/5"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: item.delay }}
                                            viewport={{ once: true }}
                                            whileHover={{ y: -5 }}
                                        >
                                            <div
                                                className={`bg-gradient-to-br ${item.bgColor} p-3 sm:p-4 rounded-lg flex-shrink-0 shadow-lg`}
                                            >
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-200 text-base sm:text-lg font-medium mb-1">
                                                    {item.content}
                                                </p>
                                                <p className="text-sm sm:text-base text-[#7ECEF4]">
                                                    {item.subtitle}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <motion.div
                                className="relative lg:col-span-2"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8 }}
                            >
                                <div className="bg-gradient-to-br from-[#333333]/80 to-[#000000]/80 backdrop-blur-md border border-[#666666]/50 rounded-2xl p-8 sm:p-10 text-center shadow-xl relative overflow-hidden">
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
                                        
                                        <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-5 bg-gradient-to-r from-[#7ECEF4] to-[#1E88E5] bg-clip-text text-transparent">
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
                        </motion.div>
                    </div>
                </section>

                {/* Call-to-Action Section */}
                <section className="relative z-10 px-4 sm:px-6 py-20 sm:py-28 overflow-hidden">
                    {/* Decorative elements */}
                    {/* <div className="absolute inset-0 bg-gradient-to-b from-[#333333]/80 via-[#1E88E5]/10 to-[#D32F2F]/20"></div>
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#1E88E5]/10 rounded-full blur-[120px]"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#D32F2F]/10 rounded-full blur-[120px]"></div> */}
                    
                    <div className="max-w-5xl mx-auto relative z-10">
                        <motion.div 
                            className="bg-gradient-to-br from-[#333333]/80 to-[#000000]/90 backdrop-blur-md border border-[#666666]/50 rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden relative"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            {/* Grid pattern overlay */}
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMzMzMiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2U9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyNSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0wIDMwaDMwdjMwSDB6IiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2U9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyNSIgZmlsbD0iI2ZmZiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
                            
                            {/* Glow effects */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#1E88E5]/20 rounded-full blur-[80px]"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#D32F2F]/20 rounded-full blur-[80px]"></div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
                                <div>
                                    <motion.div 
                                        className="inline-block mb-4"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        viewport={{ once: true }}
                                    >
                                        <span className="px-4 py-1.5 rounded-full bg-[#1E88E5]/10 border border-[#1E88E5]/20 text-[#7ECEF4] text-sm font-medium">
                                            Join Compsphere 2025
                                        </span>
                                    </motion.div>
                                    
                                    <motion.h2 
                                        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight"
                                        initial={{ y: 20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                        viewport={{ once: true }}
                                    >
                                        <span className="bg-gradient-to-r from-[#7ECEF4] via-[#1E88E5] to-[#D32F2F] bg-clip-text text-transparent">
                                            Ready to Transform Your Tech Journey?
                                        </span>
                                    </motion.h2>
                                    
                                    <motion.p 
                                        className="text-gray-300 mb-8 text-lg leading-relaxed"
                                        initial={{ y: 20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                        viewport={{ once: true }}
                                    >
                                        Bergabunglah dengan komunitas innovator dan teknolog terbaik dalam acara teknologi terbesar tahun ini. Jangan lewatkan kesempatan untuk menjadi bagian dari revolusi teknologi.
                                    </motion.p>
                                    
                                    <motion.div 
                                        className="flex flex-wrap gap-4"
                                        initial={{ y: 20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, delay: 0.5 }}
                                        viewport={{ once: true }}
                                    >
                                        <Link 
                                            href="/register" 
                                            className="group relative overflow-hidden bg-gradient-to-r from-[#1E88E5] to-[#0D47A1] hover:from-[#0D47A1] hover:to-[#1E88E5] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg inline-flex items-center gap-2"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
                                                Register Now
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                            </span>
                                            <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        </Link>
                                        
                                        <Link 
                                            href="#events" 
                                            className="group relative overflow-hidden bg-transparent border border-[#666666] hover:border-[#1E88E5]/50 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-[1.02] inline-flex items-center gap-2"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300 text-gray-300 group-hover:text-[#7ECEF4]">
                                                Explore Events
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                            </span>
                                        </Link>
                                    </motion.div>
                                </div>
                                
                                <motion.div 
                                    className="relative hidden lg:block"
                                    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="aspect-square max-w-md mx-auto relative">
                                        {/* Decorative circles */}
                                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#1E88E5]/30 rounded-full blur-md"></div>
                                        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#D32F2F]/30 rounded-full blur-md"></div>
                                        
                                        {/* Main circular container */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1E88E5]/20 to-[#D32F2F]/20 backdrop-blur-sm border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                                            {/* Inner content */}
                                            <div className="relative w-full h-full p-8 flex flex-col items-center justify-center text-center">
                                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMzMzMiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2U9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyNSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0wIDMwaDMwdjMwSDB6IiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2U9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyNSIgZmlsbD0iI2ZmZiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
                                                
                                                <Logo size="lg" showText={false} className="justify-center mb-6" />
                                                
                                                <div className="space-y-6 relative z-10">
                                                    {[
                                                        { icon: <Zap className="w-6 h-6" />, text: "Tech Workshops" },
                                                        { icon: <Users className="w-6 h-6" />, text: "Networking" },
                                                        { icon: <Lightbulb className="w-6 h-6" />, text: "Innovation" },
                                                        { icon: <Globe className="w-6 h-6" />, text: "Global Speakers" },
                                                    ].map((item, index) => (
                                                        <motion.div 
                                                            key={index}
                                                            className="flex items-center gap-3 text-white"
                                                            initial={{ opacity: 0, x: -20 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.5, delay: 0.7 + (index * 0.1) }}
                                                            viewport={{ once: true }}
                                                        >
                                                            <div className="bg-[#1E88E5]/30 p-2 rounded-full">
                                                                {item.icon}
                                                            </div>
                                                            <span className="font-medium">{item.text}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative z-10 px-4 sm:px-6 py-16 sm:py-20 mt-8">
                    {/* Decorative elements */}
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#333333]/80 to-transparent"></div>
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#666666]/20 to-transparent"></div> */}
                    
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                            <div className="text-center md:text-left">
                                <Logo
                                    size="md"
                                    className="justify-center md:justify-start mb-4 sm:mb-6"
                                />
                                <p className="text-white/50 mb-6 text-sm sm:text-base leading-relaxed">
                                    Accelerating Innovation Through Intelligent
                                    Technology. Join us in shaping the future of technology.
                                </p>
                                <div className="flex items-center justify-center md:justify-start space-x-4">
                                    {[
                                        { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> },
                                        { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg> },
                                        { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
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
                                <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
                                <ul className="space-y-2">
                                    {[
                                        { text: "About Us", href: "#" },
                                        { text: "Our Events", href: "#events" },
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
                                <h3 className="text-lg font-bold mb-4 text-white">Contact Us</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center justify-center md:justify-start text-white/50">
                                        <MapPin className="w-5 h-5 mr-2 text-[#7ECEF4]" />
                                        <span>President University, Cikarang</span>
                                    </li>
                                    <li className="flex items-center justify-center md:justify-start text-white/50">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-[#7ECEF4]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                        <span>+62 812 3456 7890</span>
                                    </li>
                                    <li className="flex items-center justify-center md:justify-start text-white/50">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-[#7ECEF4]"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                        <span>info@compsphere.id</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="pt-8 border-t border-[#333333]/50 text-center">
                            <p className="text-[#666666] text-sm">
                                © 2025 Compsphere. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Home;
