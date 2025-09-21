import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

interface TwibbonStepProps {
    twibbonInfo: {
        twibbon_leader_link: string;
        twibbon_member1_link: string;
        twibbon_member2_link: string;
    };
    setTwibbonInfo: React.Dispatch<
        React.SetStateAction<{
            twibbon_leader_link: string;
            twibbon_member1_link: string;
            twibbon_member2_link: string;
        }>
    >;
    leaderName: string;
    member1Name: string;
    member2Name: string;
    nextStep: () => void;
    prevStep: () => void;
    errors: any;
}

const TwibbonStep: React.FC<TwibbonStepProps> = ({
    twibbonInfo,
    setTwibbonInfo,
    leaderName,
    member1Name,
    member2Name,
    nextStep,
    prevStep,
    errors,
}) => {
    const [copied, setCopied] = useState(false);
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string
    ) => {
        setTwibbonInfo({
            ...twibbonInfo,
            [field]: e.target.value,
        });
    };

    // No validation needed as twibbon is optional
    const handleContinue = () => {
        if (
            twibbonInfo.twibbon_leader_link.trim() &&
            twibbonInfo.twibbon_member1_link.trim() &&
            twibbonInfo.twibbon_member2_link.trim()
        ) {
            nextStep();
        } else {
            alert("Please fill all twibbon links!");
        }
    };

    const allFieldsFilled =
        twibbonInfo.twibbon_leader_link.trim() &&
        twibbonInfo.twibbon_member1_link.trim() &&
        twibbonInfo.twibbon_member2_link.trim();

    const handleSkip = () => {
        // Clear all twibbon links
        setTwibbonInfo({
            twibbon_leader_link: "",
            twibbon_member1_link: "",
            twibbon_member2_link: "",
        });
        nextStep();
    };

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

    return (
        <motion.div
            className="max-w-2xl mx-auto w-full px-4 sm:px-6 overflow-hidden"
            variants={formVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
                <motion.h3
                    className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2"
                    variants={itemVariants}
                >
                    Post Your Twibbon
                </motion.h3>
                <motion.div
                    className="h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded mb-4"
                    variants={itemVariants}
                />
                <motion.p
                    className="text-gray-300 mb-6"
                    variants={itemVariants}
                >
                    Share your participation in Hacksphere by posting our event
                    Twibbon on social media.
                </motion.p>

                <motion.div
                    className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-5 sm:p-6 md:p-8 rounded-2xl border border-blue-500/30 shadow-lg overflow-hidden relative mb-8"
                    variants={itemVariants}
                >
                    {/* Background tech pattern - decorative */}
                    <div className="absolute inset-0 opacity-5 overflow-hidden">
                        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-500/30 filter blur-3xl"></div>
                        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-purple-500/30 filter blur-3xl"></div>
                    </div>

                    <div className="relative z-10">
                        <motion.div
                            className="mb-6"
                            variants={itemVariants}
                        ></motion.div>
                        <motion.div
                            className="flex items-center mb-6"
                            variants={itemVariants}
                        >
                            <div className="mr-4 p-3 rounded-lg bg-blue-500/20 text-blue-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-white">
                                Twibbon Details
                            </h4>
                        </motion.div>

                        <motion.div className="mb-6" variants={itemVariants}>
                            <h5 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                How to Use the Twibbon
                            </h5>
                            <ol className="list-none space-y-3 text-gray-300">
                                {[
                                    "Download our Hacksphere Twibbon from the link below",
                                    "Apply the Twibbon to your photo using any photo editing app",
                                    "Make sure your profile is public (at least until the event)",
                                    "Copy the post URL and paste it in the form below",
                                ].map((instruction, index) => (
                                    <motion.li
                                        key={index}
                                        className="flex items-start"
                                        variants={itemVariants}
                                        custom={index}
                                    >
                                        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white font-semibold mr-3 mt-0.5 text-xs">
                                            {index + 1}
                                        </div>
                                        <p>{instruction}</p>
                                    </motion.li>
                                ))}
                                <motion.li>
                                    <div className="flex items-center mb-4">

                                    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white font-semibold mr-3 mt-0.5 text-xs">
                                        5
                                    </div>
                                    <h4 className="text-blue-400 text-sm font-semibold">Copy This Caption For Your Post</h4>
                                    </div>
                                    <div className="relative bg-gray-800/60 caption rounded-lg px-2 py-4 border border-gray-700 font-mono text-sm">
                                        <pre className="text-white whitespace-pre-wrap overflow-x-auto max-h-60 overflow-y-auto">
                                            {`Greetings, Innovators! 👋🏻

Saya [tulis nama kamu di sini], siap berpartisipasi di Hacksphere 2025! 
Hacksphere 2025 adalah bagian dari COMPSPHERE 2025, event tahunan terbesar dari Fakultas Ilmu Komputer President University.

Dengan tema "Accelerating Innovation Through Intelligent Technology", COMPSPHERE mengajak kamu untuk mengasah kreativitas, kemampuan problem-solving, dan inovasi teknologi terbaikmu! 

Total hadiah hingga Rp20.000.000 menanti para pemenang!

📅 Registrasi: 14 – 25 September 2025

Jangan lewatkan kesempatan ini!
Daftarkan dirimu sekarang di:
👉 compsphere.id/events/hacksphere

Dan jangan lupa, tag 2 temanmu untuk ikut bareng! 

@Compsphere
compsphere.id
#Hacksphere2025`}
                                        </pre>
                                        <button
                                            onClick={() => {
                                                const caption = `Greetings, Innovators! 👋🏻

Saya [tulis nama kamu di sini], siap berpartisipasi di Hacksphere 2025! 
Hacksphere 2025 adalah bagian dari COMPSPHERE 2025, event tahunan terbesar dari Fakultas Ilmu Komputer President University.

Dengan tema "Accelerating Innovation Through Intelligent Technology", COMPSPHERE mengajak kamu untuk mengasah kreativitas, kemampuan problem-solving, dan inovasi teknologi terbaikmu! 

Total hadiah hingga Rp20.000.000 menanti para pemenang!

📅 Registrasi: 14 – 25 September 2025

Jangan lewatkan kesempatan ini!
Daftarkan dirimu sekarang di:
👉 compsphere.id/events/hacksphere

Dan jangan lupa, tag 2 temanmu untuk ikut bareng! 

@Compsphere
compsphere.id
#Hacksphere2025`;
                                                navigator.clipboard.writeText(
                                                    caption
                                                );
                                                setCopied(true);
                                                setTimeout(
                                                    () => setCopied(false),
                                                    2000
                                                );
                                            }}
                                            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700 transition-colors"
                                            title="Copy caption"
                                        >
                                            {copied ? (
                                                <Check className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <Copy className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </motion.li>
                            </ol>
                        </motion.div>

                        <motion.div className="mb-6" variants={itemVariants}>
                            <a
                                href="https://drive.google.com/file/d/1ayqn_tHe1sFoPdPXyJH6zwBtN03cGtXg/view?usp=drive_link"
                                className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded hover:from-blue-600 hover:to-blue-700 transition-colors mb-6"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 inline mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Download Twibbon Template
                            </a>

                            <div className="space-y-4 mb-6">
                                <div className="mb-4">
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Team Leader: {leaderName}
                                    </label>
                                    <input
                                        type="url"
                                        value={twibbonInfo.twibbon_leader_link}
                                        onChange={(e) =>
                                            handleInputChange(
                                                e,
                                                "twibbon_leader_link"
                                            )
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://www.instagram.com/p/..."
                                    />
                                    {errors && errors.twibbon_leader_link && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.twibbon_leader_link}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Team Member 1: {member1Name}
                                    </label>
                                    <input
                                        type="url"
                                        value={twibbonInfo.twibbon_member1_link}
                                        onChange={(e) =>
                                            handleInputChange(
                                                e,
                                                "twibbon_member1_link"
                                            )
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://www.instagram.com/p/..."
                                    />
                                    {errors && errors.twibbon_member1_link && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.twibbon_member1_link}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Team Member 2: {member2Name}
                                    </label>
                                    <input
                                        type="url"
                                        value={twibbonInfo.twibbon_member2_link}
                                        onChange={(e) =>
                                            handleInputChange(
                                                e,
                                                "twibbon_member2_link"
                                            )
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://www.instagram.com/p/..."
                                    />
                                    {errors && errors.twibbon_member2_link && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.twibbon_member2_link}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>

            <div className="flex justify-between mt-8">
                <motion.button
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Back
                </motion.button>
                <div className="space-x-3">
                    <motion.button
                        onClick={handleContinue}
                        disabled={!allFieldsFilled}
                        className={`px-4 py-2 rounded transition-colors ${
                            allFieldsFilled
                                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                                : "bg-gray-500 text-gray-300 cursor-not-allowed"
                        }`}
                        whileHover={allFieldsFilled ? { scale: 1.03 } : {}}
                        whileTap={allFieldsFilled ? { scale: 0.98 } : {}}
                    >
                        Continue
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default TwibbonStep;
