<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentStatusController extends Controller
{
    /**
     * Show the payment status page for a Hacksphere team.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $teamId
     * @return \Inertia\Response
     */
    public function show(Request $request, $teamId)
    {
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
        $isMember = $team->members()->where('team_members.user_id', $user->id)->exists() 
                   || $team->team_leader_id === $user->id;
        
        if (!$isMember) {
            return redirect()->route('participant.dashboard')
                ->with('error', 'You are not authorized to view this team.');
        }
        
        // Get Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();
        
        if (!$hacksphereEvent || $team->event_id !== $hacksphereEvent->id) {
            return redirect()->route('participant.dashboard')
                ->with('error', 'This is not a Hacksphere team.');
        }
        
        // Get payment status for all team members
        $teamMembers = collect();
        
        // Add team leader
        if ($team->leader) {
            $leaderRegistration = EventRegistration::where('user_id', $team->team_leader_id)
                ->where('event_id', $hacksphereEvent->id)
                ->first();
                
            $teamMembers->push([
                'id' => $team->leader->id,
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
                'name' => $member->user->first_name . ' ' . $member->user->last_name,
                'email' => $member->user->email,
                'role' => 'Member',
                'payment_status' => $memberRegistration ? $memberRegistration->payment_status : 'pending',
                'payment_verified_at' => $memberRegistration ? $memberRegistration->payment_date : null,
            ]);
        }
        
        // Check if all payments are verified (status 'verified' atau 'paid')
        $allPaymentsVerified = $teamMembers->every(function ($member) {
            return $member['payment_status'] === 'verified' || $member['payment_status'] === 'paid';
        });
        
        return Inertia::render('Participant/PaymentStatus', [
            'team' => [
                'id' => $team->id,
                'team_name' => $team->team_name,
                'team_code' => $team->team_code,
                'created_at' => $team->created_at,
            ],
            'event' => [
                'id' => $hacksphereEvent->id,
                'name' => $hacksphereEvent->event_name,
                'code' => $hacksphereEvent->event_code,
            ],
            'team_members' => $teamMembers,
            'all_payments_verified' => $allPaymentsVerified,
            'payment_amount' => 100000, // IDR 100,000 per person
            'whatsapp_number' => '628123456789', // Replace with actual WhatsApp number
            'is_leader' => $team->team_leader_id === $user->id,
        ]);
    }
}
