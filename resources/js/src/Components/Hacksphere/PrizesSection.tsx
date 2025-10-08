import React from "react";
import { motion, Variants } from "framer-motion";

interface LeaderboardItem {
    rank: number;
    team_name: string;
    project_title: string;
    team_leader: string;
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
                        <div className="space-y-3">
                            {displayLeaderboard.length > 0 ? (
                                displayLeaderboard.map((item, index) => {
                                    // Gradient colors for each rank
                                    const rankColors = [
                                        { bg: 'from-blue-500/10 to-cyan-500/10', border: 'border-blue-500/30', rankBg: 'bg-blue-500/20', rankText: 'text-blue-400', scoreBg: 'bg-blue-500/20' },
                                        { bg: 'from-purple-500/10 to-pink-500/10', border: 'border-purple-500/30', rankBg: 'bg-purple-500/20', rankText: 'text-purple-400', scoreBg: 'bg-purple-500/20' },
                                        { bg: 'from-green-500/10 to-emerald-500/10', border: 'border-green-500/30', rankBg: 'bg-green-500/20', rankText: 'text-green-400', scoreBg: 'bg-green-500/20' },
                                        { bg: 'from-orange-500/10 to-red-500/10', border: 'border-orange-500/30', rankBg: 'bg-orange-500/20', rankText: 'text-orange-400', scoreBg: 'bg-orange-500/20' },
                                        { bg: 'from-cyan-500/10 to-blue-500/10', border: 'border-cyan-500/30', rankBg: 'bg-cyan-500/20', rankText: 'text-cyan-400', scoreBg: 'bg-cyan-500/20' },
                                        { bg: 'from-pink-500/10 to-purple-500/10', border: 'border-pink-500/30', rankBg: 'bg-pink-500/20', rankText: 'text-pink-400', scoreBg: 'bg-pink-500/20' },
                                        { bg: 'from-indigo-500/10 to-blue-500/10', border: 'border-indigo-500/30', rankBg: 'bg-indigo-500/20', rankText: 'text-indigo-400', scoreBg: 'bg-indigo-500/20' },
                                    ];
                                    const colorScheme = rankColors[index % rankColors.length];
                                    
                                    return (
                                        <motion.div
                                            key={index}
                                            className={`group relative bg-gradient-to-r ${colorScheme.bg} backdrop-blur-sm border ${colorScheme.border} rounded-xl p-4 hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            {/* Glow effect on hover */}
                                            <div className={`absolute inset-0 bg-gradient-to-r ${colorScheme.bg} opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-xl`} />
                                            
                                            <div className="relative z-10 flex items-center gap-4">
                                                {/* Rank Number */}
                                                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colorScheme.rankBg} border ${colorScheme.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                    <span className={`text-xl font-bold ${colorScheme.rankText}`}>
                                                        {item.rank}
                                                    </span>
                                                </div>

                                                {/* Team Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                        <h4 className="font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                                                            {item.team_name}
                                                        </h4>
                                                        <span className="text-sm text-gray-500 hidden sm:inline">•</span>
                                                        <p className="text-sm text-gray-400 truncate">
                                                            {item.project_title}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <p className="text-xs text-gray-500 truncate">
                                                            Team Leader: {item.team_leader}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Score Badge */}
                                                <div className={`flex-shrink-0 px-4 py-2 rounded-lg ${colorScheme.scoreBg} border ${colorScheme.border}`}>
                                                    <p className={`text-sm font-bold ${colorScheme.rankText}`}>
                                                        {item.average_score.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
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
