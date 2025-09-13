import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import Button from '@/src/Components/UI/Button';
import { ExternalLink, Save, Send, Info, AlertCircle, CheckCircle } from 'lucide-react';

interface ScoringCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  tkt_level: string;
}

interface SubmissionData {
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

interface EvaluationData {
  id?: number;
  project_submission_id: number;
  judge_id: number;
  whole_system_functionality_score: number | null;
  ui_ux_design_score: number | null;
  backend_logic_score: number | null;
  ai_model_performance_score: number | null;
  automation_integration_score: number | null;
  final_score: number | null;
  comments: string;
  is_completed: boolean;
}

interface EvaluationFormProps {
  submission: SubmissionData;
  evaluation: EvaluationData;
  scoringCriteria: ScoringCriterion[];
  errors?: {
    whole_system_functionality_score?: string;
    ui_ux_design_score?: string;
    backend_logic_score?: string;
    ai_model_performance_score?: string;
    automation_integration_score?: string;
    comments?: string;
  };
  success?: string;
  error?: string;
}

export default function EvaluationForm({
  submission,
  evaluation,
  scoringCriteria,
  errors,
  success,
  error,
}: EvaluationFormProps) {
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('project');
  const [autosaveMessage, setAutosaveMessage] = useState<string | null>(null);
  
  const { data, setData, post, processing } = useForm({
    whole_system_functionality_score: evaluation?.whole_system_functionality_score || null,
    ui_ux_design_score: evaluation?.ui_ux_design_score || null,
    backend_logic_score: evaluation?.backend_logic_score || null,
    ai_model_performance_score: evaluation?.ai_model_performance_score || null,
    automation_integration_score: evaluation?.automation_integration_score || null,
    comments: evaluation?.comments || '',
  });
  
  // Calculate the weighted score based on the criteria weights
  useEffect(() => {
    const calculateWeightedScore = () => {
      const scores = {
        whole_system_functionality_score: data.whole_system_functionality_score,
        ui_ux_design_score: data.ui_ux_design_score,
        backend_logic_score: data.backend_logic_score,
        ai_model_performance_score: data.ai_model_performance_score,
        automation_integration_score: data.automation_integration_score,
      };
      
      // Check if any score is missing
      const hasMissingScores = Object.values(scores).some(score => score === null);
      if (hasMissingScores) {
        setCalculatedScore(null);
        return;
      }
      
      // Calculate weighted sum
      let weightedSum = 0;
      let totalWeight = 0;
      
      scoringCriteria.forEach(criterion => {
        const score = scores[criterion.id as keyof typeof scores] as number;
        weightedSum += (score * criterion.weight);
        totalWeight += criterion.weight;
      });
      
      // Normalize to a 0-10 scale
      const finalScore = totalWeight > 0 ? (weightedSum / totalWeight) * 10 : 0;
      setCalculatedScore(parseFloat(finalScore.toFixed(2)));
    };
    
    calculateWeightedScore();
  }, [data, scoringCriteria]);
  
  // Auto-save draft functionality
  useEffect(() => {
    // Don't auto-save if no changes
    if (
      data.whole_system_functionality_score === evaluation.whole_system_functionality_score &&
      data.ui_ux_design_score === evaluation.ui_ux_design_score &&
      data.backend_logic_score === evaluation.backend_logic_score &&
      data.ai_model_performance_score === evaluation.ai_model_performance_score &&
      data.automation_integration_score === evaluation.automation_integration_score &&
      data.comments === evaluation.comments
    ) {
      return;
    }
    
    const debouncedAutoSave = setTimeout(() => {
      // Only auto-save if something has changed
      saveDraft();
      setAutosaveMessage('Draft auto-saved');
      setTimeout(() => setAutosaveMessage(null), 3000);
    }, 30000); // Auto-save after 30 seconds of inactivity
    
    return () => clearTimeout(debouncedAutoSave);
  }, [data]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('judge.evaluation.store', submission.id));
  };
  
  const saveDraft = () => {
    post(route('judge.evaluation.draft', submission.id));
  };
  
  const isFormComplete = () => {
    return (
      data.whole_system_functionality_score !== null &&
      data.ui_ux_design_score !== null &&
      data.backend_logic_score !== null &&
      data.ai_model_performance_score !== null &&
      data.automation_integration_score !== null
    );
  };
  
