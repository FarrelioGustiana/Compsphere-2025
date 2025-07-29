<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Team;
use App\Models\EventRegistration;
use Illuminate\Support\Facades\Log;

class TeamPaymentController extends Controller
{
    /**
     * Verify payment for an entire team
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $teamId
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyTeamPayment(Request $request, $teamId)
    {
        // Debug information
        Log::debug("Team payment verification attempt", [
            'teamId' => $teamId
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
        
        // Verify team leader payment
        $leaderRegistration = EventRegistration::where('user_id', $team->team_leader_id)
            ->where('event_id', $hacksphereEvent->id)
            ->first();
        
        if (!$leaderRegistration) {
            $leaderRegistration = EventRegistration::create([
                'user_id' => $team->team_leader_id,
                'event_id' => $hacksphereEvent->id,
                'registration_status' => 'registered',
                'payment_status' => 'paid',
                'payment_date' => now(),
            ]);
        } else {
            $leaderRegistration->update([
                'payment_status' => 'paid',
                'payment_date' => now(),
            ]);
        }
        
        // Verify all team members' payments
        foreach ($team->members as $member) {
            $memberRegistration = EventRegistration::where('user_id', $member->user_id)
                ->where('event_id', $hacksphereEvent->id)
                ->first();
            
            if (!$memberRegistration) {
                EventRegistration::create([
                    'user_id' => $member->user_id,
                    'event_id' => $hacksphereEvent->id,
                    'registration_status' => 'registered',
                    'payment_status' => 'paid',
                    'payment_date' => now(),
                ]);
            } else {
                $memberRegistration->update([
                    'payment_status' => 'paid',
                    'payment_date' => now(),
                ]);
            }
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Team payment verified successfully.',
            'payment_status' => 'paid',
            'payment_verified_at' => now(),
        ]);
    }
    
    /**
     * Reject payment for an entire team
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $teamId
     * @return \Illuminate\Http\JsonResponse
     */
    public function rejectTeamPayment(Request $request, $teamId)
    {
        // Debug information
        Log::debug("Team payment rejection attempt", [
            'teamId' => $teamId
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
        
        // Reject team leader payment
        $leaderRegistration = EventRegistration::where('user_id', $team->team_leader_id)
            ->where('event_id', $hacksphereEvent->id)
            ->first();
        
        if ($leaderRegistration) {
            $leaderRegistration->update([
                'payment_status' => 'failed',
                'payment_date' => now(),
            ]);
        }
        
        // Reject all team members' payments
        foreach ($team->members as $member) {
            $memberRegistration = EventRegistration::where('user_id', $member->user_id)
                ->where('event_id', $hacksphereEvent->id)
                ->first();
            
            if ($memberRegistration) {
                $memberRegistration->update([
                    'payment_status' => 'failed',
                    'payment_date' => now(),
                ]);
            }
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Team payment rejected successfully.',
            'payment_status' => 'failed',
            'payment_rejected_at' => now(),
        ]);
    }
}
