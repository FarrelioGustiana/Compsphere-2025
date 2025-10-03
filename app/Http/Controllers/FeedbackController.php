<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    /**
     * Display the feedback form.
     */
    public function create()
    {
        return Inertia::render('Feedback/Create', [
            'user' => Auth::user(),
        ]);
    }

    /**
     * Store a new feedback submission.
     */
    public function store(Request $request)
    {
        try {
            // Log the incoming request data
            Log::info('Feedback submission attempt', [
                'request_data' => $request->all(),
                'user_id' => Auth::id(),
            ]);
            
            $validated = $request->validate([
                'subject' => 'required|string|max:255',
                'message' => 'required|string|min:10',
                'category' => 'required|in:general,bug_report,feature_request,event_feedback,technical_issue,other',
                'name' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
            ]);
            
            Log::info('Validation passed', ['validated_data' => $validated]);
            
            // Use direct query to check if feedback table exists and has the right structure
            try {
                $tableExists = DB::select("SHOW TABLES LIKE 'feedback'");
                Log::info('Table check', ['feedback_table_exists' => !empty($tableExists)]);
                
                if (!empty($tableExists)) {
                    $columns = DB::select('SHOW COLUMNS FROM feedback');
                    Log::info('Table columns', ['columns' => $columns]);
                }
            } catch (\Exception $dbError) {
                Log::error('Database check failed', ['error' => $dbError->getMessage()]);
            }
            
            // Try a simpler approach - use create method with all data at once
            $feedbackData = [
                'subject' => $validated['subject'],
                'message' => $validated['message'],
                'category' => $validated['category'],
                'priority' => 'medium',
                'status' => 'new',
            ];
            
            // If user is authenticated, use their info
            if (Auth::check()) {
                $feedbackData['user_id'] = Auth::id();
            } else {
                // For anonymous feedback, name and email are optional
                if (isset($validated['name'])) {
                    $feedbackData['name'] = $validated['name'];
                }
                if (isset($validated['email'])) {
                    $feedbackData['email'] = $validated['email'];
                }
            }
            
            Log::info('Attempting to create feedback with data', $feedbackData);
            
            // Try creating the feedback record
            $feedback = Feedback::create($feedbackData);
            
            Log::info('Feedback created successfully', ['feedback_id' => $feedback->id]);
            
            return redirect()->back()->with('success', 'Thank you for your feedback! We will review it and get back to you if needed.');

        } catch (\Exception $e) {
            Log::error('Failed to create feedback: ' . $e->getMessage(), [
                'exception' => $e,
                'exception_class' => get_class($e),
                'request_data' => $request->all(),
                'user_id' => Auth::id(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return redirect()->back()
                ->withErrors(['error' => 'Failed to submit feedback. Error: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display user's feedback history (for authenticated users).
     */
    public function index(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $feedback = Feedback::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Feedback/Index', [
            'feedback' => $feedback,
        ]);
    }

    /**
     * Show a specific feedback item (for the user who submitted it).
     */
    public function show(Request $request, Feedback $feedback)
    {
        // Check if user owns this feedback
        if (!Auth::check() || $feedback->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to feedback.');
        }

        return Inertia::render('Feedback/Show', [
            'feedback' => $feedback->load(['user', 'resolvedBy']),
        ]);
    }
}
