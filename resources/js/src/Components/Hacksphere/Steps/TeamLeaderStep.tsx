"use client";

import type React from "react";
import type { User } from "@/types/models";
import { motion } from "framer-motion";

interface TeamLeaderStepProps {
    leaderInfo: {
        team_leader_nik: string;
        team_leader_category: string;
        team_leader_domicile: string;
    };
    setLeaderInfo: React.Dispatch<
        React.SetStateAction<{
            team_leader_nik: string;
            team_leader_category: string;
            team_leader_domicile: string;
        }>
    >;
    nextStep: () => void;
    prevStep: () => void;
    errors: any;
    user?: User;
}

const TeamLeaderStep: React.FC<TeamLeaderStepProps> = ({
    leaderInfo,
    setLeaderInfo,
    nextStep,
    prevStep,
    errors,
    user,
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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setLeaderInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            leaderInfo.team_leader_nik.trim() !== "" &&
            leaderInfo.team_leader_category !== "" &&
            leaderInfo.team_leader_domicile.trim() !== ""
        ) {
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
                    Team Leader Information
                </motion.h3>
                <motion.div
                    className="h-1 w-12 sm:w-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded mb-4"
                    variants={itemVariants}
                />
                <motion.p
                    className="text-gray-300 mb-6 text-sm sm:text-base"
                    variants={itemVariants}
                >
                    As the team leader, please provide your information below.
                </motion.p>

                <motion.div
                    className="mb-6 p-3 sm:p-4 bg-blue-900/20 rounded-lg border border-blue-600/30 shadow-inner shadow-blue-500/10 relative overflow-hidden"
                    variants={itemVariants}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-50"></div>
                    <div className="relative z-10">
                        <p className="text-xs sm:text-sm text-blue-300 flex items-start">
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>
                                <strong className="font-medium">Note:</strong>{" "}
                                You ({user?.first_name} {user?.last_name}) will
                                be registered as the team leader.
                            </span>
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="mb-6 relative group"
                    variants={itemVariants}
                >
                    <label
                        htmlFor="team_leader_nik"
                        className="block text-sm font-medium text-blue-300 mb-2"
                    >
                        NIK (National Identity Number)
                    </label>
                    <div className="relative">
                        <input
                            id="team_leader_nik"
                            name="team_leader_nik"
                            type="text"
                            value={leaderInfo.team_leader_nik}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-gray-800/60 text-white border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70 disabled:border-gray-700 text-sm sm:text-base"
                            disabled
                            maxLength={16}
                            minLength={16}
                        />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-50 pointer-events-none transition-opacity duration-300" />
                    </div>
                    {errors.team_leader_nik && (
                        <motion.div
                            className="text-red-400 text-xs sm:text-sm mt-2 flex items-start"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: "spring" as const,
                                stiffness: 100,
                            }}
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
                                {errors.team_leader_nik}
                            </span>
                        </motion.div>
                    )}
                    <p className="text-xs text-gray-400 mt-2 flex items-start">
                        <svg
                            className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>Enter your 16-digit NIK without spaces</span>
                    </p>
                </motion.div>

                <motion.div
                    className="mb-6 relative group"
                    variants={itemVariants}
                >
                    <label
                        htmlFor="team_leader_category"
                        className="block text-sm font-medium text-blue-300 mb-2"
                    >
                        Category
                    </label>
                    <div className="relative">
                        <select
                            id="team_leader_category"
                            name="team_leader_category"
                            value={leaderInfo.team_leader_category}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-gray-800/60 text-white border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 shadow-lg transition-all duration-300 appearance-none text-sm sm:text-base"
                            required
                        >
                            <option value="">Select category</option>
                            <option value="high_school">High School</option>
                            <option value="university">University</option>
                            <option value="non_academic">Non-Academic</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
                    </div>
                    {errors.team_leader_category && (
                        <motion.div
                            className="text-red-400 text-xs sm:text-sm mt-2 flex items-start"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: "spring" as const,
                                stiffness: 100,
                            }}
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
                                {errors.team_leader_category}
                            </span>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    className="mb-6 sm:mb-8 relative group"
                    variants={itemVariants}
                >
                    <label
                        htmlFor="team_leader_domicile"
                        className="block text-sm font-medium text-blue-300 mb-2"
                    >
                        Domicile (City/Region)
                    </label>
                    <div className="relative">
                        <input
                            id="team_leader_domicile"
                            name="team_leader_domicile"
                            type="text"
                            value={leaderInfo.team_leader_domicile}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-gray-800/60 text-white border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 shadow-lg transition-all duration-300 text-sm sm:text-base"
                            placeholder="Enter your city or region"
                            required
                        />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
                    </div>
                    {errors.team_leader_domicile && (
                        <motion.div
                            className="text-red-400 text-xs sm:text-sm mt-2 flex items-start"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: "spring" as const,
                                stiffness: 100,
                            }}
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
                                {errors.team_leader_domicile}
                            </span>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>

            <motion.div
                className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4"
                variants={itemVariants}
            >
                <motion.button
                    type="button"
                    onClick={prevStep}
                    className="order-2 sm:order-1 w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-lg flex items-center justify-center font-medium text-sm sm:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Back
                </motion.button>
                <motion.button
                    type="submit"
                    className="order-1 sm:order-2 w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-600/30 flex items-center justify-center font-medium text-sm sm:text-base"
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

export default TeamLeaderStep;
