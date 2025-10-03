import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { 
    MessageSquare, 
    Search, 
    Filter, 
    Eye, 
    Edit3, 
    Trash2, 
    CheckCircle, 
    Clock, 
    AlertCircle,
    X,
    User,
    Mail,
    Calendar,
    Tag,
    Flag
} from "lucide-react";

interface Feedback {
    id: number;
    subject: string;
    message: string;
    feedback_type: string;
    event_code: string;
    rating: number | null;
    status: string;
    submitter_name: string;
    submitter_email: string;
    created_at: string;
    user?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    };
    responded_by?: {
        id: number;
        first_name: string;
        last_name: string;
    };
    responded_at?: string;
}

interface FeedbackStats {
    total: number;
    new: number;
    in_progress: number;
    resolved: number;
    closed: number;
}

interface Filters {
    search?: string;
    status?: string;
    category?: string;
    priority?: string;
}

interface FeedbackIndexProps {
    feedback: {
        data: Feedback[];
        links: any[];
        meta: any;
    };
    stats: FeedbackStats;
    filters: Filters;
}

export default function Index({ feedback, stats, filters }: FeedbackIndexProps) {
    // Safety check for feedback data structure
    if (!feedback || !feedback.data) {
        return (
            <DashboardLayout>
                <Head title="Feedback Management - Admin" />
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center py-12">
                            <p className="text-gray-400">Loading feedback data...</p>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }
    const [selectedFeedback, setSelectedFeedback] = useState<number[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || "");

    const categories = [
        { value: "", label: "All Categories" },
        { value: "general", label: "General Feedback" },
        { value: "bug_report", label: "Bug Report" },
        { value: "feature_request", label: "Feature Request" },
        { value: "event_feedback", label: "Event Feedback" },
        { value: "technical_issue", label: "Technical Issue" },
        { value: "other", label: "Other" },
    ];

    const statuses = [
        { value: "", label: "All Statuses" },
        { value: "new", label: "New" },
        { value: "in_progress", label: "In Progress" },
        { value: "resolved", label: "Resolved" },
        { value: "closed", label: "Closed" },
    ];

    const priorities = [
        { value: "", label: "All Priorities" },
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
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

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "bug_report": return <AlertCircle className="w-4 h-4" />;
            case "feature_request": return <Edit3 className="w-4 h-4" />;
            default: return <MessageSquare className="w-4 h-4" />;
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route("admin.feedback.index"), {
            ...filters,
            search: searchQuery,
        }, { preserveState: true });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(route("admin.feedback.index"), {
            ...filters,
            [key]: value,
        }, { preserveState: true });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedFeedback(feedback.data.map(f => f.id));
        } else {
            setSelectedFeedback([]);
        }
    };

    const handleSelectFeedback = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedFeedback([...selectedFeedback, id]);
        } else {
            setSelectedFeedback(selectedFeedback.filter(fId => fId !== id));
        }
    };

    const handleBulkAction = (action: string) => {
        if (selectedFeedback.length === 0) return;

        router.post(route("admin.feedback.bulk-update"), {
            feedback_ids: selectedFeedback,
            action: action,
        }, {
            onSuccess: () => {
                setSelectedFeedback([]);
            },
        });
    };

    return (
        <DashboardLayout>
            <Head title="Feedback Management - Admin" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-200 flex items-center">
                                <MessageSquare className="w-8 h-8 mr-3 text-blue-400" />
                                Feedback Management
                            </h1>
                            <p className="mt-1 text-gray-400">
                                Manage and respond to user feedback
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center">
                                <MessageSquare className="w-8 h-8 text-blue-400" />
                                <div className="ml-3">
                                    <p className="text-sm text-gray-400">Total</p>
                                    <p className="text-xl font-semibold text-white">{stats.total}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center">
                                <AlertCircle className="w-8 h-8 text-blue-400" />
                                <div className="ml-3">
                                    <p className="text-sm text-gray-400">New</p>
                                    <p className="text-xl font-semibold text-white">{stats.new}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center">
                                <Clock className="w-8 h-8 text-yellow-400" />
                                <div className="ml-3">
                                    <p className="text-sm text-gray-400">In Progress</p>
                                    <p className="text-xl font-semibold text-white">{stats.in_progress}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                                <div className="ml-3">
                                    <p className="text-sm text-gray-400">Resolved</p>
                                    <p className="text-xl font-semibold text-white">{stats.resolved}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center">
                                <X className="w-8 h-8 text-gray-400" />
                                <div className="ml-3">
                                    <p className="text-sm text-gray-400">Closed</p>
                                    <p className="text-xl font-semibold text-white">{stats.closed}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-gray-800 rounded-lg p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex-1 max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search feedback..."
                                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </form>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </button>
                        </div>

                        {/* Filter Options */}
                        {showFilters && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <select
                                        value={filters.status || ""}
                                        onChange={(e) => handleFilterChange("status", e.target.value)}
                                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {statuses.map((status) => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={filters.category || ""}
                                        onChange={(e) => handleFilterChange("category", e.target.value)}
                                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {categories.map((category) => (
                                            <option key={category.value} value={category.value}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={filters.priority || ""}
                                        onChange={(e) => handleFilterChange("priority", e.target.value)}
                                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {priorities.map((priority) => (
                                            <option key={priority.value} value={priority.value}>
                                                {priority.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bulk Actions */}
                    {selectedFeedback.length > 0 && (
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-blue-400">
                                    {selectedFeedback.length} feedback selected
                                </span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleBulkAction("mark_in_progress")}
                                        className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded text-sm hover:bg-yellow-500/30 transition-colors"
                                    >
                                        Mark In Progress
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction("mark_resolved")}
                                        className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-sm hover:bg-green-500/30 transition-colors"
                                    >
                                        Mark Resolved
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction("mark_closed")}
                                        className="px-3 py-1 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded text-sm hover:bg-gray-500/30 transition-colors"
                                    >
                                        Mark Closed
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction("delete")}
                                        className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-sm hover:bg-red-500/30 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Feedback Table */}
                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedFeedback.length === feedback.data.length && feedback.data.length > 0}
                                                onChange={(e) => handleSelectAll(e.target.checked)}
                                                className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Feedback
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Submitter
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Event
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {feedback.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-700/50">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFeedback.includes(item.id)}
                                                    onChange={(e) => handleSelectFeedback(item.id, e.target.checked)}
                                                    className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex-shrink-0 mt-1">
                                                        {getCategoryIcon(item.feedback_type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-white truncate">
                                                            {item.subject || 'No Subject'}
                                                        </p>
                                                        <p className="text-sm text-gray-400 truncate">
                                                            {item.message ? item.message.substring(0, 100) + '...' : 'No message'}
                                                        </p>
                                                        <div className="flex items-center mt-1 space-x-2">
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300">
                                                                <Tag className="w-3 h-3 mr-1" />
                                                                {item.feedback_type?.replace('_', ' ') || 'Unknown'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-white">{item.submitter_name || 'Anonymous'}</p>
                                                        <p className="text-xs text-gray-400">{item.submitter_email || 'No email provided'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                                    {item.status?.replace('_', ' ') || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <Flag className="w-4 h-4 mr-1 text-gray-400" />
                                                    <span className="text-sm text-gray-300">
                                                        {item.event_code || 'compsphere'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={route('admin.feedback.show', item.id)}
                                                        className="inline-flex items-center px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-medium rounded-lg transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {feedback.meta?.links && (
                            <div className="bg-gray-900 px-4 py-3 border-t border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-400">
                                        Showing {feedback.meta?.from || 0} to {feedback.meta?.to || 0} of {feedback.meta?.total || 0} results
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
                                                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
