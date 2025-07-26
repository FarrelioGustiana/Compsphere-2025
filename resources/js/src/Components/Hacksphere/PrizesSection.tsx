import React from "react";
import { motion, Variants } from "framer-motion";

type Props = {
    fadeInUpVariant: Variants;
};

function PrizesSection({ fadeInUpVariant }: Props) {
    return (
        <motion.div
            className="mb-16 sm:mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            variants={fadeInUpVariant}
        >
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Prizes & Rewards
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <motion.div
                    className="bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 p-6 sm:p-8 rounded-xl relative overflow-hidden border-2 border-yellow-500"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold py-1 px-3 sm:px-4 rounded-bl text-xs sm:text-sm">
                        1ST PLACE
                    </div>
                    <div className="text-yellow-500 text-4xl sm:text-6xl font-bold mb-4 sm:mb-6 mt-6">
                        🏆
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-yellow-400">
                        Rp 10,000,000
                    </h3>
                    <ul className="text-gray-300 space-y-2 text-sm sm:text-base">
                        <li className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-500 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Internship opportunities
                        </li>
                        <li className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-500 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Premium tech gadgets
                        </li>
                        <li className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-500 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Media exposure
                        </li>
                    </ul>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-br from-gray-400/20 to-gray-600/20 p-6 sm:p-8 rounded-xl relative overflow-hidden border-2 border-gray-400"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="absolute top-0 right-0 bg-gray-400 text-black font-bold py-1 px-3 sm:px-4 rounded-bl text-xs sm:text-sm">
                        2ND PLACE
                    </div>
                    <div className="text-gray-300 text-4xl sm:text-6xl font-bold mb-4 sm:mb-6 mt-6">
                        🥈
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-300">
                        Rp 7,500,000
                    </h3>
                    <ul className="text-gray-300 space-y-2 text-sm sm:text-base">
                        <li className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-400 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Tech gadgets
                        </li>
                        <li className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-400 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Project mentorship
                        </li>
                        <li className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-400 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Recognition certificates
                        </li>
                    </ul>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 p-6 sm:p-8 rounded-xl relative overflow-hidden border-2 border-amber-600 md:col-span-2 lg:col-span-1"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="absolute top-0 right-0 bg-amber-600 text-black font-bold py-1 px-3 sm:px-4 rounded-bl text-xs sm:text-sm">
                        3RD PLACE
                    </div>
                    <div className="text-amber-500 text-4xl sm:text-6xl font-bold mb-4 sm:mb-6 mt-6">
                        🥉
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-amber-400">
                        Rp 5,000,000
                    </h3>
                    <ul className="text-gray-300 space-y-2 text-sm sm:text-base">
                        <li className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-amber-600 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Software licenses
                        </li>
                        <li className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-amber-600 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Recognition certificates
                        </li>
                        <li className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-amber-600 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Swag packs
                        </li>
                    </ul>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default PrizesSection;
