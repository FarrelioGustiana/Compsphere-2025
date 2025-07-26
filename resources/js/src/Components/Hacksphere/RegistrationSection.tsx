import React from "react";
import { motion, AnimatePresence, easeOut, Variants } from "framer-motion";
import {
    Event,
    EventRegistration as EventRegistrationModel,
} from "@/types/models";
import { route } from "ziggy-js";
import { InertiaFormProps } from "@inertiajs/react";

type Props = {
    fadeInUpVariant: Variants;
    isRegistered: boolean;
    eventRegistration?: EventRegistrationModel;
    event: Event;
    showTwibbonEditMode: boolean;
    setShowTwibbonEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    twibbonForm: InertiaFormProps<{
        twibbon_link: string;
    }>;
    twibbonMessage: {
        type: "success" | "error";
        text: string;
    } | null;
    setTwibbonMessage: React.Dispatch<
        React.SetStateAction<{
            type: "success" | "error";
            text: string;
        } | null>
    >;
    showNikForm: boolean;
    setShowNikForm: React.Dispatch<React.SetStateAction<boolean>>;
    handleNikSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    processing: boolean;
    errors: Record<string, string>;
    handleRegisterClick: () => void;
    data: Record<string, string>;
    setData: (key: string, value: any) => void;
};

function RegistrationSection({
    fadeInUpVariant,
    isRegistered,
    eventRegistration,
    event,
    showTwibbonEditMode,
    setShowTwibbonEditMode,
    twibbonForm,
    twibbonMessage,
    setTwibbonMessage,
    showNikForm,
    setShowNikForm,
    handleNikSubmit,
    processing,
    errors,
    handleRegisterClick,
    data,
    setData,
}: Props) {
    return (
        <motion.div
            className="mb-12 sm:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
            variants={fadeInUpVariant}
        >
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Registration
            </h2>
            {isRegistered ? (
                <motion.div
                    className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border border-green-700/50 rounded-xl p-6 sm:p-8 shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
                        <div className="bg-green-500/20 p-3 sm:p-4 rounded-full flex-shrink-0">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 sm:h-12 sm:w-12 text-green-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-blue-300">
                                You're Registered!
                            </h3>
                            <p className="text-gray-300 text-sm sm:text-base">
                                Thank you for registering for Hacksphere. We'll
                                send you more details via email as the event
                                approaches.
                            </p>
                        </div>
                    </div>

                    {/* Payment information for registered users */}
                    {eventRegistration &&
                        eventRegistration.payment_status === "pending" && (
                            <motion.div
                                className="mt-6 bg-gradient-to-br from-amber-800/20 to-amber-900/20 border border-amber-600/50 rounded-xl p-4 sm:p-6 shadow-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.3,
                                    duration: 0.5,
                                }}
                            >
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4">
                                    <div className="bg-amber-500/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 sm:h-10 sm:w-10 text-amber-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h4 className="text-lg sm:text-xl font-bold mb-2 text-amber-400">
                                            Payment Required
                                        </h4>
                                        <p className="mb-2 text-gray-300 text-sm sm:text-base">
                                            Your payment status is currently{" "}
                                            <span className="text-yellow-400 font-medium">
                                                Pending Verification
                                            </span>
                                            . Please complete your payment of{" "}
                                            <span className="font-semibold">
                                                IDR 150,000
                                            </span>{" "}
                                            and send proof via WhatsApp.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700/50 mb-4 sm:mb-6">
                                    <p className="mb-2 flex items-start text-sm sm:text-base">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5"
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
                                        <span>
                                            <strong>Important:</strong> Each
                                            team member must pay IDR 150,000
                                            individually.
                                        </span>
                                    </p>
                                    <p className="text-sm sm:text-base">
                                        Remember to include your name and team
                                        name in your payment proof message.
                                    </p>
                                </div>

                                <a
                                    href="https://wa.me/6281234567890?text=Hello%2C%20I%20want%20to%20submit%20my%20payment%20proof%20for%20Hacksphere%20registration."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 text-sm sm:text-base"
                                >
                                    <svg
                                        className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                    >
                                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                    </svg>
                                    Send Payment Proof via WhatsApp
                                </a>
                            </motion.div>
                        )}

                    {eventRegistration &&
                        eventRegistration.payment_status === "paid" && (
                            <motion.div
                                className="mt-6 bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-600/50 rounded-xl p-4 sm:p-6 shadow-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.3,
                                    duration: 0.5,
                                }}
                            >
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="bg-green-500/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 sm:h-8 sm:w-8 text-green-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg sm:text-xl font-bold mb-1 text-green-400">
                                            Payment Complete
                                        </h4>
                                        <p className="text-gray-300 text-sm sm:text-base">
                                            Your payment of{" "}
                                            <span className="font-semibold">
                                                IDR 150,000
                                            </span>{" "}
                                            has been{" "}
                                            <span className="text-green-400 font-medium">
                                                Verified
                                            </span>
                                            . Thank you for completing your
                                            registration!
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    {/* Twibbon Input Section */}
                    {eventRegistration && (
                        <motion.div
                            className="mt-6 bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/50 rounded-xl p-4 sm:p-6 shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.3,
                                duration: 0.5,
                            }}
                        >
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="bg-purple-500/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400"
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
                                    <div>
                                        <h4 className="text-lg sm:text-xl font-bold mb-1 text-purple-400">
                                            Twibbon Upload
                                        </h4>
                                        <p className="text-gray-300 text-sm sm:text-base">
                                            Upload your twibbon link to complete
                                            your registration process. This step
                                            is optional and can be completed
                                            later.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700/50 mb-4">
                                    <p className="flex items-start text-sm sm:text-base">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-500 flex-shrink-0 mt-0.5"
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
                                        <span>
                                            <strong>Twibbon Template:</strong>{" "}
                                            Download our official twibbon
                                            template, apply it to your profile
                                            picture, and upload it to your
                                            Instagram. Then paste the link here.
                                        </span>
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-3">
                                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                                        <a
                                            href="/assets/hacksphere/twibbon-template.png"
                                            target="_blank"
                                            className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg text-sm transition duration-300"
                                            download
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
                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                />
                                            </svg>
                                            Download Twibbon Template
                                        </a>
                                    </div>

                                    {/* Conditional rendering based on whether twibbon link exists */}
                                    {eventRegistration &&
                                    eventRegistration.twibbon_link ? (
                                        <div className="flex items-center bg-green-900/20 p-3 border border-green-600/30 rounded-lg">
                                            <div className="bg-green-500/20 p-2 rounded-full mr-3">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-green-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-medium text-green-400">
                                                    Twibbon Uploaded
                                                </p>
                                                <a
                                                    href={
                                                        eventRegistration.twibbon_link
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-400 hover:underline truncate block"
                                                >
                                                    {
                                                        eventRegistration.twibbon_link
                                                    }
                                                </a>
                                            </div>
                                            <button
                                                type="button"
                                                className="px-3 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-white text-sm rounded-lg transition duration-300"
                                                onClick={() =>
                                                    setShowTwibbonEditMode(true)
                                                }
                                            >
                                                Change
                                            </button>
                                        </div>
                                    ) : (
                                        <form
                                            className="flex flex-col sm:flex-row items-stretch gap-3"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                twibbonForm.post(
                                                    route(
                                                        "participant.events.update-twibbon",
                                                        {
                                                            eventId: event.id,
                                                        }
                                                    ),
                                                    {
                                                        onSuccess: () => {
                                                            setTwibbonMessage({
                                                                type: "success",
                                                                text: "Twibbon link uploaded successfully!",
                                                            });
                                                            setShowTwibbonEditMode(
                                                                false
                                                            );
                                                            setTimeout(() => {
                                                                setTwibbonMessage(
                                                                    null
                                                                );
                                                            }, 5000);
                                                        },
                                                        onError: () => {
                                                            setTwibbonMessage({
                                                                type: "error",
                                                                text: "Failed to upload twibbon link. Please try again.",
                                                            });
                                                            setTimeout(() => {
                                                                setTwibbonMessage(
                                                                    null
                                                                );
                                                            }, 5000);
                                                        },
                                                    }
                                                );
                                            }}
                                        >
                                            <div className="flex-grow w-full">
                                                <input
                                                    type="url"
                                                    className="w-full px-4 py-2 h-10 bg-gray-700 border 
                                                border-gray-600 rounded-lg text-white placeholder-gray-400 
                                                focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    placeholder="https://www.instagram.com/p/..."
                                                    value={
                                                        twibbonForm.data
                                                            .twibbon_link
                                                    }
                                                    onChange={(e) =>
                                                        twibbonForm.setData(
                                                            "twibbon_link",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                                {twibbonForm.errors
                                                    .twibbon_link && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {
                                                            twibbonForm.errors
                                                                .twibbon_link
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    className="px-4 h-10 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg shadow-lg transition duration-300 flex-shrink-0"
                                                    disabled={
                                                        twibbonForm.processing
                                                    }
                                                >
                                                    {twibbonForm.processing ? (
                                                        <span className="flex items-center">
                                                            <svg
                                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                                            Processing
                                                        </span>
                                                    ) : (
                                                        "Upload"
                                                    )}
                                                </button>
                                                {showTwibbonEditMode && (
                                                    <button
                                                        type="button"
                                                        className="px-4 h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition duration-300 flex-shrink-0"
                                                        onClick={() => {
                                                            setShowTwibbonEditMode(
                                                                false
                                                            );
                                                            twibbonForm.reset();
                                                            twibbonForm.clearErrors();
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    )}

                                    {twibbonMessage && (
                                        <div
                                            className={`mt-2 px-3 py-2 rounded-lg text-sm ${
                                                twibbonMessage.type ===
                                                "success"
                                                    ? "bg-green-900/30 text-green-400"
                                                    : "bg-red-900/30 text-red-400"
                                            }`}
                                        >
                                            {twibbonMessage.text}
                                        </div>
                                    )}

                                    <p className="text-sm text-gray-400 italic">
                                        {eventRegistration &&
                                        eventRegistration.twibbon_link &&
                                        !showTwibbonEditMode
                                            ? "You can update your twibbon link at any time by clicking 'Change'."
                                            : "You can upload your twibbon link at any time."}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            ) : showNikForm ? (
                <motion.div
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 sm:p-8 border border-blue-900/30 shadow-xl max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-blue-300">
                        Complete Your Profile
                    </h3>
                    <p className="mb-6 text-gray-300 text-sm sm:text-base">
                        Please provide your NIK (National Identity Number) to
                        complete your registration.
                    </p>
                    <form onSubmit={handleNikSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="nik"
                                className="block text-sm font-medium text-blue-400 mb-2"
                            >
                                NIK (16 digits)
                            </label>
                            <input
                                id="nik"
                                type="text"
                                value={data.nik}
                                onChange={(e) => setData("nik", e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-700/80 text-white border border-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                                required
                                maxLength={16}
                                minLength={16}
                                placeholder="Enter your 16-digit NIK"
                            />
                            {errors.nik && (
                                <div className="text-red-400 text-sm mt-2">
                                    {errors.nik}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowNikForm(false)}
                                className="order-2 sm:order-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="order-1 sm:order-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100 text-sm sm:text-base"
                            >
                                {processing ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 p-6 sm:p-8 rounded-xl border border-blue-700/30 shadow-lg mb-8 max-w-2xl mx-auto">
                        <p className="text-lg sm:text-xl text-gray-300 mb-6">
                            Ready to showcase your skills? Join our hackathon
                            and collaborate with fellow tech enthusiasts to
                            build innovative solutions!
                        </p>

                        <button
                            onClick={handleRegisterClick}
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
                        >
                            Register Your Team
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

export default RegistrationSection;
