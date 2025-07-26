"use client";

import React, { useState } from "react";
import type { User, Participant } from "@/types/models";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { motion } from "framer-motion";
import TeamInfoStep from "@/src/Components/Hacksphere/Steps/TeamInfoStep";
import TeamLeaderStep from "@/src/Components/Hacksphere/Steps/TeamLeaderStep";
import TeamMemberStep from "@/src/Components/Hacksphere/Steps/TeamMemberStep";
import PaymentStep from "@/src/Components/Hacksphere/Steps/PaymentStep";
import TwibbonStep from "@/src/Components/Hacksphere/Steps/TwibbonStep";
import SummaryStep from "@/src/Components/Hacksphere/Steps/SummaryStep";

interface HacksphereRegistrationProps {
    user?: User;
    participantDetails?: Participant | null;
    eventId: number;
}

// Use Record<string, any> to allow for any string key with any value
interface HacksphereFormData extends Record<string, any> {
    team_name: string;
    team_leader_nik: string;
    team_leader_category: string;
    team_leader_domicile: string;
    member1_email: string;
    member1_name: string;
    member1_nik: string;
    member1_category: string;
    member1_domicile: string;
    member1_user_id: number;
    member2_email: string;
    member2_name: string;
    member2_nik: string;
    member2_category: string;
    member2_domicile: string;
    member2_user_id: number;
    payment_initiated: boolean;
    payment_amount?: number;
    payment_status?: string | null;
}

