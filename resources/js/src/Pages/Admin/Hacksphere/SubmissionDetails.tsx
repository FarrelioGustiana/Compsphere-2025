import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { route } from 'ziggy-js';
import { ExternalLink, Users, Calendar, Star, CheckCircle } from 'lucide-react';
import Button from '@/src/Components/UI/Button';

interface TeamMember {
  id: number;
  name: string;
  email: string;
}

interface Evaluation {
  id: number;
  judge_name: string;
  problem_solving_relevance_score: number;
  functional_mvp_prototype_score: number;
  technical_execution_score: number;
  creativity_innovation_score: number;
  impact_scalability_score: number;
  presentation_clarity_score: number;
  comments: string;
  created_at: string;
}

interface SubmissionDetailsProps {
  submission: {
    id: number;
    project_title: string;
    project_description: string;
    presentation_url: string;
    youtube_url: string;
    github_url: string;
    submitted_at: string;
    team: {
      id: number;
      team_name: string;
      team_code: string;
      leader: TeamMember;
      members: TeamMember[];
    };
    average_score: number | null;
    evaluations: Evaluation[];
    evaluations_count: number;
    criteria_scores: {
      problem_solving_relevance_score: number;
      functional_mvp_prototype_score: number;
      technical_execution_score: number;
      creativity_innovation_score: number;
      impact_scalability_score: number;
      presentation_clarity_score: number;
    };
    criteria_weights?: {
      problem_solving_relevance_score: number;
      functional_mvp_prototype_score: number;
      technical_execution_score: number;
      creativity_innovation_score: number;
      impact_scalability_score: number;
      presentation_clarity_score: number;
    };
  };
}

