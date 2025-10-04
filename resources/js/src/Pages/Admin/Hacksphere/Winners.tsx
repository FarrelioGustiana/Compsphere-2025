import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/src/Components/Layout/DashboardLayout';
import { route } from 'ziggy-js';
import { Trophy, Award, Crown, CheckCircle, XCircle, Star } from 'lucide-react';
import Button from '@/src/Components/UI/Button';

interface Submission {
  id: number;
  project_title: string;
  team_id: number;
  team_name: string;
  team_leader: string;
  evaluations_count: number;
  average_score: number;
  criteria_scores: {
    problem_solving_relevance_score: number;
    functional_mvp_prototype_score: number;
    technical_execution_score: number;
    creativity_innovation_score: number;
    impact_scalability_score: number;
    presentation_clarity_score: number;
  };
  is_winner_problem_solving: boolean;
  is_winner_technical_execution: boolean;
  is_winner_presentation: boolean;
  is_overall_winner: boolean;
  winner_categories: string[];
  winner_assigned_by: string | null;
  winner_assigned_at: string | null;
}

interface WinnersProps {
  submissions: Submission[];
}

export default function Winners({ submissions }: WinnersProps) {
  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleSetWinner = (submissionId: number, category: string, currentValue: boolean) => {
    if (processingId) return;

    const categoryNames = {
      problem_solving: 'Problem-Solving & Creativity',
      technical_execution: 'Technical Execution',
      presentation: 'Presentation & Clarity',
      overall: 'Overall Winner',
    };

    const action = currentValue ? 'remove' : 'set';
    const message = currentValue
      ? `Remove winner status for ${categoryNames[category as keyof typeof categoryNames]}?`
      : `Set as winner for ${categoryNames[category as keyof typeof categoryNames]}? This will remove the current winner if any.`;

    if (!confirm(message)) return;

    setProcessingId(submissionId);

    router.post(
      route('admin.hacksphere.winners.set', submissionId),
      {
        category: category,
        value: !currentValue,
      },
      {
        preserveScroll: true,
        onFinish: () => setProcessingId(null),
      }
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'problem_solving':
        return <Star className="h-5 w-5" />;
      case 'technical_execution':
        return <Award className="h-5 w-5" />;
      case 'presentation':
        return <Trophy className="h-5 w-5" />;
      case 'overall':
        return <Crown className="h-5 w-5" />;
      default:
        return <Trophy className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'problem_solving':
        return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
      case 'technical_execution':
        return 'text-blue-400 bg-blue-900/30 border-blue-700';
      case 'presentation':
        return 'text-purple-400 bg-purple-900/30 border-purple-700';
      case 'overall':
        return 'text-amber-400 bg-amber-900/30 border-amber-700';
      default:
        return 'text-gray-400 bg-gray-900/30 border-gray-700';
    }
  };

  // Calculate top scores for each category
  const topScores = {
    problem_solving: Math.max(
      ...submissions.map(
        (s) =>
          (s.criteria_scores.problem_solving_relevance_score || 0) +
          (s.criteria_scores.creativity_innovation_score || 0)
      )
    ),
    technical_execution: Math.max(
      ...submissions.map((s) => s.criteria_scores.technical_execution_score || 0)
    ),
    presentation: Math.max(
      ...submissions.map((s) => s.criteria_scores.presentation_clarity_score || 0)
    ),
  };

  const categories = [
    {
      key: 'problem_solving',
      name: 'Problem-Solving & Creativity',
      description: 'Highest combined score in Problem-Solving & Relevance + Creativity & Innovation',
      field: 'is_winner_problem_solving',
      scoreCalc: (s: Submission) =>
        (s.criteria_scores.problem_solving_relevance_score || 0) +
        (s.criteria_scores.creativity_innovation_score || 0),
    },
    {
      key: 'technical_execution',
      name: 'Technical Execution',
      description: 'Highest score in Technical Execution criterion',
      field: 'is_winner_technical_execution',
      scoreCalc: (s: Submission) => s.criteria_scores.technical_execution_score || 0,
    },
    {
      key: 'presentation',
      name: 'Presentation & Clarity',
      description: 'Highest score in Presentation & Clarity criterion',
      field: 'is_winner_presentation',
      scoreCalc: (s: Submission) => s.criteria_scores.presentation_clarity_score || 0,
    },
    {
      key: 'overall',
      name: 'Overall Winner',
      description: 'Best overall performance across all criteria',
      field: 'is_overall_winner',
      scoreCalc: (s: Submission) => s.average_score || 0,
    },
  ];

  return (
    <DashboardLayout>
      <Head title="Hacksphere Winners" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-900 to-yellow-900 rounded-lg shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Trophy className="h-8 w-8" />
                  Winner Categories Management
                </h1>
                <p className="text-amber-200">
                  Select winners for each judging criteria category
                </p>
              </div>
              <Link href={route('admin.hacksphere.submissions')}>
                <Button variant="secondary">Back to Submissions</Button>
              </Link>
            </div>
          </div>

          {/* Winner Categories */}
          {categories.map((category) => {
            const currentWinner = submissions.find(
              (s) => s[category.field as keyof Submission] === true
            );
            const topSubmissions = submissions
              .map((s) => ({
                ...s,
                categoryScore: category.scoreCalc(s),
              }))
              .sort((a, b) => b.categoryScore - a.categoryScore)
              .slice(0, 5);

            return (
              <div key={category.key} className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                {/* Category Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-lg border ${getCategoryColor(category.key)}`}
                    >
                      {getCategoryIcon(category.key)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{category.name}</h2>
                      <p className="text-gray-400 text-sm">{category.description}</p>
                    </div>
                  </div>
                  {currentWinner && (
                    <div className="flex items-center gap-2 bg-green-900/30 px-4 py-2 rounded-lg border border-green-700">
                      <Crown className="h-5 w-5 text-yellow-400" />
                      <span className="text-green-300 font-semibold">Winner Selected</span>
                    </div>
                  )}
                </div>

                {/* Current Winner Display */}
                {currentWinner && (
                  <div className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border-2 border-amber-600 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Crown className="h-8 w-8 text-yellow-400" />
                        <div>
                          <div className="text-lg font-bold text-white">
                            {currentWinner.team_name}
                          </div>
                          <div className="text-amber-300">{currentWinner.project_title}</div>
                          <div className="text-sm text-gray-400 mt-1">
                            Score: {category.scoreCalc(currentWinner).toFixed(2)} | Assigned by:{' '}
                            {currentWinner.winner_assigned_by || 'Unknown'}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          handleSetWinner(currentWinner.id, category.key, true)
                        }
                        disabled={processingId === currentWinner.id}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}

                {/* Top Submissions Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                      <tr>
                        <th scope="col" className="px-4 py-3">
                          Rank
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Team
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Project
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Category Score
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Overall Score
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topSubmissions.map((submission, index) => {
                        const isCurrentWinner =
                          submission[category.field as keyof Submission] === true;

                        return (
                          <tr
                            key={submission.id}
                            className={`border-b border-gray-700 ${
                              isCurrentWinner ? 'bg-amber-900/10' : ''
                            }`}
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">#{index + 1}</span>
                                {index === 0 && !isCurrentWinner && (
                                  <Star className="h-4 w-4 text-yellow-400" />
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 font-medium text-white">
                              <Link
                                href={route('admin.hacksphere.team.details', submission.team_id)}
                                className="hover:text-blue-400"
                              >
                                {submission.team_name}
                              </Link>
                            </td>
                            <td className="px-4 py-4">{submission.project_title}</td>
                            <td className="px-4 py-4">
                              <span
                                className={`font-bold ${
                                  submission.categoryScore ===
                                  topScores[category.key as keyof typeof topScores]
                                    ? 'text-yellow-400'
                                    : 'text-white'
                                }`}
                              >
                                {submission.categoryScore.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-gray-300">
                                {submission.average_score.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              {isCurrentWinner ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Current Winner
                                </span>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleSetWinner(submission.id, category.key, false)
                                  }
                                  disabled={processingId === submission.id}
                                >
                                  <Trophy className="h-4 w-4 mr-1" />
                                  Set as Winner
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
