import React from "react";
import { User } from "@/types/models";
import { motion, Variants } from "framer-motion";
import {
    FaUser,
    FaUsers,
    FaInfoCircle,
    FaCheck,
    FaExclamationTriangle,
} from "react-icons/fa";

interface SummaryStepProps {
    teamInfo: {
        team_name: string;
    };
    leaderInfo: {
        team_leader_nik: string;
        team_leader_category: string;
        team_leader_domicile: string;
    };
    member1Info: {
        member1_email: string;
        member1_name: string;
        member1_nik: string;
        member1_category: string;
        member1_domicile: string;
    };
    member2Info: {
        member2_email: string;
        member2_name: string;
        member2_nik: string;
        member2_category: string;
        member2_domicile: string;
    };
    paymentInfo?: {
        payment_initiated: boolean;
    };
    twibbonInfo?: {
        twibbon_leader_link: string;
        twibbon_member1_link: string;
        twibbon_member2_link: string;
    };
    prevStep: () => void;
    handleSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    user?: User;
    errors?: Record<string, string>;
    submissionError?: string;
    submissionSuccess?: boolean;
}

// Animation variants for framer-motion
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
        },
    },
};

const buttonVariants: Variants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
};

const SummaryStep: React.FC<SummaryStepProps> = ({
    teamInfo,
    leaderInfo,
    member1Info,
    member2Info,
    paymentInfo,
    twibbonInfo,
    prevStep,
    handleSubmit,
    processing,
    user,
    errors,
    submissionError,
    submissionSuccess,
}) => {
    const formatCategory = (category: string) => {
        switch (category) {
            case "high_school":
                return "High School";
            case "university":
                return "University";
            case "non_academic":
                return "Non-Academic";
            default:
                return category;
        }
    };

    // Helper function to get status color class
    const getStatusColorClass = (initiated: boolean | undefined) => {
        return initiated
            ? "text-yellow-400 font-medium"
            : "text-red-400 font-medium";
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative overflow-hidden"
        >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl -z-10"></div>

            <motion.div className="mb-6" variants={itemVariants}>
                <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                    Summary
                </h3>
                <p className="text-gray-300 mb-6 max-w-2xl">
                    Please review your team information before submitting. Make
                    sure all details are correct as they will be used for event
                    registration.
                </p>

                <motion.div
                    className="mb-6 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-5 rounded-lg border border-gray-700 shadow-lg hover:shadow-blue-900/20 transition-all duration-300"
                    variants={itemVariants}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                            <FaUsers className="text-white text-lg" />
                        </div>
                        <h4 className="text-lg font-bold text-white">
                            Team Information
                        </h4>
                    </div>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Team Name:
                        </span>{" "}
                        {teamInfo.team_name}
                    </p>
                </motion.div>

                <motion.div
                    className="mb-6 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-5 rounded-lg border border-gray-700 shadow-lg hover:shadow-blue-900/20 transition-all duration-300"
                    variants={itemVariants}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                            <FaUser className="text-white text-lg" />
                        </div>
                        <h4 className="text-lg font-bold text-white">
                            Team Leader
                        </h4>
                    </div>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Name:
                        </span>{" "}
                        {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Email:
                        </span>{" "}
                        {user?.email}
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            NIK:
                        </span>{" "}
                        {leaderInfo.team_leader_nik}
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Category:
                        </span>{" "}
                        {formatCategory(leaderInfo.team_leader_category)}
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Domicile:
                        </span>{" "}
                        {leaderInfo.team_leader_domicile}
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Payment Status:
                        </span>{" "}
                        <span
                            className={getStatusColorClass(
                                paymentInfo?.payment_initiated
                            )}
                        >
                            {paymentInfo?.payment_initiated
                                ? "Payment Initiated (Pending Verification)"
                                : "Not Started"}
                        </span>
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Payment Amount:
                        </span>{" "}
                        IDR 150,000
                    </p>
                </motion.div>

                <motion.div
                    className="mb-6 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-5 rounded-lg border border-gray-700 shadow-lg hover:shadow-blue-900/20 transition-all duration-300"
                    variants={itemVariants}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                            <FaUser className="text-white text-lg" />
                        </div>
                        <h4 className="text-lg font-bold text-white">
                            Team Member 1
                        </h4>
                    </div>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Name:
                        </span>{" "}
                        {member1Info.member1_name}
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Email:
                        </span>{" "}
                        {member1Info.member1_email}
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            NIK:
                        </span>{" "}
                        {member1Info.member1_nik}
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Category:
                        </span>{" "}
                        {formatCategory(member1Info.member1_category)}
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Domicile:
                        </span>{" "}
                        {member1Info.member1_domicile}
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Payment Status:
                        </span>{" "}
                        <span
                            className={getStatusColorClass(
                                paymentInfo?.payment_initiated
                            )}
                        >
                            {paymentInfo?.payment_initiated
                                ? "Payment Initiated (Pending Verification)"
                                : "Not Started"}
                        </span>
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Payment Amount:
                        </span>{" "}
                        IDR 150,000
                    </p>
                </motion.div>

                <motion.div
                    className="mb-6 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-5 rounded-lg border border-gray-700 shadow-lg hover:shadow-blue-900/20 transition-all duration-300"
                    variants={itemVariants}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                            <FaUser className="text-white text-lg" />
                        </div>
                        <h4 className="text-lg font-bold text-white">
                            Team Member 2
                        </h4>
                    </div>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Name:
                        </span>{" "}
                        {member2Info.member2_name}
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Email:
                        </span>{" "}
                        {member2Info.member2_email}
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            NIK:
                        </span>{" "}
                        {member2Info.member2_nik}
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Category:
                        </span>{" "}
                        {formatCategory(member2Info.member2_category)}
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Domicile:
                        </span>{" "}
                        {member2Info.member2_domicile}
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Payment Status:
                        </span>{" "}
                        <span
                            className={getStatusColorClass(
                                paymentInfo?.payment_initiated
                            )}
                        >
                            {paymentInfo?.payment_initiated
                                ? "Payment Initiated (Pending Verification)"
                                : "Not Started"}
                        </span>
                    </p>
                    <p className="text-gray-300 mb-2 flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium min-w-32 sm:mr-2">
                            Payment Amount:
                        </span>{" "}
                        IDR 150,000
                    </p>
                </motion.div>

                {/* Display form errors if any */}
                {errors && Object.keys(errors).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-900/30 rounded-lg border border-red-700 mb-6 shadow-lg"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <FaExclamationTriangle className="text-red-400 text-xl flex-shrink-0" />
                            <p className="text-red-300 font-bold">
                                Please fix the following errors:
                            </p>
                        </div>
                        <ul className="list-disc pl-8">
                            {Object.entries(errors).map(([key, error]) => (
                                <motion.li
                                    key={key}
                                    className="text-red-300 my-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {error}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {/* Display submission error if any */}
                {submissionError && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-red-900/30 rounded-lg border border-red-700 mb-6 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <FaExclamationTriangle className="text-red-400 text-xl flex-shrink-0" />
                            <p className="text-red-300">
                                <strong>Error:</strong> {submissionError}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Display success message if submission was successful */}
                {submissionSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring" as const }}
                        className="p-4 bg-green-900/30 rounded-lg border border-green-700 mb-6 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <FaCheck className="text-green-400 text-xl flex-shrink-0" />
                            <p className="text-green-300">
                                <strong>Success!</strong> Your team has been
                                successfully registered for Hacksphere!
                            </p>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-700 mb-6 shadow-lg"
                >
                    <div className="flex items-start gap-3">
                        <FaInfoCircle className="text-yellow-400 text-xl mt-1 flex-shrink-0" />
                        <p className="text-yellow-300">
                            <strong>Important:</strong> By submitting this form,
                            you confirm that all information provided is
                            accurate and that all team members have agreed to
                            participate in Hacksphere. Once submitted, this
                            information cannot be changed.
                        </p>
                    </div>
                </motion.div>
            </motion.div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <motion.button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    Previous Step
                </motion.button>
                <motion.button
                    type="submit"
                    disabled={processing || submissionSuccess}
                    className={`px-6 py-3 text-white rounded-lg hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                        processing || submissionSuccess
                            ? "opacity-70 cursor-not-allowed"
                            : ""
                    } ${
                        submissionSuccess
                            ? "bg-gradient-to-r from-green-600 to-green-700 focus:ring-green-500"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-purple-500"
                    }`}
                    variants={buttonVariants}
                    whileHover={processing || submissionSuccess ? {} : "hover"}
                    whileTap={processing || submissionSuccess ? {} : "tap"}
                >
                    {processing
                        ? "Submitting..."
                        : submissionSuccess
                        ? "Registration Complete"
                        : "Submit Registration"}
                </motion.button>
            </div>
        </motion.form>
    );
};

export default SummaryStep;
