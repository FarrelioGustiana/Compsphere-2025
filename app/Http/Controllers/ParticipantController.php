<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParticipantController extends Controller
{
    /**
     * Display the participant dashboard.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $participantDetails = $user->participant;
        
        return Inertia::render('Participant/Dashboard', [
            'user' => $user,
            'participantDetails' => $participantDetails,
            'allEvents' => Event::all(),
            'registeredEvents' => $user->events,
        ]);
    }

    /**
     * Update participant profile.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
        ]);

        $participant = $user->participant;
        if ($participant) {
            $participant->update($validated);
        } else {
            $encryption_code = bin2hex(random_bytes(8));
            $user->participant()->create($validated + [
                'user_id' => $user->id,
                'encryption_code' => $encryption_code,
            ]);
        }

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

        /**
     * Register participant for an event.
     */
    public function registerEvent(Request $request, $eventId)
    {
        $user = $request->user();
        $participant = $user->participant;
        // Check if participant profile is complete
        if (
            !$participant ||
            !$participant->category ||
            !$participant->phone_number ||
            !$participant->date_of_birth
        ) {
            return redirect()->route('participant.profile')->with('error', 'Please complete your profile before registering.');
        }

        // Prevent duplicate registration
        if ($user->events()->where('events.id', $eventId)->exists()) {
            return back()->with('info', 'You are already registered for this event.');
        }

        // Register for the event
        $user->events()->attach($eventId);
        return back()->with('success', 'You have registered for the event!');
    }

    /**
     * Display the participant profile.
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $participantDetails = $user->participant;
        
        return Inertia::render('Participant/Profile', [
            'user' => $user,
            'participantDetails' => $participantDetails,
        ]);
    }
    
    /**
     * Update participant NIK for Hacksphere event.
     */
    public function updateNik(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'nik' => 'required|string|max:16|unique:participants,nik',
        ]);

        $participant = $user->participant;
        if ($participant) {
            $participant->update([
                'nik' => $validated['nik']
            ]);
            return redirect()->back()->with('success', 'NIK updated successfully.');
        }
        
        return redirect()->back()->with('error', 'Please complete your profile first.');
    }

    /**
 * Handle the Hacksphere team registration process.
 */
