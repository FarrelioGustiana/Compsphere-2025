<?php

namespace App\Http\Controllers;

use App\Models\ProjectSubmission;
use App\Models\ProjectSubmissionVote;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class VotingController extends Controller
{
    /**
     * Display the voting page with all submitted projects.
     */
    public function index(): Response
    {
        /** @var User|null $user */
        $user = Auth::user();
        
        // Get all submitted projects with their teams and vote counts
        $submissions = ProjectSubmission::with(['team.members.user', 'votes'])
            ->whereNotNull('submitted_at')
            ->get()
            ->map(function ($submission) use ($user) {
                return [
                    'id' => $submission->id,
                    'project_title' => $submission->project_title,
                    'project_description' => $submission->project_description,
                    'presentation_url' => $submission->presentation_url,
                    'youtube_url' => $submission->youtube_url,
                    'github_url' => $submission->github_url,
                    'submitted_at' => $submission->submitted_at,
                    'team' => [
                        'id' => $submission->team->id,
                        'team_name' => $submission->team->team_name,
                        'members' => $submission->team->members->map(function ($member) {
                            return [
                                'id' => $member->user->id,
                                'full_name' => $member->user->full_name,
                            ];
                        }),
                    ],
                    'vote_count' => $submission->votes->count(),
                    'has_user_voted' => $user ? $submission->hasUserVoted($user->id) : false,
                ];
            })
            ->sortByDesc('vote_count')
            ->values();

        $userVoteCount = $user ? $user->projectSubmissionVotes()->count() : 0;

        return Inertia::render('Voting/HacksphereVoting', [
            'submissions' => $submissions,
            'userVoteCount' => $userVoteCount,
            'canVote' => $user && $user->hasVerifiedEmail(),
        ]);
    }

    /**
     * Cast a vote for a project submission.
     */
    public function vote(Request $request, ProjectSubmission $submission): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'You must be logged in to vote.'
            ], 401);
        }

        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'You must verify your email to vote.'
            ], 403);
        }

        // Check if submission exists and is submitted
        if (!$submission->submitted_at) {
            return response()->json([
                'success' => false,
                'message' => 'This project has not been submitted yet.'
            ], 400);
        }

        // Check if user has already voted for this submission
        if ($submission->hasUserVoted($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'You have already voted for this project.'
            ], 400);
        }

        try {
            DB::beginTransaction();

            // Create the vote
            ProjectSubmissionVote::create([
                'user_id' => $user->id,
                'project_submission_id' => $submission->id,
                'voted_at' => now(),
            ]);

            DB::commit();

            Log::info('User voted for project submission', [
                'user_id' => $user->id,
                'submission_id' => $submission->id,
                'project_title' => $submission->project_title,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Vote cast successfully!',
                'vote_count' => $submission->votes()->count(),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error casting vote', [
                'user_id' => $user->id,
                'submission_id' => $submission->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while casting your vote. Please try again.'
            ], 500);
        }
    }

    /**
     * Remove a vote for a project submission.
     */
    public function unvote(Request $request, ProjectSubmission $submission): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'You must be logged in to remove a vote.'
            ], 401);
        }

        // Check if user has voted for this submission
        $vote = ProjectSubmissionVote::where('user_id', $user->id)
            ->where('project_submission_id', $submission->id)
            ->first();

        if (!$vote) {
            return response()->json([
                'success' => false,
                'message' => 'You have not voted for this project.'
            ], 400);
        }

        try {
            DB::beginTransaction();

            $vote->delete();

            DB::commit();

            Log::info('User removed vote for project submission', [
                'user_id' => $user->id,
                'submission_id' => $submission->id,
                'project_title' => $submission->project_title,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Vote removed successfully!',
                'vote_count' => $submission->votes()->count(),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error removing vote', [
                'user_id' => $user->id,
                'submission_id' => $submission->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while removing your vote. Please try again.'
            ], 500);
        }
    }

    /**
     * Get voting statistics for admin dashboard.
     */
    public function getVotingStats(): JsonResponse
    {
        $stats = [
            'total_votes' => ProjectSubmissionVote::count(),
            'total_voters' => ProjectSubmissionVote::distinct('user_id')->count(),
            'total_submissions' => ProjectSubmission::whereNotNull('submitted_at')->count(),
            'top_submissions' => ProjectSubmission::with(['team', 'votes'])
                ->whereNotNull('submitted_at')
                ->get()
                ->map(function ($submission) {
                    return [
                        'id' => $submission->id,
                        'project_title' => $submission->project_title,
                        'team_name' => $submission->team->team_name,
                        'vote_count' => $submission->votes->count(),
                    ];
                })
                ->sortByDesc('vote_count')
                ->take(10)
                ->values(),
        ];

        return response()->json($stats);
    }
}
