import React from "react";
import { motion, Variants } from "framer-motion";

type Props = {
    fadeInUpVariant: Variants;
};

function FeaturesSection({ fadeInUpVariant }: Props) {
    const features = [
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                </svg>
            ),
            title: "Innovation",
            description:
                "Push the boundaries of technology and create solutions that can change the world.",
        },
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
            ),
            title: "Networking",
            description:
                "Connect with industry leaders, mentors, and like-minded tech enthusiasts.",
        },
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                </svg>
            ),
            title: "Prizes",
            description:
                "Win exciting cash prizes, internship opportunities, and tech gadgets.",
        },
    ];

    return (
        <motion.div
            className="mb-16 sm:mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeInUpVariant}
        >
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Why Participate?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-xl border border-blue-900/30 shadow-lg"
                        whileHover={{
                            y: -5,
                            boxShadow:
                                "0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)",
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                        }}
                    >
                        <div className="text-blue-400 mb-4">
                            {feature.icon}
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-blue-300">
                            {feature.title}
                        </h3>
                        <p className="text-gray-400 text-sm sm:text-base">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export default FeaturesSection;