public function registerHacksphere(Request $request)
{
    $user = $request->user();
    $participant = $user->participant;
    
    // Check if participant profile is complete
    if (
        !$participant ||
        !$participant->category ||
        !$participant->phone_number ||
        !$participant->date_of_birth
    ) {
        return redirect()->route('participant.profile')->with('error', 'Please complete your profile before registering for Hacksphere.');
    }
    
    // Validate the request data for team creation
    $validated = $request->validate([
        'team_name' => 'required|string|max:255',
        'team_leader_nik' => 'required|string|max:16',
        'team_leader_category' => 'required|string|in:high_school,university,non_academic',
        'team_leader_domicile' => 'required|string|max:255',
        'member1_email' => 'required|email|exists:users,email',
        'member1_nik' => 'required|string|max:16',
        'member1_category' => 'required|string|in:high_school,university,non_academic',
        'member1_domicile' => 'required|string|max:255',
        'member2_email' => 'required|email|exists:users,email',
        'member2_nik' => 'required|string|max:16',
        'member2_category' => 'required|string|in:high_school,university,non_academic',
        'member2_domicile' => 'required|string|max:255',
    ]);
    
    // Check if the team leader is the authenticated user
    if ($participant->nik && $participant->nik !== $validated['team_leader_nik']) {
        return back()->with('error', 'The NIK provided for team leader does not match your NIK.');
    }
    
    // Update participant details if needed
    if (!$participant->nik) {
        $participant->update([
            'nik' => $validated['team_leader_nik'],
            'category' => $validated['team_leader_category'],
            'domicile' => $validated['team_leader_domicile'],
        ]);
    }
    
    // Generate a unique 8-digit team code
    do {
        $team_code = str_pad(mt_rand(0, 99999999), 8, '0', STR_PAD_LEFT);
    } while (\App\Models\Team::where('team_code', $team_code)->exists());
    
    // Create the team with the authenticated user as leader
    $team = \App\Models\Team::create([
        'team_name' => $validated['team_name'],
        'team_leader_id' => $user->id,
        'team_code' => $team_code,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    
    // Process member 1
    $member1User = \App\Models\User::where('email', $validated['member1_email'])->first();
    $member1Participant = $member1User->participant;
    
    if (!$member1Participant) {
        // Create participant record if it doesn't exist
        $encryption_code = bin2hex(random_bytes(8));
        $member1Participant = \App\Models\Participant::create([
            'user_id' => $member1User->id,
            'encryption_code' => $encryption_code,
            'nik' => $validated['member1_nik'],
            'category' => $validated['member1_category'],
            'domicile' => $validated['member1_domicile'],
        ]);
    } else {
        // Update existing participant record
        $member1Participant->update([
            'nik' => $validated['member1_nik'],
            'category' => $validated['member1_category'],
            'domicile' => $validated['member1_domicile'],
        ]);
    }
    
    // Process member 2
    $member2User = \App\Models\User::where('email', $validated['member2_email'])->first();
    $member2Participant = $member2User->participant;
    
    if (!$member2Participant) {
        // Create participant record if it doesn't exist
        $encryption_code = bin2hex(random_bytes(8));
        $member2Participant = \App\Models\Participant::create([
            'user_id' => $member2User->id,
            'encryption_code' => $encryption_code,
            'nik' => $validated['member2_nik'],
            'category' => $validated['member2_category'],
            'domicile' => $validated['member2_domicile'],
        ]);
    } else {
        // Update existing participant record
        $member2Participant->update([
            'nik' => $validated['member2_nik'],
            'category' => $validated['member2_category'],
            'domicile' => $validated['member2_domicile'],
        ]);
    }
    
    // Add members to the team
    $team->members()->attach([$member1Participant->user_id, $member2Participant->user_id]);
    
    // Find Hacksphere event
    $hacksphereEvent = \App\Models\Event::where('event_code', 'hacksphere')->first();
    
    if (!$hacksphereEvent) {
        return back()->with('error', 'Hacksphere event not found.');
    }
    
    // Register all team members for the Hacksphere event
    $user->events()->attach($hacksphereEvent->id);
    $member1User->events()->attach($hacksphereEvent->id);
    $member2User->events()->attach($hacksphereEvent->id);
    
    return redirect()->route('participant.dashboard')->with('success', 'Your team has been successfully registered for Hacksphere!');
}

/**
 * Validate team member email.
 */
public function validateTeamMemberEmail(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|email',
    ]);
    
    // Check if user exists separately to provide a better error message
    $memberUser = \App\Models\User::where('email', $validated['email'])->first();
    
    if (!$memberUser) {
        return response()->json([
            'valid' => false,
            'message' => 'No user account found with this email. The person must have an account on our platform.'
        ]);
    }
    
    if ($memberUser->id === $request->user()->id) {
        return response()->json([
            'valid' => false,
            'message' => 'You cannot add yourself as a team member.'
        ]);
    }
    
    // Check if user is already registered for Hacksphere
    $hacksphereEvent = \App\Models\Event::where('event_code', 'hacksphere')->first();
    if ($hacksphereEvent && $memberUser->events()->where('events.id', $hacksphereEvent->id)->exists()) {
        return response()->json([
            'valid' => false,
            'message' => 'This user is already registered for Hacksphere.'
        ]);
    }
    
    return response()->json([
        'valid' => true,
        'user' => [
            'name' => $memberUser->full_name,
            'email' => $memberUser->email,
            'member_user_id' => $memberUser->id,
        ]
    ]);
}
}
