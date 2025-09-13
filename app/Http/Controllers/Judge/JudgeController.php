<?php

namespace App\Http\Controllers\Judge;

use App\Http\Controllers\Controller;
use App\Models\Judge;
use App\Models\ProjectEvaluation;
use App\Models\ProjectSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class JudgeController extends Controller
{
    /**
     * Display the judge dashboard.
     *
     * @return \Inertia\Response
     */
    public function dashboard()
    {
        $user = Auth::user();
        $judge = Judge::where('user_id', $user->id)->firstOrFail();
        
        // Get stats for the dashboard
        $totalSubmissions = ProjectSubmission::whereNotNull('submitted_at')->count();
        $evaluatedSubmissions = $judge->evaluations()->where('is_completed', true)->count();
        $pendingSubmissions = $totalSubmissions - $evaluatedSubmissions;
        
        return Inertia::render('Judge/Dashboard', [
            'judge' => $judge,
            'stats' => [
                'totalSubmissions' => $totalSubmissions,
                'evaluatedSubmissions' => $evaluatedSubmissions,
                'pendingSubmissions' => $pendingSubmissions,
                'completionPercentage' => $totalSubmissions > 0 
                    ? round(($evaluatedSubmissions / $totalSubmissions) * 100) 
                    : 0,
            ],
        ]);
    }
    
    /**
     * Display a list of all project submissions for judging.
     *
     * @return \Inertia\Response
     */
    public function submissions()
    {
        $user = Auth::user();
        $judge = Judge::where('user_id', $user->id)->firstOrFail();
        
        // Get all submissions with their team information and evaluation status for this judge
        $submissions = ProjectSubmission::with(['team.leader.user', 'evaluations' => function($query) use ($judge) {
            $query->where('judge_id', $judge->id);
        }])
        ->whereNotNull('submitted_at')
        ->get()
        ->map(function($submission) use ($judge) {
            $evaluation = $submission->evaluations->first();
            
            return [
                'id' => $submission->id,
                'team_name' => $submission->team->team_name,
                'project_title' => $submission->project_title,
                'submitted_at' => $submission->submitted_at->format('Y-m-d H:i'),
                'status' => $evaluation && $evaluation->is_completed ? 'evaluated' : 'pending',
                'team_leader' => $submission->team->leader->user->name,
            ];
        });
        
        return Inertia::render('Judge/Submissions', [
            'submissions' => $submissions,
        ]);
    }
    
    /**
     * Display the evaluation form for a specific project submission.
     *
     * @param  int  $submissionId
     * @return \Inertia\Response
     */
    public function evaluate($submissionId)
    {
        $user = Auth::user();
        $judge = Judge::where('user_id', $user->id)->firstOrFail();
        
        $submission = ProjectSubmission::with(['team.leader.user', 'team.members.user'])
            ->findOrFail($submissionId);
            
        // Get or create evaluation record
        $evaluation = ProjectEvaluation::firstOrNew([
            'project_submission_id' => $submission->id,
            'judge_id' => $judge->id,
        ]);
        
        // Prepare team data with safeguards for null values
        $leaderName = "No leader assigned";
        if ($submission->team->leader && $submission->team->leader->user) {
            $leaderName = $submission->team->leader->user->full_name ?? $submission->team->leader->user->name ?? 'Unknown';
        }
        
        $memberNames = [];
        if ($submission->team->members->count() > 0) {
            $memberNames = $submission->team->members->map(function($member) {
                return $member->user->full_name ?? $member->user->name ?? 'Unknown Member';
            })->toArray();
        }
        
        return Inertia::render('Judge/EvaluationForm', [
            'submission' => [
                'id' => $submission->id,
                'project_title' => $submission->project_title,
                'project_description' => $submission->project_description,
                'presentation_url' => $submission->presentation_url,
                'youtube_url' => $submission->youtube_url,
                'github_url' => $submission->github_url,
                'team' => [
                    'id' => $submission->team->id,
                    'team_name' => $submission->team->team_name,
                    'leader' => $leaderName,
                    'members' => $memberNames,
                ],
            ],
            'evaluation' => $evaluation,
            'scoringCriteria' => [
                [
                    'id' => 'whole_system_functionality_score',
                    'name' => 'Whole System Functionality',
                    'description' => 'Apakah sistem menyatu dan dapat digunakan sesuai konteks kasus PT. Kereta Api Indonesia (KAI)?',
                    'weight' => 30,
                    'tkt_level' => 'TKT 6',
                ],
                [
                    'id' => 'ui_ux_design_score',
                    'name' => 'UI/UX Design',
                    'description' => 'Apakah antar muka ramah pengguna, intuitif, dan profesional?',
                    'weight' => 20,
                    'tkt_level' => 'TKT 5-6',
                ],
                [
                    'id' => 'backend_logic_score',
                    'name' => 'Back-End & Logic',
                    'description' => 'Apakah logika sistem berjalan stabil, efisien, dan fleksibel?',
                    'weight' => 25,
                    'tkt_level' => 'TKT 6',
                ],
                [
                    'id' => 'ai_model_performance_score',
                    'name' => 'AI Model Performance',
                    'description' => 'Apakah AI/ML digunakan secara tepat dan menghasilkan output relevan?',
                    'weight' => 15,
                    'tkt_level' => 'TKT 5-6',
                ],
                [
                    'id' => 'automation_integration_score',
                    'name' => 'Automation & Integration',
                    'description' => 'Apakah terdapat komponen otomasi atau chatbot yang real-time dan terhubung dengan sistem lain?',
                    'weight' => 10,
                    'tkt_level' => 'TKT 6',
                ],
            ],
        ]);
    }
    
    /**
     * Store a new evaluation for a project submission.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $submissionId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeEvaluation(Request $request, $submissionId)
    {
        $user = Auth::user();
        $judge = Judge::where('user_id', $user->id)->firstOrFail();
        
        $submission = ProjectSubmission::findOrFail($submissionId);
        
        // Validate evaluation data
        $validator = Validator::make($request->all(), [
            'whole_system_functionality_score' => 'required|numeric|min:0|max:10',
            'ui_ux_design_score' => 'required|numeric|min:0|max:10',
            'backend_logic_score' => 'required|numeric|min:0|max:10',
            'ai_model_performance_score' => 'required|numeric|min:0|max:10',
            'automation_integration_score' => 'required|numeric|min:0|max:10',
            'comments' => 'nullable|string|max:2000',
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        
        // Create or update evaluation
        $evaluation = ProjectEvaluation::updateOrCreate(
            [
                'project_submission_id' => $submission->id,
                'judge_id' => $judge->id,
            ],
            [
                'whole_system_functionality_score' => $request->whole_system_functionality_score,
                'ui_ux_design_score' => $request->ui_ux_design_score,
                'backend_logic_score' => $request->backend_logic_score,
                'ai_model_performance_score' => $request->ai_model_performance_score,
                'automation_integration_score' => $request->automation_integration_score,
                'comments' => $request->comments,
                'is_completed' => true,
            ]
        );
        
        // Calculate and update final score
        $evaluation->updateFinalScore();
        
        return redirect()->route('judge.hacksphere.submissions')
            ->with('success', 'Evaluation submitted successfully!');
    }
    
    /**
     * Save an evaluation as draft without marking it as completed.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $submissionId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function saveEvaluationDraft(Request $request, $submissionId)
    {
        $user = Auth::user();
        $judge = Judge::where('user_id', $user->id)->firstOrFail();
        
        $submission = ProjectSubmission::findOrFail($submissionId);
        
        // Validate evaluation data (with less strict requirements for draft)
        $validator = Validator::make($request->all(), [
            'whole_system_functionality_score' => 'nullable|numeric|min:0|max:10',
            'ui_ux_design_score' => 'nullable|numeric|min:0|max:10',
            'backend_logic_score' => 'nullable|numeric|min:0|max:10',
            'ai_model_performance_score' => 'nullable|numeric|min:0|max:10',
            'automation_integration_score' => 'nullable|numeric|min:0|max:10',
            'comments' => 'nullable|string|max:2000',
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        
        // Create or update evaluation as draft
        $evaluation = ProjectEvaluation::updateOrCreate(
            [
                'project_submission_id' => $submission->id,
                'judge_id' => $judge->id,
            ],
            [
                'whole_system_functionality_score' => $request->whole_system_functionality_score,
                'ui_ux_design_score' => $request->ui_ux_design_score,
                'backend_logic_score' => $request->backend_logic_score,
                'ai_model_performance_score' => $request->ai_model_performance_score,
                'automation_integration_score' => $request->automation_integration_score,
                'comments' => $request->comments,
                'is_completed' => false,
            ]
        );
        
        return redirect()->route('judge.hacksphere.evaluate', $submission->id)
            ->with('success', 'Evaluation draft saved successfully!');
    }
    
    /**
     * Display the leaderboard with ranked submissions.
     *
     * @return \Inertia\Response
     */
    public function leaderboard()
    {
        $submissions = ProjectSubmission::with(['team'])
            ->whereNotNull('submitted_at')
            ->get();
        
        $rankedSubmissions = $submissions->map(function($submission) {
            $averageScore = $submission->getAverageFinalScoreAttribute();
            
            return [
                'id' => $submission->id,
                'team_name' => $submission->team->team_name,
                'project_title' => $submission->project_title,
                'average_score' => $averageScore,
                'evaluations_count' => $submission->evaluations()->where('is_completed', true)->count(),
            ];
        })
        ->filter(function($submission) {
            // Only include submissions that have been evaluated
            return $submission['average_score'] !== null;
        })
        ->sortByDesc('average_score')
        ->values()
        ->map(function($submission, $index) {
            // Add rank to each submission
            $submission['rank'] = $index + 1;
            return $submission;
        });
        
        return Inertia::render('Judge/Leaderboard', [
            'rankedSubmissions' => $rankedSubmissions,
        ]);
    }
}
