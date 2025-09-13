import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { route } from 'ziggy-js';
import { Search, Filter, Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Button from '@/src/Components/UI/Button';

interface Submission {
  id: number;
  project_title: string;
  team: {
    id: number;
    team_name: string;
    leader: {
      name: string;
    };
  };
  submitted_at: string;
  evaluations_count: number;
  average_score: number | null;
}

interface SubmissionsProps {
  submissions: Submission[];
  stats: {
    totalSubmissions: number;
    evaluatedSubmissions: number;
    pendingEvaluations: number;
    averageScore: number;
  };
}

export default function Submissions({ submissions, stats }: SubmissionsProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filter submissions based on search query and status
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.project_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.team.leader.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'evaluated' && submission.evaluations_count > 0) || 
      (statusFilter === 'pending' && submission.evaluations_count === 0);
      
    return matchesSearch && matchesStatus;
  });
  
  return (
    <DashboardLayout>
      <Head title="Hacksphere Submissions" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-xl p-6 mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Project Submissions</h1>
            <p className="text-blue-200">
              Manage team project submissions for Hacksphere
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Total Submissions */}
            <div className="bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="bg-blue-900/30 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{stats.totalSubmissions}</h2>
                  <p className="text-gray-400">Total Submissions</p>
                </div>
              </div>
            </div>
            
            {/* Evaluated */}
            <div className="bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="bg-green-900/30 p-3 rounded-full mr-4">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{stats.evaluatedSubmissions}</h2>
                  <p className="text-gray-400">Evaluated</p>
                </div>
              </div>
            </div>
            
            {/* Pending */}
            <div className="bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="bg-yellow-900/30 p-3 rounded-full mr-4">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{stats.pendingEvaluations}</h2>
                  <p className="text-gray-400">Pending Evaluation</p>
                </div>
              </div>
            </div>
            
            {/* Average Score */}
            <div className="bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="bg-purple-900/30 p-3 rounded-full mr-4">
                  <div className="flex items-center justify-center h-6 w-6 text-purple-400 font-bold">
                    Σ
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {stats.averageScore > 0 ? stats.averageScore.toFixed(2) : '-'}
                  </h2>
                  <p className="text-gray-400">Average Score</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              {/* Search Input */}
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
              
              <div className="flex items-center gap-4">
                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-300">Status:</span>
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="evaluated">Evaluated</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                
                {/* Export Button */}
                <Button 
                  variant="secondary"
                  className="flex items-center gap-2"
                  onClick={() => {
                    // Create CSV data
                    const headers = ['ID', 'Team', 'Project Title', 'Team Leader', 'Submitted At', 'Evaluations', 'Score'];
                    const csvContent = [
                      headers.join(','),
                      ...submissions.map(s => 
                        [s.id, s.team.team_name, `"${s.project_title}"`, s.team.leader.name, s.submitted_at, 
                         s.evaluations_count, s.average_score || ''].join(',')
                      )
                    ].join('\n');
                    
                    // Create download link
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.setAttribute('hidden', '');
                    a.setAttribute('href', url);
                    a.setAttribute('download', `hacksphere-submissions-${new Date().toISOString().split('T')[0]}.csv`);
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
          </div>
          
          {/* Submissions Table */}
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Team</th>
                    <th scope="col" className="px-6 py-3">Project Title</th>
                    <th scope="col" className="px-6 py-3">Team Leader</th>
                    <th scope="col" className="px-6 py-3">Submitted At</th>
                    <th scope="col" className="px-6 py-3">Evaluations</th>
                    <th scope="col" className="px-6 py-3">Score</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                        {searchQuery || statusFilter !== 'all' ? 
                          'No matching submissions found' : 
                          'No submissions available yet'}
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((submission) => (
                      <tr key={submission.id} className="border-b border-gray-700">
                        <td className="px-6 py-4 font-medium text-white">
                          <Link 
                            href={route('admin.hacksphere.team.details', submission.team.id)} 
                            className="hover:text-blue-400"
                          >
                            {submission.team.team_name}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          {submission.project_title}
                        </td>
                        <td className="px-6 py-4">
                          {submission.team.leader.name}
                        </td>
                        <td className="px-6 py-4">
                          {submission.submitted_at}
                        </td>
                        <td className="px-6 py-4">
                          {submission.evaluations_count > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {submission.evaluations_count}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {submission.average_score !== null ? (
                            <span className={`
                              ${submission.average_score >= 8 ? 'text-green-400' : 
                                submission.average_score >= 6 ? 'text-blue-400' : 
                                submission.average_score >= 4 ? 'text-yellow-400' : 'text-red-400'}
                            `}>
                              {submission.average_score.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
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
          
          {/* View Leaderboard Link */}
          <div className="mt-8 text-center">
            <Link href={route('admin.hacksphere.leaderboard')}>
              <Button className="text-white">
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
