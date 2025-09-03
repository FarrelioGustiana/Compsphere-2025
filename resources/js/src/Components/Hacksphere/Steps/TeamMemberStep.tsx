import React, { useState, useEffect } from "react";
import { route } from "ziggy-js";
import axios from "axios";
import { motion } from "framer-motion";

interface TeamMemberStepProps<T extends Record<string, string | number>> {
    memberInfo: T;
    setMemberInfo: React.Dispatch<React.SetStateAction<T>>;
    nextStep: () => void;
    prevStep: () => void;
    errors: any;
    memberNumber: number;
    otherMemberInfos?: T[];
}

// Use a type assertion to make TypeScript happy
type AnyMemberInfo = Record<string, string | number>;

// Interface for email validation response
interface ValidationResponse {
    valid: boolean;
    duplicate?: boolean;
    message?: string;
    user?: {
        name: string;
        email: string;
        member_user_id: number;
        nik?: string;
        category?: string;
        domicile?: string;
    };
    flash?: {
        valid?: boolean;
        message?: string;
    };
    errors?: {
        email?: string;
    };
    data?: {
        valid?: boolean;
        message?: string;
        user?: {
            name: string;
            email: string;
            member_user_id: number;
            nik?: string;
            category?: string;
            domicile?: string;
        };
    };
}

