import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import DashboardLayout from "@/src/Components/Layout/DashboardLayout";
import { ExternalLink, Save, CheckCircle } from "lucide-react";

interface Criterion {
    id: string;
    name: string;
    description: string;
    weight: number;
}

interface Submission {
    id: number;
    project_title: string;
    project_description: string;
    presentation_url: string;
    youtube_url: string;
    github_url: string;
    team: {
        id: number;
        team_name: string;
        leader: string;
        members: string[];
    };
}

interface Evaluation {
    id?: number;
    project_submission_id: number;
    problem_solving_relevance_score?: number;
    functional_mvp_prototype_score?: number;
    technical_execution_score?: number;
    creativity_innovation_score?: number;
    impact_scalability_score?: number;
    presentation_clarity_score?: number;
    comments?: string;
    is_completed?: boolean;
    created_at?: string;
    updated_at?: string;
}

interface EvaluationFormProps {
    submission: Submission;
    evaluation: Evaluation;
    scoringCriteria: Criterion[];
}

export default function EvaluationForm({ submission, evaluation, scoringCriteria }: EvaluationFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        problem_solving_relevance_score: evaluation?.problem_solving_relevance_score || 0,
        functional_mvp_prototype_score: evaluation?.functional_mvp_prototype_score || 0,
        technical_execution_score: evaluation?.technical_execution_score || 0,
        creativity_innovation_score: evaluation?.creativity_innovation_score || 0,
        impact_scalability_score: evaluation?.impact_scalability_score || 0,
        presentation_clarity_score: evaluation?.presentation_clarity_score || 0,
        comments: evaluation?.comments || '',
    });

    const [activeTab, setActiveTab] = useState('project');

    // Calculate weighted average score
    const calculateWeightedScore = () => {
        const weights = {
            problem_solving_relevance_score: 0.25,
            functional_mvp_prototype_score: 0.25,
            technical_execution_score: 0.20,
            creativity_innovation_score: 0.10,
            impact_scalability_score: 0.10,
            presentation_clarity_score: 0.10,
        };

        let weightedSum = 0;
        let weightSum = 0;

        for (const criterion of scoringCriteria) {
            const score = data[criterion.id as keyof typeof data];
            if (typeof score === 'number') {
                const weight = criterion.weight / 100;
                weightedSum += score * weight;
                weightSum += weight;
            }
        }

        return weightSum > 0 ? (weightedSum / weightSum).toFixed(2) : '0.00';
    };

    const handleSubmit = (e: React.FormEvent, isDraft = false) => {
        e.preventDefault();
        const url = isDraft 
            ? `/judge/hacksphere/evaluate/${submission.id}/draft` 
            : `/judge/hacksphere/evaluate/${submission.id}`;

        post(url, {
            onSuccess: () => {
                // Handle success
            },
        });
    };

    return (
        <DashboardLayout>
            <Head title={`Evaluate: ${submission.project_title}`} />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-200">{submission.project_title}</h1>
                    <p className="mt-1 text-gray-400">
                        Submitted by {submission.team.team_name}
                    </p>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="border-b border-gray-700 mb-4">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('project')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'project'
                                        ? 'border-blue-500 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                                }`}
                            >
                                Project Details
                            </button>
                            <button
                                onClick={() => setActiveTab('evaluation')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'evaluation'
                                        ? 'border-blue-500 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                                }`}
                            >
                                Evaluation Form
                            </button>
                        </nav>
                    </div>
                    
                    {activeTab === 'project' ? (
                        <div className="bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                            <div className="p-6">
                                <div className="mb-6">
                                    <h2 className="text-xl font-medium text-white">Project Description</h2>
                                    <div className="mt-2 text-gray-300 prose prose-invert max-w-none">
                                        {submission.project_description.split('\n').map((paragraph, index) => (
                                            <p key={index} className="mb-4">{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <h2 className="text-xl font-medium text-white">Team Information</h2>
                                    <div className="mt-2">
                                        <p className="text-gray-300"><span className="font-medium text-white">Team:</span> {submission.team.team_name}</p>
                                        <p className="text-gray-300"><span className="font-medium text-white">Leader:</span> {submission.team.leader}</p>
                                        <div className="mt-2">
                                            <span className="font-medium text-white">Members:</span>
                                            <ul className="list-disc pl-5 mt-1 text-gray-300">
                                                {submission.team.members.map((member, index) => (
                                                    <li key={index}>{member}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <h2 className="text-xl font-medium text-white">Project Resources</h2>
                                    <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {submission.presentation_url && (
                                            <a href={submission.presentation_url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                                                <ExternalLink className="h-5 w-5 text-blue-400 mr-2" />
                                                <span className="text-white">Presentation</span>
                                            </a>
                                        )}
                                        
                                        {submission.youtube_url && (
                                            <a href={submission.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                                                <ExternalLink className="h-5 w-5 text-red-400 mr-2" />
                                                <span className="text-white">Video Demo</span>
                                            </a>
                                        )}
                                        
                                        {submission.github_url && (
                                            <a href={submission.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                                                <ExternalLink className="h-5 w-5 text-gray-400 mr-2" />
                                                <span className="text-white">GitHub Repository</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={(e) => handleSubmit(e, false)}>
                            <div className="bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                                <div className="p-6">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-medium text-white mb-4">Scoring Criteria</h2>
                                        
                                        <div className="space-y-6">
                                            {scoringCriteria.map((criterion) => (
                                                <div key={criterion.id} className="bg-gray-750 p-4 rounded-md">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-lg font-medium text-white">{criterion.name}</h3>
                                                            <p className="text-gray-300 text-sm mt-1">{criterion.description}</p>
                                                            <div className="mt-2">
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                                                    Weight: {criterion.weight}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="w-32">
                                                            <label htmlFor={criterion.id} className="block text-sm font-medium text-gray-300 mb-1">
                                                                Score (0-10)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                id={criterion.id}
                                                                min="1"
                                                                max="10"
                                                                step="0.5"
                                                                className="bg-gray-700 border border-gray-600 text-white rounded-md block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                                                value={data[criterion.id as keyof typeof data] as number}
                                                                onChange={(e) => {
                                                                    const id = criterion.id as keyof typeof data;
                                                                    setData(id, parseFloat(e.target.value));
                                                                }}
                                                            />
                                                            {criterion.id in errors && (
                                                                <p className="text-red-500 text-xs mt-1">{String(errors[criterion.id as keyof typeof errors])}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-white mb-2">Comments</h3>
                                        <textarea
                                            className="bg-gray-700 border border-gray-600 text-white rounded-md block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                            rows={5}
                                            value={data.comments}
                                            onChange={(e) => setData('comments', e.target.value)}
                                        ></textarea>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-white">Final Score</h3>
                                            <p className="text-2xl font-bold text-blue-400">{calculateWeightedScore()}/10</p>
                                        </div>
                                        
                                        <div className="flex space-x-4">
                                            <button
                                                type="button"
                                                onClick={(e) => handleSubmit(e, true)}
                                                disabled={processing}
                                                className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Draft
                                            </button>
                                            
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Submit Evaluation
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
