<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventVerificationController extends Controller
{
    /**
     * Display participant's event verification QR code
     */
    public function showVerificationQR(Request $request, $eventId)
    {
        $user = $request->user();
        $eventRegistration = EventRegistration::where('user_id', $user->id)
            ->where('event_id', $eventId)
            ->first();
            
        if (!$eventRegistration) {
            return redirect()->route('participant.dashboard')
                ->with('error', 'You are not registered for this event.');
        }
        
        $event = Event::find($eventId);
        $verificationUrl = route('admin.event.verification', [
            'eventCode' => $event->event_code,
            'verificationCode' => $eventRegistration->verification_code
        ]);
        
        // Generate QR code using online API
        $qrCode = '<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='.urlencode($verificationUrl).'" alt="QR Code" class="mx-auto" />';
        
        return Inertia::render('Participant/EventVerification', [
            'user' => $user,
            'event' => $event,
            'qrCode' => $qrCode,
            'verificationUrl' => $verificationUrl,
        ]);
    }
    
    /**
     * Admin verification page for event attendance
     */
    public function adminVerificationPage(Request $request, $eventCode, $verificationCode)
    {
        // Check if user is admin
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return redirect()->route('login')
                ->with('error', 'You must be logged in as an admin to access this page.');
        }
        
        $event = Event::where('event_code', $eventCode)->first();
        if (!$event) {
            return redirect()->route('admin.dashboard')
                ->with('error', 'Event not found.');
        }
        
        $eventRegistration = EventRegistration::where('verification_code', $verificationCode)
            ->where('event_id', $event->id)
            ->first();
            
        if (!$eventRegistration) {
            return redirect()->route('admin.dashboard')
                ->with('error', 'Invalid verification code.');
        }
        
        $participant = User::find($eventRegistration->user_id);
        
        return Inertia::render('Admin/EventVerification', [
            'event' => $event,
            'participant' => $participant,
            'eventRegistration' => $eventRegistration,
        ]);
    }
    
    /**
     * Verify participant attendance
     */
    public function verifyAttendance(Request $request, $eventCode, $verificationCode)
    {
        // Check if user is admin
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $event = Event::where('event_code', $eventCode)->first();
        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }
        
        $eventRegistration = EventRegistration::where('verification_code', $verificationCode)
            ->where('event_id', $event->id)
            ->first();
            
        if (!$eventRegistration) {
            return response()->json(['error' => 'Invalid verification code'], 404);
        }
        
        // Update attendance verification
        $eventRegistration->update([
            'attendance_verified_at' => now(),
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Attendance verified successfully',
        ]);
    }
}
