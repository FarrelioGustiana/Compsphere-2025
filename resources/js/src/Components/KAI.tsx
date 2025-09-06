import { motion } from "framer-motion";

type KAIProps = {
    containerClassName?: string;
    imageClassName?: string;
    textClassName?: string;
};

const KAI = ({
    containerClassName,
    imageClassName,
    textClassName,
}: KAIProps) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{
                type: "spring",
                stiffness: 300,
            }}
            className={`${containerClassName} flex items-center justify-center cursor-pointer`}
            onClick={() => (window.location.href = "https://www.kai.id/")}
        >
            <span
                className={`${textClassName} text-white text-sm mr-2 font-medium`}
            >
                Powered by
            </span>
            <motion.img
                src="/assets/kai-logo.png"
                alt="KAI Logo"
                className={`${imageClassName} h-6`}
            />
        </motion.div>
    );
};

export default KAI;
