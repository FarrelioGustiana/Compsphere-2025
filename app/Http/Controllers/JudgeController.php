<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class JudgeController extends Controller
{
    /**
     * Display the judge dashboard.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $judgeProfile = $user->judgeProfile;
        
        return Inertia::render('Judge/Dashboard', [
            'user' => $user,
            'judgeProfile' => $judgeProfile,
            'assignments' => [
                // Placeholder for future judging assignments
                [
                    'event' => 'Hacksphere',
                    'category' => 'Web Development',
                    'status' => 'Pending',
                ],
                [
                    'event' => 'Hacksphere',
                    'category' => 'Mobile Development',
                    'status' => 'Pending',
                ],
            ],
        ]);
    }
    
    /**
     * Display the judge profile.
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $judgeProfile = $user->judgeProfile;
        
        return Inertia::render('Judge/Profile', [
            'user' => $user,
            'judgeProfile' => $judgeProfile,
        ]);
    }
}
