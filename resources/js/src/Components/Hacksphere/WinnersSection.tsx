import React from "react";
import { motion, Variants } from "framer-motion";
import { Trophy, Award, Heart, Mic, Code } from "lucide-react";

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

function WinnersSection({ fadeInUpVariant, leaderboard }: Props) {
    // Get top 3 from leaderboard
    const topThreeData = leaderboard.slice(0, 3);
    
    const topThree = topThreeData.map((item, index) => {
        const configs = [
            {
                place: "2nd Place",
                bgColor: "bg-gray-700/30",
                textColor: "text-gray-300",
                scoreColor: "bg-gray-600/50",
            },
            {
                place: "1st Place",
                bgColor: "bg-yellow-500/20",
                textColor: "text-yellow-400",
                scoreColor: "bg-yellow-500/30",
                highlight: true,
            },
            {
                place: "3rd Place",
                bgColor: "bg-orange-600/20",
                textColor: "text-orange-400",
                scoreColor: "bg-orange-600/30",
            },
        ];
        
        // Map rank to config (rank 2 -> index 0, rank 1 -> index 1, rank 3 -> index 2)
        const configIndex = item.rank === 1 ? 1 : item.rank === 2 ? 0 : 2;
        
        return {
            ...configs[configIndex],
            team: item.team_name,
            project: item.project_title,
            score: item.average_score.toFixed(2),
            rank: item.rank.toString(),
        };
    });

    const specialAwards = [
        {
            title: "Best Innovation",
            team: "KAI Life",
            icon: <Award className="w-6 h-6" />,
            iconBg: "bg-purple-500/20",
            iconColor: "text-purple-400",
        },
        {
            title: "Public Favorite",
            team: "Bright",
            icon: <Heart className="w-6 h-6" />,
            iconBg: "bg-pink-500/20",
            iconColor: "text-pink-400",
        },
        {
            title: "Best Pitch",
            team: "Access 2.0",
            icon: <Mic className="w-6 h-6" />,
            iconBg: "bg-blue-500/20",
            iconColor: "text-blue-400",
        },
        {
            title: "Best Tech Execution",
            team: "KAI HACKSPHERE",
            icon: <Code className="w-6 h-6" />,
            iconBg: "bg-green-500/20",
            iconColor: "text-green-400",
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
            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-white">
                    Hacksphere 2025 Winners
                </h2>
                <p className="text-gray-400">
                    Congratulations to all the amazing teams!
                </p>
            </div>

            {/* Top 3 Winners - Clean Podium Style */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
                {topThree.map((winner, index) => (
                    <motion.div
                        key={index}
                        className={`${
                            winner.highlight
                                ? "lg:order-2"
                                : index === 0
                                ? "lg:order-1"
                                : "lg:order-3"
                        }`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 }}
                    >
                        <div
                            className={`relative bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 ${
                                winner.highlight ? "lg:scale-105" : ""
                            }`}
                        >
                            {/* Rank Badge */}
                            <div className="flex justify-center mb-4">
                                <div
                                    className={`w-16 h-16 rounded-full ${winner.bgColor} border-2 border-gray-700 flex items-center justify-center`}
                                >
                                    <Trophy className={`w-8 h-8 ${winner.textColor}`} />
                                </div>
                            </div>

                            {/* Place */}
                            <div className={`text-center text-sm font-medium mb-2 ${winner.textColor}`}>
                                {winner.place}
                            </div>

                            {/* Team Name */}
                            <h3 className="text-center text-xl font-bold text-white mb-2">
                                {winner.team}
                            </h3>

                            {/* Project Name */}
                            <p className="text-center text-sm text-gray-400 mb-4 line-clamp-2">
                                {winner.project}
                            </p>

                            {/* Score */}
                            <div className="flex justify-center">
                                <div className={`px-6 py-2 rounded-lg ${winner.scoreColor} border border-gray-600/50`}>
                                    <span className="text-2xl font-bold text-white">
                                        {winner.score}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Special Awards - Enhanced Cards */}
            <div className="mt-16">
                <h3 className="text-2xl font-bold mb-8 text-center text-white">
                    Special Awards
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                    {specialAwards.map((award, index) => (
                        <motion.div
                            key={index}
                            className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm p-5 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all duration-300 overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                        >
                            {/* Glow Effect on Hover */}
                            <div className={`absolute inset-0 ${award.iconBg} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`} />
                            
                            {/* Content */}
                            <div className="relative z-10">
                                {/* Icon with better styling */}
                                <div className="flex items-center justify-center mb-4">
                                    <div className={`p-3 rounded-xl ${award.iconBg} border border-gray-700/30 group-hover:scale-110 transition-transform duration-300`}>
                                        <div className={award.iconColor}>
                                            {award.icon}
                                        </div>
                                    </div>
                                </div>

                                {/* Award Title */}
                                <h4 className="text-center text-base font-bold text-white mb-2">
                                    {award.title}
                                </h4>

                                {/* Winner Label */}
                                <p className="text-center text-xs text-gray-500 mb-2 uppercase tracking-wider">
                                    Winner
                                </p>

                                {/* Team Name with gradient on hover */}
                                <p className="text-center text-lg font-bold text-white group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                                    {award.team}
                                </p>
                            </div>

                            {/* Decorative corner accent */}
                            <div className={`absolute top-0 right-0 w-20 h-20 ${award.iconBg} opacity-5 rounded-bl-full`} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default WinnersSection;
