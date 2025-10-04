import React, { useState, useEffect } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import Button from '@/src/Components/UI/Button';
import { CalendarClock, Save, Send, AlertCircle, ExternalLink, CheckCircle } from 'lucide-react';

interface ProjectSubmissionProps {
  team: {
    id: number;
    team_name: string;
    team_code: string;
  };
  submission: {
    project_title: string;
    project_description: string;
    presentation_url: string;
    youtube_url: string;
    github_url: string;
    submitted_at: string | null;
  } | null;
  isTeamLeader: boolean;
  deadlinePassed: boolean;
  deadline: string;
  errors?: {
    project_title?: string;
    project_description?: string;
    presentation_url?: string;
    youtube_url?: string;
    github_url?: string;
  };
  success?: string;
  error?: string;
  format_reminders?: string[];
}

export default function ProjectSubmission({
  team,
  submission,
  isTeamLeader,
  deadlinePassed,
  deadline,
  errors,
  success,
  error,
  format_reminders,
}: ProjectSubmissionProps) {
  const [autoSaveMessage, setAutoSaveMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  const { data, setData, processing, post, put } = useForm({
    project_title: submission?.project_title || '',
    project_description: submission?.project_description || '',
    presentation_url: submission?.presentation_url || '',
    youtube_url: submission?.youtube_url || '',
    github_url: submission?.github_url || '',
  });
  
  // Calculate time remaining until deadline
  useEffect(() => {
    const calculateTimeLeft = () => {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const difference = deadlineDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft('Deadline has passed');
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${days} days, ${hours} hours, ${minutes} minutes remaining`);
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [deadline]);
  
  // Auto-save draft functionality
  useEffect(() => {
    if (!isTeamLeader || deadlinePassed) return;
    
    const debouncedAutoSave = setTimeout(() => {
      // Don't auto-save if form is empty or hasn't been modified
      if (!data.project_title && 
          !data.project_description && 
          !data.presentation_url && 
          !data.youtube_url && 
          !data.github_url) {
        return;
      }
      
      // Only auto-save if at least one field has been filled
      if (data.project_title || 
          data.project_description || 
          data.presentation_url || 
          data.youtube_url || 
          data.github_url) {
        saveDraft();
        setAutoSaveMessage('Draft auto-saved');
        setTimeout(() => setAutoSaveMessage(null), 3000);
      }
    }, 15000); // Auto-save after 15 seconds of inactivity
    
    return () => clearTimeout(debouncedAutoSave);
  }, [data, isTeamLeader, deadlinePassed]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submission) {
      put(route('participant.team.submission.update', team.id));
    } else {
      post(route('participant.team.submission.store', team.id));
    }
  };
  
  const saveDraft = () => {
    router.post(route('participant.team.submission.draft', team.id), data);
  };
  
  const isFormValid = () => {
    return (
      data.project_title.trim() !== '' &&
      data.project_description.trim() !== '' &&
      data.presentation_url.trim() !== '' &&
      data.youtube_url.trim() !== '' &&
      data.github_url.trim() !== ''
    );
  };
  
  const isSubmitted = submission?.submitted_at !== null && submission?.submitted_at !== undefined;
  
  return (
    <DashboardLayout>
      <Head title={`${team.team_name} - Project Submission`} />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-xl p-6 mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Project Submission</h1>
            <p className="text-blue-200">Team: {team.team_name}</p>
            
            {/* Deadline Info */}
            <div className="mt-4 flex items-center">
              <CalendarClock className="h-5 w-5 text-yellow-300 mr-2" />
              <span className="text-yellow-100">
                {deadlinePassed ? (
                  'Submission deadline has passed'
                ) : (
                  <>Deadline: {new Date(deadline).toLocaleString()} ({timeLeft})</>
                )}
              </span>
            </div>
          </div>
          
          {/* Submission Guidelines */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">Submission Guidelines</h2>
            <div className="text-gray-300 space-y-3">
              <p>Please submit the following information about your project:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Project title</li>
                <li>Project description</li>
                <li>Presentation slides (Google Drive link) with the following structure:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Slide 1: Team name, project name, and team members</li>
                    <li>Slide 2: Problem statement and background</li>
                    <li>Slide 3: Solution overview</li>
                    <li>Slide 4: Demo screenshots/visuals</li>
                    <li>Slide 5: Technical aspects (tech stack, architecture, challenges)</li>
                    <li>Slide 6: Impact and future development</li>
                  </ul>
                </li>
                <li>YouTube video presentation (max 10 minutes)</li>
                <li>GitHub repository link</li>
              </ol>
              
              <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                <h3 className="text-yellow-300 font-semibold mb-2">📋 Required Naming Formats:</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-yellow-300 font-medium">YouTube Video Title:</span>
                    <br />
                    <span className="text-gray-300 font-mono bg-gray-700 px-2 py-1 rounded">Nama Tim - Judul Project - Hacksphere 2025</span>
                  </div>
                  <div>
                    <span className="text-yellow-300 font-medium">Presentation File Name:</span>
                    <br />
                    <span className="text-gray-300 font-mono bg-gray-700 px-2 py-1 rounded">Nama Tim_Judul Project_Hacksphere 2025</span>
                  </div>
                  <div>
                    <span className="text-yellow-300 font-medium">GitHub Repository:</span>
                    <br />
                    <span className="text-gray-300">Bebas (Free format)</span>
                  </div>
                </div>
              </div>
            </div>
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
          {autoSaveMessage && (
            <div className="bg-blue-900 text-white px-4 py-3 rounded mb-6 flex items-center">
              <Save className="h-5 w-5 mr-2" />
              <span>{autoSaveMessage}</span>
            </div>
          )}
          
          {/* Format Reminder Messages */}
          {format_reminders && format_reminders.length > 0 && (
            <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 px-4 py-3 rounded mb-6">
              <div className="flex items-center font-medium mb-2">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Format Reminder</span>
              </div>
              <ul className="space-y-1 text-sm">
                {format_reminders.map((reminder, index) => (
                  <li key={index}>• {reminder}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Submission Status */}
          {isSubmitted && (
            <div className="bg-green-900/20 border border-green-700 text-green-300 px-4 py-3 rounded mb-6">
              <div className="flex items-center font-medium mb-2">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Submission Complete</span>
              </div>
              <p>
                Your project was submitted on{' '}
                {new Date(submission.submitted_at!).toLocaleString()}.
                {!deadlinePassed && " You can still update your submission until the deadline."}
              </p>
            </div>
          )}
          
          {/* Non-leader Message */}
          {!isTeamLeader && (
            <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <p className="text-gray-300">
                Only the team leader can submit or edit the project submission.
                {isSubmitted ? (
                  " Your team has already submitted the project. Please contact your team leader if you need to make any changes."
                ) : (
                  " Please ask your team leader to submit the project details."
                )}
              </p>
            </div>
          )}
          
          {/* Submission Form */}
          {isTeamLeader && !deadlinePassed && (
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-md p-6">
              <div className="space-y-6">
                {/* Project Title */}
                <div>
                  <label htmlFor="project_title" className="block text-sm font-medium text-gray-300 mb-1">
                    Project Title*
                  </label>
                  <input
                    id="project_title"
                    type="text"
                    value={data.project_title}
                    onChange={(e) => setData('project_title', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your project title"
                    maxLength={255}
                  />
                  {errors?.project_title && (
                    <p className="mt-1 text-sm text-red-400">{errors.project_title}</p>
                  )}
                </div>
                
                {/* Project Description */}
                <div>
                  <label htmlFor="project_description" className="block text-sm font-medium text-gray-300 mb-1">
                    Project Description*
                  </label>
                  <textarea
                    id="project_description"
                    value={data.project_description}
                    onChange={(e) => setData('project_description', e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your project in detail"
                    maxLength={5000}
                  />
                  {errors?.project_description && (
                    <p className="mt-1 text-sm text-red-400">{errors.project_description}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    {5000 - data.project_description.length} characters remaining
                  </p>
                </div>
                
                {/* Presentation URL */}
                <div>
                  <label htmlFor="presentation_url" className="block text-sm font-medium text-gray-300 mb-1">
                    Presentation URL (Google Drive)*
                  </label>
                  <div className="relative">
                    <input
                      id="presentation_url"
                      type="text"
                      value={data.presentation_url}
                      onChange={(e) => setData('presentation_url', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      placeholder="https://drive.google.com/..."
                    />
                    {data.presentation_url && (
                      <a 
                        href={data.presentation_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                  {errors?.presentation_url && (
                    <p className="mt-1 text-sm text-red-400">{errors.presentation_url}</p>
                  )}
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-gray-400">
                      Must be a Google Drive link with public access
                    </p>
                    <p className="text-xs text-yellow-400">
                      📋 File name must follow format: <span className="font-mono bg-gray-700 px-1 rounded">{team.team_name}_[Judul Project]_Hacksphere 2025</span>
                    </p>
                  </div>
                </div>
                
                {/* YouTube URL */}
                <div>
                  <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-300 mb-1">
                    YouTube Video URL*
                  </label>
                  <div className="relative">
                    <input
                      id="youtube_url"
                      type="text"
                      value={data.youtube_url}
                      onChange={(e) => setData('youtube_url', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      placeholder="https://youtube.com/..."
                    />
                    {data.youtube_url && (
                      <a 
                        href={data.youtube_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                  {errors?.youtube_url && (
                    <p className="mt-1 text-sm text-red-400">{errors.youtube_url}</p>
                  )}
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-gray-400">
                      Video should be a maximum of 10 minutes long
                    </p>
                    <p className="text-xs text-yellow-400">
                      📋 Video title must follow format: <span className="font-mono bg-gray-700 px-1 rounded">{team.team_name} - [Judul Project] - Hacksphere 2025</span>
                    </p>
                  </div>
                </div>
                
                {/* GitHub URL */}
                <div>
                  <label htmlFor="github_url" className="block text-sm font-medium text-gray-300 mb-1">
                    GitHub Repository URL*
                  </label>
                  <div className="relative">
                    <input
                      id="github_url"
                      type="text"
                      value={data.github_url}
                      onChange={(e) => setData('github_url', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      placeholder="https://github.com/..."
                    />
                    {data.github_url && (
                      <a 
                        href={data.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                  {errors?.github_url && (
                    <p className="mt-1 text-sm text-red-400">{errors.github_url}</p>
                  )}
                  <p className="mt-1 text-xs text-green-400">
                    📋 Repository name: Bebas (Free format)
                  </p>
                </div>
                
                {/* Form Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    type="submit"
                    className="flex items-center gap-2"
                    disabled={processing || !isFormValid()}
                  >
                    <Send className="h-4 w-4" />
                    {submission ? 'Update Submission' : 'Submit Project'}
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
                </div>
                
                <p className="text-sm text-gray-400">
                  * Required fields. Make sure all links are publicly accessible.
                </p>
              </div>
            </form>
          )}
          
          {/* Deadline Passed Message */}
          {deadlinePassed && !isSubmitted && (
            <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded mb-6">
              <div className="flex items-center font-medium mb-2">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Submission Deadline Passed</span>
              </div>
              <p>
                The submission deadline ({new Date(deadline).toLocaleString()}) has passed.
                Unfortunately, it is no longer possible to submit your project.
              </p>
            </div>
          )}
          
          {/* View Only Mode (when deadline passed) */}
          {deadlinePassed && isSubmitted && (
            <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Your Submission</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Project Title</h3>
                  <p className="text-white">{submission.project_title}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Project Description</h3>
                  <p className="text-white whitespace-pre-line">{submission.project_description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Presentation</h3>
                  <a 
                    href={submission.presentation_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-2"
                  >
                    View Presentation <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">YouTube Video</h3>
                  <a 
                    href={submission.youtube_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-2"
                  >
                    Watch Video <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">GitHub Repository</h3>
                  <a 
                    href={submission.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-2"
                  >
                    View Code <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <Link href={route('participant.team.dashboard', team.id)}>
              <Button variant="outline" className="text-gray-300">
                Back to Team Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}