<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HacksphereCountdownController extends Controller
{
    /**
     * Get the common countdown data
     * 
     * @return array
     */
    private function getCountdownData()
    {
        // Define the start and end dates for the hackathon
        $startDate = '2025-10-02 12:00:00'; // October 2, 2025, 12:00 PM
        $endDate = '2025-10-04 12:00:00';   // October 4, 2025, 12:00 PM

        // Define announcement milestones (hours remaining)
        $announcements = [
            42 => 'First checkpoint! 6 hours in, 42 hours remaining. Keep up the great work!',
            36 => 'Halfway through day 1! 12 hours in, 36 hours remaining.',
            24 => 'Day 1 complete! 24 hours in, 24 hours remaining. You\'re halfway there!',
            18 => '30 hours in, 18 hours remaining. Keep pushing!',
            12 => '36 hours in, 12 hours remaining. Final stretch approaching!',
            6 => '42 hours in, 6 hours remaining. Final sprint!',
            3 => '45 hours in, 3 hours remaining. Wrap up your projects!',
            1 => '47 hours in, 1 hour remaining. Prepare for submission!',
        ];

        return [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'announcements' => $announcements,
        ];
    }

    /**
     * Display the countdown timer page for Hacksphere event in admin panel
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get the Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();

        if (!$hacksphereEvent) {
            return back()->with('error', 'Hacksphere event not found.');
        }

        return Inertia::render('Admin/Hacksphere/Countdown', $this->getCountdownData());
    }
    
    /**
     * Display the public countdown timer page for Hacksphere event
     * This page is meant to be displayed on a large screen during the hackathon
     *
     * @return \Inertia\Response
     */
    public function publicDisplay()
    {
        // Get the Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();

        if (!$hacksphereEvent) {
            return back()->with('error', 'Hacksphere event not found.');
        }

        return Inertia::render('Public/Hacksphere/CountdownDisplay', $this->getCountdownData());
    }
}
