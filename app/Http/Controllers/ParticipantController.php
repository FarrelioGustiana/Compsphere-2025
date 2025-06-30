<?php

namespace App\Http\Controllers;

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
        $participantDetails = $user->participantDetails;
        
        return Inertia::render('Participant/Dashboard', [
            'user' => $user,
            'participantDetails' => $participantDetails,
            'events' => [
                [
                    'name' => 'Hacksphere',
                    'description' => 'Competitive programming and hackathon event',
                    'registered' => false,
                ],
                [
                    'name' => 'Festsphere',
                    'description' => 'Festival and exhibition event',
                    'registered' => false,
                ],
                [
                    'name' => 'Talksphere',
                    'description' => 'Talks and workshops event',
                    'registered' => false,
                ],
            ],
        ]);
    }
    
    /**
     * Display the participant profile.
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $participantDetails = $user->participantDetails;
        
        return Inertia::render('Participant/Profile', [
            'user' => $user,
            'participantDetails' => $participantDetails,
        ]);
    }
}
