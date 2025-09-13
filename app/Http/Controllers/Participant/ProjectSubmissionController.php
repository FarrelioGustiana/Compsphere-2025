<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\ProjectSubmission;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ProjectSubmissionController extends Controller
{
    /**
     * Display the project submission form for a team.
     *
     * @param  int  $teamId
     * @return \Inertia\Response
     */
    public function show(int $teamId)
    {
        $team = Team::with(['leader', 'members', 'event'])
            ->findOrFail($teamId);
            
        // Check if user is part of this team
        $user = Auth::user();
        $participant = $user->participant;
        
        $isTeamLeader = $team->team_leader_id === $participant->user_id;
        $isTeamMember = $team->members()->where('team_members.user_id', $participant->user_id)->exists();
        
        if (!$isTeamLeader && !$isTeamMember) {
            abort(403, 'You are not authorized to access this team\'s submission form.');
        }
        
        // Get submission if exists
        $submission = $team->projectSubmission;
        
        // Check if submission deadline has passed
        $deadlinePassed = now() > config('hacksphere.submission_deadline', '2025-10-04 12:00:00');
        
        return Inertia::render('Participant/ProjectSubmission', [
            'team' => $team,
            'submission' => $submission,
            'isTeamLeader' => $isTeamLeader,
            'deadlinePassed' => $deadlinePassed,
            'deadline' => config('hacksphere.submission_deadline', '2025-10-04 12:00:00'),
        ]);
    }
    
    /**
     * Store a new project submission.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $teamId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, int $teamId)
    {
        $team = Team::findOrFail($teamId);
        
        // Check if user is part of this team
        $user = Auth::user();
        $participant = $user->participant;
        
        $isTeamLeader = $team->team_leader_id === $participant->user_id;
        
        if (!$isTeamLeader) {
            return redirect()->back()->with('error', 'Only team leaders can submit project details.');
        }
        
        // Check if deadline has passed
        if (now() > config('hacksphere.submission_deadline', '2025-10-04 12:00:00')) {
            return redirect()->back()->with('error', 'The submission deadline has passed.');
        }
        
        // Validate submission data
        $validator = Validator::make($request->all(), [
            'project_title' => 'required|string|max:255',
            'project_description' => 'required|string|max:5000',
            'presentation_url' => ['required', 'string', 'url', 'max:255', function ($attribute, $value, $fail) {
                // Validate Google Drive URL
                if (!preg_match('/drive\.google\.com/i', $value)) {
                    $fail('The presentation URL must be a Google Drive link.');
                }
            }],
            'youtube_url' => ['required', 'string', 'url', 'max:255', function ($attribute, $value, $fail) {
                // Validate YouTube URL
                if (!preg_match('/(youtube\.com|youtu\.be)/i', $value)) {
                    $fail('The video URL must be a YouTube link.');
                }
            }],
            'github_url' => ['required', 'string', 'url', 'max:255', function ($attribute, $value, $fail) {
                // Validate GitHub URL
                if (!preg_match('/github\.com/i', $value)) {
                    $fail('The repository URL must be a GitHub link.');
                }
            }],
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        
        // Create or update submission
        $submission = ProjectSubmission::updateOrCreate(
            ['team_id' => $team->id],
            [
                'project_title' => $request->project_title,
                'project_description' => $request->project_description,
                'presentation_url' => $request->presentation_url,
                'youtube_url' => $request->youtube_url,
                'github_url' => $request->github_url,
                'submitted_at' => now(),
            ]
        );
        
        return redirect()->route('participant.team.submission', $team->id)
            ->with('success', 'Project submission successful!');
    }
    
    /**
     * Update an existing project submission.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $teamId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, int $teamId)
    {
        $team = Team::findOrFail($teamId);
        
        // Check if user is part of this team
        $user = Auth::user();
        $participant = $user->participant;
        
        $isTeamLeader = $team->team_leader_id === $participant->user_id;
        
        if (!$isTeamLeader) {
            return redirect()->back()->with('error', 'Only team leaders can update project details.');
        }
        
        // Check if submission exists
        $submission = $team->projectSubmission;
        if (!$submission) {
            return redirect()->back()->with('error', 'No submission found to update.');
        }
        
        // Check if deadline has passed
        if (now() > config('hacksphere.submission_deadline', '2025-10-04 12:00:00')) {
            return redirect()->back()->with('error', 'The submission deadline has passed. You can no longer update your submission.');
        }
        
        // Validate submission data
        $validator = Validator::make($request->all(), [
            'project_title' => 'required|string|max:255',
            'project_description' => 'required|string|max:5000',
            'presentation_url' => ['required', 'string', 'url', 'max:255', function ($attribute, $value, $fail) {
                // Validate Google Drive URL
                if (!preg_match('/drive\.google\.com/i', $value)) {
                    $fail('The presentation URL must be a Google Drive link.');
                }
            }],
            'youtube_url' => ['required', 'string', 'url', 'max:255', function ($attribute, $value, $fail) {
                // Validate YouTube URL
                if (!preg_match('/(youtube\.com|youtu\.be)/i', $value)) {
                    $fail('The video URL must be a YouTube link.');
                }
            }],
            'github_url' => ['required', 'string', 'url', 'max:255', function ($attribute, $value, $fail) {
                // Validate GitHub URL
                if (!preg_match('/github\.com/i', $value)) {
                    $fail('The repository URL must be a GitHub link.');
                }
            }],
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        
        // Update submission
        $submission->update([
            'project_title' => $request->project_title,
            'project_description' => $request->project_description,
            'presentation_url' => $request->presentation_url,
            'youtube_url' => $request->youtube_url,
            'github_url' => $request->github_url,
            'submitted_at' => now(),
        ]);
        
        return redirect()->route('participant.team.submission', $team->id)
            ->with('success', 'Project submission updated successfully!');
    }
    
    /**
     * Save a draft of the project submission without finalizing.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $teamId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function saveDraft(Request $request, int $teamId)
    {
        $team = Team::findOrFail($teamId);
        
        // Check if user is part of this team
        $user = Auth::user();
        $participant = $user->participant;
        
        $isTeamLeader = $team->team_leader_id === $participant->user_id;
        
        if (!$isTeamLeader) {
            return redirect()->back()->with('error', 'Only team leaders can save draft submissions.');
        }
        
        // Check if deadline has passed
        if (now() > config('hacksphere.submission_deadline', '2025-10-04 12:00:00')) {
            return redirect()->back()->with('error', 'The submission deadline has passed. You can no longer update your submission.');
        }
        
        // Validate submission data - less strict for draft
        $validator = Validator::make($request->all(), [
            'project_title' => 'nullable|string|max:255',
            'project_description' => 'nullable|string|max:5000',
            'presentation_url' => 'nullable|string|url|max:255',
            'youtube_url' => 'nullable|string|url|max:255',
            'github_url' => 'nullable|string|url|max:255',
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        
        // Create or update draft submission
        $submission = ProjectSubmission::updateOrCreate(
            ['team_id' => $team->id],
            [
                'project_title' => $request->project_title ?? '',
                'project_description' => $request->project_description ?? '',
                'presentation_url' => $request->presentation_url ?? '',
                'youtube_url' => $request->youtube_url ?? '',
                'github_url' => $request->github_url ?? '',
                // Don't update submitted_at for drafts
            ]
        );
        
        return redirect()->route('participant.team.submission', $team->id)
            ->with('success', 'Draft saved successfully!');
    }
}
