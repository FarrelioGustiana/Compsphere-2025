import React, { useState, useEffect } from "react";
import { X, MessageSquare } from "lucide-react";

interface FeedbackFloatingModalProps {
    storageKey?: string;
}

const FeedbackFloatingModal: React.FC<FeedbackFloatingModalProps> = ({
    storageKey = "compsphere_feedback_modal_shown",
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Show modal after a short delay every time the page loads
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
        }, 300);
    };

    const handleGoToFeedback = () => {
        window.location.href = "/feedback";
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
                className={`pointer-events-auto relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${
                    isClosing
                        ? "opacity-0 scale-95"
                        : "opacity-100 scale-100 animate-fadeIn"
                }`}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="p-6 sm:p-8">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full">
                            <MessageSquare className="w-12 h-12 text-blue-400" />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="text-center space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white">
                            Hii 👋
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                            uhmm... Since our event has ended{" "}
                            <span className="text-gray-400 italic">
                                (tbh, even the developer can't hold back how sad this is)
                            </span>
                            , We really really hope you can give your{" "}
                            <span className="text-blue-400 font-semibold">
                                impressions
                            </span>{" "}
                            for this event or even{" "}
                            <span className="text-purple-400 font-semibold">
                                criticism and suggestions
                            </span>{" "}
                            for our event. Thank youuu 👋
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleGoToFeedback}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                            Share Feedback
                        </button>
                        <button
                            onClick={handleClose}
                            className="flex-1 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white font-medium rounded-lg transition-all duration-200"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-1 -right-1 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-1 -left-1 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl" />
            </div>

            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm -z-10 transition-opacity duration-300 ${
                    isClosing ? "opacity-0" : "opacity-100"
                }`}
                onClick={handleClose}
            />
        </div>
    );
};

export default FeedbackFloatingModal;
