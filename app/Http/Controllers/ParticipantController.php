<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

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
            'domicile' => 'required|string|max:255',
            'job_or_institution' => 'string|max:255',
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
            !$participant->date_of_birth ||
            !$participant->domicile
        ) {
            return redirect()->route('participant.profile')->with('error', 'Please complete your profile before registering.');
        }

        // Prevent duplicate registration
        if ($user->events()->where('events.id', $eventId)->exists()) {
            return back()->with('info', 'You are already registered for this event.');
        }

        // Generate unique verification code
        $verificationCode = Str::random(20);
        
        // Register for the event with verification code
        $user->events()->attach($eventId, [
            'registration_date' => now(),
            'registration_status' => 'registered',
            'verification_code' => $verificationCode
        ]);
        
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
}
