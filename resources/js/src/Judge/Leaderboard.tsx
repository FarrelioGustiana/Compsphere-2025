import React from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { Award, Users, Star } from "lucide-react";

interface RankedSubmission {
    id: number;
    project_title: string;
    team_id: number;
    team_name: string;
    team_leader: string;
    members: string[];
    evaluations_count: number;
    average_score: number;
    criteria_scores: {
        whole_system_functionality_score: number;
        ui_ux_design_score: number;
        backend_logic_score: number;
        ai_model_performance_score: number;
        automation_integration_score: number;
    };
    rank: number;
}

interface LeaderboardProps {
    rankedSubmissions: RankedSubmission[];
}

export default function Leaderboard({ rankedSubmissions }: LeaderboardProps) {
    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1:
                return "text-yellow-400";
            case 2:
                return "text-gray-300";
            case 3:
                return "text-amber-600";
            default:
                return "text-gray-500";
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 9) return "text-green-400";
        if (score >= 7.5) return "text-blue-400";
        if (score >= 6) return "text-yellow-400";
        return "text-red-400";
    };

    return (
        <DashboardLayout>
            <Head title="Hacksphere Leaderboard" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-200">Project Leaderboard</h1>
                    <p className="mt-1 text-gray-400">
                        Current rankings of all evaluated project submissions.
                    </p>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    {rankedSubmissions && rankedSubmissions.length > 0 ? (
                        <div className="bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Rank
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Project
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Team
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Evaluations
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Score
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {rankedSubmissions.map((submission) => (
                                            <tr key={submission.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-xl font-bold ${getRankColor(submission.rank)} flex items-center`}>
                                                        {submission.rank <= 3 && <Award className="h-5 w-5 mr-1" />}
                                                        {submission.rank}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-white">{submission.project_title}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-300 flex items-center">
                                                        <Users className="h-4 w-4 mr-1" />
                                                        {submission.team_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">Led by {submission.team_leader}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {submission.evaluations_count} evaluations
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-center text-xl font-bold ${getScoreColor(submission.average_score)}`}>
                                                        {submission.average_score.toFixed(2)}
                                                    </div>
                                                    <div className="flex justify-center items-center mt-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star 
                                                                key={star} 
                                                                className={`h-3 w-3 ${
                                                                    star <= Math.round(submission.average_score / 2)
                                                                        ? 'text-yellow-400 fill-yellow-400'
                                                                        : 'text-gray-600'
                                                                }`} 
                                                            />
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-800 overflow-hidden shadow-sm rounded-lg p-8 text-center">
                            <div className="text-gray-400 text-lg">
                                No evaluated submissions available yet.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