  return (
    <DashboardLayout>
      <Head title={`Evaluate: ${submission.project_title}`} />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-xl p-6 mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">{submission.project_title}</h1>
            <p className="text-blue-200">
              Team: {submission.team.team_name}
            </p>
          </div>
          
          {/* Error Messages */}
          {error && (
            <div className="bg-red-900 text-white px-4 py-3 rounded mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Success Messages */}
          {success && (
            <div className="bg-green-900 text-white px-4 py-3 rounded mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>{success}</span>
            </div>
          )}
          
          {/* Auto-save Message */}
          {autosaveMessage && (
            <div className="bg-blue-900 text-white px-4 py-3 rounded mb-6 flex items-center">
              <Save className="h-5 w-5 mr-2" />
              <span>{autosaveMessage}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Project Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg shadow-md mb-6">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h2 className="text-lg font-semibold text-white">Project Information</h2>
                </div>
                <div className="px-6 py-4">
                  {/* Tabs */}
                  <div className="flex border-b border-gray-700 mb-4">
                    <button
                      className={`py-2 px-4 text-sm font-medium ${activeTab === 'project' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                      onClick={() => setActiveTab('project')}
                    >
                      Project Details
                    </button>
                    <button
                      className={`py-2 px-4 text-sm font-medium ${activeTab === 'team' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                      onClick={() => setActiveTab('team')}
                    >
                      Team
                    </button>
                    <button
                      className={`py-2 px-4 text-sm font-medium ${activeTab === 'links' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                      onClick={() => setActiveTab('links')}
                    >
                      Resources
                    </button>
                  </div>
                  
                  {/* Project Details Tab */}
                  {activeTab === 'project' && (
                    <div>
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-400">Project Title</h3>
                        <p className="text-white">{submission.project_title}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Project Description</h3>
                        <p className="text-white whitespace-pre-line mt-1">{submission.project_description}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Team Tab */}
                  {activeTab === 'team' && (
                    <div>
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-400">Team Name</h3>
                        <p className="text-white">{submission.team.team_name}</p>
                      </div>
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-400">Team Leader</h3>
                        <p className="text-white">{submission.team.leader}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Team Members</h3>
                        <ul className="mt-1 list-disc pl-5 text-white">
                          {submission.team.members.map((member, index) => (
                            <li key={index}>{member}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {/* Resources Tab */}
                  {activeTab === 'links' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Presentation</h3>
                        <a
                          href={submission.presentation_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline flex items-center mt-1"
                        >
                          View Presentation <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Demo Video</h3>
                        <a
                          href={submission.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline flex items-center mt-1"
                        >
                          Watch Video <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">GitHub Repository</h3>
                        <a
                          href={submission.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline flex items-center mt-1"
                        >
                          View Code <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Weighted Score Card */}
              <div className="bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Final Score</h3>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">
                    {calculatedScore !== null ? (
                      <span className={`
                        ${calculatedScore >= 8 ? 'text-green-400' : 
                          calculatedScore >= 6 ? 'text-blue-400' : 
                          calculatedScore >= 4 ? 'text-yellow-400' : 'text-red-400'}
                      `}>
                        {calculatedScore.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">
                    {calculatedScore !== null ? 'Weighted score based on your evaluation' : 'Complete all criteria to calculate score'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Column - Evaluation Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Evaluation Form</h2>
                
                <div className="space-y-8">
                  {/* Evaluation Criteria */}
                  {scoringCriteria.map((criterion) => (
                    <div key={criterion.id} className="pb-6 border-b border-gray-700">
                      <div className="flex flex-wrap justify-between items-start mb-3">
                        <div className="mb-2">
                          <h3 className="text-lg font-medium text-white">{criterion.name}</h3>
                          <div className="flex items-center text-sm text-gray-400">
                            <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs mr-2">
                              {criterion.tkt_level}
                            </span>
                            <span>{criterion.weight}%</span>
                          </div>
                        </div>
                        
                        {/* Score Input */}
                        <div className="flex items-center">
                          <label htmlFor={criterion.id} className="mr-3 text-gray-300">
                            Score (0-10):
                          </label>
                          <input
                            id={criterion.id}
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={data[criterion.id as keyof typeof data] as number || ''}
                            onChange={(e) => {
                              const val = e.target.value ? parseFloat(e.target.value) : null;
                              setData(criterion.id as keyof typeof data, val as any);
                            }}
                            className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <p className="text-gray-400 mb-3">{criterion.description}</p>
                      
                      {/* Score Scale Guide */}
                      <div className="grid grid-cols-5 gap-1 text-xs text-center">
                        <div className="px-2 py-1 bg-red-900/20 text-red-400 rounded">
                          0-2<br />Poor
                        </div>
                        <div className="px-2 py-1 bg-orange-900/20 text-orange-400 rounded">
                          3-4<br />Fair
                        </div>
                        <div className="px-2 py-1 bg-yellow-900/20 text-yellow-400 rounded">
                          5-6<br />Average
                        </div>
                        <div className="px-2 py-1 bg-blue-900/20 text-blue-400 rounded">
                          7-8<br />Good
                        </div>
                        <div className="px-2 py-1 bg-green-900/20 text-green-400 rounded">
                          9-10<br />Excellent
                        </div>
                      </div>
                      
                      {/* Error Message */}
                      {errors && errors[criterion.id as keyof typeof errors] && (
                        <p className="mt-1 text-sm text-red-400">{errors[criterion.id as keyof typeof errors]}</p>
                      )}
                    </div>
                  ))}
                  
                  {/* Comments Section */}
                  <div>
                    <label htmlFor="comments" className="block text-lg font-medium text-white mb-3">
                      Comments (Optional)
                    </label>
                    <textarea
                      id="comments"
                      rows={5}
                      value={data.comments}
                      onChange={(e) => setData('comments', e.target.value)}
                      placeholder="Add any additional comments about the project..."
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors?.comments && (
                      <p className="mt-1 text-sm text-red-400">{errors.comments}</p>
                    )}
                  </div>
                  
                  {/* Form Buttons */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Button
                      type="submit"
                      className="flex items-center gap-2"
                      disabled={processing || !isFormComplete()}
                    >
                      <Send className="h-4 w-4" />
                      Submit Evaluation
                    </Button>
                    
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={saveDraft}
                      className="flex items-center gap-2"
                      disabled={processing}
                    >
                      <Save className="h-4 w-4" />
                      Save as Draft
                    </Button>
                    
                    {!isFormComplete() && (
                      <div className="mt-4 bg-gray-700 text-amber-300 px-3 py-2 rounded-md flex items-center">
                        <Info className="h-5 w-5 mr-2" />
                        <span>All criteria scores must be filled to submit the evaluation.</span>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <Link href={route('judge.submissions')}>
              <Button variant="outline" className="text-gray-300">
                Back to Submissions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
