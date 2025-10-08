<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\SubEvent;
use App\Models\EventRegistration;
use App\Models\ProjectSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Get all events
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllEvents()
    {
        $events = Event::all();
        
        return response()->json([
            'status' => 'success',
            'data' => $events
        ]);
    }
    
    /**
     * Get active events
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getActiveEvents()
    {
        $events = Event::where('is_active', true)->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $events
        ]);
    }
    
    /**
     * Display events page with all events
     * 
     * @return \Inertia\Response
     */
    public function index()
    {
        $events = Event::all();
        
        return Inertia::render('Events/Index', [
            'events' => $events
        ]);
    }
    
    /**
     * Display a specific event page
     * 
     * @param string $slug The event code/slug
     * @return \Inertia\Response
     */
    public function show(Request $request, $slug)
    {
        $event = Event::where('event_code', $slug)->firstOrFail();
        
        // Get user and participant data if logged in
        $user = $request->user();
        $participantDetails = $user ? $user->participant : null;
        
        // Check if user is registered for this event
        $isRegistered = false;
        if ($user) {
            $isRegistered = $user->events()->where('events.id', $event->id)->exists();
        }

        // Get event registration if user is registered
        $eventRegistration = null;
        if ($isRegistered) {
            $eventRegistration = $user->eventRegistrations()->where('event_id', $event->id)->first();
        }

        // Get sub-events for this event (if any)
        $subEvents = $event->activeSubEvents()->get();
        
        // Add status to each sub-event
        $subEvents = $subEvents->map(function ($subEvent) {
            $subEvent->status = $subEvent->status; // This will trigger the getStatusAttribute
            return $subEvent;
        });
        
        // Get user's sub-event registrations if logged in
        $userSubEventRegistrations = [];
        if ($user) {
            $userSubEventRegistrations = EventRegistration::where('user_id', $user->id)
                ->where('event_id', $event->id)
                ->whereNotNull('sub_event_id')
                ->with('subEvent')
                ->get()
                ->pluck('sub_event_id')
                ->toArray();
        }
        
        // Add status and registration open check to event
        $event->status = $event->status;
        $event->is_registration_open = $event->isRegistrationOpen();
        
        // Get top 10 leaderboard for Hacksphere
        $topTenLeaderboard = [];
        if ($slug === 'hacksphere') {
            $topTenLeaderboard = ProjectSubmission::with(['team.members.user', 'team.leader.user'])
                ->whereHas('evaluations', function($query) {
                    $query->where('is_completed', true);
                })
                ->get()
                ->map(function($submission) {
                    // Get all team members
                    $members = [];
                    if ($submission->team && $submission->team->members) {
                        foreach ($submission->team->members as $member) {
                            if ($member->user) {
                                $members[] = $member->user->name;
                            }
                        }
                    }
                    
                    return [
                        'team_name' => $submission->team->team_name,
                        'project_title' => $submission->project_title,
                        'team_members' => $members,
                        'average_score' => $submission->average_final_score,
                    ];
                })
                ->sortByDesc('average_score')
                ->take(10)
                ->values()
                ->map(function($item, $index) {
                    $item['rank'] = $index + 1;
                    return $item;
                });
        }
        
        // Determine the component name based on the event code
        $componentName = 'Pages/Events/' . ucfirst($slug);
        
        return Inertia::render($componentName, [
            'event' => $event,
            'user' => $user,
            'participantDetails' => $participantDetails,
            'isRegistered' => $isRegistered,
            'eventRegistration' => $eventRegistration,
            'subEvents' => $subEvents,
            'userSubEventRegistrations' => $userSubEventRegistrations,
            'topTenLeaderboard' => $topTenLeaderboard,
        ]);
    }

   
}
