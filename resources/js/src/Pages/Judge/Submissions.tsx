import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { CheckCircle, Clock, Search, Filter } from 'lucide-react';
import Button from '@/src/Components/UI/Button';

interface Submission {
  id: number;
  team_name: string;
  project_title: string;
  submitted_at: string;
  status: 'evaluated' | 'pending';
  team_leader: string;
}

interface SubmissionsProps {
  submissions: Submission[];
}

export default function Submissions({ submissions }: SubmissionsProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filter submissions based on search query and status
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.project_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.team_leader.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'evaluated' && submission.status === 'evaluated') || 
      (statusFilter === 'pending' && submission.status === 'pending');
      
    return matchesSearch && matchesStatus;
  });
  
  // Get counts for status indicators
  const totalCount = submissions.length;
  const evaluatedCount = submissions.filter(sub => sub.status === 'evaluated').length;
  const pendingCount = submissions.filter(sub => sub.status === 'pending').length;
  
  return (
    <DashboardLayout>
      <Head title="Project Submissions | Judge" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-xl p-6 mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Project Submissions</h1>
            <p className="text-blue-200">
              Review and evaluate team projects for Hacksphere
            </p>
          </div>
          
          {/* Filter and Search */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              {/* Search Input */}
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
                  <option value="all">All ({totalCount})</option>
                  <option value="evaluated">Evaluated ({evaluatedCount})</option>
                  <option value="pending">Pending ({pendingCount})</option>
                </select>
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
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                        {searchQuery || statusFilter !== 'all' ? 
                          'No matching submissions found' : 
                          'No submissions available yet'}
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((submission) => (
                      <tr key={submission.id} className="border-b border-gray-700">
                        <td className="px-6 py-4 font-medium text-white">
                          {submission.team_name}
                        </td>
                        <td className="px-6 py-4">
                          {submission.project_title}
                        </td>
                        <td className="px-6 py-4">
                          {submission.team_leader}
                        </td>
                        <td className="px-6 py-4">
                          {submission.submitted_at}
                        </td>
                        <td className="px-6 py-4">
                          {submission.status === 'evaluated' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Evaluated
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Link href={route('judge.evaluate', submission.id)}>
                            <Button size="sm">
                              {submission.status === 'evaluated' ? 'Review' : 'Evaluate'}
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
