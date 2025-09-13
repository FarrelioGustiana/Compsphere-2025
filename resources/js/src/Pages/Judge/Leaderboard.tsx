import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { Trophy, Medal, Download, Search } from 'lucide-react';
import Button from '@/src/Components/UI/Button';

interface RankedSubmission {
  id: number;
  rank: number;
  team_name: string;
  project_title: string;
  average_score: number;
  evaluations_count: number;
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
      submission.project_title.toLowerCase().includes(searchQuery.toLowerCase())
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
  
  return (
    <DashboardLayout>
      <Head title="Hacksphere Leaderboard" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-xl p-6 mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Hacksphere Leaderboard</h1>
            <p className="text-blue-200">
              Ranked project submissions based on evaluation scores
            </p>
          </div>
          
          {/* Search */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by team or project name..."
                  className="pl-10 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button 
                variant="secondary"
                className="hidden md:flex items-center gap-2 ml-4"
                onClick={() => {
                  // Create CSV data
                  const headers = ['Rank', 'Team', 'Project Title', 'Score', 'Evaluations'];
                  const csvContent = [
                    headers.join(','),
                    ...rankedSubmissions.map(s => 
                      [s.rank, s.team_name, `"${s.project_title}"`, s.average_score, s.evaluations_count].join(',')
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
                Export CSV
              </Button>
            </div>
          </div>
          
          {/* Top 3 Winners */}
          {rankedSubmissions.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* 2nd Place */}
              <div className="md:order-1 bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-700">
                <div className="flex justify-center mb-3">
                  <div className="bg-gray-700 rounded-full p-3">
                    <Medal className="h-8 w-8 text-gray-300" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white">2nd Place</h3>
                <p className="text-gray-300 text-xl font-bold mt-2">{rankedSubmissions[1]?.team_name}</p>
                <p className="text-gray-400 mt-1 truncate">{rankedSubmissions[1]?.project_title}</p>
                <p className="text-2xl font-bold text-gray-300 mt-3">{rankedSubmissions[1]?.average_score.toFixed(2)}</p>
              </div>
              
              {/* 1st Place */}
              <div className="md:order-0 bg-gradient-to-b from-amber-900/30 to-gray-800 rounded-lg shadow-md p-6 text-center border border-amber-700/50">
                <div className="flex justify-center mb-3">
                  <div className="bg-amber-900/50 rounded-full p-3">
                    <Trophy className="h-10 w-10 text-yellow-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-yellow-300">1st Place</h3>
                <p className="text-white text-2xl font-bold mt-2">{rankedSubmissions[0]?.team_name}</p>
                <p className="text-gray-300 mt-1 truncate">{rankedSubmissions[0]?.project_title}</p>
                <p className="text-3xl font-bold text-yellow-400 mt-3">{rankedSubmissions[0]?.average_score.toFixed(2)}</p>
              </div>
              
              {/* 3rd Place */}
              <div className="md:order-2 bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-700">
                <div className="flex justify-center mb-3">
                  <div className="bg-gray-700 rounded-full p-3">
                    <Medal className="h-8 w-8 text-amber-700" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white">3rd Place</h3>
                <p className="text-gray-300 text-xl font-bold mt-2">{rankedSubmissions[2]?.team_name}</p>
                <p className="text-gray-400 mt-1 truncate">{rankedSubmissions[2]?.project_title}</p>
                <p className="text-2xl font-bold text-gray-300 mt-3">{rankedSubmissions[2]?.average_score.toFixed(2)}</p>
              </div>
            </div>
          )}
          
          {/* Full Rankings Table */}
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 w-16">Rank</th>
                    <th scope="col" className="px-6 py-3">Team</th>
                    <th scope="col" className="px-6 py-3">Project</th>
                    <th scope="col" className="px-6 py-3 w-32 text-right">Score</th>
                    <th scope="col" className="px-6 py-3 w-32 text-center">Evaluations</th>
                    <th scope="col" className="px-6 py-3 w-20 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                        {searchQuery ? 'No matching submissions found' : 'No evaluated submissions available yet'}
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((submission) => (
                      <tr 
                        key={submission.id} 
                        className={`
                          border-b border-gray-700 
                          ${submission.rank === 1 ? 'bg-amber-900/10' : 
                            submission.rank === 2 ? 'bg-gray-700/40' : 
                            submission.rank === 3 ? 'bg-amber-800/10' : ''}
                        `}
                      >
                        <td className="px-6 py-4 font-bold">
                          <div className="flex items-center">
                            <span className="mr-2">{submission.rank}</span>
                            {getMedal(submission.rank)}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-white">
                          {submission.team_name}
                        </td>
                        <td className="px-6 py-4">
                          {submission.project_title}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold">
                          <span className={`
                            ${submission.average_score >= 8 ? 'text-green-400' : 
                              submission.average_score >= 6 ? 'text-blue-400' : 
                              submission.average_score >= 4 ? 'text-yellow-400' : 'text-red-400'}
                          `}>
                            {submission.average_score.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {submission.evaluations_count}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link href={route('judge.evaluate', submission.id)}>
                            <Button size="sm" variant="secondary">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Note about Score Calculation */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">About Scoring</h3>
            <p className="text-gray-300">
              Scores are calculated using the following weighted criteria:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-400 space-y-1">
              <li>Whole System Functionality (TKT 6) - <span className="text-white">30%</span></li>
              <li>UI/UX Design (TKT 5-6) - <span className="text-white">20%</span></li>
              <li>Back-End & Logic (TKT 6) - <span className="text-white">25%</span></li>
              <li>AI Model Performance (TKT 5-6) - <span className="text-white">15%</span></li>
              <li>Automation & Integration (TKT 6) - <span className="text-white">10%</span></li>
            </ul>
            <p className="mt-4 text-gray-300">
              Final scores are calculated as weighted averages across all evaluations.
            </p>
          </div>
          
          {/* Back to Dashboard */}
          <div className="mt-8 text-center">
            <Link href={route('judge.hacksphere.dashboard')}>
              <Button variant="outline" className="text-gray-300">
                Back to Judge Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
