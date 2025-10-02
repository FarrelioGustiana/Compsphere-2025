import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { 
    Trophy, 
    Heart, 
    Users,
    Eye,
    BarChart3,
    Download
} from 'lucide-react';

interface VotingStats {
    total_votes: number;
    total_voters: number;
    total_submissions: number;
    top_submissions: {
        id: number;
        project_title: string;
        team_name: string;
        vote_count: number;
    }[];
}

export default function HacksphereVotingResults() {
    const [stats, setStats] = useState<VotingStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVotingStats();
    }, []);

    const fetchVotingStats = async () => {
        try {
            const response = await fetch('/admin/hacksphere/voting-stats');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to load voting statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportResults = () => {
        if (!stats) return;
        
        const csvContent = [
            ['Rank', 'Project Title', 'Team Name', 'Vote Count'],
            ...stats.top_submissions.map((submission, index) => [
                index + 1,
                submission.project_title,
                submission.team_name,
                submission.vote_count
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hacksphere-voting-results-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Head title="Hacksphere Voting Results" />
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!stats) {
        return (
            <DashboardLayout>
                <Head title="Hacksphere Voting Results" />
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                                <h3 className="text-xl font-semibold text-gray-400 mb-2">Failed to Load Statistics</h3>
                                <button 
                                    onClick={fetchVotingStats}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Head title="Hacksphere Voting Results" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-200">
                                Hacksphere Voting Results
                            </h1>
                            <p className="mt-1 text-gray-400">
                                Public Favorite voting statistics and leaderboard
                            </p>
                        </div>
                        <button
                            onClick={exportResults}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center transition-colors text-white"
                        >
                            <Download className="h-5 w-5 mr-2" />
                            Export CSV
                        </button>
                    </div>
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-800 p-6 rounded-xl">
                            <div className="flex items-center">
                                <Trophy className="h-8 w-8 text-yellow-400 mr-3" />
                                <div>
                                    <div className="text-2xl font-bold text-yellow-400">
                                        {stats.total_submissions}
                                    </div>
                                    <div className="text-gray-400 text-sm">Total Projects</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-xl">
                            <div className="flex items-center">
                                <Heart className="h-8 w-8 text-red-400 mr-3" />
                                <div>
                                    <div className="text-2xl font-bold text-red-400">
                                        {stats.total_votes}
                                    </div>
                                    <div className="text-gray-400 text-sm">Total Votes</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-xl">
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-blue-400 mr-3" />
                                <div>
                                    <div className="text-2xl font-bold text-blue-400">
                                        {stats.total_voters}
                                    </div>
                                    <div className="text-gray-400 text-sm">Unique Voters</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-xl">
                            <div className="flex items-center">
                                <BarChart3 className="h-8 w-8 text-green-400 mr-3" />
                                <div>
                                    <div className="text-2xl font-bold text-green-400">
                                        {stats.total_submissions > 0 ? (stats.total_votes / stats.total_submissions).toFixed(1) : '0'}
                                    </div>
                                    <div className="text-gray-400 text-sm">Avg Votes/Project</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="bg-gray-800 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-700">
                            <h2 className="text-xl font-bold flex items-center text-white">
                                <Trophy className="h-6 w-6 mr-2 text-yellow-400" />
                                Public Favorite Leaderboard
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Rank
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Project
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Team
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Votes
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Percentage
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {stats.top_submissions.map((submission, index) => (
                                        <tr key={submission.id} className="hover:bg-gray-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                        index === 0 ? 'bg-yellow-500 text-yellow-900' :
                                                        index === 1 ? 'bg-gray-400 text-gray-900' :
                                                        index === 2 ? 'bg-orange-600 text-orange-100' :
                                                        'bg-gray-600 text-gray-300'
                                                    }`}>
                                                        {index + 1}
                                                    </div>
                                                    {index === 0 && (
                                                        <Trophy className="h-5 w-5 text-yellow-400 ml-2" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-white">
                                                    {submission.project_title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-300">
                                                    {submission.team_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <Heart className="h-4 w-4 text-red-400 mr-2" />
                                                    <span className="text-sm font-medium text-white">
                                                        {submission.vote_count}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-16 bg-gray-700 rounded-full h-2 mr-3">
                                                        <div 
                                                            className="bg-purple-500 h-2 rounded-full"
                                                            style={{ 
                                                                width: `${stats.total_votes > 0 ? (submission.vote_count / stats.total_votes) * 100 : 0}%` 
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-300">
                                                        {stats.total_votes > 0 ? ((submission.vote_count / stats.total_votes) * 100).toFixed(1) : '0'}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {stats.top_submissions.length === 0 && (
                            <div className="text-center py-12">
                                <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Submissions Yet</h3>
                                <p className="text-gray-500">Voting results will appear here once projects are submitted and voted on.</p>
                            </div>
                        )}
                    </div>

                    {/* Refresh Button */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={fetchVotingStats}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Refresh Results
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
