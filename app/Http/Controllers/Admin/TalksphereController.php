<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\SubEvent;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TalksphereController extends Controller
{
    /**
     * Display Talksphere admin dashboard with sub-events data
     */
    public function index()
    {
        // Get Talksphere event
        $talksphereEvent = Event::where('event_code', 'talksphere')->first();
        
        if (!$talksphereEvent) {
            return redirect()->back()->with('error', 'Talksphere event not found.');
        }

        // Get all sub-events with registration counts
        $subEvents = SubEvent::where('event_id', $talksphereEvent->id)
            ->withCount(['eventRegistrations as total_registrations'])
            ->get()
            ->map(function ($subEvent) {
                return [
                    'id' => $subEvent->id,
                    'sub_event_name' => $subEvent->sub_event_name,
                    'sub_event_code' => $subEvent->sub_event_code,
                    'description' => $subEvent->description,
                    'start_time' => $subEvent->start_time,
                    'end_time' => $subEvent->end_time,
                    'location' => $subEvent->location,
                    'max_participants' => $subEvent->max_participants,
                    'total_registrations' => $subEvent->total_registrations,
                    'available_slots' => $subEvent->max_participants ? 
                        max(0, $subEvent->max_participants - $subEvent->total_registrations) : null,
                ];
            });

        // Get overall statistics
        $totalRegistrations = EventRegistration::where('event_id', $talksphereEvent->id)
            ->whereNotNull('sub_event_id')
            ->count();

        $totalUniqueParticipants = EventRegistration::where('event_id', $talksphereEvent->id)
            ->whereNotNull('sub_event_id')
            ->distinct('user_id')
            ->count();

        return Inertia::render('Admin/Talksphere/Dashboard', [
            'event' => $talksphereEvent,
            'subEvents' => $subEvents,
            'statistics' => [
                'total_registrations' => $totalRegistrations,
                'total_unique_participants' => $totalUniqueParticipants,
                'total_sub_events' => $subEvents->count(),
            ],
        ]);
    }

    /**
     * Show registrations for a specific sub-event
     */
    public function showSubEvent($subEventId)
    {
        $subEvent = SubEvent::with('event')->findOrFail($subEventId);
        
        $registrations = EventRegistration::where('sub_event_id', $subEventId)
            ->join('users', 'event_registrations.user_id', '=', 'users.id')
            ->leftJoin('participants', 'users.id', '=', 'participants.user_id')
            ->select(
                'event_registrations.*',
                'users.first_name',
                'users.last_name', 
                'users.email',
                'participants.category',
                'participants.phone_number',
                'participants.date_of_birth'
            )
            ->get()
            ->map(function ($registration) {
                
                // Check verification status
                $verification = \App\Models\EventRegistrationVerification::where('event_registration_id', $registration->id)
                    ->orderBy('created_at', 'desc')
                    ->first();
                
                $verificationStatus = 'not_verified';
                if ($verification) {
                    if ($verification->status === 'used') {
                        $verificationStatus = 'verified';
                    } elseif ($verification->status === 'active') {
                        $verificationStatus = 'pending_verification';
                    }
                }
                
                Log::info('Processing registration with JOIN', [
                    'registration_id' => $registration->id,
                    'user_id' => $registration->user_id,
                    'user_data' => [
                        'first_name' => $registration->first_name,
                        'last_name' => $registration->last_name,
                        'email' => $registration->email,
                    ],
                    'participant_data' => [
                        'category' => $registration->category,
                        'phone' => $registration->phone_number
                    ],
                    'verification_status' => $verificationStatus
                ]);
                
                return [
                    'id' => $registration->id,
                    'registration_date' => $registration->registration_date,
                    'registration_status' => $registration->registration_status,
                    'verification_status' => $verificationStatus,
                    'user' => [
                        'id' => $registration->user_id,
                        'first_name' => $registration->first_name,
                        'last_name' => $registration->last_name,
                        'email' => $registration->email,
                        'participant' => [
                            'category' => $registration->category,
                            'phone_number' => $registration->phone_number,
                            'date_of_birth' => $registration->date_of_birth,
                        ],
                    ],
                ];
            });

        return Inertia::render('Admin/Talksphere/SubEventDetail', [
            'subEvent' => $subEvent,
            'registrations' => $registrations,
        ]);
    }

    /**
     * Export registrations for a sub-event
     */
    public function exportSubEvent($subEventId)
    {
        $subEvent = SubEvent::findOrFail($subEventId);
        $registrations = EventRegistration::where('sub_event_id', $subEventId)
            ->join('users', 'event_registrations.user_id', '=', 'users.id')
            ->leftJoin('participants', 'users.id', '=', 'participants.user_id')
            ->select(
                'event_registrations.*',
                'users.first_name',
                'users.last_name', 
                'users.email',
                'participants.category',
                'participants.phone_number'
            )
            ->get();

        $filename = "talksphere_{$subEvent->sub_event_code}_registrations_" . now()->format('Y-m-d') . ".csv";

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($registrations) {
            $file = fopen('php://output', 'w');
            
            // CSV Headers
            fputcsv($file, [
                'Registration ID',
                'Full Name',
                'Email',
                'Phone Number',
                'Category',
                'Registration Date',
                'Status'
            ]);

            // CSV Data
            foreach ($registrations as $registration) {
                fputcsv($file, [
                    $registration->id,
                    $registration->first_name . ' ' . $registration->last_name,
                    $registration->email,
                    $registration->phone_number ?? 'N/A',
                    $registration->category ?? 'N/A',
                    $registration->registration_date->format('Y-m-d H:i:s'),
                    $registration->registration_status
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
