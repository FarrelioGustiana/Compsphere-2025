<?php

namespace App\Http\Middleware;

use App\Models\EventRegistration;
use App\Models\Team;
use App\Models\Event;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerifyHackspherePayment
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        
        // Get team ID from route parameter
        $teamId = $request->route('teamId');
        
        if (!$teamId) {
            return redirect()->route('participant.dashboard')
                ->with('error', 'Team not found.');
        }
        
        // Get the team
        $team = Team::find($teamId);
        
        if (!$team) {
            return redirect()->route('participant.dashboard')
                ->with('error', 'Team not found.');
        }
        
        // Check if this is a Hacksphere team
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();
        
        if (!$hacksphereEvent || $team->event_id !== $hacksphereEvent->id) {
            // If not a Hacksphere team, allow access
            return $next($request);
        }
        
        // Check if user is a member of this team
        $isMember = $team->members()->where('team_members.user_id', $user->id)->exists() 
                   || $team->team_leader_id === $user->id;
        
        if (!$isMember) {
            return redirect()->route('participant.dashboard')
                ->with('error', 'You are not authorized to access this team.');
        }
        
        // Check payment status of team leader (as representative of the team)
        $leaderRegistration = EventRegistration::where('user_id', $team->team_leader_id)
            ->where('event_id', $hacksphereEvent->id)
            ->first();
        
        // Memeriksa apakah status pembayaran adalah 'verified' atau 'paid'
        if (!$leaderRegistration || !in_array($leaderRegistration->payment_status, ['verified', 'paid'])) {
            return redirect()->route('participant.hacksphere.payment-status', ['teamId' => $teamId])
                ->with('info', 'Your team payment needs to be verified before accessing Hacksphere features.');
        }
        
        return $next($request);
    }
}
