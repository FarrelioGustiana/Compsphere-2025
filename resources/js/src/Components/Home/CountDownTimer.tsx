import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTime {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const CountdownTimer: React.FC = () => {
    const [countdown, setCountdown] = useState<CountdownTime>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const targetDate = new Date("2025-10-12T12:00:00+07:00").getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance > 0) {
                setCountdown({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor(
                        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    ),
                    minutes: Math.floor(
                        (distance % (1000 * 60 * 60)) / (1000 * 60)
                    ),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const timeUnits = [
        { label: "Hari", value: countdown.days },
        { label: "Jam", value: countdown.hours },
        { label: "Menit", value: countdown.minutes },
        { label: "Detik", value: countdown.seconds },
    ];

    return (
        <motion.div
            className="mb-8 sm:mb-12 px-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
        >
            <h3 className="text-lg sm:text-xl mb-4 sm:mb-6 text-blue-400 flex justify-center">
                Countdown to Hacksphere
            </h3>
            <div className="grid grid-cols-2 sm:flex sm:justify-center gap-3 sm:gap-4 lg:gap-8 max-w-2xl mx-auto">
                {timeUnits.map((item, index) => (
                    <motion.div
                        key={item.label}
                        className="bg-gradient-to-br from-blue-600/20 to-red-600/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 sm:p-4 lg:p-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                            {item.value}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-400">
                            {item.label}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default CountdownTimer;
