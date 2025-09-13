import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { route } from 'ziggy-js';
import { Trophy, Medal, Download, Search, Users } from 'lucide-react';
import Button from '@/src/Components/UI/Button';

interface TeamMember {
  id: number;
  name: string;
}

interface RankedSubmission {
  id: number;
  rank: number;
  team_id: number;
  team_name: string;
  project_title: string;
  average_score: number;
  evaluations_count: number;
  criteria_scores: {
    whole_system_functionality_score: number;
    ui_ux_design_score: number;
    backend_logic_score: number;
    ai_model_performance_score: number;
    automation_integration_score: number;
  };
  team_leader: string;
  members: string[];
}

interface LeaderboardProps {
  rankedSubmissions: RankedSubmission[];
}

export default function Leaderboard({ rankedSubmissions }: LeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filter submissions based on search query
  const filteredSubmissions = rankedSubmissions.filter(submission => {
    return (
      submission.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.project_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.team_leader.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Get medal for top 3
  const getMedal = (rank: number) => {
    if (rank === 1) {
      return <Trophy className="h-5 w-5 text-yellow-400" />;
    } else if (rank === 2) {
      return <Medal className="h-5 w-5 text-gray-400" />;
    } else if (rank === 3) {
      return <Medal className="h-5 w-5 text-amber-700" />;
    }
    return null;
  };
  
  const getScoreClass = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-blue-400';
    if (score >= 4) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  return (
    <DashboardLayout>
      <Head title="Hacksphere Leaderboard | Admin" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Hacksphere Leaderboard</h1>
                <p className="text-blue-200">
                  Final rankings for Hacksphere teams based on project evaluations
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Button 
                  variant="secondary"
                  className="flex items-center gap-2"
                  onClick={() => {
                    // Create CSV data
                    const headers = ['Rank', 'Team', 'Project Title', 'Team Leader', 'Score', 'Evaluations'];
                    const csvContent = [
                      headers.join(','),
                      ...rankedSubmissions.map(s => 
                        [s.rank, s.team_name, `"${s.project_title}"`, s.team_leader, s.average_score, s.evaluations_count].join(',')
                      )
                    ].join('\n');
                    
                    // Create download link
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.setAttribute('hidden', '');
                    a.setAttribute('href', url);
                    a.setAttribute('download', `hacksphere-leaderboard-${new Date().toISOString().split('T')[0]}.csv`);
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                >
                  <Download className="h-4 w-4" />
                  Export Leaderboard
                </Button>
              </div>
            </div>
          </div>
          
          {/* Search */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by team, project, or leader..."
                className="pl-10 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Winner Podium */}
          {rankedSubmissions.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* 2nd Place */}
              <div className="order-2 md:order-1 bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-700">
                <div className="flex justify-center mb-3">
                  <div className="bg-gray-700 rounded-full p-3">
                    <Medal className="h-8 w-8 text-gray-300" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white">2nd Place</h3>
                <p className="text-gray-300 text-xl font-bold mt-2">{rankedSubmissions[1]?.team_name || 'N/A'}</p>
                <p className="text-gray-400 mt-1 truncate">{rankedSubmissions[1]?.project_title || 'No project'}</p>
                <p className="text-2xl font-bold text-gray-300 mt-3">
                  {rankedSubmissions[1]?.average_score ? rankedSubmissions[1].average_score.toFixed(2) : '-'}
                </p>
                <div className="mt-4">
                  {rankedSubmissions[1]?.id ? (
                    <Link href={route('admin.hacksphere.submissions.show', rankedSubmissions[1].id)}>
                      <Button size="sm" variant="outline" className="text-gray-300">
                        View Details
                      </Button>
                    </Link>
                  ) : (
                    <Button size="sm" variant="outline" className="text-gray-300" disabled>
                      No Data
                    </Button>
                  )}
                </div>
              </div>
              
              {/* 1st Place */}
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-900/30 to-gray-800 rounded-lg shadow-md p-6 text-center border border-amber-700/50">
                <div className="flex justify-center mb-3">
                  <div className="bg-amber-900/50 rounded-full p-3">
                    <Trophy className="h-10 w-10 text-yellow-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-yellow-300">1st Place</h3>
                <p className="text-white text-2xl font-bold mt-2">{rankedSubmissions[0]?.team_name || 'N/A'}</p>
                <p className="text-gray-300 mt-1 truncate">{rankedSubmissions[0]?.project_title || 'No project'}</p>
                <p className="text-3xl font-bold text-yellow-400 mt-3">
                  {rankedSubmissions[0]?.average_score ? rankedSubmissions[0].average_score.toFixed(2) : '-'}
                </p>
                <div className="mt-4">
                  {rankedSubmissions[0]?.id ? (
                    <Link href={route('admin.hacksphere.submissions.show', rankedSubmissions[0].id)}>
                      <Button size="sm" variant="outline" className="text-yellow-300 border-yellow-700">
                        View Details
                      </Button>
                    </Link>
                  ) : (
                    <Button size="sm" variant="outline" className="text-yellow-300 border-yellow-700" disabled>
                      No Data
                    </Button>
                  )}
                </div>
              </div>
              
              {/* 3rd Place */}
              <div className="order-3 bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-700">
                <div className="flex justify-center mb-3">
                  <div className="bg-gray-700 rounded-full p-3">
                    <Medal className="h-8 w-8 text-amber-700" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white">3rd Place</h3>
                <p className="text-gray-300 text-xl font-bold mt-2">{rankedSubmissions[2]?.team_name || 'N/A'}</p>
                <p className="text-gray-400 mt-1 truncate">{rankedSubmissions[2]?.project_title || 'No project'}</p>
                <p className="text-2xl font-bold text-gray-300 mt-3">
                  {rankedSubmissions[2]?.average_score ? rankedSubmissions[2].average_score.toFixed(2) : '-'}
                </p>
                <div className="mt-4">
                  {rankedSubmissions[2]?.id ? (
                    <Link href={route('admin.hacksphere.submissions.show', rankedSubmissions[2].id)}>
                      <Button size="sm" variant="outline" className="text-gray-300">
                        View Details
                      </Button>
                    </Link>
                  ) : (
                    <Button size="sm" variant="outline" className="text-gray-300" disabled>
                      No Data
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Leaderboard Table */}
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 w-16">Rank</th>
                    <th scope="col" className="px-6 py-3">Team</th>
                    <th scope="col" className="px-6 py-3">Project</th>
                    <th scope="col" className="px-6 py-3">Team Leader</th>
                    <th scope="col" className="px-6 py-3 text-right">System</th>
                    <th scope="col" className="px-6 py-3 text-right">UI/UX</th>
                    <th scope="col" className="px-6 py-3 text-right">Logic</th>
                    <th scope="col" className="px-6 py-3 text-right">AI</th>
                    <th scope="col" className="px-6 py-3 text-right">Auto</th>
                    <th scope="col" className="px-6 py-3 w-24 text-right">Final Score</th>
                    <th scope="col" className="px-6 py-3 w-24 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-6 py-8 text-center text-gray-400">
                        {searchQuery ? 'No matching submissions found' : 'No evaluated submissions available yet'}
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((submission) => (
                      <tr 
                        key={submission.id} 
                        className={`
                          border-b border-gray-700 
                          ${submission.rank <= 3 ? 'bg-gray-700/30' : ''}
                          ${submission.rank === 1 ? 'bg-amber-900/20' : ''}
                        `}
                      >
                        <td className="px-6 py-4 font-bold">
                          <div className="flex items-center">
                            <span className="mr-2">{submission.rank}</span>
                            {getMedal(submission.rank)}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-white">
                          <Link href={route('admin.hacksphere.team.details', submission.team_id)} className="hover:text-blue-400">
                            {submission.team_name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate">
                          <Link href={route('admin.hacksphere.submissions.show', submission.id)} className="hover:text-blue-400">
                            {submission.project_title}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          {submission.team_leader}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={getScoreClass(submission.criteria_scores.whole_system_functionality_score)}>
                            {submission.criteria_scores.whole_system_functionality_score.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={getScoreClass(submission.criteria_scores.ui_ux_design_score)}>
                            {submission.criteria_scores.ui_ux_design_score.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={getScoreClass(submission.criteria_scores.backend_logic_score)}>
                            {submission.criteria_scores.backend_logic_score.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={getScoreClass(submission.criteria_scores.ai_model_performance_score)}>
                            {submission.criteria_scores.ai_model_performance_score.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={getScoreClass(submission.criteria_scores.automation_integration_score)}>
                            {submission.criteria_scores.automation_integration_score.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold">
                          <span className={getScoreClass(submission.average_score)}>
                            {submission.average_score.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link href={route('admin.hacksphere.submissions.show', submission.id)}>
                            <Button size="sm">View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <Link href={route('admin.hacksphere.submissions')}>
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
