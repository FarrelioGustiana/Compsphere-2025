import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CriteriaScores {
    problem_solving_relevance_score: number;
    functional_mvp_prototype_score: number;
    technical_execution_score: number;
    creativity_innovation_score: number;
    impact_scalability_score: number;
    presentation_clarity_score: number;
}

interface LeaderboardItem {
    rank: number;
    team_name: string;
    project_title: string;
    team_members: string[];
    average_score: number;
    criteria_scores: CriteriaScores;
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
                                displayLeaderboard.map((item, index) => {
                                    const [isExpanded, setIsExpanded] = useState(false);
                                    
                                    return (
                                        <motion.div
                                            key={index}
                                            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg overflow-hidden hover:border-blue-500/50 hover:bg-gray-800/70 transition-all duration-300"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <div className="p-4">
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

                                                    {/* Expand Button */}
                                                    <button
                                                        onClick={() => setIsExpanded(!isExpanded)}
                                                        className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expanded Criteria Scores */}
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-gray-700/50 bg-gray-900/30 p-4"
                                                >
                                                    <p className="text-xs text-gray-400 mb-3 font-semibold">Score Breakdown:</p>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                        <div className="bg-gray-800/50 rounded-lg p-2">
                                                            <p className="text-xs text-gray-500 mb-1">Problem Solving</p>
                                                            <p className="text-sm font-bold text-green-400">
                                                                {item.criteria_scores.problem_solving_relevance_score?.toFixed(1) || '0.0'}
                                                            </p>
                                                        </div>
                                                        <div className="bg-gray-800/50 rounded-lg p-2">
                                                            <p className="text-xs text-gray-500 mb-1">MVP/Prototype</p>
                                                            <p className="text-sm font-bold text-blue-400">
                                                                {item.criteria_scores.functional_mvp_prototype_score?.toFixed(1) || '0.0'}
                                                            </p>
                                                        </div>
                                                        <div className="bg-gray-800/50 rounded-lg p-2">
                                                            <p className="text-xs text-gray-500 mb-1">Technical</p>
                                                            <p className="text-sm font-bold text-purple-400">
                                                                {item.criteria_scores.technical_execution_score?.toFixed(1) || '0.0'}
                                                            </p>
                                                        </div>
                                                        <div className="bg-gray-800/50 rounded-lg p-2">
                                                            <p className="text-xs text-gray-500 mb-1">Creativity</p>
                                                            <p className="text-sm font-bold text-yellow-400">
                                                                {item.criteria_scores.creativity_innovation_score?.toFixed(1) || '0.0'}
                                                            </p>
                                                        </div>
                                                        <div className="bg-gray-800/50 rounded-lg p-2">
                                                            <p className="text-xs text-gray-500 mb-1">Impact</p>
                                                            <p className="text-sm font-bold text-orange-400">
                                                                {item.criteria_scores.impact_scalability_score?.toFixed(1) || '0.0'}
                                                            </p>
                                                        </div>
                                                        <div className="bg-gray-800/50 rounded-lg p-2">
                                                            <p className="text-xs text-gray-500 mb-1">Presentation</p>
                                                            <p className="text-sm font-bold text-cyan-400">
                                                                {item.criteria_scores.presentation_clarity_score?.toFixed(1) || '0.0'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
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
