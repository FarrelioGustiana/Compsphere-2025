import React, { useState } from "react";
import { route } from "ziggy-js";
import axios from "axios";

interface TeamMemberStepProps<T extends Record<string, string | number>> {
    memberInfo: T;
    setMemberInfo: React.Dispatch<React.SetStateAction<T>>;
    nextStep: () => void;
    prevStep: () => void;
    errors: any;
    memberNumber: number;
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
}: TeamMemberStepProps<T>) {
    const [isValidating, setIsValidating] = useState(false);
    const [emailValidated, setEmailValidated] = useState(false);
    const [emailError, setEmailError] = useState<string>("");

    const prefix = `member${memberNumber}`;

    const handleNewstep = () => {
        setEmailError("");
        setEmailValidated(false);
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
        console.log(name, value, `${prefix}_email`);
        setMemberInfo((prev: T) => ({ ...prev, [name]: value }));

        // Reset validation if email changes
        if (name === `${prefix}_email`) {
            setEmailValidated(false);
            setEmailError("");
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

        console.log(`Validating email for ${prefix}:`, email);

        axios
            .post(route("participant.validate-team-member-email"), { email })
            .then((response) => {
                console.log(
                    `Email validation response for ${prefix}:`,
                    response.data
                );
                const data = response.data;

                if (data && data.valid === true && data.user) {
                    // Success case
                    setEmailValidated(true);
                    setEmailError("");
                    setMemberInfo((prev: T) => ({
                        ...prev,
                        [`${prefix}_name`]: data.user.name || "",
                        [`${prefix}_user_id`]: data.user.member_user_id || 0,
                        [`${prefix}_nik`]: data.user.nik || "",
                        [`${prefix}_category`]: data.user.category || "",
                        [`${prefix}_domicile`]: data.user.domicile || "",
                        [`${prefix}_email`]: data.user.email || "",
                    }));
                    console.log(`Email validated successfully for ${prefix}`);
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
                    console.log(
                        `Email validation failed for ${prefix}:`,
                        errorMessage
                    );
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailValidated) {
            setEmailError("Please validate the email first");
            return;
        }

        if (
            memberInfo[`${prefix}_email`] &&
            memberInfo[`${prefix}_nik`] &&
            memberInfo[`${prefix}_category`] &&
            memberInfo[`${prefix}_domicile`] &&
            emailValidated
        ) {
            handleNewstep();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                    Step {memberNumber + 1}: Team Member {memberNumber}{" "}
                    Information
                </h3>
                <p className="text-gray-300 mb-4">
                    Please provide information for team member {memberNumber}.
                </p>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address
                    </label>
                    <div className="flex">
                        <input
                            type="email"
                            name={`${prefix}_email`}
                            value={memberInfo[`${prefix}_email`] as string}
                            onChange={handleChange}
                            className={`flex-1 px-3 py-2 rounded-l bg-gray-700 text-white border ${
                                emailError
                                    ? "border-red-500"
                                    : emailValidated
                                    ? "border-green-500"
                                    : "border-gray-600"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            disabled={emailValidated}
                            required
                            placeholder="Enter team member's email"
                        />
                        <button
                            type="button"
                            onClick={validateEmail}
                            disabled={
                                isValidating ||
                                emailValidated ||
                                !memberInfo[`${prefix}_email`]
                            }
                            className={`px-4 py-2 ${
                                emailValidated
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                            } text-white rounded-r transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isValidating ? (
                                <>
                                    <span className="inline-block animate-spin mr-1">
                                        ⟳
                                    </span>
                                    Verifying...
                                </>
                            ) : emailValidated ? (
                                "Verified"
                            ) : (
                                "Verify"
                            )}
                        </button>
                    </div>
                    {emailValidated && (
                        <div className="flex items-center justify-between">
                            <div className="text-green-500 text-sm mt-1">
                                Email verified! User:{" "}
                                {memberInfo[`${prefix}_name`] as string}
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmailValidated(false);
                                    setEmailError("");
                                    setMemberInfo((prev: T) => ({
                                        ...prev,
                                        [`${prefix}_email`]: "",
                                        [`${prefix}_name`]: "",
                                        [`${prefix}_user_id`]: 0,
                                    }));
                                }}
                                className="text-xs text-blue-400 hover:text-blue-500"
                            >
                                Change email
                            </button>
                        </div>
                    )}
                    {emailError && (
                        <div className="text-red-500 text-sm mt-1">
                            {emailError}
                        </div>
                    )}
                    {errors[`${prefix}_email`] && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors[`${prefix}_email`]}
                        </div>
                    )}
                    {!emailValidated && !emailError && (
                        <div className="text-gray-400 text-xs mt-1">
                            The team member must have an existing account on our
                            platform. They cannot be already registered for
                            Hacksphere and cannot be you.
                        </div>
                    )}
                </div>

                {emailValidated && (
                    <div className="mb-4 p-3 bg-green-900/30 rounded border border-green-700">
                        <p className="text-sm text-green-300">
                            <strong>Verified:</strong>{" "}
                            {memberInfo[`${prefix}_name`] as string}
                        </p>
                    </div>
                )}

                <div className="mb-4">
                    <label
                        htmlFor={`${prefix}_nik`}
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        NIK (National Identity Number)
                    </label>
                    <input
                        id={`${prefix}_nik`}
                        name={`${prefix}_nik`}
                        type="text"
                        value={memberInfo[`${prefix}_nik`] as string}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        maxLength={16}
                        minLength={16}
                        disabled={!emailValidated}
                    />
                    {errors[`${prefix}_nik`] && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors[`${prefix}_nik`]}
                        </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                        Enter the 16-digit NIK without spaces
                    </p>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor={`${prefix}_category`}
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Category
                    </label>
                    <select
                        id={`${prefix}_category`}
                        name={`${prefix}_category`}
                        value={memberInfo[`${prefix}_category`] as string}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!emailValidated}
                    >
                        <option value="">Select category</option>
                        <option value="high_school">High School</option>
                        <option value="university">University</option>
                        <option value="non_academic">Non-Academic</option>
                    </select>
                    {errors[`${prefix}_category`] && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors[`${prefix}_category`]}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor={`${prefix}_domicile`}
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Domicile (City/Region)
                    </label>
                    <input
                        id={`${prefix}_domicile`}
                        name={`${prefix}_domicile`}
                        type="text"
                        value={memberInfo[`${prefix}_domicile`] as string}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!emailValidated}
                    />
                    {errors[`${prefix}_domicile`] && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors[`${prefix}_domicile`]}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                    Previous
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    disabled={!emailValidated || isValidating}
                >
                    Next
                </button>
            </div>
        </form>
    );
}

// Cast the component to allow it to work with specific member info types
export default TeamMemberStep as unknown as <T extends AnyMemberInfo>(
    props: TeamMemberStepProps<T>
) => React.ReactElement;
