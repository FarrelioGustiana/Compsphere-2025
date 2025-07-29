<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Team;
use App\Models\TeamActivityVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HacksphereController extends Controller
{
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
            ->with(['teams' => function($query) {
                $query->withPivot(['status', 'verified_at', 'verified_by']);
            }])
            ->get();
        
        // Get all teams for Hacksphere
        $teams = Team::where('event_id', $hacksphereEvent->id)
            ->with(['leader', 'members', 'activities' => function($query) {
                $query->withPivot(['status', 'verified_at', 'verified_by']);
            }])
            ->get();
        
        // Format activities data for frontend
        $formattedActivities = $activities->map(function($activity) use ($teams) {
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
        $formattedTeams = $teams->map(function($team) use ($activities) {
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
        
        // Get all teams for Hacksphere with relations
        $teams = Team::where('event_id', $hacksphereEvent->id)
            ->with([
                'leader.user', 
                'members.user', 
                'activities' => function($query) {
                    $query->withPivot(['status', 'verified_at']);
                }
            ])
            ->get();
        
        // Format teams data for the frontend
        $formattedTeams = $teams->map(function($team) use ($activities) {
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
                'leader_name' => $team->leader ? $team->leader->user->full_name : 'No leader',
                'member_count' => $team->members->count() + ($team->leader ? 1 : 0), // Leader + members
                'progress_percentage' => $progress,
                'created_at' => $team->created_at,
            ];
        });
        
        return Inertia::render('Admin/Hacksphere/Teams', [
            'teams' => $formattedTeams,
            'total_teams' => $teams->count(),
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
        // Get the team with relations
        $team = Team::with([
            'leader.user', 
            'members.user', 
            'activities' => function($query) {
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
            $members[] = [
                'id' => $team->leader->user_id,
                'full_name' => $team->leader->user->full_name,
                'email' => $team->leader->user->email,
                'role' => 'Leader',
                'nik' => $team->leader->nik,
                'category' => $team->leader->category,
                'domicile' => $team->leader->domicile,
            ];
        }
        
        // Add other members
        foreach ($team->members as $member) {
            $members[] = [
                'id' => $member->user_id,
                'full_name' => $member->user->full_name,
                'email' => $member->user->email,
                'role' => 'Member',
                'nik' => $member->nik,
                'category' => $member->category,
                'domicile' => $member->domicile,
            ];
        }
        
        // Format activities data
        $activities = $team->activities->map(function($activity) {
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
        
        return Inertia::render('Admin/Hacksphere/TeamDetails', [
            'team' => [
                'id' => $team->id,
                'team_name' => $team->team_name,
                'team_code' => $team->team_code,
                'profile_picture' => $team->profile_picture,
                'created_at' => $team->created_at,
            ],
            'members' => $members,
            'activities' => $activities,
        ]);
    }
    
    /**
     * Display the payments page for Hacksphere teams
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function payments(Request $request)
    {
        // Get the Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();
        
        if (!$hacksphereEvent) {
            return back()->with('error', 'Hacksphere event not found.');
        }
        
        // Get all teams for Hacksphere with their payment status
        $teams = Team::where('event_id', $hacksphereEvent->id)
            ->with(['leader', 'members.user'])
            ->get();
        
        // Format teams data with payment status
        $formattedTeams = $teams->map(function($team) use ($hacksphereEvent) {
            // Get payment status for all team members
            $teamMembers = collect();
            
            // Add team leader
            if ($team->leader) {
                $leaderRegistration = EventRegistration::where('user_id', $team->team_leader_id)
                    ->where('event_id', $hacksphereEvent->id)
                    ->first();
                    
                $teamMembers->push([
                    'id' => $team->leader->id,
                    'user_id' => $team->team_leader_id, // Explicit user_id for backend verification
                    'name' => $team->leader->first_name . ' ' . $team->leader->last_name,
                    'email' => $team->leader->email,
                    'role' => 'Leader',
                    'payment_status' => $leaderRegistration ? $leaderRegistration->payment_status : 'pending',
                    'payment_verified_at' => $leaderRegistration ? $leaderRegistration->payment_date : null,
                ]);
            }
            
            // Add team members
            foreach ($team->members as $member) {
                $memberRegistration = EventRegistration::where('user_id', $member->user_id)
                    ->where('event_id', $hacksphereEvent->id)
                    ->first();
                    
                $teamMembers->push([
                    'id' => $member->user->id,
                    'user_id' => $member->user_id, // Explicit user_id for backend verification
                    'name' => $member->user->first_name . ' ' . $member->user->last_name,
                    'email' => $member->user->email,
                    'role' => 'Member',
                    'payment_status' => $memberRegistration ? $memberRegistration->payment_status : 'pending',
                    'payment_verified_at' => $memberRegistration ? $memberRegistration->payment_date : null,
                ]);
            }
            
            // Calculate payment summary
            $totalMembers = $teamMembers->count();
            // Mengenali status 'paid' dan 'verified' sebagai terverifikasi
            $verifiedPayments = $teamMembers->whereIn('payment_status', ['verified', 'paid'])->count();
            $pendingPayments = $teamMembers->where('payment_status', 'pending')->count();
            $allPaymentsVerified = $verifiedPayments === $totalMembers;
            
            return [
                'id' => $team->id,
                'team_name' => $team->team_name,
                'team_code' => $team->team_code,
                'leader_name' => $team->leader ? $team->leader->first_name . ' ' . $team->leader->last_name : 'No leader',
                'total_members' => $totalMembers,
                'verified_payments' => $verifiedPayments,
                'pending_payments' => $pendingPayments,
                'all_payments_verified' => $allPaymentsVerified,
                'team_members' => $teamMembers,
                'created_at' => $team->created_at,
            ];
        });
        
        return Inertia::render('Admin/Hacksphere/Payments', [
            'teams' => $formattedTeams,
            'total_teams' => $teams->count(),
        ]);
    }
    
    /**
     * Verify payment for a specific team member
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $teamId
     * @param  int  $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyPayment(Request $request, $teamId, $userId)
    {
        // Debug info
        \Illuminate\Support\Facades\Log::debug("Payment verification attempt", [
            'teamId' => $teamId,
            'userId' => $userId,
            'request' => $request->all()
        ]);
        
        // Get the Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();
        
        if (!$hacksphereEvent) {
            return response()->json([
                'success' => false,
                'message' => 'Hacksphere event not found.'
            ], 404);
        }
        
        // Get the team
        $team = Team::find($teamId);
        
        if (!$team || $team->event_id !== $hacksphereEvent->id) {
            return response()->json([
                'success' => false,
                'message' => 'Team not found or not a Hacksphere team.'
            ], 404);
        }
        
        // Check if user is a member of this team
        $isMember = $team->members()->where('team_members.user_id', $userId)->exists() 
                   || $team->team_leader_id === $userId;
        
        if (!$isMember) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a member of this team.'
            ], 400);
        }
        
        // Get or create event registration
        $registration = EventRegistration::where('user_id', $userId)
            ->where('event_id', $hacksphereEvent->id)
            ->first();
        
        if (!$registration) {
            return response()->json([
                'success' => false,
                'message' => 'Event registration not found.'
            ], 404);
        }
        
        // Update payment status
        $registration->update([
            'payment_status' => 'verified',
            'payment_date' => now(),
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Payment verified successfully.',
            'payment_status' => 'verified',
            'payment_verified_at' => $registration->payment_date,
        ]);
    }
    
    /**
     * Reject payment for a specific team member
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $teamId
     * @param  int  $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function rejectPayment(Request $request, $teamId, $userId)
    {
        // Get the Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();
        
        if (!$hacksphereEvent) {
            return response()->json([
                'success' => false,
                'message' => 'Hacksphere event not found.'
            ], 404);
        }
        
        // Get the team
        $team = Team::find($teamId);
        
        if (!$team || $team->event_id !== $hacksphereEvent->id) {
            return response()->json([
                'success' => false,
                'message' => 'Team not found or not a Hacksphere team.'
            ], 404);
        }
        
        // Check if user is a member of this team
        $isMember = $team->members()->where('team_members.user_id', $userId)->exists() 
                   || $team->team_leader_id === $userId;
        
        if (!$isMember) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a member of this team.'
            ], 400);
        }
        
        // Get event registration
        $registration = EventRegistration::where('user_id', $userId)
            ->where('event_id', $hacksphereEvent->id)
            ->first();
        
        if (!$registration) {
            return response()->json([
                'success' => false,
                'message' => 'Event registration not found.'
            ], 404);
        }
        
        // Update payment status
        $registration->update([
            'payment_status' => 'rejected',
            'payment_date' => null,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Payment rejected.',
            'payment_status' => 'rejected',
        ]);
    }
}
