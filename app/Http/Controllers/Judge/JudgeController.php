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
                    'id' => 'problem_solving_relevance_score',
                    'name' => 'Problem-Solving & Relevance',
                    'description' => 'Does the team identify a real PT. KAI problem (fraud, security, UX)? Is the solution well-targeted and supported by data/research?',
                    'weight' => 25,
                ],
                [
                    'id' => 'functional_mvp_prototype_score',
                    'name' => 'Functional MVP / Prototype',
                    'description' => 'Does the solution work as promised? Is it stable, usable, and does it demonstrate core features?',
                    'weight' => 25,
                ],
                [
                    'id' => 'technical_execution_score',
                    'name' => 'Technical Execution',
                    'description' => 'Is the technical quality strong? Clear architecture, appropriate stack, handling of integration, security, scalability, and errors?',
                    'weight' => 20,
                ],
                [
                    'id' => 'creativity_innovation_score',
                    'name' => 'Creativity & Innovation',
                    'description' => 'Is there a unique or novel approach, feature, or technology that stands out from conventional solutions?',
                    'weight' => 10,
                ],
                [
                    'id' => 'impact_scalability_score',
                    'name' => 'Impact & Scalability',
                    'description' => 'Can the solution scale across KAI\'s ecosystem? Is it sustainable with long-term development potential?',
                    'weight' => 10,
                ],
                [
                    'id' => 'presentation_clarity_score',
                    'name' => 'Presentation Clarity',
                    'description' => 'Are slides and video clear and complete? Did all members present well? Was the demo easy to follow?',
                    'weight' => 10,
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
            'problem_solving_relevance_score' => 'required|numeric|min:1|max:100',
            'functional_mvp_prototype_score' => 'required|numeric|min:1|max:100',
            'technical_execution_score' => 'required|numeric|min:1|max:100',
            'creativity_innovation_score' => 'required|numeric|min:1|max:100',
            'impact_scalability_score' => 'required|numeric|min:1|max:100',
            'presentation_clarity_score' => 'required|numeric|min:1|max:100',
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
                'problem_solving_relevance_score' => $request->problem_solving_relevance_score,
                'functional_mvp_prototype_score' => $request->functional_mvp_prototype_score,
                'technical_execution_score' => $request->technical_execution_score,
                'creativity_innovation_score' => $request->creativity_innovation_score,
                'impact_scalability_score' => $request->impact_scalability_score,
                'presentation_clarity_score' => $request->presentation_clarity_score,
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
            'problem_solving_relevance_score' => 'nullable|numeric|min:1|max:100',
            'functional_mvp_prototype_score' => 'nullable|numeric|min:1|max:100',
            'technical_execution_score' => 'nullable|numeric|min:1|max:100',
            'creativity_innovation_score' => 'nullable|numeric|min:1|max:100',
            'impact_scalability_score' => 'nullable|numeric|min:1|max:100',
            'presentation_clarity_score' => 'nullable|numeric|min:1|max:100',
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
                'problem_solving_relevance_score' => $request->problem_solving_relevance_score,
                'functional_mvp_prototype_score' => $request->functional_mvp_prototype_score,
                'technical_execution_score' => $request->technical_execution_score,
                'creativity_innovation_score' => $request->creativity_innovation_score,
                'impact_scalability_score' => $request->impact_scalability_score,
                'presentation_clarity_score' => $request->presentation_clarity_score,
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