const HacksphereRegistration: React.FC<HacksphereRegistrationProps> = ({
    user,
    participantDetails,
    eventId,
}) => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [teamInfo, setTeamInfo] = useState({
        team_name: "",
    });
    const [leaderInfo, setLeaderInfo] = useState({
        team_leader_nik: participantDetails?.nik || "",
        team_leader_category: participantDetails?.category || "",
        team_leader_domicile: participantDetails?.domicile || "",
    });
    const [member1Info, setMember1Info] = useState({
        member1_email: "",
        member1_name: "",
        member1_nik: "",
        member1_category: "",
        member1_domicile: "",
        member1_user_id: 0,
    });
    const [member2Info, setMember2Info] = useState({
        member2_email: "",
        member2_name: "",
        member2_nik: "",
        member2_category: "",
        member2_domicile: "",
        member2_user_id: 0,
    });

    const [paymentInfo, setPaymentInfo] = useState({
        payment_initiated: false,
    });

    const [twibbonInfo, setTwibbonInfo] = useState({
        twibbon_leader_link: "",
        twibbon_member1_link: "",
        twibbon_member2_link: "",
    });

    const { data, setData, post, processing, errors } =
        useForm<HacksphereFormData>({
            ...teamInfo,
            ...leaderInfo,
            ...member1Info,
            ...member2Info,
            ...paymentInfo,
            ...twibbonInfo,
            payment_amount: 100000, // Fixed payment amount for Hacksphere
            payment_status: null,
        });

    // Update form data when any step's data changes
    React.useEffect(() => {
        setData((prevData) => ({
            ...prevData,
            ...teamInfo,
            ...leaderInfo,
            ...member1Info,
            ...member2Info,
            ...paymentInfo,
            ...twibbonInfo,
            payment_amount: 100000, // Fixed payment amount for Hacksphere
            payment_status: paymentInfo.payment_initiated ? "pending" : null,
        }));
    }, [
        teamInfo,
        leaderInfo,
        member1Info,
        member2Info,
        paymentInfo,
        twibbonInfo,
        setData,
    ]);

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    const [submissionError, setSubmissionError] = useState<string>("");
    const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionError("");

        post(route("participant.register-hacksphere"), {
            onSuccess: () => {
                setSubmissionSuccess(true);
            },
            onError: (errors) => {
                console.error("Registration errors:", errors);
                if (errors.default) {
                    setSubmissionError(errors.default);
                }
            },
        });
    };

    const renderStep = (stepss: number) => {
        switch (stepss) {
            case 1:
                return (
                    <TeamInfoStep
                        teamInfo={teamInfo}
                        setTeamInfo={setTeamInfo}
                        nextStep={nextStep}
                        errors={errors}
                    />
                );
            case 2:
                return (
                    <TeamLeaderStep
                        leaderInfo={leaderInfo}
                        setLeaderInfo={setLeaderInfo}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        errors={errors}
                        user={user}
                    />
                );
            case 3:
                return (
                    <TeamMemberStep
                        memberInfo={member1Info}
                        setMemberInfo={setMember1Info}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        errors={errors}
                        memberNumber={1}
                        otherMemberInfos={[
                            // Cast the types to ensure compatibility
                            {
                                ...member2Info,
                            } as any,
                            {
                                // Add team_leader properties converted to member format
                                team_leader_nik: leaderInfo.team_leader_nik,
                                team_leader_category:
                                    leaderInfo.team_leader_category,
                                team_leader_domicile:
                                    leaderInfo.team_leader_domicile,
                            } as any,
                        ]}
                    />
                );
            case 4:
                return (
                    <TeamMemberStep
                        memberInfo={member2Info}
                        setMemberInfo={setMember2Info}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        errors={errors}
                        memberNumber={2}
                        otherMemberInfos={[
                            // Cast the types to ensure compatibility
                            {
                                ...member1Info,
                            } as any,
                            {
                                // Add team_leader properties converted to member format
                                team_leader_nik: leaderInfo.team_leader_nik,
                                team_leader_category:
                                    leaderInfo.team_leader_category,
                                team_leader_domicile:
                                    leaderInfo.team_leader_domicile,
                            } as any,
                        ]}
                    />
                );
            case 5:
                return (
                    <PaymentStep
                        nextStep={nextStep}
                        prevStep={prevStep}
                        paymentInfo={paymentInfo}
                        setPaymentInfo={setPaymentInfo}
                        errors={errors}
                    />
                );
            case 6:
                return (
                    <TwibbonStep
                        twibbonInfo={twibbonInfo}
                        setTwibbonInfo={setTwibbonInfo}
                        leaderName={user?.first_name || "Team Leader"}
                        member1Name={member1Info.member1_name}
                        member2Name={member2Info.member2_name}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        errors={errors}
                    />
                );
            case 7:
                return (
                    <SummaryStep
                        teamInfo={teamInfo}
                        leaderInfo={leaderInfo}
                        member1Info={member1Info}
                        member2Info={member2Info}
                        prevStep={prevStep}
                        handleSubmit={handleSubmit}
                        processing={processing}
                        user={user}
                        errors={errors}
                        submissionError={submissionError}
                        submissionSuccess={submissionSuccess}
                        paymentInfo={paymentInfo}
                        twibbonInfo={twibbonInfo}
                    />
                );
            default:
                return null;
        }
    };

    // Animation variants for form elements with proper TypeScript typing
    const containerVariant = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, stiffness: 100 },
        },
    };

    // Step titles for the stepper
    const stepTitles = [
        "Team Info",
        "Leader",
        "Member 1",
        "Member 2",
        "Payment",
        "Twibbon",
        "Summary",
    ];

    return (
        <motion.div
            className="mt-4 sm:mt-6 lg:mt-8 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            animate="visible"
            variants={containerVariant}
        >
            <motion.div
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl border border-blue-500/30"
                variants={itemVariant}
            >
                <motion.div className="mb-6 lg:mb-8" variants={itemVariant}>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 sm:mb-6 text-center sm:text-left">
                        Hacksphere Team Registration
                    </h2>

                    {/* Mobile Vertical Stepper - Only visible on small screens */}
                    <div className="lg:hidden mb-6">
                        <div className="flex flex-col space-y-3">
                            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                                <div key={step} className="w-full">
                                    <motion.div
                                        className={`flex items-center space-x-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                                            currentStep === step
                                                ? "bg-blue-900/30 border border-blue-500/30"
                                                : "hover:bg-gray-800/50"
                                        }`}
                                        variants={itemVariant}
                                    >
                                        <motion.div
                                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg text-xs sm:text-sm font-medium ${
                                                currentStep > step
                                                    ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                                                    : currentStep === step
                                                    ? "bg-gradient-to-br from-blue-400 to-purple-600 ring-2 ring-blue-400 text-white"
                                                    : "bg-gray-800 border border-gray-600 text-gray-400"
                                            }`}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {currentStep > step ? (
                                                <svg
                                                    className="w-3 h-3 sm:w-4 sm:h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            ) : (
                                                step
                                            )}
                                        </motion.div>

                                        <div
                                            className={`text-sm font-medium ${
                                                currentStep >= step
                                                    ? "text-blue-400"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {stepTitles[step - 1]}
                                        </div>
                                    </motion.div>

                                    {currentStep === step && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="mt-3 bg-gradient-to-br from-gray-800 to-gray-900 p-3 sm:p-4 rounded-lg border border-blue-500/20 shadow-inner overflow-hidden lg:hidden"
                                        >
                                            <div className="w-full max-w-full overflow-x-hidden">
                                                {renderStep(step)}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Horizontal Stepper - Only visible on large screens */}
                    <div className="relative hidden lg:block">
                        {/* Progress bar */}
                        <div className="absolute top-4 left-0 h-1 bg-gray-700 w-full rounded-full">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${(currentStep / 7) * 100}%`,
                                }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        {/* Step indicators */}
                        <div className="flex justify-between items-center relative z-10">
                            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                                <motion.div
                                    key={step}
                                    className="flex flex-col items-center"
                                    whileHover={{ scale: 1.05 }}
                                    variants={itemVariant}
                                >
                                    <motion.div
                                        className={`w-8 h-8 xl:w-9 xl:h-9 rounded-full flex items-center justify-center mb-2 shadow-lg text-sm font-medium ${
                                            currentStep > step
                                                ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                                                : currentStep === step
                                                ? "bg-gradient-to-br from-blue-400 to-purple-600 ring-2 ring-blue-400 text-white"
                                                : "bg-gray-800 border border-gray-600 text-gray-400"
                                        }`}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {currentStep > step ? (
                                            <svg
                                                className="w-4 h-4 xl:w-5 xl:h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        ) : (
                                            step
                                        )}
                                    </motion.div>
                                    <div
                                        className={`text-xs xl:text-sm font-medium text-center ${
                                            currentStep >= step
                                                ? "text-blue-400"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {stepTitles[step - 1]}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8 rounded-lg border border-blue-500/20 shadow-inner overflow-hidden hidden lg:block"
                >
                    <div className="w-full max-w-full overflow-x-hidden">
                        {renderStep(currentStep)}
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default HacksphereRegistration;
