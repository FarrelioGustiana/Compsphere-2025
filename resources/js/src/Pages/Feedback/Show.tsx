import React from "react";
import { Head, Link } from "@inertiajs/react";
import { 
    ArrowLeft, 
    Calendar, 
    Tag, 
    Flag, 
    MessageSquare, 
    CheckCircle,
    Clock,
    AlertCircle,
    X,
    User
} from "lucide-react";

interface Feedback {
    id: number;
    subject: string;
    message: string;
    category: string;
    priority: string;
    status: string;
    admin_notes?: string;
    user?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    };
    resolved_by?: {
        id: number;
        first_name: string;
        last_name: string;
    };
    created_at: string;
    resolved_at?: string;
}

interface FeedbackShowProps {
    feedback: Feedback;
}

export default function Show({ feedback }: FeedbackShowProps) {
    const categories = [
        { value: "general", label: "General Feedback" },
        { value: "bug_report", label: "Bug Report" },
        { value: "feature_request", label: "Feature Request" },
        { value: "event_feedback", label: "Event Feedback" },
        { value: "technical_issue", label: "Technical Issue" },
        { value: "other", label: "Other" },
    ];

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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "new": return <AlertCircle className="w-5 h-5" />;
            case "in_progress": return <Clock className="w-5 h-5" />;
            case "resolved": return <CheckCircle className="w-5 h-5" />;
            case "closed": return <X className="w-5 h-5" />;
            default: return <MessageSquare className="w-5 h-5" />;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Head title={`Feedback: ${feedback.subject} - Compsphere 2025`} />

            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
            <div className="fixed inset-0 bg-[url('/images/grid.svg')] opacity-10" />

            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/feedback/my-feedback"
                                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-400" />
                            </Link>
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-blue-500/20 rounded-lg">
                                    <MessageSquare className="w-8 h-8 text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">
                                        Feedback Details
                                    </h1>
                                    <p className="text-gray-400">
                                        #{feedback.id} • Submitted {new Date(feedback.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="space-y-6">
                            {/* Status Banner */}
                            <div className={`rounded-lg p-4 border ${getStatusColor(feedback.status)}`}>
                                <div className="flex items-center space-x-3">
                                    {getStatusIcon(feedback.status)}
                                    <div>
                                        <h3 className="font-medium">
                                            Status: {feedback.status.replace('_', ' ').toUpperCase()}
                                        </h3>
                                        <p className="text-sm opacity-80">
                                            {feedback.status === 'new' && 'Your feedback has been received and is awaiting review.'}
                                            {feedback.status === 'in_progress' && 'Your feedback is being reviewed by our team.'}
                                            {feedback.status === 'resolved' && 'Your feedback has been addressed and resolved.'}
                                            {feedback.status === 'closed' && 'This feedback has been closed.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback Content */}
                            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <h2 className="text-2xl font-semibold text-white">
                                        {feedback.subject}
                                    </h2>
                                    <div className="flex items-center space-x-2">
                                        <Flag className={`w-4 h-4 ${getPriorityColor(feedback.priority)}`} />
                                        <span className={`text-sm ${getPriorityColor(feedback.priority)} capitalize`}>
                                            {feedback.priority} Priority
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-800 text-gray-300 border border-gray-700">
                                        <Tag className="w-4 h-4 mr-2" />
                                        {categories.find(c => c.value === feedback.category)?.label}
                                    </span>
                                </div>

                                <div className="prose prose-invert max-w-none">
                                    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                                        <h4 className="text-lg font-medium text-white mb-3">Your Message</h4>
                                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                            {feedback.message}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Response */}
                            {(feedback.admin_notes || feedback.resolved_at) && (
                                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-blue-400" />
                                        Admin Response
                                    </h3>

                                    {feedback.admin_notes && (
                                        <div className="mb-4">
                                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                                <p className="text-gray-300 whitespace-pre-wrap">
                                                    {feedback.admin_notes}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {feedback.resolved_at && feedback.resolved_by && (
                                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                                <div>
                                                    <p className="text-green-400 font-medium">
                                                        Resolved by {feedback.resolved_by.first_name} {feedback.resolved_by.last_name}
                                                    </p>
                                                    <p className="text-green-300 text-sm">
                                                        {new Date(feedback.resolved_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Feedback Info */}
                            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    Feedback Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Submitted</p>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <p className="text-gray-300">
                                                {new Date(feedback.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Feedback ID</p>
                                        <p className="text-gray-300 font-mono">
                                            #{feedback.id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between items-center">
                                <Link
                                    href="/feedback/my-feedback"
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to My Feedback
                                </Link>
                                <Link
                                    href="/feedback"
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300"
                                >
                                    Submit New Feedback
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
