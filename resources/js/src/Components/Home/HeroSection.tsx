"use client";

import type React from "react";
import { motion } from "framer-motion";
import Logo from "@/src/Components/UI/Logo";
import Button from "@/src/Components/UI/Button";

const HeroSection: React.FC = () => {
    return (
        <section className="relative px-4 sm:px-6 py-12 sm:py-20">
            <div className="max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mb-6 sm:mb-8"
                >
                    <Logo
                        size="xl"
                        showText={false}
                        className="justify-center mb-6 sm:mb-8"
                    />
                </motion.div>

                <motion.h1
                    className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
                        Compsphere
                    </span>
                </motion.h1>

                <motion.p
                    className="text-lg sm:text-2xl lg:text-3xl mb-6 sm:mb-8 text-gray-300 font-light px-4"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    Accelerating Innovation Through Intelligent Technology
                </motion.p>

                <motion.p
                    className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 text-gray-400 max-w-3xl mx-auto px-4"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    Bergabunglah dengan para inovator, developer, dan teknolog
                    terdepan dalam event teknologi terbesar tahun ini. Wujudkan
                    masa depan melalui kolaborasi dan inovasi yang tak terbatas.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center px-4"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                >
                    <Button
                        variant="gradient"
                        size="lg"
                        className="w-full sm:w-auto"
                    >
                        Daftar Sekarang
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto bg-transparent"
                    >
                        Pelajari Lebih Lanjut
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
