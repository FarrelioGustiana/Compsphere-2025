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
    user?: any; // Added user prop
    isProfileComplete?: boolean | null | string | undefined; // Added profile completeness prop
    isProfileCompleteButNikMissing?: boolean | null | string | undefined; // Added NIK check prop
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
    user,
    isProfileComplete,
    isProfileCompleteButNikMissing,
}: Props) {
    // Format currency for display
    const formatCurrency = (amount: number) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Payment amount
    const paymentAmount = eventRegistration?.payment_amount || 100025;
    const formattedPayment = formatCurrency(paymentAmount);

    console.log(eventRegistration);

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
            {eventRegistration?.registration_status === "pending" ||
            eventRegistration?.registration_status === "registered" ? (
                <motion.div
                    className={`bg-gradient-to-br ${
                        eventRegistration?.registration_status ===
                            "registered" &&
                        eventRegistration?.payment_status === "paid"
                            ? "from-green-900/30 to-blue-900/30 border border-green-700/50"
                            : "from-yellow-900/30 to-blue-900/30 border border-yellow-700/50"
                    } rounded-xl p-6 sm:p-8 shadow-lg gap-6`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <div
                            className={`${
                                eventRegistration?.registration_status ===
                                    "registered" &&
                                eventRegistration?.payment_status === "paid"
                                    ? "bg-green-500/20"
                                    : "bg-yellow-500/20"
                            } p-3 sm:p-4 rounded-full flex-shrink-0`}
                        >
                            {eventRegistration?.registration_status ===
                                "registered" &&
                            eventRegistration?.payment_status === "paid" ? (
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
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            )}
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-blue-300">
                                {eventRegistration?.registration_status ===
                                    "registered" &&
                                eventRegistration?.payment_status === "paid"
                                    ? "Registration Approved!"
                                    : eventRegistration?.registration_status ===
                                          "registered" &&
                                      eventRegistration?.payment_status ===
                                          "pending"
                                    ? "Payment Verification Required"
                                    : "Waiting for Approval"}
                            </h3>
                            <p className="text-gray-300 text-sm sm:text-base">
                                {eventRegistration?.registration_status ===
                                    "registered" &&
                                eventRegistration?.payment_status === "paid"
                                    ? "Congratulations! Your registration has been approved. Get ready for an exciting hackathon experience!"
                                    : eventRegistration?.registration_status ===
                                          "registered" &&
                                      eventRegistration?.payment_status ===
                                          "pending"
                                    ? "Your team registration is complete, but payment verification is still required to access all Hacksphere features."
                                    : "Thank you for registering for Hacksphere. We'll send you more details via email as the event approaches."}
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
                                    <div className="bg-amber-500/20 p-3 sm:p-4 rounded-full flex-shrink-0">
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
                                            Your team's payment status is currently{" "}
                                            <span className="text-yellow-400 font-medium">
                                                Pending Verification
                                            </span>
                                            . Please complete the team payment of{" "}
                                            <span className="font-semibold">
                                                IDR {formattedPayment}
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
                                            <strong>Important:</strong>
                                            Only one payment of IDR {formattedPayment} is required per team
                                        </span>
                                    </p>
                                    <p className="text-sm sm:text-base">
                                        Remember to include your team name in your payment proof message.
                                        This is a one-time payment for the entire team.
                                    </p>
                                </div>

                                <a
                                    href="https://wa.me/6285693230231?text=Hello%2C%20I%20want%20to%20submit%20my%20payment%20proof%20for%20Hacksphere%20registration."
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
                        eventRegistration.payment_status === "paid" &&
                        eventRegistration.registration_status === "pending" && (
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
                                    <div className="bg-green-500/20 p-2 rounded-full mr-3">
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
                                            Your team's payment of{" "}
                                            <span className="font-semibold">
                                                IDR {formattedPayment}
                                            </span>{" "}
                                            has been{" "}
                                            <span className="text-green-400 font-medium">
                                                Verified
                                            </span>
                                            !
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        

                    {/* Discord Invitation Section - Only shown when payment is verified */}
                    {eventRegistration &&
                        eventRegistration.payment_status === "paid" && (
                            <motion.div
                                className="mt-6 bg-gradient-to-br from-indigo-900/20 to-blue-800/20 border border-indigo-600/50 rounded-xl p-4 sm:p-6 shadow-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.3,
                                    duration: 0.5,
                                }}
                            >
                                <div className="flex flex-col space-y-4">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="bg-indigo-500/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" 
                                                viewBox="0 0 127.14 96.36" 
                                                fill="currentColor"
                                            >
                                                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-lg sm:text-xl font-bold mb-1 text-indigo-400">
                                                Discord Community
                                            </h4>
                                            <p className="text-gray-300 text-sm sm:text-base">
                                                Join our Discord server to connect with fellow participants, get important announcements, and access exclusive resources for Hacksphere.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700/50 mb-4">
                                        <p className="flex items-start text-sm sm:text-base">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-indigo-500 flex-shrink-0 mt-0.5"
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
                                                <strong>
                                                    Team Leaders:
                                                </strong>{" "}
                                                Please share this invitation link with all your team members so everyone can join our Discord community.
                                            </span>
                                        </p>
                                    </div>

                                    <div className="flex flex-col space-y-3">
                                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                                            <a
                                                href="https://discord.com/invite/ApD3shP5cr"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-700 to-blue-800 hover:from-indigo-600 hover:to-blue-700 text-white rounded-lg text-sm transition duration-300"
                                            >
                                                <svg 
                                                    className="w-5 h-5 mr-2" 
                                                    viewBox="0 0 127.14 96.36" 
                                                    fill="currentColor"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                                                </svg>
                                                Join Discord Server
                                            </a>
                                        </div>

                                        <div className="mt-2 px-4 py-3 rounded-lg flex items-start bg-blue-900/30 text-blue-400 border border-blue-700/30">
                                            <svg
                                                className="h-5 w-5 mr-2 flex-shrink-0"
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
                                            <span>
                                                Get timely updates, technical resources, and connect with others participants in our Discord community!
                                            </span>
                                        </div>
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

                        {user ? (
                            <div className="space-y-4 w-full">
                                {isProfileComplete && (
                                    <button
                                        onClick={handleRegisterClick}
                                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
                                    >
                                        Register Your Team
                                    </button>
                                )}

                                {/* Profile warning and button for incomplete profile */}
                                {!isProfileComplete && !isRegistered && (
                                    <div className="mt-4 space-y-4">
                                        <div className="bg-yellow-500/20 text-yellow-300 p-4 rounded-lg border border-yellow-700/30 text-sm">
                                            <p>
                                                Please complete your profile
                                                before registering for
                                                Hacksphere.
                                            </p>
                                        </div>
                                        <div>
                                            <a
                                                href={route(
                                                    "participant.profile"
                                                )}
                                                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md flex items-center justify-center gap-2 transition-all duration-300"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                                </svg>
                                                Complete Your Profile
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-blue-500/20 text-blue-300 p-4 rounded-lg border border-blue-700/30 text-sm">
                                    <p>
                                        You need to log in or register before
                                        you can participate in Hacksphere.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a
                                        href={route("login")}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md flex items-center justify-center gap-2 transition-all duration-300"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Login
                                    </a>
                                    <a
                                        href={route("register")}
                                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md flex items-center justify-center gap-2 transition-all duration-300"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                        </svg>
                                        Register
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

export default RegistrationSection;
