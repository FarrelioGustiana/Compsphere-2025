import React from "react";
import { motion, Variants } from "framer-motion";

type Props = {
    fadeInUpVariant: Variants;
};

function PrizesSection({ fadeInUpVariant }: Props) {
    // SVG checkmark component for reuse
    const CheckIcon = ({ color }: { color: string }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${color} flex-shrink-0`}
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
            />
        </svg>
    );

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
                Prizes and Awards
            </h2>

            {/* Kategori Umum */}
            <div className="mb-10">
                <h3 className="text-xl font-bold mb-4 text-center text-blue-300 bg-blue-900/30 py-2 rounded-lg">
                    General Category
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <motion.div
                        className="bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 p-6 rounded-xl relative overflow-hidden border-2 border-yellow-500"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold py-1 px-3 rounded-bl text-xs">
                            GRAND PRIZE
                        </div>
                        <div className="text-yellow-500 text-4xl font-bold mb-4 mt-6">
                            🏆
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-yellow-400">
                            Rp8.000.000
                        </h3>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li className="flex items-center">
                                <CheckIcon color="text-yellow-500" />
                                Certificate
                            </li>
                            <li className="flex items-center">
                                <CheckIcon color="text-yellow-500" />
                                Goodie Bag
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 p-6 rounded-xl relative overflow-hidden border-2 border-blue-500"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="absolute top-0 right-0 bg-blue-500 text-black font-bold py-1 px-3 rounded-bl text-xs">
                            BEST INNOVATION
                        </div>
                        <div className="text-blue-400 text-4xl font-bold mb-4 mt-6">
                            💡
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-blue-400">
                            Rp1.500.000
                        </h3>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li className="flex items-center">
                                <CheckIcon color="text-blue-500" />
                                Certificate
                            </li>
                            <li className="flex items-center">
                                <CheckIcon color="text-blue-500" />
                                Goodie Bag
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 p-6 rounded-xl relative overflow-hidden border-2 border-purple-500"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="absolute top-0 right-0 bg-purple-500 text-black font-bold py-1 px-3 rounded-bl text-xs">
                            PUBLIC'S FAVORITE
                        </div>
                        <div className="text-purple-400 text-4xl font-bold mb-4 mt-6">
                            👑
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-purple-400">
                            Rp1.500.000
                        </h3>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li className="flex items-center">
                                <CheckIcon color="text-purple-500" />
                                Certificate
                            </li>
                            <li className="flex items-center">
                                <CheckIcon color="text-purple-500" />
                                Goodie Bag
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>

            {/* Kategori SMK */}
            <div className="mb-10">
                <h3 className="text-xl font-bold mb-4 text-center text-green-300 bg-green-900/30 py-2 rounded-lg">
                    High School Category
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
                    <motion.div
                        className="bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 p-6 rounded-xl relative overflow-hidden border-2 border-yellow-500"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold py-1 px-3 rounded-bl text-xs">
                            RUNNER-UP
                        </div>
                        <div className="text-yellow-500 text-4xl font-bold mb-4 mt-6">
                            🥈
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-yellow-400">
                            Rp3.000.000
                        </h3>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li className="flex items-center">
                                <CheckIcon color="text-yellow-500" />
                                Certificate
                            </li>
                            <li className="flex items-center">
                                <CheckIcon color="text-yellow-500" />
                                Goodie Bag
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 p-6 rounded-xl relative overflow-hidden border-2 border-blue-500"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="absolute top-0 right-0 bg-blue-500 text-black font-bold py-1 px-3 rounded-bl text-xs">
                            SECOND RUNNER-UP
                        </div>
                        <div className="text-blue-400 text-4xl font-bold mb-4 mt-6">
                            🥉
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-blue-400">
                            Rp1.500.000
                        </h3>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li className="flex items-center">
                                <CheckIcon color="text-blue-500" />
                                Certificate
                            </li>
                            <li className="flex items-center">
                                <CheckIcon color="text-blue-500" />
                                Goodie Bag
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>

            {/* Kategori Kuliah */}
            <div className="mb-10">
                <h3 className="text-xl font-bold mb-4 text-center text-indigo-300 bg-indigo-900/30 py-2 rounded-lg">
                    University Category
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
                    <motion.div
                        className="bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 p-6 rounded-xl relative overflow-hidden border-2 border-yellow-500"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold py-1 px-3 rounded-bl text-xs">
                            RUNNER-UP
                        </div>
                        <div className="text-yellow-500 text-4xl font-bold mb-4 mt-6">
                            🥈
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-yellow-400">
                            Rp3.000.000
                        </h3>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li className="flex items-center">
                                <CheckIcon color="text-yellow-500" />
                                Certificate
                            </li>
                            <li className="flex items-center">
                                <CheckIcon color="text-yellow-500" />
                                Goodie Bag
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 p-6 rounded-xl relative overflow-hidden border-2 border-blue-500"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="absolute top-0 right-0 bg-blue-500 text-black font-bold py-1 px-3 rounded-bl text-xs">
                            SECOND RUNNER-UP
                        </div>
                        <div className="text-blue-400 text-4xl font-bold mb-4 mt-6">
                            🥉
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-blue-400">
                            Rp1.500.000
                        </h3>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li className="flex items-center">
                                <CheckIcon color="text-blue-500" />
                                Certificate
                            </li>
                            <li className="flex items-center">
                                <CheckIcon color="text-blue-500" />
                                Goodie Bag
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>

            {/* All Participants */}
            <div className="max-w-md mx-auto">
                <motion.div
                    className="bg-gradient-to-br from-gray-500/20 to-gray-700/20 p-6 rounded-xl relative overflow-hidden border-2 border-gray-500 text-center"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="text-gray-400 text-4xl font-bold mb-4">
                        🎓
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-300">
                        All participants will receive
                    </h3>
                    <p className="text-gray-400">
                        Electronic Certificate + Merchandise
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default PrizesSection;
