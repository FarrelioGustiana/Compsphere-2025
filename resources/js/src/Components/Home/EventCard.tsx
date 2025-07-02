import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, QrCode } from "lucide-react";
import { Event } from "@/types/models";

interface EventCardProps {
    event: Event;
    index: number;
    icon: any;
    color: string;
    isRegistered?: boolean;
    isLarge?: boolean;
}

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

const EventCard: React.FC<EventCardProps> = ({ event, index, icon, color, isRegistered = false, isLarge = false }) => {
    // Responsive styling based on screen size
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{
                duration: 0.25,
            }}
            className="block group relative bg-white/5 backdrop-blur-sm border border-gray-700/30 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 h-full"
        >
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="h-full flex flex-col"
            >
                {/* Mobile View */}
                <div className="md:hidden">
                    {/* Mobile Card Header with Icon */}
                    <div className={`w-full bg-gradient-to-r ${color} p-4 sm:p-5`}>
                        <div className="flex items-center justify-between">
                            <div className="bg-white/20 rounded-full p-2 sm:p-3">
                                <div className="text-white w-6 h-6 sm:w-7 sm:h-7">
                                    {icon}
                                </div>
                            </div>
                            <div className="flex items-center text-xs sm:text-sm text-white/90">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                {formatDate(event.start_date)}
                            </div>
                        </div>
                    </div>
                    
                    {/* Mobile Card Content */}
                    <div className="p-4 sm:p-5 flex flex-col flex-grow">
                        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">
                            {event.event_name}
                        </h3>
                        <p className="text-gray-400 mb-4 sm:mb-5 leading-relaxed text-sm sm:text-base flex-grow">
                            {event.description}
                        </p>
                        
                        {/* Mobile Card Footer with Links */}
                        <div className="mt-auto">
                            <Link 
                                href={`/events/${event.event_code.toLowerCase()}`}
                                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700 hover:to-indigo-700 text-white py-2 sm:py-2.5 px-4 rounded-lg transition-all duration-300 text-sm sm:text-base font-medium"
                            >
                                Selengkapnya{" "}
                                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                            </Link>
                            
                            {isRegistered && (
                                <Link 
                                    href={`/participant/event/${event.id}/verification`}
                                    className="inline-flex items-center justify-center w-full bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-700 hover:to-emerald-700 text-white py-2 sm:py-2.5 px-4 rounded-lg mt-2 transition-all duration-300 text-sm sm:text-base font-medium"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    View QR Code{" "}
                                    <QrCode className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Desktop View - Bento Layout */}
                <div className="hidden md:block h-full">
                    {/* Large Card Layout */}
                    {isLarge ? (
                        <div className="flex flex-col h-full">
                            {/* Header with large image/banner */}
                            <div className={`w-full bg-gradient-to-r ${color} p-6`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-white/20 rounded-full p-3">
                                        <div className="text-white w-8 h-8">
                                            {icon}
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm text-white/90">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {formatDate(event.start_date)}
                                    </div>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    {event.event_name}
                                </h2>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-gray-400 text-base leading-relaxed mb-6 flex-grow">
                                    {event.description}
                                </p>
                                
                                <div className="mt-auto flex items-center justify-between">
                                    <Link 
                                        href={`/events/${event.event_code.toLowerCase()}`}
                                        className="inline-flex items-center bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-5 rounded-lg transition-all duration-300 text-base font-medium"
                                    >
                                        Selengkapnya{" "}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                    
                                    {isRegistered && (
                                        <Link 
                                            href={`/participant/event/${event.id}/verification`}
                                            className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors text-base font-medium"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            View QR Code{" "}
                                            <QrCode className="w-4 h-4 ml-1" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Small/Medium Card Layout */
                        <div className="flex flex-col h-full p-5">
                            <div className="flex items-start mb-3">
                                <div className={`rounded-full bg-gradient-to-r ${color} p-2.5 mr-3 flex-shrink-0`}>
                                    <div className="text-white w-5 h-5">
                                        {icon}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1 text-white">
                                        {event.event_name}
                                    </h3>
                                    <div className="flex items-center text-xs text-gray-400">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {formatDate(event.start_date)}
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-gray-400 text-sm leading-relaxed mb-3 flex-grow line-clamp-3">
                                {event.description}
                            </p>
                            
                            <div className="mt-auto">
                                <Link 
                                    href={`/events/${event.event_code.toLowerCase()}`}
                                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                                >
                                    Selengkapnya{" "}
                                    <ArrowRight className="w-3 h-3 ml-1" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EventCard;