export default function SubmissionDetails({ submission }: { submission: SubmissionDetailsProps['submission'] }) {
  const [activeTab, setActiveTab] = useState<string>('details');
  
  // Get evaluations from submission object
  const evaluations = submission.evaluations || [];
  
  // Use criteria scores from backend
  const criterionAverages = submission.criteria_scores || {
    problem_solving_relevance_score: 0,
    functional_mvp_prototype_score: 0,
    technical_execution_score: 0,
    creativity_innovation_score: 0,
    impact_scalability_score: 0,
    presentation_clarity_score: 0,
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const getScoreClass = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  return (
    <DashboardLayout>
      <Head title={`${submission.project_title} - Submission Details`} />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{submission.project_title}</h1>
                <p className="text-blue-200">
                  Submitted by Team: {submission.team.team_name}
                </p>
                <p className="text-blue-200 mt-1">
                  Submitted: {formatDate(submission.submitted_at)}
                </p>
              </div>
              
              {/* Score Badge */}
              {submission.average_score !== null && (
                <div className="mt-4 md:mt-0 flex flex-col items-center justify-center">
                  <div className="text-sm text-gray-300 mb-1">Average Score</div>
                  <div className={`text-2xl font-bold ${getScoreClass(submission.average_score)}`}>
                    {submission.average_score.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    Based on {evaluations.length} evaluation{evaluations.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`py-3 px-6 text-sm font-medium ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('details')}
            >
              Project Details
            </button>
            <button
              className={`py-3 px-6 text-sm font-medium ${activeTab === 'evaluations' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('evaluations')}
            >
              Evaluations ({evaluations.length})
            </button>
            <button
              className={`py-3 px-6 text-sm font-medium ${activeTab === 'team' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('team')}
            >
              Team
            </button>
          </div>
          
          {/* Project Details Tab */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Description */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Project Description</h2>
                  <p className="text-gray-300 whitespace-pre-line">
                    {submission.project_description}
                  </p>
                </div>
                
                {/* Score Breakdown */}
                {evaluations.length > 0 && (
                  <div className="bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Score Breakdown</h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-300">Problem-Solving & Relevance (25%)</span>
                          <span className={getScoreClass(criterionAverages.problem_solving_relevance_score)}>
                            {criterionAverages.problem_solving_relevance_score?.toFixed(2) || '-'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(criterionAverages.problem_solving_relevance_score / 100) * 100}%` }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-300">Functional MVP / Prototype (25%)</span>
                          <span className={getScoreClass(criterionAverages.functional_mvp_prototype_score)}>
                            {criterionAverages.functional_mvp_prototype_score?.toFixed(2) || '-'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(criterionAverages.functional_mvp_prototype_score / 100) * 100}%` }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-300">Technical Execution (20%)</span>
                          <span className={getScoreClass(criterionAverages.technical_execution_score)}>
                            {criterionAverages.technical_execution_score?.toFixed(2) || '-'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(criterionAverages.technical_execution_score / 100) * 100}%` }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-300">Creativity & Innovation (10%)</span>
                          <span className={getScoreClass(criterionAverages.creativity_innovation_score)}>
                            {criterionAverages.creativity_innovation_score?.toFixed(2) || '-'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(criterionAverages.creativity_innovation_score / 100) * 100}%` }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-300">Impact & Scalability (10%)</span>
                          <span className={getScoreClass(criterionAverages.impact_scalability_score)}>
                            {criterionAverages.impact_scalability_score?.toFixed(2) || '-'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(criterionAverages.impact_scalability_score / 100) * 100}%` }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-300">Presentation Clarity (10%)</span>
                          <span className={getScoreClass(criterionAverages.presentation_clarity_score)}>
                            {criterionAverages.presentation_clarity_score?.toFixed(2) || '-'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${(criterionAverages.presentation_clarity_score / 100) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Resources */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Project Resources</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Presentation Slides</h3>
                      <a
                        href={submission.presentation_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center p-3 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
                      >
                        <span className="flex-grow">View Presentation</span>
                        <ExternalLink className="h-5 w-5 ml-2" />
                      </a>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Demo Video</h3>
                      <a
                        href={submission.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center p-3 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
                      >
                        <span className="flex-grow">Watch on YouTube</span>
                        <ExternalLink className="h-5 w-5 ml-2" />
                      </a>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">GitHub Repository</h3>
                      <a
                        href={submission.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center p-3 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
                      >
                        <span className="flex-grow">View Source Code</span>
                        <ExternalLink className="h-5 w-5 ml-2" />
                      </a>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Team Dashboard</h3>
                      <Link
                        href={route('admin.hacksphere.team.details', submission.team.id)}
                        className="mt-2 flex items-center p-3 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
                      >
                        <span className="flex-grow">View Team Details</span>
                        <Users className="h-5 w-5 ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Evaluations Tab */}
          {activeTab === 'evaluations' && (
            <div className="bg-gray-800 rounded-lg shadow-md">
              {evaluations.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  No evaluations have been submitted yet.
                </div>
              ) : (
                <div className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                      <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">Judge</th>
                          <th scope="col" className="px-6 py-3 text-center">Problem<br/>(25%)</th>
                          <th scope="col" className="px-6 py-3 text-center">MVP<br/>(25%)</th>
                          <th scope="col" className="px-6 py-3 text-center">Tech<br/>(20%)</th>
                          <th scope="col" className="px-6 py-3 text-center">Creative<br/>(10%)</th>
                          <th scope="col" className="px-6 py-3 text-center">Impact<br/>(10%)</th>
                          <th scope="col" className="px-6 py-3 text-center">Present<br/>(10%)</th>
                          <th scope="col" className="px-6 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {evaluations.map((evaluation) => (
                          <tr key={evaluation.id} className="border-b border-gray-700">
                            <td className="px-6 py-4 font-medium text-white">
                              {evaluation.judge_name || 'Unknown Judge'}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={getScoreClass(evaluation.problem_solving_relevance_score || 0)}>
                                {evaluation.problem_solving_relevance_score?.toFixed(1) || '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={getScoreClass(evaluation.functional_mvp_prototype_score || 0)}>
                                {evaluation.functional_mvp_prototype_score?.toFixed(1) || '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={getScoreClass(evaluation.technical_execution_score || 0)}>
                                {evaluation.technical_execution_score?.toFixed(1) || '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={getScoreClass(evaluation.creativity_innovation_score || 0)}>
                                {evaluation.creativity_innovation_score?.toFixed(1) || '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={getScoreClass(evaluation.impact_scalability_score || 0)}>
                                {evaluation.impact_scalability_score?.toFixed(1) || '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={getScoreClass(evaluation.presentation_clarity_score || 0)}>
                                {evaluation.presentation_clarity_score?.toFixed(1) || '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs">
                              {evaluation.created_at ? formatDate(evaluation.created_at) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Evaluation Comments */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Judge Comments</h3>
                    {evaluations.filter(e => e.comments).length === 0 ? (
                      <p className="text-gray-400 italic">No comments provided by judges.</p>
                    ) : (
                      <div className="space-y-4">
                        {evaluations.filter(e => e.comments).map((evaluation) => (
                          <div key={`comment-${evaluation.id}`} className="bg-gray-700 rounded-md p-4">
                            <div className="flex items-center mb-2">
                              <Star className="h-4 w-4 text-yellow-400 mr-2" />
                              <span className="font-medium text-white">{evaluation.judge_name || 'Unknown Judge'}</span>
                              <span className="text-xs text-gray-400 ml-auto">
                                {evaluation.created_at ? formatDate(evaluation.created_at) : '-'}
                              </span>
                            </div>
                            <p className="text-gray-300 whitespace-pre-line">
                              {evaluation.comments}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">{submission.team.team_name}</h2>
                  <p className="text-gray-400 mt-1">Team Code: {submission.team.team_code}</p>
                </div>
                
                <div className="mt-3 md:mt-0">
                  <Link href={route('admin.hacksphere.team.details', submission.team.id)}>
                    <Button variant="outline">View Full Team Details</Button>
                  </Link>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Members
                </h3>
                
                <div className="space-y-4">
                  {/* Team Leader */}
                  {submission.team.leader && (
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-md p-4 border-l-4 border-yellow-500">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <div className="font-medium text-white">{submission.team.leader?.name || 'Unknown Leader'}</div>
                          <div className="text-gray-400 text-sm">{submission.team.leader?.email || 'No email provided'}</div>
                          <div className="text-yellow-400 text-xs mt-1">Team Leader</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Team Members */}
                  {submission.team.members && submission.team.members.length > 0 ? (
                    submission.team.members.map((member) => (
                      <div key={member.id} className="bg-gray-700 rounded-md p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <div className="font-medium text-white">{member.name || 'Unknown Member'}</div>
                            <div className="text-gray-400 text-sm">{member.email || 'No email provided'}</div>
                            <div className="text-gray-500 text-xs mt-1">Team Member</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-700 rounded-md p-4 text-center text-gray-400">
                      No team members found
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <Link href={route('admin.hacksphere.submissions')}>
              <Button variant="outline" className="text-gray-300">
                Back to All Submissions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
