import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { MessageSquare, Send, User, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { User as UserType } from "@/types/models";
import { route } from "ziggy-js";

interface FeedbackCreateProps {
    user?: UserType;
}

interface FeedbackForm {
    subject: string;
    message: string;
    category: string;
    name?: string;
    email?: string;
    [key: string]: any;
}

export default function Create({ user }: FeedbackCreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        subject: "",
        message: "",
        category: "general",
        name: user ? "" : "",
        email: user ? "" : "",
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const categories = [
        { value: "general", label: "General Feedback" },
        { value: "bug_report", label: "Bug Report" },
        { value: "feature_request", label: "Feature Request" },
        { value: "event_feedback", label: "Event Feedback" },
        { value: "technical_issue", label: "Technical Issue" },
        { value: "other", label: "Other" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Log the data being submitted
        console.log('Form data being submitted:', {
            subject: data.subject,
            message: data.message,
            category: data.category,
            name: data.name,
            email: data.email
        });
        
        post(route("feedback.store"), {
            onSuccess: () => {
                console.log('Feedback submission successful');
                setShowSuccess(true);
                reset();
                setTimeout(() => setShowSuccess(false), 5000);
            },
            onError: (errors) => {
                console.error('Feedback submission failed:', errors);
                
                // Log all form data and errors for debugging
                console.log('Form data at time of error:', data);
                console.log('Error details:', errors);
                
                // Show detailed error message
                if (errors.error) {
                    alert(`Error: ${errors.error}`);
                } else {
                    const errorMessages = Object.values(errors).join('\n');
                    alert(`Failed to submit feedback: \n${errorMessages}`);
                }
            },
        });
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Head title="Feedback - Compsphere 2025" />

            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
            <div className="fixed inset-0 bg-[url('/images/grid.svg')] opacity-10" />

            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <MessageSquare className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Share Your Feedback
                                </h1>
                                <p className="text-gray-400 mt-1">
                                    Help us improve Compsphere by sharing your thoughts and suggestions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Success Message */}
                        {showSuccess && (
                            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center space-x-3">
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <div>
                                    <p className="text-green-400 font-medium">
                                        Thank you for your feedback!
                                    </p>
                                    <p className="text-green-300 text-sm">
                                        We will review it and get back to you if needed.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Feedback Form */}
                            <div className="lg:col-span-2">
                                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* User Info (for anonymous users) */}
                                        {!user && (
                                            <div>
                                                <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                                    <p className="text-blue-400 text-sm">
                                                        <AlertCircle className="w-4 h-4 inline mr-2" />
                                                        You can submit feedback anonymously. Name and email are optional but helpful if you want us to follow up with you.
                                                    </p>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        <User className="w-4 h-4 inline mr-2" />
                                                        Your Name (Optional)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.name || ""}
                                                        onChange={(e) => setData("name", e.target.value)}
                                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter your name (optional)"
                                                    />
                                                    {errors.name && (
                                                        <p className="mt-1 text-sm text-red-400 flex items-center">
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        <Mail className="w-4 h-4 inline mr-2" />
                                                        Your Email (Optional)
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={data.email || ""}
                                                        onChange={(e) => setData("email", e.target.value)}
                                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter your email (optional)"
                                                    />
                                                    {errors.email && (
                                                        <p className="mt-1 text-sm text-red-400 flex items-center">
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            {errors.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            </div>
                                        )}
                                        
                                        {/* Category */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Category *
                                            </label>
                                            <select
                                                value={data.category}
                                                onChange={(e) => setData("category", e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            >
                                                {categories.map((category) => (
                                                    <option key={category.value} value={category.value}>
                                                        {category.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.category && (
                                                <p className="mt-1 text-sm text-red-400 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    {errors.category}
                                                </p>
                                            )}
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Subject *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.subject}
                                                onChange={(e) => setData("subject", e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Brief description of your feedback"
                                                required
                                            />
                                            {errors.subject && (
                                                <p className="mt-1 text-sm text-red-400 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    {errors.subject}
                                                </p>
                                            )}
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Message *
                                            </label>
                                            <textarea
                                                value={data.message}
                                                onChange={(e) => setData("message", e.target.value)}
                                                rows={6}
                                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                placeholder="Please provide detailed feedback..."
                                                required
                                            />
                                            <div className="flex justify-between items-center mt-2">
                                                <div>
                                                    {errors.message && (
                                                        <p className="text-sm text-red-400 flex items-center">
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            {errors.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {data.message.length} characters (minimum 10)
                                                </p>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Send Feedback
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* User Info */}
                                {user && (
                                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">
                                            Submitting as
                                        </h3>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-medium">
                                                    {user.first_name[0]}{user.last_name[0]}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">
                                                    {user.first_name} {user.last_name}
                                                </p>
                                                <p className="text-gray-400 text-sm">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        {user && (
                                            <div className="mt-4 pt-4 border-t border-gray-700">
                                                <a
                                                    href={route("feedback.index")}
                                                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                                                >
                                                    View my previous feedback →
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Guidelines */}
                                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">
                                        Feedback Guidelines
                                    </h3>
                                    <ul className="space-y-3 text-sm text-gray-300">
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-400 mt-1">•</span>
                                            <span>Be specific and constructive in your feedback</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-400 mt-1">•</span>
                                            <span>Include steps to reproduce bugs if applicable</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-400 mt-1">•</span>
                                            <span>Suggest improvements for feature requests</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-400 mt-1">•</span>
                                            <span>Be respectful and professional</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Contact Info */}
                                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">
                                        Need Immediate Help?
                                    </h3>
                                    <p className="text-gray-300 text-sm mb-4">
                                        For urgent issues, you can also contact us directly:
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-gray-400">
                                            <Mail className="w-4 h-4 inline mr-2" />
                                            contact@compsphere.id
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
