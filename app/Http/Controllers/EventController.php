<?php

namespace App\Http\Controllers;

use App\Models\Event;
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
        
        // Determine the component name based on the event code
        $componentName = 'Pages/Events/' . ucfirst($slug);
        
        return Inertia::render($componentName, [
            'event' => $event,
            'user' => $user,
            'participantDetails' => $participantDetails,
            'isRegistered' => $isRegistered
        ]);
    }

    public function registerHackSphere(Request $request, $eventId)
    {
        $user = $request->user();
        $participant = $user->participant;
        
        if (!$participant) {
            return redirect()->route('participant.profile')->with('error', 'Please complete your profile before registering.');
        }

        $validated = $request->validate([
            'team_name' => 'required|string|max:255',
            'team_code' => 'required|string|max:255|unique:teams,team_code',
        ]);
    }
}
