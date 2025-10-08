import React from "react";
import { motion, Variants } from "framer-motion";
import { Heart, Sparkles, Trophy, Users } from "lucide-react";

type Props = {
    fadeInUpVariant: Variants;
};

function ThankYouSection({ fadeInUpVariant }: Props) {
    return (
        <motion.div
            className="mb-16 sm:mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
            variants={fadeInUpVariant}
        >
            <div className="relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 px-6 py-12 sm:py-16">
                    {/* Icon Group */}
                    <div className="flex justify-center gap-4 mb-6">
                        <motion.div
                            className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-500/30"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Trophy className="w-6 h-6 text-blue-400" />
                        </motion.div>
                        <motion.div
                            className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                        >
                            <Heart className="w-6 h-6 text-purple-400" />
                        </motion.div>
                        <motion.div
                            className="p-3 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full border border-pink-500/30"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                        >
                            <Sparkles className="w-6 h-6 text-pink-400" />
                        </motion.div>
                    </div>

                    {/* Main Message */}
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Thank You, Innovators! 🎉
                        </h2>

                        <div className="space-y-4 text-gray-300">
                            <p className="text-lg sm:text-xl leading-relaxed">
                                What an incredible journey it has been! To every team that participated in <span className="text-blue-400 font-semibold">Hacksphere 2025</span>, you've shown us the true power of innovation and creativity.
                            </p>

                            <p className="text-base sm:text-lg leading-relaxed">
                                Your dedication, late-night coding sessions, brilliant ideas, and unwavering teamwork have made this hackathon truly unforgettable. Each project showcased unique solutions that push the boundaries of what's possible.
                            </p>

                            <p className="text-base sm:text-lg leading-relaxed">
                                Whether you're celebrating on the podium or taking home valuable experience, remember that <span className="text-purple-400 font-semibold">every line of code you wrote</span> and <span className="text-pink-400 font-semibold">every problem you solved</span> contributes to a brighter, more innovative future.
                            </p>
                        </div>

                        {/* Closing Message */}
                        <div className="mt-8 p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl">
                            <p className="text-lg text-gray-300 mb-2">
                                Keep innovating, keep creating, and keep pushing boundaries.
                            </p>
                            <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Until we meet again at the next Hacksphere! 🚀
                            </p>
                        </div>

                        {/* Signature */}
                        <div className="mt-6 text-gray-500 text-sm">
                            <p>With gratitude,</p>
                            <p className="font-semibold text-gray-400">The Compsphere Team</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default ThankYouSection;
