import React from "react";
import { Head, Link } from "@inertiajs/react";
import { MessageSquare, Calendar, Tag, Flag, Eye, Plus, ArrowLeft } from "lucide-react";

interface Feedback {
    id: number;
    subject: string;
    message: string;
    category: string;
    priority: string;
    status: string;
    created_at: string;
    resolved_at?: string;
}

interface FeedbackIndexProps {
    feedback: {
        data: Feedback[];
        links: any[];
        meta: any;
    };
}

export default function Index({ feedback }: FeedbackIndexProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "new": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "in_progress": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
            case "resolved": return "bg-green-500/20 text-green-400 border-green-500/30";
            case "closed": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
            default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "text-red-400";
            case "medium": return "text-yellow-400";
            case "low": return "text-green-400";
            default: return "text-gray-400";
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Head title="My Feedback - Compsphere 2025" />

            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
            <div className="fixed inset-0 bg-[url('/images/grid.svg')] opacity-10" />

            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/"
                                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-400" />
                                </Link>
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-blue-500/20 rounded-lg">
                                        <MessageSquare className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                            My Feedback
                                        </h1>
                                        <p className="text-gray-400 mt-1">
                                            Track your submitted feedback and responses
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Link
                                href="/feedback"
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Feedback
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {feedback.data.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                    <MessageSquare className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-300 mb-2">
                                    No feedback yet
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    You haven't submitted any feedback. Share your thoughts to help us improve!
                                </p>
                                <Link
                                    href="/feedback"
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Submit Feedback
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {feedback.data.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-white mb-2">
                                                    {item.subject}
                                                </h3>
                                                <p className="text-gray-400 line-clamp-2">
                                                    {item.message}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2 ml-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                                    {item.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-1">
                                                    <Tag className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-400 capitalize">
                                                        {item.category.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Flag className={`w-4 h-4 ${getPriorityColor(item.priority)}`} />
                                                    <span className={`text-sm ${getPriorityColor(item.priority)} capitalize`}>
                                                        {item.priority}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-400">
                                                        {new Date(item.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/feedback/my-feedback/${item.id}`}
                                                className="inline-flex items-center px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination */}
                                {feedback.meta.links && (
                                    <div className="flex items-center justify-between pt-6">
                                        <div className="text-sm text-gray-400">
                                            Showing {feedback.meta.from} to {feedback.meta.to} of {feedback.meta.total} results
                                        </div>
                                        <div className="flex space-x-1">
                                            {feedback.meta.links.map((link: any, index: number) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || "#"}
                                                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                                        link.active
                                                            ? "bg-blue-500 text-white"
                                                            : link.url
                                                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                                            : "bg-gray-900 text-gray-500 cursor-not-allowed"
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
