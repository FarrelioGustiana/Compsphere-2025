import React from "react";
import { motion, Variants } from "framer-motion";
import { Trophy, Medal, Award, Star, Zap, Lightbulb, Users, MessageSquare } from "lucide-react";

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
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl blur-xl"></div>
                <div className="relative z-10 px-4 py-8 sm:py-12">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center font-airborne bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 text-transparent bg-clip-text">
                        PRIZES AND AWARDS
                    </h2>
                    
                    <div className="max-w-4xl mx-auto">
                        <p className="text-center text-blue-300 mb-10 max-w-2xl mx-auto">
                            Win spectacular prizes and prestigious recognition at Hacksphere 2025! 
                            We value innovation, creativity, and the best solutions for PT. KAI.
                        </p>
                        
                        {/* Main Prize Cards */}
                        <div className="space-y-4 sm:space-y-6 mb-12">
                            {/* Grand Prize */}
                            <motion.div 
                                className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-xl overflow-hidden border border-blue-500/30 shadow-lg shadow-blue-500/10"
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="flex flex-col sm:flex-row items-center">
                                    <div className="bg-gradient-to-br from-yellow-600 to-amber-800 p-6 sm:p-8 flex items-center justify-center sm:w-1/4">
                                        <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-300" strokeWidth={1.5} />
                                    </div>
                                    <div className="p-6 sm:p-8 flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-2">Grand Prize</h3>
                                                <p className="text-gray-300 text-sm sm:text-base mb-2">Main winner with the highest overall score</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl sm:text-3xl font-bold text-yellow-300">Rp8,000,000</div>
                                                <div className="text-yellow-500/80 text-sm">+ Certificate + Goodie Bag</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            
                            {/* 1st Runner Up */}
                            <motion.div 
                                className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-xl overflow-hidden border border-blue-500/30 shadow-lg shadow-blue-500/10"
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="flex flex-col sm:flex-row items-center">
                                    <div className="bg-gradient-to-br from-gray-500 to-gray-700 p-6 sm:p-8 flex items-center justify-center sm:w-1/4">
                                        <Medal className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300" strokeWidth={1.5} />
                                    </div>
                                    <div className="p-6 sm:p-8 flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl sm:text-2xl font-bold text-gray-300 mb-2">1st Runner Up</h3>
                                                <p className="text-gray-400 text-sm sm:text-base mb-2">Second place with outstanding performance</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl sm:text-3xl font-bold text-gray-200">Rp5,000,000</div>
                                                <div className="text-gray-500 text-sm">+ Certificate + Goodie Bag</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            
                            {/* 2nd Runner Up */}
                            <motion.div 
                                className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-xl overflow-hidden border border-blue-500/30 shadow-lg shadow-blue-500/10"
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="flex flex-col sm:flex-row items-center">
                                    <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-6 sm:p-8 flex items-center justify-center sm:w-1/4">
                                        <Award className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500" strokeWidth={1.5} />
                                    </div>
                                    <div className="p-6 sm:p-8 flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl sm:text-2xl font-bold text-amber-600 mb-2">2nd Runner Up</h3>
                                                <p className="text-gray-400 text-sm sm:text-base mb-2">Third place with innovative solution</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl sm:text-3xl font-bold text-amber-500">Rp3,000,000</div>
                                                <div className="text-amber-700/80 text-sm">+ Certificate + Goodie Bag</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        
                        {/* Special Awards */}
                        <h3 className="text-xl font-bold mb-6 text-center text-blue-300">Special Awards</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            {/* Public's Favorite */}
                            <motion.div 
                                className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-xl overflow-hidden border border-purple-500/30 shadow-lg shadow-purple-500/10"
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <Star className="w-10 h-10 text-purple-400" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-lg font-bold text-purple-400 text-center mb-2">Public's Favorite</h3>
                                    <p className="text-gray-400 text-sm text-center mb-4">Team with the most votes on compsphere.id website before October 4, 2025</p>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-purple-300">Rp1,000,000</div>
                                        <div className="text-purple-500/80 text-sm">+ Certificate + Goodie Bag</div>
                                    </div>
                                </div>
                            </motion.div>
                            
                            {/* Best Innovation */}
                            <motion.div 
                                className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-xl overflow-hidden border border-blue-500/30 shadow-lg shadow-blue-500/10"
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <Lightbulb className="w-10 h-10 text-blue-400" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-lg font-bold text-blue-400 text-center mb-2">Best Innovation</h3>
                                    <p className="text-gray-400 text-sm text-center mb-4">Team with the highest score in "Problem-Solving & Relevance" and "Creativity & Innovation" criteria</p>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-blue-300">Rp1,000,000</div>
                                        <div className="text-blue-500/80 text-sm">+ Certificate + Goodie Bag</div>
                                    </div>
                                </div>
                            </motion.div>
                            
                            {/* Best Tech Execution */}
                            <motion.div 
                                className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-xl overflow-hidden border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <Zap className="w-10 h-10 text-cyan-400" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-lg font-bold text-cyan-400 text-center mb-2">Best Tech Execution</h3>
                                    <p className="text-gray-400 text-sm text-center mb-4">Team with the highest score in "Technical Execution" criterion</p>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-cyan-300">Rp1,000,000</div>
                                        <div className="text-cyan-500/80 text-sm">+ Certificate + Goodie Bag</div>
                                    </div>
                                </div>
                            </motion.div>
                            
                            {/* Best Pitch */}
                            <motion.div 
                                className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-xl overflow-hidden border border-green-500/30 shadow-lg shadow-green-500/10"
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <MessageSquare className="w-10 h-10 text-green-400" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-lg font-bold text-green-400 text-center mb-2">Best Pitch</h3>
                                    <p className="text-gray-400 text-sm text-center mb-4">Team with the highest score in "Presentation & Clarity" criterion</p>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-green-300">Rp1,000,000</div>
                                        <div className="text-green-500/80 text-sm">+ Certificate + Goodie Bag</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        
                        {/* All Participants */}
                        <motion.div 
                            className="max-w-md mx-auto bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-xl overflow-hidden border border-gray-500/30 shadow-lg shadow-gray-500/10 p-6 text-center"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="flex items-center justify-center mb-4">
                                <Users className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-300 mb-2">All Participants</h3>
                            <p className="text-gray-400">Electronic Certificate + Merchandise</p>
                        </motion.div>
                        
                        <div className="mt-10 text-center text-sm text-gray-500">
                            <p>Winners are determined based on comprehensive evaluation by a panel of industry expert judges</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default PrizesSection;