function TeamMemberStep<T extends AnyMemberInfo>({
    memberInfo,
    setMemberInfo,
    nextStep,
    prevStep,
    errors,
    memberNumber,
    otherMemberInfos = [],
}: TeamMemberStepProps<T>) {
    const [isValidating, setIsValidating] = useState(false);
    const [isNikValidating, setIsNikValidating] = useState(false);
    const [emailValidated, setEmailValidated] = useState(false);
    const [nikValidated, setNikValidated] = useState(false);
    const [emailError, setEmailError] = useState<string>("");
    const [nikError, setNikError] = useState<string>("");

    const prefix = `member${memberNumber}`;

    const handleNewstep = () => {
        setEmailError("");
        setNikError("");
        setEmailValidated(false);
        setNikValidated(false);
        setMemberInfo((prev: T) => ({
            ...prev,
            [`${prefix}_email`]: memberInfo[`${prefix}_email`],
            [`${prefix}_nik`]: memberInfo[`${prefix}_nik`],
            [`${prefix}_category`]: memberInfo[`${prefix}_category`],
            [`${prefix}_domicile`]: memberInfo[`${prefix}_domicile`],
            [`${prefix}_name`]: memberInfo[`${prefix}_name`],
            [`${prefix}_user_id`]: memberInfo[`${prefix}_user_id`],
        }));
        nextStep();
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setMemberInfo((prev: T) => ({ ...prev, [name]: value }));

        // Reset validation if email changes
        if (name === `${prefix}_email`) {
            setEmailValidated(false);
            setEmailError("");
        }

        // Reset validation if NIK changes
        if (name === `${prefix}_nik`) {
            setNikValidated(false);
            setNikError("");
        }
    };

    const validateEmail = () => {
        const email = memberInfo[`${prefix}_email`] as string;

        if (!email) {
            setEmailError("Email is required");
            return;
        }

        setIsValidating(true);
        setEmailError("");

        axios
            .post(route("participant.validate-team-member-email"), { email })
            .then((response) => {
                const data = response.data;

                if (data && data.valid === true && data.user) {
                    // Success case
                    setEmailValidated(true);
                    setEmailError("");

                    // If the user already has an NIK in their profile, it's valid
                    const userNik = data.user.nik || "";
                    if (userNik && userNik.length === 16) {
                        setNikValidated(true);
                        setNikError("");
                    }

                    setMemberInfo((prev: T) => ({
                        ...prev,
                        [`${prefix}_name`]: data.user.name || "",
                        [`${prefix}_user_id`]: data.user.member_user_id || 0,
                        [`${prefix}_nik`]: data.user.nik || "",
                        [`original_${prefix}_nik`]: data.user.nik || "", // Store original NIK to detect changes
                        [`${prefix}_category`]: data.user.category || "",
                        [`${prefix}_domicile`]: data.user.domicile || "",
                        [`${prefix}_email`]: data.user.email || "",
                    }));
                } else {
                    // Error case
                    setEmailValidated(false);

                    // Extract error message
                    let errorMessage =
                        data.message || "Failed to validate email";

                    // Show specific guidance based on error
                    if (errorMessage.includes("yourself as a team member")) {
                        errorMessage =
                            "You cannot add yourself as a team member. Please use another team member's email.";
                    } else if (errorMessage.includes("already registered")) {
                        errorMessage =
                            "This user is already registered for Hacksphere. Please invite someone else.";
                    } else if (errorMessage.includes("No user account")) {
                        errorMessage =
                            "No user account found with this email. The person must have an account on our platform.";
                    }

                    setEmailError(errorMessage);
                }
            })
            .catch((error) => {
                console.error(`Validation error for ${prefix}:`, error);
                setEmailValidated(false);

                let errorMessage =
                    "Failed to connect to the server. Please try again.";

                if (error.response && error.response.data) {
                    if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    } else if (
                        error.response.data.errors &&
                        error.response.data.errors.email
                    ) {
                        errorMessage = error.response.data.errors.email;
                    }
                }

                setEmailError(errorMessage);
            })
            .finally(() => {
                setIsValidating(false);
            });
    };

    // Collect NIKs from other members to check for duplicates
        const validateNikFormat = (nik: string): { valid: boolean; message: string } => {
        if (!/^[0-9]{16}$/.test(nik)) {
            return { valid: false, message: "NIK must be a 16-digit number." };
        }

        let day = parseInt(nik.substring(6, 8), 10);
        const month = parseInt(nik.substring(8, 10), 10);
        const year = parseInt(nik.substring(10, 12), 10);

        if (day > 40) {
            day -= 40; // Adjust for female birth date
        }

        if (month < 1 || month > 12) {
            return { valid: false, message: "Invalid month in NIK." };
        }

        // Basic check for day validity based on month
        const daysInMonth = new Date(2000, month, 0).getDate(); // Use a leap year for Feb check
        if (day < 1 || day > daysInMonth) {
            return { valid: false, message: "Invalid day in NIK." };
        }

        // This is a simplified check. A full check would need a proper Date object and year handling.
        // For now, we assume the backend will do the definitive check.

        return { valid: true, message: "" };
    };

    const collectOtherNiks = (): string[] => {
        const niks: string[] = [];

        // Add NIKs from other member infos if available
        if (otherMemberInfos && otherMemberInfos.length > 0) {
            otherMemberInfos.forEach((info, index) => {
                // Skip current member
                if (index + 1 !== memberNumber) {
                    const otherNikKey = `member${index + 1}_nik`;
                    const otherNik = info[otherNikKey] as string;
                    if (otherNik) {
                        niks.push(otherNik);
                    }
                }
            });
        }

        return niks;
    };

    const validateNik = () => {
        const nik = memberInfo[`${prefix}_nik`] as string;
        const email = memberInfo[`${prefix}_email`] as string;
        const originalNik = memberInfo[`original_${prefix}_nik`];

        // If this is the same NIK as in the user's profile, no need to validate
        if (nik && originalNik && nik === originalNik) {
            setNikValidated(true);
            setNikError("");
            return;
        }

        if (!nik) {
            setNikError("NIK is required");
            return;
        }

                const formatValidation = validateNikFormat(nik);
        if (!formatValidation.valid) {
            setNikError(formatValidation.message);
            return;
        }

        // Need valid email before validating NIK
        if (!email) {
            setNikError("Email validation required first");
            return;
        }

        setIsNikValidating(true);
        setNikError("");

        const otherNiks = collectOtherNiks();

        axios
            .post(route("participant.validate-team-member-nik"), {
                nik: nik,
                current_member_email: email,
                other_niks: otherNiks,
            })
            .then((response) => {
                const data = response.data;

                if (data && data.valid === true) {
                    // Success case
                    setNikValidated(true);
                    setNikError("");
                } else {
                    // Error case
                    setNikValidated(false);
                    setNikError(data.message || "Failed to validate NIK");
                }
            })
            .catch((error) => {
                console.error(`NIK validation error for ${prefix}:`, error);
                setNikValidated(false);

                let errorMessage =
                    "Failed to connect to the server. Please try again.";

                if (error.response && error.response.data) {
                    if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }
                }

                setNikError(errorMessage);
            })
            .finally(() => {
                setIsNikValidating(false);
            });
    };

    // Validate NIK when it changes to 16 digits
    useEffect(() => {
        const nik = memberInfo[`${prefix}_nik`] as string;
        if (
            nik &&
            nik.length === 16 &&
            emailValidated &&
            !nikValidated &&
            !isNikValidating
        ) {
            // Only validate if the NIK was manually changed
            // If the NIK was automatically filled from the profile, it's already valid
            const originalNik = memberInfo[`original_${prefix}_nik`];
            if (originalNik !== nik) {
                validateNik();
            }
        }
    }, [memberInfo[`${prefix}_nik`]]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailValidated) {
            setEmailError("Please validate the email first");
            return;
        }

        if (!nikValidated) {
            validateNik();
            return;
        }

        if (
            memberInfo[`${prefix}_email`] &&
            memberInfo[`${prefix}_nik`] &&
            memberInfo[`${prefix}_category`] &&
            memberInfo[`${prefix}_domicile`] &&
            emailValidated &&
            nikValidated
        ) {
            handleNewstep();
        }
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
        <motion.form
            onSubmit={handleSubmit}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto w-full px-4 sm:px-6 overflow-hidden"
        >
            <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
                <motion.h3
                    className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2"
                    variants={itemVariants}
                >
                    Team Member {memberNumber} Information
                </motion.h3>
                <motion.div
                    className="h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded mb-4"
                    variants={itemVariants}
                />
                <motion.p
                    className="text-gray-300 mb-6"
                    variants={itemVariants}
                >
                    Please provide information for team member {memberNumber}.
                </motion.p>

                <motion.div
                    className="mb-6 relative group"
                    variants={itemVariants}
                >
                    <label
                        htmlFor={`${prefix}_email`}
                        className="block text-sm font-medium text-blue-300 mb-2"
                    >
                        Email
                    </label>
                    <div className="flex flex-col sm:flex-row mb-1 gap-2">
                        <div className="relative flex-grow mb-2 sm:mb-0">
                            <input
                                id={`${prefix}_email`}
                                name={`${prefix}_email`}
                                type="email"
                                value={memberInfo[`${prefix}_email`] as string}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg ${
                                    !emailValidated ? "sm:rounded-r-none" : ""
                                } bg-gray-800/60 text-white border ${
                                    emailError
                                        ? "border-red-400"
                                        : emailValidated
                                        ? "border-green-500"
                                        : "border-gray-700"
                                } focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 shadow-lg transition-all duration-300 disabled:opacity-70`}
                                disabled={emailValidated}
                                required
                                placeholder="Enter team member's email"
                            />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-50 pointer-events-none transition-opacity duration-300" />
                        </div>
                        <motion.button
                            type="button"
                            onClick={validateEmail}
                            disabled={
                                isValidating ||
                                emailValidated ||
                                !memberInfo[`${prefix}_email`]
                            }
                            className={`px-3 sm:px-4 py-3 ${
                                emailValidated
                                    ? "bg-gradient-to-r from-green-500 to-green-600"
                                    : "bg-gradient-to-r from-blue-500 to-purple-600"
                            } text-white rounded-lg ${
                                !emailValidated ? "sm:rounded-l-none" : ""
                            } shadow-lg transition-all duration-300 flex items-center justify-center hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] sm:min-w-[100px]`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isValidating ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Verifying
                                </>
                            ) : emailValidated ? (
                                <>
                                    <svg
                                        className="w-5 h-5 mr-1"
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
                                    Verified
                                </>
                            ) : (
                                "Verify"
                            )}
                        </motion.button>
                    </div>

                    {emailValidated && (
                        <motion.div
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 gap-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: "spring" as const,
                                stiffness: 100,
                            }}
                        >
                            <div className="text-green-400 text-sm flex items-center">
                                <svg
                                    className="w-4 h-4 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Email verified! User:{" "}
                                <span className="font-medium ml-1">
                                    {memberInfo[`${prefix}_name`] as string}
                                </span>
                            </div>
                            <motion.button
                                type="button"
                                onClick={() => {
                                    setEmailValidated(false);
                                    setEmailError("");
                                    setMemberInfo((prev: T) => ({
                                        ...prev,
                                        [`${prefix}_email`]: "",
                                        [`${prefix}_name`]: "",
                                        [`${prefix}_user_id`]: 0,
                                        [`${prefix}_nik`]: "",
                                        [`original_${prefix}_nik`]: "",
                                        [`${prefix}_category`]: "",
                                        [`${prefix}_domicile`]: "",
                                    }));
                                    setNikValidated(false);
                                    setNikError("");
                                }}
                                className="text-sm text-blue-400 hover:text-blue-300 flex items-center transition-colors duration-200 justify-center sm:justify-start"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                Change email
                            </motion.button>
                        </motion.div>
                    )}

                    {emailError && (
                        <motion.div
                            className="text-red-400 text-sm mt-2 flex items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: "spring" as const,
                                stiffness: 100,
                            }}
                        >
                            <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {emailError}
                        </motion.div>
                    )}

                    {errors[`${prefix}_email`] && (
                        <motion.div
                            className="text-red-400 text-sm mt-2 flex items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: "spring" as const,
                                stiffness: 100,
                            }}
                        >
                            <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {errors[`${prefix}_email`]}
                        </motion.div>
                    )}

                    {!emailValidated && !emailError && (
                        <div className="text-gray-400 text-xs mt-2 flex items-center">
                            <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            The team member must have an existing account on our
                            platform. They cannot be already registered for
                            Hacksphere and cannot be you.
                        </div>
                    )}
                </motion.div>

                {emailValidated && (
                    <motion.div
                        className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-lg border border-green-700/50 shadow-lg relative overflow-hidden"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-b from-green-500/20 to-transparent rounded-full -mr-12 -mt-12 opacity-30" />
                        <p className="text-sm text-green-300 flex items-center">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <strong className="mr-1">Verified Member:</strong>
                            <span className="font-medium text-white">
                                {memberInfo[`${prefix}_name`] as string}
                            </span>
                        </p>
                    </motion.div>
                )}

                <motion.div
                    className="mb-6 relative group"
                    variants={itemVariants}
                >
                    <label
                        htmlFor={`${prefix}_nik`}
                        className="block text-sm font-medium text-blue-300 mb-2"
                    >
                        NIK (National Identity Number)
                    </label>
                    <div className="relative px-0 sm:px-0">
                        <input
                            id={`${prefix}_nik`}
                            name={`${prefix}_nik`}
                            type="text"
                            value={memberInfo[`${prefix}_nik`] as string}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg bg-gray-800/60 text-white border ${
                                nikError
                                    ? "border-red-400"
                                    : nikValidated
                                    ? "border-green-500"
                                    : "border-gray-700"
                            } focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 shadow-lg transition-all duration-300 disabled:opacity-70`}
                            required
                            maxLength={16}
                            minLength={16}
                            disabled={!emailValidated}
                            placeholder="16-digit NIK"
                            onBlur={() => {
                                const nik = memberInfo[
                                    `${prefix}_nik`
                                ] as string;
                                if (
                                    nik &&
                                    nik.length === 16 &&
                                    !nikValidated &&
                                    !isNikValidating
                                ) {
                                    validateNik();
                                }
                            }}
                        />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-50 pointer-events-none transition-opacity duration-300" />

                        {isNikValidating && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <svg
                                    className="animate-spin h-5 w-5 text-blue-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            </div>
                        )}

                        {nikValidated && !isNikValidating && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                        )}
                    </div>

                    {nikError && (
                        <motion.div
                            className="text-red-400 text-sm mt-2 flex items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: "spring" as const,
                                stiffness: 100,
                            }}
                        >
                            <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {nikError}
                        </motion.div>
                    )}

                    {errors[`${prefix}_nik`] && (
                        <motion.div
                            className="text-red-400 text-sm mt-2 flex items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: "spring" as const,
                                stiffness: 100,
                            }}
                        >
                            <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {errors[`${prefix}_nik`]}
                        </motion.div>
                    )}

                    {nikValidated && (
                        <motion.div
                            className="text-green-400 text-sm mt-2 flex items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: "spring" as const,
                                stiffness: 100,
                            }}
                        >
                            <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            NIK is valid and unique
                        </motion.div>
                    )}

                    <div className="text-xs text-gray-400 mt-2 flex items-center">
                        <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Enter the 16-digit NIK without spaces
                    </div>
                </motion.div>

                <motion.div
                    className="mb-6 relative group"
                    variants={itemVariants}
                >
                    <label
                        htmlFor={`${prefix}_category`}
                        className="block text-sm font-medium text-blue-300 mb-2"
                    >
                        Category
                    </label>
                    <div className="relative">
                        <select
                            id={`${prefix}_category`}
                            name={`${prefix}_category`}
                            value={memberInfo[`${prefix}_category`] as string}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg appearance-none bg-gray-800/60 text-white border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 shadow-lg transition-all duration-300 disabled:opacity-70"
                            required
                            disabled={!emailValidated}
                        >
                            <option value="">Select category</option>
                            <option value="high_school">High School</option>
                            <option value="university">University</option>
                            <option value="non_academic">Non-Academic</option>
                        </select>
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-50 pointer-events-none transition-opacity duration-300" />

                        {/* Dropdown arrow */}
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                ></path>
                            </svg>
                        </div>
                    </div>

                    {errors[`${prefix}_category`] && (
                        <motion.div
                            className="text-red-400 text-sm mt-2 flex items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: "spring" as const,
                                stiffness: 100,
                            }}
                        >
                            <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {errors[`${prefix}_category`]}
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    className="mb-8 relative group"
                    variants={itemVariants}
                >
                    <label
                        htmlFor={`${prefix}_domicile`}
                        className="block text-sm font-medium text-blue-300 mb-2"
                    >
                        Domicile (City/Region)
                    </label>
                    <div className="relative">
                        <input
                            id={`${prefix}_domicile`}
                            name={`${prefix}_domicile`}
                            type="text"
                            value={memberInfo[`${prefix}_domicile`] as string}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800/60 text-white border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 shadow-lg transition-all duration-300 disabled:opacity-70"
                            placeholder="Enter city or region"
                            required
                            disabled={!emailValidated}
                        />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-50 pointer-events-none transition-opacity duration-300" />
                    </div>

                    {errors[`${prefix}_domicile`] && (
                        <motion.div
                            className="text-red-400 text-sm mt-2 flex items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: "spring" as const,
                                stiffness: 100,
                            }}
                        >
                            <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {errors[`${prefix}_domicile`]}
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>

            <motion.div
                className="flex flex-col sm:flex-row justify-between gap-4 mt-8 sm:mt-6"
                variants={itemVariants}
            >
                <motion.button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 order-2 sm:order-1"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
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
                    type="submit"
                    className={`px-6 py-3 text-white rounded-lg shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 order-1 sm:order-2 ${
                        !emailValidated ||
                        isValidating ||
                        !nikValidated ||
                        isNikValidating
                            ? "bg-gray-600 opacity-70 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-purple-600"
                    }`}
                    whileHover={
                        !emailValidated ||
                        isValidating ||
                        !nikValidated ||
                        isNikValidating
                            ? {}
                            : { scale: 1.03 }
                    }
                    whileTap={
                        !emailValidated ||
                        isValidating ||
                        !nikValidated ||
                        isNikValidating
                            ? {}
                            : { scale: 0.98 }
                    }
                    disabled={
                        !emailValidated ||
                        isValidating ||
                        !nikValidated ||
                        isNikValidating
                    }
                >
                    Next
                    <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
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
        </motion.form>
    );
}

// Cast the component to allow it to work with specific member info types
export default TeamMemberStep as unknown as <T extends AnyMemberInfo>(
    props: TeamMemberStepProps<T>
) => React.ReactElement;
