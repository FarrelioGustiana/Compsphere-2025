import type React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Logo from "@/src/Components/UI/Logo";
import Button from "@/src/Components/UI/Button";

const HeroSection: React.FC = () => {
    const scrollToNextSection = () => {
        const nextSection = document.getElementById('about-section');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 z-10 pt-20 pb-16">
            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-[#1E88E5]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#D32F2F]/10 rounded-full blur-3xl"></div>
            
            <div className="max-w-7xl mx-auto text-center relative">
                {/* Animated logo with glow effect */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mb-6 sm:mb-8 relative"
                >
                    <div className="absolute inset-0 bg-[#1E88E5]/20 blur-xl rounded-full transform scale-150"></div>
                    <Logo
                        size="xxxl"
                        showText={false}
                        className="justify-center mb-6 sm:mb-8 relative z-10"
                    />
                </motion.div>

                {/* Modern animated heading with enhanced gradient */}
                <motion.h1
                    className="text-5xl sm:text-7xl lg:text-9xl font-bold mb-4 sm:mb-6 tracking-tight"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <span className="bg-gradient-to-r from-[#7ECEF4] via-[#1E88E5] to-[#D32F2F] bg-clip-text text-transparent font-orbitron inline-block relative">
                        Compsphere
                        <motion.span 
                            className="absolute -right-4 top-0 text-[#FF5252] opacity-80"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            .
                        </motion.span>
                    </span>
                </motion.h1>

                {/* Animated tagline with enhanced styling */}
                <motion.div
                    className="relative mb-6 sm:mb-8"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <p className="text-xl sm:text-3xl lg:text-4xl text-gray-200 font-light px-4 tracking-wide">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7ECEF4] to-[#1E88E5]">Accelerating</span> Innovation Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#D32F2F]">Intelligent</span> Technology
                    </p>
                </motion.div>

                {/* Description with enhanced typography */}
                <motion.p
                    className="text-base sm:text-lg lg:text-xl mb-10 sm:mb-14 text-gray-300 max-w-3xl mx-auto px-4 leading-relaxed"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    Bergabunglah dengan para inovator, developer, dan teknolog
                    terdepan dalam event teknologi terbesar tahun ini. Wujudkan
                    masa depan melalui kolaborasi dan inovasi yang tak terbatas.
                </motion.p>

                {/* Modern button group with hover effects */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-5 justify-center px-4"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                >
                    <Button
                        variant="gradient"
                        size="lg"
                        className="w-full sm:w-auto group relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
                            Daftar Sekarang
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-[#1E88E5] to-[#D32F2F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto bg-transparent backdrop-blur-sm border border-[#7ECEF4]/20 hover:border-[#7ECEF4]/40 transition-all duration-300"
                    >
                        Pelajari Lebih Lanjut
                    </Button>
                </motion.div>
            </div>
            
            {/* Scroll indicator */}
            <motion.div 
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
                onClick={scrollToNextSection}
            >
                <ChevronDown className="w-8 h-8 text-gray-400" />
            </motion.div>
        </section>
    );
};

export default HeroSection;
