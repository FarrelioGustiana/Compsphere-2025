<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\Event;
use App\Models\TeamMember;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamDashboardController extends Controller
{
    /**
     * Show the team dashboard.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $teamId
     * @return \Inertia\Response
     */
    public function show(Request $request, $teamId)
    {
        // Get the authenticated user
        $user = $request->user();
        
        // Get the team with its members and event
        $team = Team::with(['members.user', 'event', 'leader'])
            ->where('id', $teamId)
            ->first();
        
        // Check if team exists
        if (!$team) {
            return redirect()->route('participant.dashboard')
                ->with('error', 'Team not found.');
        }
        
        // Check if the user is a member of this team
        $isMember = $team->members()->where('team_members.user_id', $user->id)->exists() || $team->team_leader_id === $user->id;
        
        if (!$isMember) {
            return redirect()->route('participant.dashboard')
                ->with('error', 'You are not authorized to view this team dashboard.');
        }
        
        // Get team activities and their verification status
        $activities = $team->event->activities()
            ->with(['verifications' => function ($query) use ($team) {
                $query->where('team_id', $team->id);
            }])
            ->get()
            ->map(function ($activity) use ($team) {
                $verification = $activity->verifications->first();
                return [
                    'id' => $activity->id,
                    'name' => $activity->name,
                    'description' => $activity->description,
                    'activity_code' => $activity->activity_code,
                    'verified' => $verification ? ($verification->status === 'used' || $verification->verified_at !== null) : false,
                    'verification_time' => $verification ? $verification->verified_at : null,
                ];
            });
        
        // Hitung jumlah aktivitas yang sudah diverifikasi
        $completedActivities = $activities->filter(function ($activity) {
            return $activity['verified'] === true;
        })->count();
        
        $totalActivities = $activities->count();
        $completionPercentage = $totalActivities > 0 ? ($completedActivities / $totalActivities) * 100 : 0;
        
        // Return the team dashboard view
        return Inertia::render('Participant/TeamDashboard', [
            'team' => [
                'id' => $team->id,
                'team_name' => $team->team_name,
                'team_code' => $team->team_code,
                'created_at' => $team->created_at,
                'leader' => [
                    'id' => $team->leader->id,
                    'name' => $team->leader->first_name . ' ' . $team->leader->last_name,
                    'email' => $team->leader->email,
                ],
                'members' => $team->members->map(function ($member) {
                    return [
                        'id' => $member->id,
                        'user' => [
                            'id' => $member->user->id,
                            'name' => $member->user->first_name . ' ' . $member->user->last_name,
                            'email' => $member->user->email,
                        ],
                    ];
                }),
                'is_leader' => $team->team_leader_id === $user->id,
            ],
            'event' => [
                'id' => $team->event->id,
                'name' => $team->event->event_name,
                'code' => $team->event->event_code,
            ],
            'activities' => $activities,
            'progress' => [
                'completed' => $completedActivities,
                'total' => $totalActivities,
                'percentage' => round($completionPercentage),
            ],
        ]);
    }
}
