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
        
        // Get real data for assignments
        $judge = \App\Models\Judge::where('user_id', $user->id)->first();
        $event = \App\Models\Event::where('event_code', 'hacksphere')->first();
        
        if (!$judge) {
            // Create judge record if it doesn't exist
            $judge = \App\Models\Judge::create([
                'user_id' => $user->id,
                'specialization' => $judgeProfile ? $judgeProfile->specialization : null,
                'bio' => $judgeProfile ? $judgeProfile->bio : null,
                'is_active' => true,
            ]);
        }
        
        // Get counts of pending and completed evaluations
        $totalSubmissions = \App\Models\ProjectSubmission::whereNotNull('submitted_at')->count();
        $evaluatedCount = $judge->evaluations()->where('is_completed', true)->count();
        $pendingCount = $totalSubmissions - $evaluatedCount;
        
        // Get real categories from the judge's expertise or from the database
        $categories = explode(',', $judge->specialization ?? 'Web Development,Mobile Development');
        $categories = array_map('trim', $categories);
        
        // Generate assignments based on real data
        $assignments = [];
        foreach ($categories as $category) {
            $assignments[] = [
                'event' => 'Hacksphere',
                'category' => $category,
                'status' => $pendingCount > 0 ? 'Pending' : 'Completed',
                'pending_count' => $pendingCount,
                'url' => route('judge.hacksphere.submissions'),
            ];
        }
        
        return Inertia::render('Judge/Dashboard', [
            'user' => $user,
            'judgeProfile' => $judgeProfile,
            'assignments' => $assignments,
            'stats' => [
                'totalSubmissions' => $totalSubmissions,
                'evaluatedSubmissions' => $evaluatedCount,
                'pendingSubmissions' => $pendingCount,
                'completionPercentage' => $totalSubmissions > 0 ? round(($evaluatedCount / $totalSubmissions) * 100) : 0,
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
