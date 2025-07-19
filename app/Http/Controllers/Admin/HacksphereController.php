<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Event;
use App\Models\Team;
use App\Models\TeamActivityVerification;
use Illuminate\Http\Request;
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
}
