<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10',
            'category' => 'required|in:general,bug_report,feature_request,event_feedback,technical_issue,other',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
        ]);

        try {
            $feedbackData = [
                'subject' => $request->subject,
                'message' => $request->message,
                'feedback_type' => $request->category, // Map category to feedback_type
                'event_code' => 'compsphere', // Default event code
                'rating' => null, // No rating for general feedback
                'status' => 'pending', // Default status
            ];

            // If user is authenticated, use their info
            if (Auth::check()) {
                $feedbackData['user_id'] = Auth::id();
            } else {
                // For anonymous feedback, name and email are optional
                if ($request->filled('name')) {
                    $feedbackData['name'] = $request->name;
                }
                if ($request->filled('email')) {
                    $feedbackData['email'] = $request->email;
                }
            }

            Feedback::create($feedbackData);

            return redirect()->back()->with('success', 'Thank you for your feedback! We will review it and get back to you if needed.');

        } catch (\Exception $e) {
            Log::error('Failed to create feedback: ' . $e->getMessage());
            
            return redirect()->back()
                ->withErrors(['error' => 'Failed to submit feedback. Please try again.'])
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
