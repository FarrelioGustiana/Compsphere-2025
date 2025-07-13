<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Team;
use App\Models\TeamActivityVerification;
use App\Services\QRCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ActivityQrController extends Controller
{
    /**
     * Show QR code for a specific activity
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $teamId
     * @param  int  $activityId
     * @return \Inertia\Response
     */
    public function show(Request $request, $teamId, $activityId)
    {
        $user = $request->user();
        
        // Find the team and activity
        $team = Team::findOrFail($teamId);
        $activity = Activity::findOrFail($activityId);
        
        // Check if the user is a member of this team
        $isMember = $team->members()->where('team_members.user_id', $user->id)->exists() 
            || $team->team_leader_id === $user->id;
            
        if (!$isMember) {
            return redirect()->route('participant.dashboard')
                ->with('error', 'You are not authorized to view this QR code.');
        }
        
        // Check if the activity belongs to the team's event
        if ($activity->event_id !== $team->event_id) {
            return redirect()->route('participant.team.dashboard', ['teamId' => $team->id])
                ->with('error', 'This activity does not belong to your team\'s event.');
        }
        
        // Get verification status
        $verification = TeamActivityVerification::where('team_id', $team->id)
            ->where('activity_id', $activity->id)
            ->first();
        
        // Use QRCodeService to get verification data
        $qrCodeService = new QRCodeService();
        $qrData = $qrCodeService->generateTeamActivityQR($team->id, $activity->id);
        
        if (!$qrData) {
            return redirect()->route('participant.team.dashboard', ['teamId' => $team->id])
                ->with('error', 'Failed to generate QR code data.');
        }
        
        return Inertia::render('Participant/ActivityQr', [
            'team' => [
                'id' => $team->id,
                'name' => $team->team_name,
                'code' => $team->team_code,
            ],
            'activity' => [
                'id' => $activity->id,
                'name' => $activity->name,
                'description' => $activity->description,
                'code' => $activity->activity_code,
                'verified' => $verification ? $verification->verified : false,
                'verification_time' => $verification ? $verification->verification_time : null,
            ],
            'qrData' => $qrData,
            // QR code will be generated on client side
        ]);
    }
}
