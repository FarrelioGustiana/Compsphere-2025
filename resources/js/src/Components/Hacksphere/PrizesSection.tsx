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

    // Prize category component for reuse
    const PrizeCategory = ({
        title,
        prizes,
    }: {
        title: string;
        prizes: { name: string; amount: string; items: string[] }[];
    }) => (
        <motion.div
            className="bg-gradient-to-br from-blue-800/30 to-indigo-900/30 p-6 rounded-xl border border-blue-500/50 mb-8"
            whileHover={{ scale: 1.01 }}
        >
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                {title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {prizes.map((prize, index) => (
                    <motion.div
                        key={index}
                        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-5 rounded-lg border border-blue-400/30 hover:border-blue-400/60 transition-colors w-full max-w-xs h-[260px] flex flex-col"
                        whileHover={{ scale: 1.03 }}
                    >
                        <div className="text-blue-400 text-3xl font-bold mb-3">
                            {prize.name.includes("Grand Prize")
                                ? "🏆"
                                : prize.name.includes("Best Innovation")
                                ? "💡"
                                : prize.name.includes("Public's Favorite")
                                ? "👑"
                                : prize.name.includes("Runner-Up") &&
                                  !prize.name.includes("Second")
                                ? "🥈"
                                : prize.name.includes("Second Runner-Up")
                                ? "🥉"
                                : "🎖️"}
                        </div>
                        <h4 className="text-lg font-bold mb-2 text-white">
                            {prize.name}
                        </h4>
                        <div className="text-cyan-300 font-bold mb-3">
                            {prize.amount}
                        </div>
                        <ul className="text-gray-300 space-y-2 text-sm mt-auto">
                            {prize.items.map((item, idx) => (
                                <li key={idx} className="flex items-center">
                                    <CheckIcon color="text-blue-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );

    // Prize data based on the image
    const prizeCategories = [
        {
            title: "Kategori Umum",
            prizes: [
                {
                    name: "Grand Prize",
                    amount: "Rp8.000.000",
                    items: ["Sertifikat", "Goodie Bag"],
                },
                {
                    name: "Best Innovation",
                    amount: "Rp1.500.000",
                    items: ["Sertifikat", "Goodie Bag"],
                },
                {
                    name: "Public's Favorite",
                    amount: "Rp1.500.000",
                    items: ["Sertifikat", "Goodie Bag"],
                },
            ],
        },
        {
            title: "Kategori SMK",
            prizes: [
                {
                    name: "Runner-Up SMK",
                    amount: "Rp8.000.000",
                    items: ["Sertifikat", "Goodie Bag"],
                },
                {
                    name: "Second Runner-Up SMK",
                    amount: "Rp1.500.000",
                    items: ["Sertifikat", "Goodie Bag"],
                },
            ],
        },
        {
            title: "Kategori Kuliah",
            prizes: [
                {
                    name: "Runner-Up Kuliah",
                    amount: "Rp8.000.000",
                    items: ["Sertifikat", "Goodie Bag"],
                },
                {
                    name: "Second Runner-Up Kuliah",
                    amount: "Rp1.500.000",
                    items: ["Sertifikat", "Goodie Bag"],
                },
            ],
        },
    ];

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
                Prizes & Awards
            </h2>

            {/* Prize categories */}
            {prizeCategories.map((category, index) => (
                <PrizeCategory
                    key={index}
                    title={category.title}
                    prizes={category.prizes}
                />
            ))}
        </motion.div>
    );
}

export default PrizesSection;
