<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\ActivityVerification;
use App\Models\Event;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class VerificationController extends Controller
{
    /**
     * Verify Hacksphere team activity using QR code
     * 
     * @param string $activityName The activity name to verify
     * @param string $teamCode The team code from QR
     * @return \Inertia\Response
     */
    public function verifyHacksphereActivity($activityName, $teamCode)
    {
        // Find the team by team_code
        $team = Team::where('team_code', $teamCode)->first();
        
        if (!$team) {
            return Inertia::render('Admin/Verification/Error', [
                'title' => 'Team Not Found',
                'message' => "No team found with code: {$teamCode}",
                'status' => 'error',
            ]);
        }
        
        // Find Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();
        
        if (!$hacksphereEvent) {
            return Inertia::render('Admin/Verification/Error', [
                'title' => 'Event Not Found',
                'message' => 'Hacksphere event not found in system',
                'status' => 'error',
            ]);
        }
        
        // Find the activity by name and event
        $activity = Activity::where('name', $activityName)
            ->where('event_id', $hacksphereEvent->id)
            ->first();
            
        if (!$activity) {
            return Inertia::render('Admin/Verification/Error', [
                'title' => 'Activity Not Found',
                'message' => "Activity '{$activityName}' not found for Hacksphere",
                'status' => 'error',
            ]);
        }
        
        // Find verification record for this team and activity
        $verification = ActivityVerification::where('team_id', $team->id)
            ->where('activity_id', $activity->id)
            ->first();
            
        if (!$verification) {
            return Inertia::render('Admin/Verification/Error', [
                'title' => 'Verification Not Found',
                'message' => "This team is not registered for the '{$activityName}' activity",
                'status' => 'error',
            ]);
        }
        
        // Check if already verified
        if ($verification->is_verified) {
            return Inertia::render('Admin/Verification/Expired', [
                'title' => 'QR Code Already Used',
                'message' => "This QR code has already been used on " . $verification->verified_at->format('Y-m-d H:i:s'),
                'verification' => [
                    'team_name' => $team->team_name,
                    'activity' => $activity->description,
                    'verified_at' => $verification->verified_at->format('Y-m-d H:i:s'),
                    'verified_by' => $verification->verifier ? $verification->verifier->name : 'Unknown',
                ],
                'status' => 'expired',
            ]);
        }
        
        // Mark as verified
        $verification->update([
            'is_verified' => true,
            'verified_at' => now(),
            'verified_by' => Auth::id(),
        ]);
        
        // Get team members info for display
        $teamLeader = User::find($team->team_leader_id);
        $teamMembers = $team->members()->get();
        
        return Inertia::render('Admin/Verification/Success', [
            'title' => 'Verification Successful',
            'message' => "Team '{$team->team_name}' has been successfully verified for {$activity->description}",
            'verification' => [
                'team_name' => $team->team_name,
                'team_code' => $team->team_code,
                'activity' => $activity->description,
                'verified_at' => now()->format('Y-m-d H:i:s'),
                'verified_by' => Auth::user()->name,
            ],
            'team' => [
                'leader' => [
                    'name' => $teamLeader->full_name,
                    'email' => $teamLeader->email,
                ],
                'members' => $teamMembers->map(function($member) {
                    return [
                        'name' => $member->full_name,
                        'email' => $member->email,
                    ];
                }),
            ],
            'status' => 'success',
        ]);
    }

    /**
     * Verify individual participant activity using QR code
     * 
     * @param string $eventCode The event code (talksphere/festsphere)
     * @param string $activityName The activity name to verify
     * @param string $userCode The user unique code from QR
     * @return \Inertia\Response
     */
    public function verifyParticipantActivity($eventCode, $activityName, $userCode)
    {
        // Find the participant by encryption_code
        $participant = \App\Models\Participant::where('encryption_code', $userCode)->first();
        
        if (!$participant) {
            return Inertia::render('Admin/Verification/Error', [
                'title' => 'Participant Not Found',
                'message' => "No participant found with the provided code",
                'status' => 'error',
            ]);
        }
        
        $user = User::find($participant->user_id);
        
        // Find the event by event_code
        $event = Event::where('event_code', $eventCode)->first();
        
        if (!$event) {
            return Inertia::render('Admin/Verification/Error', [
                'title' => 'Event Not Found',
                'message' => "'{$eventCode}' event not found in system",
                'status' => 'error',
            ]);
        }
        
        // Find the activity by name and event
        $activity = Activity::where('name', $activityName)
            ->where('event_id', $event->id)
            ->first();
            
        if (!$activity) {
            return Inertia::render('Admin/Verification/Error', [
                'title' => 'Activity Not Found',
                'message' => "Activity '{$activityName}' not found for {$event->event_name}",
                'status' => 'error',
            ]);
        }
        
        // Find verification record for this user and activity
        $verification = ActivityVerification::where('user_id', $user->id)
            ->where('activity_id', $activity->id)
            ->first();
            
        if (!$verification) {
            return Inertia::render('Admin/Verification/Error', [
                'title' => 'Verification Not Found',
                'message' => "This participant is not registered for the '{$activityName}' activity",
                'status' => 'error',
            ]);
        }
        
        // Check if already verified
        if ($verification->is_verified) {
            return Inertia::render('Admin/Verification/Expired', [
                'title' => 'QR Code Already Used',
                'message' => "This QR code has already been used on " . $verification->verified_at->format('Y-m-d H:i:s'),
                'verification' => [
                    'participant_name' => $user->full_name,
                    'activity' => $activity->description,
                    'verified_at' => $verification->verified_at->format('Y-m-d H:i:s'),
                    'verified_by' => $verification->verifier ? $verification->verifier->name : 'Unknown',
                ],
                'status' => 'expired',
            ]);
        }
        
        // Mark as verified
        $verification->update([
            'is_verified' => true,
            'verified_at' => now(),
            'verified_by' => Auth::id(),
        ]);
        
        return Inertia::render('Admin/Verification/Success', [
            'title' => 'Verification Successful',
            'message' => "{$user->full_name} has been successfully verified for {$activity->description}",
            'verification' => [
                'participant_name' => $user->full_name,
                'participant_email' => $user->email,
                'activity' => $activity->description,
                'verified_at' => now()->format('Y-m-d H:i:s'),
                'verified_by' => Auth::user()->name,
            ],
            'status' => 'success',
        ]);
    }
}
