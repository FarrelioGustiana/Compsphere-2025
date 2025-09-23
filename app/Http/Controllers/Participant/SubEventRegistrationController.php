<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\SubEvent;
use App\Services\QRCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubEventRegistrationController extends Controller
{
    /**
     * Register participant for a sub-event.
     */
    public function register(Request $request, $subEventId, QRCodeService $qrCodeService)
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

        // Find the sub-event
        $subEvent = SubEvent::findOrFail($subEventId);
        $event = $subEvent->event;

        // Check if the sub-event is at capacity
        if ($subEvent->isAtCapacity()) {
            return back()->with('error', 'This event has reached its maximum capacity.');
        }

        // Prevent duplicate registration for this specific sub-event
        $existingRegistration = EventRegistration::where('user_id', $participant->user_id)
            ->where('event_id', $event->id)
            ->where('sub_event_id', $subEvent->id)
            ->first();

        if ($existingRegistration) {
            return back()->with('info', 'You are already registered for this event.');
        }

        try {
            DB::beginTransaction();

            // Create EventRegistration record
            $eventRegistration = EventRegistration::create([
                'user_id' => $participant->user_id,
                'event_id' => $event->id,
                'sub_event_id' => $subEvent->id,
                'registration_date' => now(),
                'registration_status' => 'pending', // Will be updated to 'registered' after QR verification
                'payment_status' => $event->is_paid_event ? 'pending' : null,
                'payment_amount' => $event->is_paid_event ? 0 : null,
            ]);

            // Also maintain the pivot table relationship for backward compatibility
            if (!$user->events()->where('events.id', $event->id)->exists()) {
                $user->events()->attach($event->id, [
                    'registration_date' => now(),
                    'registration_status' => 'pending'
                ]);
            }

            // Generate QR code for Talksphere sub-events
            if ($event->event_code === 'talksphere') {
                $qrCodeData = $qrCodeService->generateEventRegistrationQR($participant->user_id, $event->id);

                if ($qrCodeData) {
                    DB::commit();
                    return back()->with([
                        'success' => "You have registered for {$subEvent->sub_event_name}! Your QR code has been generated.",
                        'qr_code_data' => $qrCodeData
                    ]);
                }
            }

            DB::commit();
            return back()->with('success', "You have registered for {$subEvent->sub_event_name}!");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Sub-event registration error: ' . $e->getMessage());
            return back()->with('error', 'An error occurred during registration. Please try again.');
        }
    }

    /**
     * Get all sub-events for a specific event.
     */
    public function getSubEvents($eventCode)
    {
        $event = Event::where('event_code', $eventCode)->firstOrFail();
        $subEvents = $event->subEvents()->where('is_active', true)->get();
        
        return response()->json([
            'success' => true,
            'data' => $subEvents
        ]);
    }

    /**
     * Check if user is registered for a specific sub-event.
     */
    public function checkRegistration($subEventId)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }
        
        $registration = EventRegistration::where('user_id', $user->id)
            ->where('sub_event_id', $subEventId)
            ->first();
            
        return response()->json([
            'success' => true,
            'isRegistered' => $registration ? true : false,
            'registration' => $registration
        ]);
    }
}
