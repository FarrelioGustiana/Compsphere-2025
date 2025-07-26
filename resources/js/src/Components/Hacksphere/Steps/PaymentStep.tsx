import React from "react";
import { motion } from "framer-motion";

interface PaymentStepProps {
    nextStep: () => void;
    prevStep: () => void;
    paymentInfo: {
        payment_initiated: boolean;
    };
    setPaymentInfo: React.Dispatch<
        React.SetStateAction<{
            payment_initiated: boolean;
        }>
    >;
    errors?: Record<string, string>;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
    nextStep,
    prevStep,
    paymentInfo,
    setPaymentInfo,
    errors,
}) => {
    const handleContinue = () => {
        setPaymentInfo({
            ...paymentInfo,
            payment_initiated: true,
        });
        nextStep();
    };

    // WhatsApp contact number - this should be configured somewhere else in production
    const whatsappNumber = "628123456789"; // Replace with the actual WhatsApp number
    const whatsappMessage = encodeURIComponent(
        "Hi, I would like to send payment proof for Hacksphere registration."
    );
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

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

    // Payment card animation
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { type: "spring" as const, stiffness: 100 },
        },
        hover: {
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
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
                    Payment
                </motion.h3>
                <motion.div
                    className="h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded mb-4"
                    variants={itemVariants}
                />
                <motion.p
                    className="text-gray-300 mb-6"
                    variants={itemVariants}
                >
                    Please complete your payment to finalize your Hacksphere
                    registration.
                </motion.p>

                <motion.div
                    className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-5 sm:p-6 md:p-8 rounded-2xl border border-blue-500/30 shadow-lg overflow-hidden relative mb-8"
                    variants={cardVariants}
                    whileHover="hover"
                >
                    {/* Background tech pattern - decorative */}
                    <div className="absolute inset-0 opacity-5 overflow-hidden">
                        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-500/30 filter blur-3xl"></div>
                        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-purple-500/30 filter blur-3xl"></div>
                    </div>

                    <div className="relative z-10">
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
                                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-white">
                                Payment Details
                            </h4>
                        </motion.div>

                        <motion.div
                            className="mb-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 sm:p-5 rounded-xl border border-blue-500/20"
                            variants={itemVariants}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-end gap-2 mb-3">
                                <p className="text-gray-300 text-sm">
                                    Registration Fee:
                                </p>
                                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    IDR 100,000
                                    <span className="text-xs sm:text-sm ml-2 font-normal text-gray-400">
                                        (per person)
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-start space-x-2 text-amber-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 flex-shrink-0 mt-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <p className="text-sm">
                                    <strong>Important:</strong> Each team member
                                    must pay IDR 100,000 individually.
                                </p>
                            </div>
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
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                                Payment Instructions
                            </h5>
                            <ol className="list-none space-y-3 text-gray-300">
                                {[
                                    "Make a payment of IDR 100,000 to our account",
                                    "Take a screenshot or photo of your payment proof",
                                    "Send the proof through WhatsApp using the button below",
                                    "Include your team name and member name in the WhatsApp message",
                                    "Each team member must make a separate payment and send proof individually",
                                    "After sending proof, click 'Continue' to complete your registration",
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
                                        <span>{instruction}</span>
                                    </motion.li>
                                ))}
                            </ol>
                        </motion.div>

                        <motion.div
                            className="flex flex-col space-y-3"
                            variants={itemVariants}
                        >
                            <motion.a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg text-center shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center group"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                                Send Payment Proof via WhatsApp
                            </motion.a>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>

            {errors && errors.payment_status && (
                <motion.div
                    className="text-red-400 mb-6 p-3 rounded-lg border border-red-500/30 bg-red-500/10 flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
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
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    {errors.payment_status}
                </motion.div>
            )}

            <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-between mt-8"
                variants={itemVariants}
            >
                <motion.button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center order-2 sm:order-1"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
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
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Previous
                </motion.button>

                <motion.button
                    type="button"
                    onClick={handleContinue}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center order-1 sm:order-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Continue to Summary
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default PaymentStep;
