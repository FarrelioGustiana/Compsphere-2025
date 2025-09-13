import React from "react";
import { Head, Link } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { Clock, CheckCircle, Eye } from "lucide-react";

interface Submission {
    id: number;
    team_name: string;
    project_title: string;
    submitted_at: string;
    status: string;
    team_leader: string;
}

interface SubmissionsProps {
    submissions: Submission[];
}

export default function Submissions({ submissions }: SubmissionsProps) {
    return (
        <DashboardLayout>
            <Head title="Project Submissions" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-200">Project Submissions</h1>
                    <p className="mt-1 text-gray-400">
                        Review and evaluate team project submissions.
                    </p>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    {submissions && submissions.length > 0 ? (
                        <div className="bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Project
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Team
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Submitted
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {submissions.map((submission) => (
                                            <tr key={submission.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-white">{submission.project_title}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-300">{submission.team_name}</div>
                                                    <div className="text-xs text-gray-500">Led by {submission.team_leader}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {submission.submitted_at}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        submission.status === 'evaluated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {submission.status === 'evaluated' ? (
                                                            <>
                                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                                Evaluated
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                Pending
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link 
                                                        href={`/judge/hacksphere/evaluate/${submission.id}`} 
                                                        className="text-indigo-400 hover:text-indigo-300 flex items-center justify-end"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        {submission.status === 'evaluated' ? 'Review Evaluation' : 'Evaluate'}
                                                    </Link>
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
                                No submissions are available for evaluation at this time.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
