import React from "react";
import { motion, Variants } from "framer-motion";

interface LeaderboardItem {
    rank: number;
    team_name: string;
    project_title: string;
    team_members: string[];
    average_score: number;
}

type Props = {
    fadeInUpVariant: Variants;
    leaderboard: LeaderboardItem[];
};

function PrizesSection({ fadeInUpVariant, leaderboard }: Props) {
    // Filter to show only rank 4-10
    const displayLeaderboard = leaderboard.filter(item => item.rank >= 4 && item.rank <= 10);

    return (
        <motion.div
            className="mb-16 sm:mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            variants={fadeInUpVariant}
        >
            <div className="relative">
                <div className="relative z-10 px-4 py-8 sm:py-12">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-white">
                        Top 10 Leaderboard
                    </h2>
                    
                    <div className="max-w-5xl mx-auto">
                        {/* Leaderboard Rank 4-10 */}
                        <div className="space-y-2">
                            {displayLeaderboard.length > 0 ? (
                                displayLeaderboard.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 hover:border-blue-500/50 hover:bg-gray-800/70 transition-all duration-300"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ x: 5 }}
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Rank Number */}
                                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center">
                                                <span className="text-lg font-bold text-gray-300">
                                                    {item.rank}
                                                </span>
                                            </div>

                                            {/* Team Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                    <h4 className="font-bold text-white truncate">
                                                        {item.team_name}
                                                    </h4>
                                                    <span className="text-sm text-gray-500 hidden sm:inline">•</span>
                                                    <p className="text-sm text-gray-400 truncate">
                                                        {item.project_title}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    {item.team_members && item.team_members.length > 0 && (
                                                        <>
                                                            <p className="text-xs text-gray-500">
                                                                Members: {item.team_members.join(', ')}
                                                            </p>
                                                            <span className="text-xs text-gray-600">•</span>
                                                        </>
                                                    )}
                                                    <p className="text-xs text-blue-400 font-medium">
                                                        Score: {item.average_score.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <p>Leaderboard will be available after evaluations are completed.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default PrizesSection;
