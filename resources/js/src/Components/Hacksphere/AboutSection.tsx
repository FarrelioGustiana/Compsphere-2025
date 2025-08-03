import { motion, Variants } from "framer-motion";

type Props = {
    fadeInUpVariant: Variants;
};

function AboutSection({ fadeInUpVariant }: Props) {
    return (
        <motion.div
            className="mb-16 sm:mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeInUpVariant}
        >
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                <div className="lg:w-1/2">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                        About Hacksphere
                    </h2>
                    <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6">
                        Hacksphere is a 48-hour hackathon where teams of 3
                        participants collaborate to build innovative solutions
                        using cutting-edge technology. This is your chance to
                        showcase your coding skills, creativity, and
                        problem-solving abilities!
                    </p>
                    <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8">
                        This event welcomes high school students, university
                        students, and industry professionals. Form a team and
                        join us for an unforgettable tech experience.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="flex items-center bg-blue-900/50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-blue-700/50">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <span className="text-sm sm:text-base">
                                October 2-4, 2025
                            </span>
                        </div>

                        <div className="flex items-center bg-blue-900/50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-blue-700/50">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <span className="text-sm sm:text-base">
                                Fablab, President University
                            </span>
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/2 mt-8 lg:mt-0">
                    <motion.div
                        className="relative"
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 6,
                            ease: "easeInOut",
                        }}
                    >
                        <img
                            src="/assets/hacksphere/Kiri.png"
                            alt="Hacksphere Illustration"
                            className="w-full h-auto rounded-xl shadow-2xl shadow-blue-700/20 border border-blue-800/30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-xl"></div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

export default AboutSection;
