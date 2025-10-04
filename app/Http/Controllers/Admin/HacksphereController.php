<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Team;
use App\Models\TeamActivityVerification;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HacksphereController extends Controller
{
    /**
     * Helper function to calculate scores with backward compatibility
     * 
     * @param \Illuminate\Support\Collection $evaluations
     * @return array ['average_score' => float, 'criteria_scores' => array]
     */
    private function calculateScores($evaluations)
    {
        $evaluationsCount = $evaluations->count();
        $averageScore = 0;
        
        if ($evaluationsCount === 0) {
            return [
                'average_score' => 0,
                'criteria_scores' => [
                    'problem_solving_relevance_score' => 0,
                    'functional_mvp_prototype_score' => 0,
                    'technical_execution_score' => 0,
                    'creativity_innovation_score' => 0,
                    'impact_scalability_score' => 0,
                    'presentation_clarity_score' => 0,
                ],
            ];
        }
        
        // Check if using new or old criteria format
        $firstEvaluation = $evaluations->first();
        $useNewFormat = $firstEvaluation && isset($firstEvaluation->problem_solving_relevance_score);
        
        if ($useNewFormat) {
            // New format
            $criteriaScores = [
                'problem_solving_relevance_score' => $evaluations->avg('problem_solving_relevance_score'),
                'functional_mvp_prototype_score' => $evaluations->avg('functional_mvp_prototype_score'),
                'technical_execution_score' => $evaluations->avg('technical_execution_score'),
                'creativity_innovation_score' => $evaluations->avg('creativity_innovation_score'),
                'impact_scalability_score' => $evaluations->avg('impact_scalability_score'),
                'presentation_clarity_score' => $evaluations->avg('presentation_clarity_score'),
            ];
            
            $weights = [
                'problem_solving_relevance_score' => 0.25,
                'functional_mvp_prototype_score' => 0.25,
                'technical_execution_score' => 0.20,
                'creativity_innovation_score' => 0.10,
                'impact_scalability_score' => 0.10,
                'presentation_clarity_score' => 0.10,
            ];
            
            $weightedTotal = 0;
            foreach ($criteriaScores as $criterion => $score) {
                $weightedTotal += ($score ?? 0) * $weights[$criterion];
            }
            
            $averageScore = $weightedTotal;
        } else {
            // Old format - convert to new format for display
            $oldCriteriaScores = [
                'whole_system_functionality_score' => $evaluations->avg('whole_system_functionality_score'),
                'ui_ux_design_score' => $evaluations->avg('ui_ux_design_score'),
                'backend_logic_score' => $evaluations->avg('backend_logic_score'),
                'ai_model_performance_score' => $evaluations->avg('ai_model_performance_score'),
                'automation_integration_score' => $evaluations->avg('automation_integration_score'),
            ];
            
            $oldWeights = [
                'whole_system_functionality_score' => 0.30,
                'ui_ux_design_score' => 0.20,
                'backend_logic_score' => 0.25,
                'ai_model_performance_score' => 0.15,
                'automation_integration_score' => 0.10,
            ];
            
            $weightedTotal = 0;
            foreach ($oldCriteriaScores as $criterion => $score) {
                $weightedTotal += ($score ?? 0) * $oldWeights[$criterion];
            }
            
            $averageScore = $weightedTotal;
            
            // Map old criteria to new format for frontend
            $criteriaScores = [
                'problem_solving_relevance_score' => $oldCriteriaScores['whole_system_functionality_score'] ?? 0,
                'functional_mvp_prototype_score' => $oldCriteriaScores['backend_logic_score'] ?? 0,
                'technical_execution_score' => $oldCriteriaScores['ui_ux_design_score'] ?? 0,
                'creativity_innovation_score' => $oldCriteriaScores['ai_model_performance_score'] ?? 0,
                'impact_scalability_score' => $oldCriteriaScores['ai_model_performance_score'] ?? 0,
                'presentation_clarity_score' => $oldCriteriaScores['automation_integration_score'] ?? 0,
            ];
        }
        
        return [
            'average_score' => $averageScore,
            'criteria_scores' => $criteriaScores,
        ];
    }
    
    /**
     * Display the dashboard with team statistics by category
     *
     * @return \Inertia\Response
     */
    public function dashboard()
    {
        // Get the Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();

        if (!$hacksphereEvent) {
            return back()->with('error', 'Hacksphere event not found.');
        }

        // Get team statistics by category
        $teamsByCategory = Team::where('event_id', $hacksphereEvent->id)
            ->select('category', DB::raw('count(*) as total'))
            ->groupBy('category')
            ->get()
            ->pluck('total', 'category')
            ->toArray();

        // Format category names for display
        $formattedCategories = [];
        $categoryLabels = [
            'high_school' => 'High School',
            'university' => 'University',
            'non_academic' => 'Non-Academic'
        ];

        foreach ($categoryLabels as $key => $label) {
            $formattedCategories[$label] = $teamsByCategory[$key] ?? 0;
        }

        // Get total teams count
        $totalTeams = array_sum($teamsByCategory);

        // Get teams with payment status
        $teamsWithPaymentStatus = Team::where('event_id', $hacksphereEvent->id)
            ->with(['leader.user'])
            ->get()
            ->map(function ($team) use ($hacksphereEvent) {
                // Get payment status from team leader
                $paymentStatus = 'pending';
                if ($team->leader) {
                    $leaderRegistration = EventRegistration::where('user_id', $team->leader->user_id)
                        ->where('event_id', $hacksphereEvent->id)
                        ->first();
                    
                    if ($leaderRegistration) {
                        $paymentStatus = $leaderRegistration->payment_status;
                    }
                }

                return [
                    'id' => $team->id,
                    'team_name' => $team->team_name,
                    'category' => $team->category,
                    'category_label' => $categoryLabels[$team->category] ?? $team->category,
                    'payment_status' => $paymentStatus,
                    'leader_name' => $team->leader ? $team->leader->user->full_name : 'No leader',
                ];
            });

        // Get payment statistics
        $paymentStats = [
            'paid' => $teamsWithPaymentStatus->where('payment_status', 'paid')->count(),
            'pending' => $teamsWithPaymentStatus->where('payment_status', 'pending')->count(),
            'failed' => $teamsWithPaymentStatus->where('payment_status', 'failed')->count(),
        ];

        return Inertia::render('Admin/Hacksphere/Dashboard', [
            'teamsByCategory' => $formattedCategories,
            'totalTeams' => $totalTeams,
            'paymentStats' => $paymentStats,
            'recentTeams' => $teamsWithPaymentStatus->take(5),
        ]);
    }

    /**
     * Display the activities page for Hacksphere event
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function activities(Request $request)
    {
        // Get the Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();

        if (!$hacksphereEvent) {
            return back()->with('error', 'Hacksphere event not found.');
        }

        // Get all activities for Hacksphere
        $activities = Activity::where('event_id', $hacksphereEvent->id)
            ->with(['teams' => function ($query) {
                $query->withPivot(['status', 'verified_at', 'verified_by']);
            }])
            ->get();

        // Get all teams for Hacksphere
        $teams = Team::where('event_id', $hacksphereEvent->id)
            ->with(['leader', 'members', 'activities' => function ($query) {
                $query->withPivot(['status', 'verified_at', 'verified_by']);
            }])
            ->get();

        // Format activities data for frontend
        $formattedActivities = $activities->map(function ($activity) use ($teams) {
            $teamsCompleted = $activity->teams()->wherePivot('status', 'used')->count();

            return [
                'id' => $activity->id,
                'name' => $activity->name,
                'description' => $activity->description,
                'activity_code' => $activity->activity_code,
                'is_active' => $activity->is_active,
                'teams_completed' => $teamsCompleted,
                'total_teams' => $teams->count(),
                'progress_percentage' => $teams->count() > 0 ? ($teamsCompleted / $teams->count()) * 100 : 0,
            ];
        });

        // Format teams data with their activity statuses
        $formattedTeams = $teams->map(function ($team) use ($activities) {
            $activityStatuses = [];

            foreach ($activities as $activity) {
                $verification = $team->activities()->where('activities.id', $activity->id)->first();

                $status = 'not_verified';
                $verified_at = null;
                $verified_by_name = null;

                if ($verification && $verification->pivot->status === 'used') {
                    $status = 'verified';
                    $verified_at = $verification->pivot->verified_at;

                    if ($verification->pivot->verified_by) {
                        $verifier = \App\Models\User::find($verification->pivot->verified_by);
                        $verified_by_name = $verifier ? $verifier->full_name : 'Unknown';
                    }
                }

                $activityStatuses[$activity->id] = [
                    'status' => $status,
                    'verified_at' => $verified_at,
                    'verified_by' => $verified_by_name,
                ];
            }

            return [
                'id' => $team->id,
                'team_name' => $team->team_name,
                'leader_name' => $team->leader ? $team->leader->user->full_name : 'No leader',
                'activity_statuses' => $activityStatuses,
            ];
        });

        return Inertia::render('Admin/Hacksphere/Activities', [
            'activities' => $formattedActivities,
            'teams' => $formattedTeams,
        ]);
    }

    /**
     * Display the teams page for Hacksphere event
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function teams(Request $request)
    {
        // Get the Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();

        if (!$hacksphereEvent) {
            return back()->with('error', 'Hacksphere event not found.');
        }

        // Get all activities for Hacksphere
        $activities = Activity::where('event_id', $hacksphereEvent->id)->get();

        // Get filter parameters
        $categoryFilter = $request->input('category');
        
        // Build query for teams
        $teamsQuery = Team::where('event_id', $hacksphereEvent->id);
        
        // Apply category filter if provided
        if ($categoryFilter) {
            $teamsQuery->where('category', $categoryFilter);
        }
        
        // Get all teams for Hacksphere with relations
        $teams = $teamsQuery->with([
                'leader.user',
                'members.user',
                'activities' => function ($query) {
                    $query->withPivot(['status', 'verified_at']);
                }
            ])
            ->get();

        // Format teams data for the frontend
        $formattedTeams = $teams->map(function ($team) use ($activities) {
            // Calculate progress
            $completedActivities = 0;
            foreach ($activities as $activity) {
                $verification = $team->activities()->where('activities.id', $activity->id)->first();
                if ($verification && $verification->pivot->status === 'used') {
                    $completedActivities++;
                }
            }

            $progress = $activities->count() > 0 ? ($completedActivities / $activities->count()) * 100 : 0;

            return [
                'id' => $team->id,
                'team_name' => $team->team_name,
                'team_code' => $team->team_code,
                'category' => $team->category, // Menambahkan kategori tim
                'leader_name' => $team->leader ? $team->leader->user->full_name : 'No leader',
                'member_count' => $team->members->count() + ($team->leader ? 1 : 0), // Leader + members
                'progress_percentage' => $progress,
                'created_at' => $team->created_at,
            ];
        });

        // Get category counts for filtering
        $categoryLabels = [
            'high_school' => 'High School',
            'university' => 'University',
            'non_academic' => 'Non-Academic'
        ];
        
        // Get count of teams by category
        $categoryCounts = Team::where('event_id', $hacksphereEvent->id)
            ->select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->get()
            ->mapWithKeys(function ($item) use ($categoryLabels) {
                $label = $categoryLabels[$item->category] ?? $item->category;
                return [$item->category => [
                    'label' => $label,
                    'count' => $item->count
                ]];
            })
            ->toArray();
            
        return Inertia::render('Admin/Hacksphere/Teams', [
            'teams' => $formattedTeams,
            'total_teams' => $teams->count(),
            'categories' => $categoryCounts,
            'activeFilter' => $categoryFilter,
        ]);
    }

    /**
     * Display the team details page
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $team_id
     * @return \Inertia\Response
     */
    public function teamDetails(Request $request, $team_id)
    {
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();

        // Get the team with relations
        $team = Team::with([
            'leader.user',
            'members.user',
            'activities' => function ($query) {
                $query->withPivot(['status', 'verified_at', 'verified_by']);
            }
        ])->find($team_id);

        if (!$team) {
            return back()->with('error', 'Team not found.');
        }

        // Format team members data
        $members = [];

        // Add leader
        if ($team->leader) {
            $leaderRegistration = EventRegistration::where('user_id', $team->leader->user_id)->where('event_id', $hacksphereEvent->id)->first();

            $members[] = [
                'id' => $team->leader->user_id,
                'full_name' => $team->leader->user->full_name,
                'email' => $team->leader->user->email,
                'role' => 'Leader',
                'nik' => $team->leader->nik,
                'category' => $team->leader->category,
                'domicile' => $team->leader->domicile,
                'payment_status' => $leaderRegistration ? $leaderRegistration->payment_status : null,
                'payment_date' => $leaderRegistration ? $leaderRegistration->payment_date : null,
                'twibbon_link' => $leaderRegistration ? $leaderRegistration->twibbon_link : null
            ];
        }

        // Add other members
        foreach ($team->members as $member) {
            $memberRegistration = EventRegistration::where('user_id', $member->user_id)->where('event_id', $hacksphereEvent->id)->first();

            $members[] = [
                'id' => $member->user_id,
                'full_name' => $member->user->full_name,
                'email' => $member->user->email,
                'role' => 'Member',
                'nik' => $member->nik,
                'category' => $member->category,
                'domicile' => $member->domicile,
                'payment_status' => $memberRegistration ? $memberRegistration->payment_status : null,
                'payment_date' => $memberRegistration ? $memberRegistration->payment_date : null,
                'twibbon_link' => $memberRegistration ? $memberRegistration->twibbon_link : null,
            ];
        }

        // Format activities data
        $activities = $team->activities->map(function ($activity) {
            $status = $activity->pivot->status === 'used' ? 'Completed' : 'Not Completed';
            $verified_by_name = null;

            if ($activity->pivot->verified_by) {
                $verifier = \App\Models\User::find($activity->pivot->verified_by);
                $verified_by_name = $verifier ? $verifier->full_name : 'Unknown';
            }

            return [
                'id' => $activity->id,
                'name' => $activity->name,
                'description' => $activity->description,
                'status' => $status,
                'verified_at' => $activity->pivot->verified_at,
                'verified_by' => $verified_by_name,
            ];
        });

        // Get payment amount from leader's event registration
        $paymentAmount = null;
        $paymentStatus = null;
        $registrationStatus = null;
        if ($team->leader) {
            $leaderRegistration = EventRegistration::where('user_id', $team->leader->user_id)
                ->where('event_id', $hacksphereEvent->id)
                ->first();

            if ($leaderRegistration && $leaderRegistration->payment_amount) {
                $paymentAmount = $leaderRegistration->payment_amount;
                $paymentStatus = $leaderRegistration->payment_status;
                $registrationStatus = $leaderRegistration->registration_status;
            }
        }

        return Inertia::render('Admin/Hacksphere/TeamDetails', [
            'team' => [
                'id' => $team->id,
                'team_name' => $team->team_name,
                'team_code' => $team->team_code,
                'profile_picture' => $team->profile_picture,
                'created_at' => $team->created_at,
                'payment_amount' => $paymentAmount,
                'payment_status' => $paymentStatus,
                'registration_status' => $registrationStatus
            ],
            'members' => $members,
            'activities' => $activities,
        ]);
    }

    public function verifyPayment($user_id)
    {
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();

        // Find the user's event registration
        $eventRegistration = EventRegistration::where('user_id', $user_id)
            ->where('event_id', $hacksphereEvent->id)
            ->first();

        if (!$eventRegistration) {
            return back()->with('error', 'Event registration not found.');
        }

        // Find the team for this user (either as leader or member)
        $team = Team::where('team_leader_id', $user_id)
            ->where('event_id', $hacksphereEvent->id)
            ->first();

        if (!$team) {
            // Check if user is a team member
            $teamMember = \App\Models\TeamMember::where('user_id', $user_id)->first();
            if ($teamMember) {
                $team = Team::find($teamMember->team_id);
            }
        }

        if (!$team) {
            // If no team found, just update this individual registration
            $eventRegistration->payment_status = 'paid';
            $eventRegistration->payment_date = now();
            $eventRegistration->save();
            return back()->with('success', 'Individual payment verified successfully.');
        }

        // Update team leader's payment status
        $leaderRegistration = EventRegistration::where('user_id', $team->team_leader_id)
            ->where('event_id', $hacksphereEvent->id)
            ->first();

        if ($leaderRegistration) {
            $leaderRegistration->payment_status = 'paid';
            $leaderRegistration->payment_date = now();
            $leaderRegistration->save();
        }

        // Update all team members' payment status
        $teamMembers = $team->members;
        foreach ($teamMembers as $member) {
            $memberRegistration = EventRegistration::where('user_id', $member->user_id)
                ->where('event_id', $hacksphereEvent->id)
                ->first();

            if ($memberRegistration) {
                $memberRegistration->payment_status = 'paid';
                $memberRegistration->payment_date = now();
                $memberRegistration->save();
            }
        }

        return back()->with('success', 'Team payment verified successfully for all members.');
    }

    /**
     * Reject a payment for Hacksphere event
     */
    public function rejectPayment($user_id)
    {
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();

        // Find the user's event registration
        $eventRegistration = EventRegistration::where('user_id', $user_id)
            ->where('event_id', $hacksphereEvent->id)
            ->first();

        if (!$eventRegistration) {
            return back()->with('error', 'Event registration not found.');
        }

        // Find the team for this user (either as leader or member)
        $team = Team::where('team_leader_id', $user_id)
            ->where('event_id', $hacksphereEvent->id)
            ->first();

        if (!$team) {
            // Check if user is a team member
            $teamMember = \App\Models\TeamMember::where('user_id', $user_id)->first();
            if ($teamMember) {
                $team = Team::find($teamMember->team_id);
            }
        }

        if (!$team) {
            // If no team found, just update this individual registration
            $eventRegistration->payment_status = 'failed';
            $eventRegistration->payment_date = null;
            $eventRegistration->save();
            return back()->with('success', 'Individual payment rejected successfully.');
        }

        // Update team leader's payment status
        $leaderRegistration = EventRegistration::where('user_id', $team->team_leader_id)
            ->where('event_id', $hacksphereEvent->id)
            ->first();

        if ($leaderRegistration) {
            $leaderRegistration->payment_status = 'failed';
            $leaderRegistration->payment_date = null;
            $leaderRegistration->save();
        }

        // Update all team members' payment status
        $teamMembers = $team->members;
        foreach ($teamMembers as $member) {
            $memberRegistration = EventRegistration::where('user_id', $member->user_id)
                ->where('event_id', $hacksphereEvent->id)
                ->first();

            if ($memberRegistration) {
                $memberRegistration->payment_status = 'failed';
                $memberRegistration->payment_date = null;
                $memberRegistration->save();
            }
        }

        return back()->with('success', 'Team payment rejected for all members.');
    }

    /**
     * Verify payment for the entire team at once
     * 
     * @param int $team_id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function verifyTeamPayment($team_id)
    {
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();

        if (!$hacksphereEvent) {
            return back()->with('error', 'Hacksphere event not found.');
        }

        $team = Team::with(['leader', 'members'])->find($team_id);

        if (!$team) {
            return back()->with('error', 'Team not found.');
        }

        // Update team leader's payment status
        if ($team->leader) {
            $leaderRegistration = EventRegistration::where('user_id', $team->leader->user_id)
                ->where('event_id', $hacksphereEvent->id)
                ->first();

            if ($leaderRegistration) {
                $leaderRegistration->payment_status = 'paid';
                $leaderRegistration->payment_date = new DateTime();
                $leaderRegistration->save();
            }
        }

        // Update all team members' payment status
        foreach ($team->members as $member) {
            $memberRegistration = EventRegistration::where('user_id', $member->user_id)
                ->where('event_id', $hacksphereEvent->id)
                ->first();

            if ($memberRegistration) {
                $memberRegistration->payment_status = 'paid';
                $memberRegistration->payment_date = new DateTime();
                $memberRegistration->save();
            }
        }

        return back()->with('success', 'Team payment verified successfully for all members.');
    }

    /**
     * Reject payment for the entire team at once
     * 
     * @param int $team_id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function rejectTeamPayment($team_id)
    {
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();

        if (!$hacksphereEvent) {
            return back()->with('error', 'Hacksphere event not found.');
        }

        $team = Team::with(['leader', 'members'])->find($team_id);

        if (!$team) {
            return back()->with('error', 'Team not found.');
        }

        // Update team leader's payment status
        if ($team->leader) {
            $leaderRegistration = EventRegistration::where('user_id', $team->leader->user_id)
                ->where('event_id', $hacksphereEvent->id)
                ->first();

            if ($leaderRegistration) {
                $leaderRegistration->payment_status = 'failed';
                $leaderRegistration->payment_date = null;
                $leaderRegistration->save();
            }
        }

        // Update all team members' payment status
        foreach ($team->members as $member) {
            $memberRegistration = EventRegistration::where('user_id', $member->user_id)
                ->where('event_id', $hacksphereEvent->id)
                ->first();

            if ($memberRegistration) {
                $memberRegistration->payment_status = 'failed';
                $memberRegistration->payment_date = null;
                $memberRegistration->save();
            }
        }

        return back()->with('success', 'Team payment rejected for all members.');
    }

    public function changeTeamRegistrationStatus(Request $request)
    {
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();

        if (!$hacksphereEvent) {
            return back()->with('error', 'Hacksphere event not found.');
        }

        $team = Team::with(['leader', 'members'])->find($request->team_id);

        if (!$team) {
            return back()->with('error', 'Team not found.');
        }

        if ($team->leader) {
            $leaderRegistration = EventRegistration::where('user_id', $team->leader->user_id)
                ->where('event_id', $hacksphereEvent->id)
                ->first();

            if ($leaderRegistration) {
                $leaderRegistration->registration_status = $request->status;
                $leaderRegistration->save();
            }
        }

        foreach ($team->members as $member) {
            $memberRegistration = EventRegistration::where('user_id', $member->user_id)
                ->where('event_id', $hacksphereEvent->id)
                ->first();

            if ($memberRegistration) {
                $memberRegistration->registration_status = $request->status;
                $memberRegistration->save();
            }
        }

        return back()->with('success', 'Team registration status changed successfully.');
    }

    /**
     * Display the payments page for Hacksphere event
     * 
     * @return \Inertia\Response
     */
    public function payments()
    {
        // Get the Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();

        if (!$hacksphereEvent) {
            return back()->with('error', 'Hacksphere event not found.');
        }

        // Get all teams for Hacksphere with payment information
        $teams = Team::where('event_id', $hacksphereEvent->id)
            ->with(['leader.user', 'members.user'])
            ->get();
            
        $formattedTeams = $teams->map(function($team) use ($hacksphereEvent) {
            // Get payment statuses for all team members
            $teamMembers = [];
            $verifiedPayments = 0;
            $pendingPayments = 0;
            
            // Process leader
            if ($team->leader) {
                $leaderRegistration = EventRegistration::where('user_id', $team->leader->user_id)
                    ->where('event_id', $hacksphereEvent->id)
                    ->first();
                    
                $paymentStatus = $leaderRegistration ? $leaderRegistration->payment_status : 'pending';
                $paymentVerifiedAt = $leaderRegistration && $leaderRegistration->payment_date ? $leaderRegistration->payment_date : null;
                
                if ($paymentStatus === 'paid') {
                    $verifiedPayments++;
                } else {
                    $pendingPayments++;
                }
                
                $teamMembers[] = [
                    'id' => $team->leader->id,
                    'user_id' => $team->leader->user_id,
                    'name' => $team->leader->user->full_name,
                    'email' => $team->leader->user->email,
                    'role' => 'Leader',
                    'payment_status' => $paymentStatus,
                    'payment_verified_at' => $paymentVerifiedAt
                ];
            }
            
            // Process members
            foreach ($team->members as $member) {
                $memberRegistration = EventRegistration::where('user_id', $member->user_id)
                    ->where('event_id', $hacksphereEvent->id)
                    ->first();
                    
                $paymentStatus = $memberRegistration ? $memberRegistration->payment_status : 'pending';
                $paymentVerifiedAt = $memberRegistration && $memberRegistration->payment_date ? $memberRegistration->payment_date : null;
                
                if ($paymentStatus === 'paid') {
                    $verifiedPayments++;
                } else {
                    $pendingPayments++;
                }
                
                $teamMembers[] = [
                    'id' => $member->id,
                    'user_id' => $member->user_id,
                    'name' => $member->user->full_name,
                    'email' => $member->user->email,
                    'role' => 'Member',
                    'payment_status' => $paymentStatus,
                    'payment_verified_at' => $paymentVerifiedAt
                ];
            }
            
            $totalMembers = count($teamMembers);
            
            return [
                'id' => $team->id,
                'team_name' => $team->team_name,
                'team_code' => $team->team_code,
                'leader_name' => $team->leader ? $team->leader->user->full_name : 'No leader',
                'total_members' => $totalMembers,
                'verified_payments' => $verifiedPayments,
                'pending_payments' => $pendingPayments,
                'all_payments_verified' => $verifiedPayments === $totalMembers,
                'team_members' => $teamMembers,
                'created_at' => $team->created_at->format('Y-m-d H:i:s')
            ];
        });
        
        return Inertia::render('Admin/Hacksphere/Payments', [
            'teams' => $formattedTeams,
            'total_teams' => $teams->count(),
        ]);
    }
    
    /**
     * Display the project submissions list page
     * 
     * @return \Inertia\Response
     */
    public function submissions()
    {
        // Get the Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();

        if (!$hacksphereEvent) {
            return back()->with('error', 'Hacksphere event not found.');
        }
        
        // Get all project submissions with evaluations
        $submissions = \App\Models\ProjectSubmission::with([
            'team.leader.user', 
            'team.members.user',
            'evaluations.judge.user'
        ])->get();
        
        // Calculate statistics
        $totalSubmissions = $submissions->count();
        $evaluatedSubmissions = 0;
        $pendingEvaluations = 0;
        $totalScore = 0;
        $evaluatedCount = 0;
        
        $formattedSubmissions = $submissions->map(function($submission) use (&$evaluatedSubmissions, &$pendingEvaluations, &$totalScore, &$evaluatedCount) {
            // Calculate average scores using helper function
            $evaluations = $submission->evaluations;
            $evaluationsCount = $evaluations->count();
            
            $scores = $this->calculateScores($evaluations);
            $averageScore = $scores['average_score'];
            $criteriaScores = $scores['criteria_scores'];
            
            if ($evaluationsCount > 0) {
                $evaluatedSubmissions++;
                $totalScore += $averageScore;
                $evaluatedCount++;
            } else {
                $pendingEvaluations++;
            }
            
            return [
                'id' => $submission->id,
                'project_title' => $submission->project_title,
                'submitted_at' => $submission->submitted_at,
                'team' => [
                    'id' => $submission->team->id,
                    'team_name' => $submission->team->team_name,
                    'leader' => [
                        'name' => $submission->team->leader ? $submission->team->leader->user->full_name : 'No leader',
                    ],
                ],
                'evaluations_count' => $evaluationsCount,
                'average_score' => $averageScore,
                'criteria_scores' => $criteriaScores,
            ];
        });
        
        // Calculate average score across all evaluated submissions
        $averageScore = $evaluatedCount > 0 ? $totalScore / $evaluatedCount : 0;
        
        // Prepare stats for the frontend
        $stats = [
            'totalSubmissions' => $totalSubmissions,
            'evaluatedSubmissions' => $evaluatedSubmissions,
            'pendingEvaluations' => $pendingEvaluations,
            'averageScore' => $averageScore,
        ];
        
        return Inertia::render('Admin/Hacksphere/Submissions', [
            'submissions' => $formattedSubmissions,
            'stats' => $stats,
        ]);
    }
    
    /**
     * Display the project submission details page
     * 
     * @param int $submission_id
     * @return \Inertia\Response
     */
    public function submissionDetails($submission_id)
    {
        $submission = \App\Models\ProjectSubmission::with([
            'team.leader.user',
            'team.members.user',
            'evaluations.judge.user'
        ])->findOrFail($submission_id);
        
        // Format team members
        $teamMembers = [];
        if ($submission->team->leader) {
            $teamMembers[] = [
                'id' => $submission->team->leader->id,
                'name' => $submission->team->leader->user->full_name,
                'email' => $submission->team->leader->user->email,
                'role' => 'Leader',
            ];
        }
        
        foreach ($submission->team->members as $member) {
            $teamMembers[] = [
                'id' => $member->id,
                'name' => $member->user->full_name,
                'email' => $member->user->email,
                'role' => 'Member',
            ];
        }
        
        // Check format from first evaluation
        $firstEval = $submission->evaluations->first();
        $useNewFormat = $firstEval && isset($firstEval->problem_solving_relevance_score);
        
        // Format evaluations
        $evaluations = $submission->evaluations->map(function($evaluation) use ($useNewFormat) {
            $evalData = [
                'id' => $evaluation->id,
                'judge_name' => $evaluation->judge->user->full_name,
                'comments' => $evaluation->comments,
                'created_at' => $evaluation->created_at,
            ];
            
            if ($useNewFormat) {
                $evalData['problem_solving_relevance_score'] = $evaluation->problem_solving_relevance_score;
                $evalData['functional_mvp_prototype_score'] = $evaluation->functional_mvp_prototype_score;
                $evalData['technical_execution_score'] = $evaluation->technical_execution_score;
                $evalData['creativity_innovation_score'] = $evaluation->creativity_innovation_score;
                $evalData['impact_scalability_score'] = $evaluation->impact_scalability_score;
                $evalData['presentation_clarity_score'] = $evaluation->presentation_clarity_score;
            } else {
                // Map old format to new format for display
                $evalData['problem_solving_relevance_score'] = $evaluation->whole_system_functionality_score;
                $evalData['functional_mvp_prototype_score'] = $evaluation->backend_logic_score;
                $evalData['technical_execution_score'] = $evaluation->ui_ux_design_score;
                $evalData['creativity_innovation_score'] = $evaluation->ai_model_performance_score;
                $evalData['impact_scalability_score'] = $evaluation->ai_model_performance_score;
                $evalData['presentation_clarity_score'] = $evaluation->automation_integration_score;
            }
            
            return $evalData;
        });
        
        // Calculate average scores using helper function
        $evaluationsCount = $submission->evaluations->count();
        $scores = $this->calculateScores($submission->evaluations);
        $averageScore = $scores['average_score'];
        $criteriaScores = $scores['criteria_scores'];
        
        // Weights for display
        $weights = [
            'problem_solving_relevance_score' => 0.25,
            'functional_mvp_prototype_score' => 0.25,
            'technical_execution_score' => 0.20,
            'creativity_innovation_score' => 0.10,
            'impact_scalability_score' => 0.10,
            'presentation_clarity_score' => 0.10,
        ];
        
        $formattedSubmission = [
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
            ],
            'team_members' => $teamMembers,
            'evaluations' => $evaluations,
            'evaluations_count' => $evaluationsCount,
            'average_score' => $averageScore,
            'criteria_scores' => $criteriaScores,
            'criteria_weights' => $weights,
        ];
        
        return Inertia::render('Admin/Hacksphere/SubmissionDetails', [
            'submission' => $formattedSubmission,
        ]);
    }
    
    /**
     * Display the leaderboard page
     * 
     * @return \Inertia\Response
     */
    public function leaderboard()
    {
        // Get all project submissions with evaluations
        $submissions = \App\Models\ProjectSubmission::with([
            'team.leader.user', 
            'evaluations'
        ])->get();
        
        $rankedSubmissions = $submissions->map(function($submission) {
            // Calculate average scores using helper function
            $evaluations = $submission->evaluations;
            $evaluationsCount = $evaluations->count();
            
            $scores = $this->calculateScores($evaluations);
            $averageScore = $scores['average_score'];
            $criteriaScores = $scores['criteria_scores'];
            
            // Get team members
            $members = $submission->team->members->map(function($member) {
                return $member->user->full_name;
            })->toArray();
            
            if ($submission->team->leader) {
                array_unshift($members, $submission->team->leader->user->full_name);
            }
            
            return [
                'id' => $submission->id,
                'project_title' => $submission->project_title,
                'team_id' => $submission->team->id,
                'team_name' => $submission->team->team_name,
                'team_leader' => $submission->team->leader ? $submission->team->leader->user->full_name : 'No leader',
                'members' => $members,
                'evaluations_count' => $evaluationsCount,
                'average_score' => $averageScore,
                'criteria_scores' => $criteriaScores,
                'rank' => 0, // Will be filled after sorting
            ];
        })->filter(function($submission) {
            // Only include submissions with at least one evaluation
            return $submission['evaluations_count'] > 0;
        })->sortByDesc('average_score')->values();
        
        // Add ranks
        $rankedSubmissionsArray = $rankedSubmissions->toArray();
        $rank = 1;
        foreach ($rankedSubmissionsArray as $index => $submission) {
            $rankedSubmissionsArray[$index]['rank'] = $rank++;
        }
        $rankedSubmissions = collect($rankedSubmissionsArray);
        
        return Inertia::render('Admin/Hacksphere/Leaderboard', [
            'rankedSubmissions' => $rankedSubmissions,
        ]);
    }
}
