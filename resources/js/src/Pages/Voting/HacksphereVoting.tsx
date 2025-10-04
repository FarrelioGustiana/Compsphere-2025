import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
// Note: Using console.log instead of toast for now
import { 
    Heart, 
    Eye, 
    Code, 
    Play,
    Users,
    Trophy,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';

interface TeamMember {
    id: number;
    full_name: string;
}

interface Team {
    id: number;
    team_name: string;
    members: TeamMember[];
}

interface Submission {
    id: number;
    project_title: string;
    project_description: string;
    presentation_url: string;
    youtube_url: string;
    github_url: string;
    submitted_at: string;
    team: Team;
    vote_count: number;
    has_user_voted: boolean;
}

interface Props {
    submissions: Submission[];
    userVoteCount: number;
    canVote: boolean;
    auth?: {
        user?: {
            id: number;
            full_name: string;
            email: string;
        };
    };
}

export default function HacksphereVoting({ submissions: initialSubmissions, userVoteCount, canVote, auth }: Props) {
    const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
    const [loading, setLoading] = useState<Record<number, boolean>>({});

    const handleVote = async (submissionId: number) => {
        if (!auth?.user) {
            console.error('Please login to vote');
            return;
        }

        if (!canVote) {
            console.error('Please verify your email to vote');
            return;
        }

        setLoading(prev => ({ ...prev, [submissionId]: true }));

        try {
            // Get CSRF token from meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch(`/voting/hacksphere/${submissionId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
            });

            const data = await response.json();

            if (data.success) {
                setSubmissions(prev => prev.map(submission => 
                    submission.id === submissionId 
                        ? { ...submission, has_user_voted: true, vote_count: data.vote_count }
                        : submission
                ));
                console.log(data.message);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('An error occurred while voting');
        } finally {
            setLoading(prev => ({ ...prev, [submissionId]: false }));
        }
    };

    const handleUnvote = async (submissionId: number) => {
        setLoading(prev => ({ ...prev, [submissionId]: true }));

        try {
            // Get CSRF token from meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch(`/voting/hacksphere/${submissionId}/unvote`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
            });

            const data = await response.json();

            if (data.success) {
                setSubmissions(prev => prev.map(submission => 
                    submission.id === submissionId 
                        ? { ...submission, has_user_voted: false, vote_count: data.vote_count }
                        : submission
                ));
                console.log(data.message);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('An error occurred while removing vote');
        } finally {
            setLoading(prev => ({ ...prev, [submissionId]: false }));
        }
    };

    const sortedSubmissions = [...submissions].sort((a, b) => b.vote_count - a.vote_count);

    return (
        <>
            <Head title="Hacksphere Public Voting" />
            
            <div className="min-h-screen bg-gray-900 text-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
                            <h1 className="text-4xl font-bold mb-4">
                                Hacksphere Public Favorite
                            </h1>
                            <p className="text-xl text-purple-100 mb-6">
                                Vote for your favorite project and help choose the Public Favorite winner!
                            </p>
                            
                            {auth?.user ? (
                                <div className="flex items-center justify-center space-x-4 text-sm">
                                    <div className="bg-white/20 px-4 py-2 rounded-full">
                                        Welcome, {auth.user.full_name}
                                    </div>
                                    {canVote ? (
                                        <div className="bg-green-500/20 px-4 py-2 rounded-full flex items-center">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            You can vote
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-500/20 px-4 py-2 rounded-full flex items-center">
                                            <AlertTriangle className="h-4 w-4 mr-2" />
                                            Please verify your email to vote
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-x-4">
                                    <Link
                                        href="/login"
                                        className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                                    >
                                        Login to Vote
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-800 p-6 rounded-xl text-center">
                            <div className="text-3xl font-bold text-blue-400">{submissions.length}</div>
                            <div className="text-gray-400">Total Projects</div>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-xl text-center">
                            <div className="text-3xl font-bold text-green-400">
                                {submissions.reduce((sum, s) => sum + s.vote_count, 0)}
                            </div>
                            <div className="text-gray-400">Total Votes</div>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-xl text-center">
                            <div className="text-3xl font-bold text-purple-400">{userVoteCount}</div>
                            <div className="text-gray-400">Your Votes</div>
                        </div>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {sortedSubmissions.map((submission, index) => (
                            <div key={submission.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                {/* Ranking Badge */}
                                {index < 3 && (
                                    <div className={`absolute top-4 left-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                        index === 0 ? 'bg-yellow-500 text-yellow-900' :
                                        index === 1 ? 'bg-gray-400 text-gray-900' :
                                        'bg-orange-600 text-orange-100'
                                    }`}>
                                        {index + 1}
                                    </div>
                                )}

                                <div className="p-6">
                                    {/* Project Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2">{submission.project_title}</h3>
                                            <div className="flex items-center text-gray-400 mb-2">
                                                <Users className="h-4 w-4 mr-2" />
                                                <span className="font-semibold">{submission.team.team_name}</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {submission.team.members.map(member => member.full_name).join(', ')}
                                            </div>
                                        </div>
                                        
                                        {/* Vote Button */}
                                        <div className="flex flex-col items-center ml-4">
                                            <button
                                                onClick={() => submission.has_user_voted ? handleUnvote(submission.id) : handleVote(submission.id)}
                                                disabled={!canVote || loading[submission.id]}
                                                className={`p-3 rounded-full transition-all duration-200 ${
                                                    submission.has_user_voted
                                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                                        : canVote
                                                        ? 'bg-gray-700 hover:bg-purple-600 text-gray-300 hover:text-white'
                                                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                } ${loading[submission.id] ? 'animate-pulse' : ''}`}
                                            >
                                                {submission.has_user_voted ? (
                                                    <Heart className="h-6 w-6" fill="currentColor" />
                                                ) : (
                                                    <Heart className="h-6 w-6" />
                                                )}
                                            </button>
                                            {/* <span className="text-sm font-semibold mt-2">{submission.vote_count}</span> */}
                                        </div>
                                    </div>

                                    {/* Project Description */}
                                    <p className="text-gray-300 mb-4 line-clamp-3">
                                        {submission.project_description}
                                    </p>

                                    {/* Project Links */}
                                    <div className="flex flex-wrap gap-3">
                                        {submission.presentation_url && (
                                            <a
                                                href={submission.presentation_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                Demo
                                            </a>
                                        )}
                                        {submission.youtube_url && (
                                            <a
                                                href={submission.youtube_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <Play className="h-4 w-4 mr-2" />
                                                Video
                                            </a>
                                        )}
                                    </div>

                                    {/* Submission Date */}
                                    <div className="mt-4 pt-4 border-t border-gray-700">
                                        <span className="text-xs text-gray-500">
                                            Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {submissions.length === 0 && (
                        <div className="text-center py-12">
                            <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Projects Yet</h3>
                            <p className="text-gray-500">Projects will appear here once teams submit their work.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-800 mt-16 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-gray-400">
                            Voting is open to all registered Compsphere users. The project with the most votes wins the Public Favorite award!
                        </p>
                        <Link href="/" className="text-purple-400 hover:text-purple-300 mt-2 inline-block">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
