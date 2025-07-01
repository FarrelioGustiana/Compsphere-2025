import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { Event } from "@/types/models";

interface EventCardProps {
    event: Event;
    index: number;
    icon: any;
    color: string;
}

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

const EventCard: React.FC<EventCardProps> = ({ event, index, icon, color }) => {
    return (
        <motion.a
            href={`/events/${event.event_code.toLowerCase()}`}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{
                duration: 0.25,
            }}
            className="block group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:border-blue-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                }}
                viewport={{ once: true }}
            >
                <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                    {icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">
                    {event.event_name}
                </h3>
                <p className="text-gray-400 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                    {event.description}
                </p>
                <div className="flex items-center text-xs sm:text-sm text-blue-400 mb-3 sm:mb-4">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    {formatDate(event.start_date)}
                </div>
                <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-2 transform duration-300 text-sm sm:text-base">
                    Selengkapnya{" "}
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                </button>
            </motion.div>
        </motion.a>
    );
};

export default EventCard;
