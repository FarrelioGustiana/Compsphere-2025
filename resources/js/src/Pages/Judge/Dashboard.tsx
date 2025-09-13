import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { ClipboardList, Award, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Button from '@/src/Components/UI/Button';

interface DashboardProps {
  judge: {
    id: number;
    user: {
      name: string;
    };
    specialization: string;
  };
  stats: {
    totalSubmissions: number;
    evaluatedSubmissions: number;
    pendingSubmissions: number;
    completionPercentage: number;
  };
}

export default function Dashboard({ judge, stats }: DashboardProps) {
  return (
    <DashboardLayout>
      <Head title="Judge Dashboard" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Welcome, {judge.user.name}
                </h1>
                <p className="text-blue-200">
                  Hacksphere Judging Panel
                  {judge.specialization && ` • ${judge.specialization}`}
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Submissions */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-blue-900/30 p-3 rounded-full mr-4">
                  <ClipboardList className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{stats.totalSubmissions}</h2>
                  <p className="text-gray-400">Total Submissions</p>
                </div>
              </div>
            </div>
            
            {/* Evaluated Submissions */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-green-900/30 p-3 rounded-full mr-4">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{stats.evaluatedSubmissions}</h2>
                  <p className="text-gray-400">Evaluated</p>
                </div>
              </div>
            </div>
            
            {/* Pending Submissions */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-yellow-900/30 p-3 rounded-full mr-4">
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{stats.pendingSubmissions}</h2>
                  <p className="text-gray-400">Pending Evaluation</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium text-white">Evaluation Progress</h2>
              <span className="text-white font-medium">{stats.completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${stats.completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${stats.completionPercentage}%` }}
              />
            </div>
          </div>
          
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* View Submissions */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Evaluate Projects</h2>
              <p className="text-gray-400 mb-6">
                Review and score team submissions based on the evaluation criteria.
                Each project will be scored on system functionality, UI/UX design, backend logic,
                AI model performance, and automation integration.
              </p>
              <Link href={route('judge.submissions')}>
                <Button className="w-full">
                  View All Submissions
                </Button>
              </Link>
            </div>
            
            {/* Leaderboard */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-white mb-4">View Leaderboard</h2>
              <p className="text-gray-400 mb-6">
                See the current rankings of all teams based on their evaluation scores.
                The leaderboard shows the weighted average scores across all evaluation criteria.
              </p>
              <Link href={route('judge.leaderboard')}>
                <Button className="w-full">
                  Go to Leaderboard
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Judging Criteria Reference */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Judging Criteria</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Component</th>
                    <th scope="col" className="px-6 py-3">Criteria</th>
                    <th scope="col" className="px-6 py-3">TKT Level</th>
                    <th scope="col" className="px-6 py-3">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="px-6 py-4 font-medium">Whole System Functionality</td>
                    <td className="px-6 py-4">Apakah sistem menyatu dan dapat digunakan sesuai konteks kasus PT. Kereta Api Indonesia (KAI)?</td>
                    <td className="px-6 py-4">TKT 6</td>
                    <td className="px-6 py-4">30%</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="px-6 py-4 font-medium">UI/UX Design</td>
                    <td className="px-6 py-4">Apakah antar muka ramah pengguna, intuitif, dan profesional?</td>
                    <td className="px-6 py-4">TKT 5-6</td>
                    <td className="px-6 py-4">20%</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="px-6 py-4 font-medium">Back-End & Logic</td>
                    <td className="px-6 py-4">Apakah logika sistem berjalan stabil, efisien, dan fleksibel?</td>
                    <td className="px-6 py-4">TKT 6</td>
                    <td className="px-6 py-4">25%</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="px-6 py-4 font-medium">AI Model Performance</td>
                    <td className="px-6 py-4">Apakah AI/ML digunakan secara tepat dan menghasilkan output relevan?</td>
                    <td className="px-6 py-4">TKT 5-6</td>
                    <td className="px-6 py-4">15%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Automation & Integration</td>
                    <td className="px-6 py-4">Apakah terdapat komponen otomasi atau chatbot yang real-time dan terhubung dengan sistem lain?</td>
                    <td className="px-6 py-4">TKT 6</td>
                    <td className="px-6 py-4">10%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Alert if pending evaluations */}
          {stats.pendingSubmissions > 0 && (
            <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg mt-8 flex items-start">
              <AlertTriangle className="h-5 w-5 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium">Pending Evaluations</h3>
                <p>You have {stats.pendingSubmissions} submission{stats.pendingSubmissions === 1 ? '' : 's'} that still need{stats.pendingSubmissions === 1 ? 's' : ''} to be evaluated.</p>
              </div>
            </div>
          )}
          
          {/* All evaluations complete */}
          {stats.pendingSubmissions === 0 && stats.totalSubmissions > 0 && (
            <div className="bg-green-900/20 border border-green-700 text-green-300 px-4 py-3 rounded-lg mt-8 flex items-start">
              <CheckCircle className="h-5 w-5 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium">All Evaluations Complete</h3>
                <p>Great job! You have evaluated all submissions.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
