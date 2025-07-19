<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventParticipantsController extends Controller
{
    /**
     * Display participants for a specific event.
     *
     * @param Request $request
     * @param string $eventCode
     * @return \Inertia\Response
     */
    public function participants(Request $request, string $eventCode)
    {
        // Find the event by event_code
        $event = Event::where('event_code', $eventCode)->firstOrFail();
        
        // Get all registrations for this event with participant data
        $registrations = EventRegistration::where('event_id', $event->id)
            ->with(['user.user', 'event'])
            ->get()
            ->map(function ($registration) {
                $participant = $registration->user;
                $user = $participant->user;
                
                return [
                    'id' => $registration->id,
                    'registration_date' => $registration->registration_date,
                    'registration_status' => $registration->registration_status,
                    'payment_status' => $registration->payment_status,
                    'user_id' => $user->id,
                    'participant' => $participant,
                ];
            });
        
        return Inertia::render('Admin/EventParticipants', [
            'event' => [
                'id' => $event->id,
                'event_code' => $event->event_code,
                'event_name' => $event->event_name,
                'description' => $event->description,
                'is_paid_event' => $event->is_paid_event,
            ],
            'registrations' => $registrations,
        ]);
    }
}
