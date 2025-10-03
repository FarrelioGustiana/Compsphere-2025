import React, { useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { 
    ArrowLeft, 
    User, 
    Mail, 
    Calendar, 
    Tag, 
    Flag, 
    MessageSquare, 
    Save,
    Trash2,
    CheckCircle,
    Clock,
    AlertCircle,
    X
} from "lucide-react";

interface Feedback {
    id: number;
    subject: string;
    message: string;
    category: string;
    priority: string;
    status: string;
    admin_notes?: string;
    submitter_name: string;
    submitter_email: string;
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
    const [isEditing, setIsEditing] = useState(false);
    
    const { data, setData, put, processing, errors } = useForm({
        status: feedback.status,
        priority: feedback.priority,
        admin_notes: feedback.admin_notes || "",
    });

    const statuses = [
        { value: "new", label: "New", icon: AlertCircle, color: "text-blue-400" },
        { value: "in_progress", label: "In Progress", icon: Clock, color: "text-yellow-400" },
        { value: "resolved", label: "Resolved", icon: CheckCircle, color: "text-green-400" },
        { value: "closed", label: "Closed", icon: X, color: "text-gray-400" },
    ];

    const priorities = [
        { value: "low", label: "Low", color: "text-green-400" },
        { value: "medium", label: "Medium", color: "text-yellow-400" },
        { value: "high", label: "High", color: "text-red-400" },
    ];

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.feedback.update", feedback.id), {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this feedback? This action cannot be undone.")) {
            router.delete(route("admin.feedback.destroy", feedback.id));
        }
    };

    return (
        <DashboardLayout>
            <Head title={`Feedback: ${feedback.subject} - Admin`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <Link
                                href={route("admin.feedback.index")}
                                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-400" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-200">
                                    Feedback Details
                                </h1>
                                <p className="text-gray-400">
                                    #{feedback.id} • Submitted {new Date(feedback.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                {isEditing ? "Cancel" : "Edit"}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Feedback Content */}
                            <div className="bg-gray-800 rounded-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-white">
                                        {feedback.subject}
                                    </h2>
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(feedback.status)}`}>
                                            {feedback.status.replace('_', ' ')}
                                        </span>
                                        <div className="flex items-center">
                                            <Flag className={`w-4 h-4 mr-1 ${getPriorityColor(feedback.priority)}`} />
                                            <span className={`text-sm ${getPriorityColor(feedback.priority)}`}>
                                                {feedback.priority}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300">
                                        <Tag className="w-3 h-3 mr-1" />
                                        {categories.find(c => c.value === feedback.category)?.label}
                                    </span>
                                </div>

                                <div className="prose prose-invert max-w-none">
                                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                            {feedback.message}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Response */}
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                                    Admin Response
                                </h3>

                                {isEditing ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Status
                                                </label>
                                                <select
                                                    value={data.status}
                                                    onChange={(e) => setData("status", e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {statuses.map((status) => (
                                                        <option key={status.value} value={status.value}>
                                                            {status.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.status && (
                                                    <p className="mt-1 text-sm text-red-400">{errors.status}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Priority
                                                </label>
                                                <select
                                                    value={data.priority}
                                                    onChange={(e) => setData("priority", e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {priorities.map((priority) => (
                                                        <option key={priority.value} value={priority.value}>
                                                            {priority.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.priority && (
                                                    <p className="mt-1 text-sm text-red-400">{errors.priority}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Admin Notes
                                            </label>
                                            <textarea
                                                value={data.admin_notes}
                                                onChange={(e) => setData("admin_notes", e.target.value)}
                                                rows={4}
                                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                placeholder="Add internal notes about this feedback..."
                                            />
                                            {errors.admin_notes && (
                                                <p className="mt-1 text-sm text-red-400">{errors.admin_notes}</p>
                                            )}
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4 mr-2" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-400 mb-1">Status</p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium border ${getStatusColor(feedback.status)}`}>
                                                    {feedback.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400 mb-1">Priority</p>
                                                <div className="flex items-center">
                                                    <Flag className={`w-4 h-4 mr-1 ${getPriorityColor(feedback.priority)}`} />
                                                    <span className={`text-sm ${getPriorityColor(feedback.priority)}`}>
                                                        {feedback.priority}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {feedback.admin_notes && (
                                            <div>
                                                <p className="text-sm text-gray-400 mb-2">Admin Notes</p>
                                                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                                                    <p className="text-gray-300 whitespace-pre-wrap">
                                                        {feedback.admin_notes}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {feedback.resolved_at && feedback.resolved_by && (
                                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                                <p className="text-green-400 text-sm">
                                                    <CheckCircle className="w-4 h-4 inline mr-1" />
                                                    Resolved by {feedback.resolved_by.first_name} {feedback.resolved_by.last_name} on {new Date(feedback.resolved_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Submitter Info */}
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    Submitter Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-white font-medium">
                                                {feedback.submitter_name}
                                            </p>
                                            {feedback.user && (
                                                <p className="text-xs text-gray-400">
                                                    Registered User
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <p className="text-gray-300">
                                            {feedback.submitter_email}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="w-5 h-5 text-gray-400" />
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
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    Quick Actions
                                </h3>
                                <div className="space-y-2">
                                    {feedback.status !== 'in_progress' && (
                                        <button
                                            onClick={() => {
                                                setData('status', 'in_progress');
                                                put(route("admin.feedback.update", feedback.id));
                                            }}
                                            className="w-full text-left px-3 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-colors"
                                        >
                                            Mark In Progress
                                        </button>
                                    )}
                                    {feedback.status !== 'resolved' && (
                                        <button
                                            onClick={() => {
                                                setData('status', 'resolved');
                                                put(route("admin.feedback.update", feedback.id));
                                            }}
                                            className="w-full text-left px-3 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
                                        >
                                            Mark Resolved
                                        </button>
                                    )}
                                    {feedback.status !== 'closed' && (
                                        <button
                                            onClick={() => {
                                                setData('status', 'closed');
                                                put(route("admin.feedback.update", feedback.id));
                                            }}
                                            className="w-full text-left px-3 py-2 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-lg hover:bg-gray-500/30 transition-colors"
                                        >
                                            Mark Closed
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
