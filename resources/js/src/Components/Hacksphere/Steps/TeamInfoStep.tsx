"use client";

import type React from "react";
import { motion } from "framer-motion";

interface TeamInfoStepProps {
    teamInfo: {
        team_name: string;
    };
    setTeamInfo: React.Dispatch<
        React.SetStateAction<{
            team_name: string;
        }>
    >;
    nextStep: () => void;
    errors: any;
}

const TeamInfoStep: React.FC<TeamInfoStepProps> = ({
    teamInfo,
    setTeamInfo,
    nextStep,
    errors,
}) => {
    // Animation variants for framer-motion
    const formVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, stiffness: 100 },
        },
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTeamInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (teamInfo.team_name.trim() !== "") {
            nextStep();
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-0 overflow-hidden"
        >
            <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
                <motion.h3
                    className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2"
                    variants={itemVariants}
                >
                    Team Information
                </motion.h3>
                <motion.div
                    className="h-1 w-12 sm:w-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded mb-4"
                    variants={itemVariants}
                />
                <motion.p
                    className="text-gray-300 mb-6 text-sm sm:text-base"
                    variants={itemVariants}
                >
                    Please provide information about your Hacksphere team.
                </motion.p>

                <motion.div
                    className="mb-6 sm:mb-8 relative group"
                    variants={itemVariants}
                >
                    <label
                        htmlFor="team_name"
                        className="block text-sm font-medium text-blue-300 mb-2"
                    >
                        Team Name
                    </label>
                    <div className="relative">
                        <input
                            id="team_name"
                            name="team_name"
                            type="text"
                            value={teamInfo.team_name}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-gray-800/60 text-white border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 shadow-lg transition-all duration-300 text-sm sm:text-base"
                            placeholder="Enter your team name"
                            required
                        />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
                    </div>
                    {errors.team_name && (
                        <motion.div
                            className="text-red-400 text-xs sm:text-sm mt-2 flex items-start"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 100 }}
                        >
                            <svg
                                className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="break-words">
                                {errors.team_name}
                            </span>
                        </motion.div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                        Choose a creative and unique name for your hackathon
                        team
                    </p>
                </motion.div>
            </motion.div>

            <motion.div className="flex justify-end" variants={itemVariants}>
                <motion.button
                    type="submit"
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-600/30 flex items-center justify-center font-medium text-sm sm:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span>Next</span>
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                    </svg>
                </motion.button>
            </motion.div>
        </motion.form>
    );
};

export default TeamInfoStep;
