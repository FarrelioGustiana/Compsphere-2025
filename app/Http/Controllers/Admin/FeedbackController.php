<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    /**
     * Display a listing of all feedback.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $category = $request->input('category');
        $priority = $request->input('priority');

        $feedback = Feedback::query()
            ->with(['user', 'respondedBy'])
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('subject', 'like', "%{$search}%")
                        ->orWhere('message', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($query) use ($search) {
                            $query->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status, function ($query, $status) {
                $query->byStatus($status);
            })
            ->when($category, function ($query, $category) {
                $query->byCategory($category);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Get statistics for dashboard
        $stats = [
            'total' => Feedback::count(),
            'new' => Feedback::byStatus('pending')->count(),
            'in_progress' => Feedback::byStatus('in_progress')->count(),
            'resolved' => Feedback::byStatus('resolved')->count(),
            'closed' => Feedback::byStatus('closed')->count(),
        ];

        $filters = [
            'search' => $search,
            'status' => $status,
            'category' => $category,
            'priority' => $priority,
        ];

        return Inertia::render('Admin/Feedback/Index', [
            'feedback' => $feedback,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    /**
     * Display the specified feedback.
     */
    public function show(Feedback $feedback)
    {
        $feedback->load(['user', 'resolvedBy']);

        return Inertia::render('Admin/Feedback/Show', [
            'feedback' => $feedback,
        ]);
    }

    /**
     * Update the feedback status and admin notes.
     */
    public function update(Request $request, Feedback $feedback)
    {
        $request->validate([
            'status' => 'required|in:new,in_progress,resolved,closed',
            'priority' => 'required|in:low,medium,high',
            'admin_notes' => 'nullable|string',
        ]);

        try {
            $updateData = [
                'status' => $request->status,
                'priority' => $request->priority,
                'admin_notes' => $request->admin_notes,
            ];

            // If marking as resolved, set resolved timestamp and admin
            if ($request->status === 'resolved' && $feedback->status !== 'resolved') {
                $updateData['resolved_at'] = now();
                $updateData['resolved_by'] = Auth::id();
            }

            // If changing from resolved to another status, clear resolved data
            if ($request->status !== 'resolved' && $feedback->status === 'resolved') {
                $updateData['resolved_at'] = null;
                $updateData['resolved_by'] = null;
            }

            $feedback->update($updateData);

            return redirect()->back()->with('success', 'Feedback updated successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to update feedback: ' . $e->getMessage());
            
            return redirect()->back()->with('error', 'Failed to update feedback. Please try again.');
        }
    }

    /**
     * Remove the specified feedback from storage.
     */
    public function destroy(Feedback $feedback)
    {
        try {
            $feedback->delete();

            return redirect()->route('admin.feedback.index')->with('success', 'Feedback deleted successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to delete feedback: ' . $e->getMessage());
            
            return redirect()->back()->with('error', 'Failed to delete feedback. Please try again.');
        }
    }

    /**
     * Bulk update feedback status.
     */
    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'feedback_ids' => 'required|array',
            'feedback_ids.*' => 'exists:feedback,id',
            'action' => 'required|in:mark_resolved,mark_closed,mark_in_progress,delete',
        ]);

        try {
            $feedbackIds = $request->feedback_ids;
            
            switch ($request->action) {
                case 'mark_resolved':
                    Feedback::whereIn('id', $feedbackIds)->update([
                        'status' => 'resolved',
                        'resolved_at' => now(),
                        'resolved_by' => Auth::id(),
                    ]);
                    $message = 'Selected feedback marked as resolved.';
                    break;
                    
                case 'mark_closed':
                    Feedback::whereIn('id', $feedbackIds)->update(['status' => 'closed']);
                    $message = 'Selected feedback marked as closed.';
                    break;
                    
                case 'mark_in_progress':
                    Feedback::whereIn('id', $feedbackIds)->update(['status' => 'in_progress']);
                    $message = 'Selected feedback marked as in progress.';
                    break;
                    
                case 'delete':
                    Feedback::whereIn('id', $feedbackIds)->delete();
                    $message = 'Selected feedback deleted successfully.';
                    break;
            }

            return redirect()->back()->with('success', $message);

        } catch (\Exception $e) {
            Log::error('Failed to bulk update feedback: ' . $e->getMessage());
            
            return redirect()->back()->with('error', 'Failed to update feedback. Please try again.');
        }
    }
}
