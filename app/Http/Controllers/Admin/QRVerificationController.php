<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\EventRegistrationVerification;
use App\Models\Team;
use App\Models\TeamActivityVerification;
use App\Services\QRCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class QRVerificationController extends Controller
{
    protected $qrCodeService;

    public function __construct(QRCodeService $qrCodeService)
    {
        $this->qrCodeService = $qrCodeService;
        // Middleware akan diterapkan melalui route bukan di controller
    }

    /**
     * Show the QR code scanner page
     */
    public function showScanner()
    {
        $events = Event::where('is_active', true)->get();
        
        return Inertia::render('Admin/QRScanner', [
            'events' => $events
        ]);
    }

    /**
     * Show the verification page for a specific QR code
     */
    public function showVerificationPage(string $eventCode, string $activityCode, string $token)
    {
        // Get the event and activity
        $event = Event::where('event_code', $eventCode)->firstOrFail();
        $activity = Activity::where('activity_code', $activityCode)
            ->where('event_id', $event->id)
            ->firstOrFail();
        
        // Validate the token (but don't mark as used yet)
        $isValid = $this->qrCodeService->isValidToken($token);
        
        if (!$isValid) {
            return Inertia::render('Admin/QRVerificationResult', [
                'success' => false,
                'message' => 'Invalid or expired QR code',
                'event' => $event,
                'activity' => $activity
            ]);
        }
        
        // Get verification record to check if already used
        $verification = TeamActivityVerification::where('verification_token', $token)->first();
        
        if (!$verification) {
            return Inertia::render('Admin/QRVerificationResult', [
                'success' => false,
                'message' => 'Verification record not found',
                'event' => $event,
                'activity' => $activity
            ]);
        }
        
        if ($verification->status !== 'active') {
            return Inertia::render('Admin/QRVerificationResult', [
                'success' => false,
                'message' => 'QR code has already been used or expired',
                'event' => $event,
                'activity' => $activity,
                'verification' => $verification
            ]);
        }
        
        // Show verification confirmation page
        return Inertia::render('Admin/QRVerificationConfirm', [
            'event' => $event,
            'activity' => $activity,
            'verificationToken' => $token
        ]);
    }

    /**
     * Process the QR code verification
     */
    public function verifyQRCode(Request $request)
    {
        $request->validate([
            'verification_token' => 'required|string'
        ]);
        
        try {
            $result = $this->qrCodeService->verifyQRCode(
                $request->verification_token, 
                Auth::id()
            );
            
            if ($result['success']) {
                return Inertia::render('Admin/QRVerificationResult', [
                    'success' => true,
                    'message' => 'Team activity successfully verified',
                    'data' => $result['data']
                ]);
            } else {
                return Inertia::render('Admin/QRVerificationResult', [
                    'success' => false,
                    'message' => $result['message'],
                    'data' => $result['data'] ?? null
                ]);
            }
        } catch (\Exception $e) {
            Log::error('QR verification error: ' . $e->getMessage());
            
            return Inertia::render('Admin/QRVerificationResult', [
                'success' => false,
                'message' => 'An error occurred during verification: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Show the verification result page directly
     */
    public function showVerificationResult(Request $request)
    {
        $success = $request->input('success', false);
        $message = $request->input('message', '');
        
        return Inertia::render('Admin/QRVerificationResult', [
            'success' => $success,
            'message' => $message
        ]);
    }
    
    /**
     * API endpoint to verify QR code (for mobile app or JavaScript)
     */
    public function apiVerifyQRCode(Request $request)
    {
        $request->validate([
            'verification_token' => 'required|string'
        ]);
        
        try {
            $result = $this->qrCodeService->verifyQRCode(
                $request->verification_token,
                Auth::id()
            );
            
            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('API QR verification error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during verification: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process verification (matching route name)
     */
    public function processVerification(Request $request)
    {
        return $this->verifyQRCode($request);
    }

    /**
     * Handle verification using the new descriptive URL format with team code
     */
    public function verifyByTeamCode(string $eventCode, string $activityCode, string $teamCode)
    {
        // Find the team by team_code
        $team = Team::where('team_code', $teamCode)->first();
        
        if (!$team) {
            return Inertia::render('Admin/QRVerificationResult', [
                'success' => false,
                'message' => 'Invalid team code: ' . $teamCode
            ]);
        }
        
        // Get the event and activity
        $event = Event::where('event_code', $eventCode)->first();
        if (!$event) {
            return Inertia::render('Admin/QRVerificationResult', [
                'success' => false,
                'message' => 'Invalid event code: ' . $eventCode
            ]);
        }
        
        $activity = Activity::where('activity_code', $activityCode)
            ->where('event_id', $event->id)
            ->first();
            
        if (!$activity) {
            return Inertia::render('Admin/QRVerificationResult', [
                'success' => false,
                'message' => 'Invalid activity code or activity not found in this event'
            ]);
        }
        
        // Find the active verification for this team and activity
        $verification = TeamActivityVerification::where('team_id', $team->id)
            ->where('activity_id', $activity->id)
            ->where('status', 'active')
            ->first();
            
        if (!$verification) {
            return Inertia::render('Admin/QRVerificationResult', [
                'success' => false,
                'message' => 'No active verification found for this team and activity',
                'event' => $event,
                'activity' => $activity,
                'team' => $team
            ]);
        }
        
        // Show verification confirmation page
        return Inertia::render('Admin/QRVerificationConfirm', [
            'event' => $event,
            'activity' => $activity,
            'verificationToken' => $verification->verification_token,
            'team' => $team
        ]);
    }

    /**
     * Show the verification page for event registration QR code
     */
    public function showEventRegistrationVerificationPage(Request $request, string $eventCode, int $userId, string $token)
    {
        // Get the event
        $event = Event::where('event_code', $eventCode)->firstOrFail();
        
        // Validate the token (but don't mark as used yet)
        $isValid = $this->qrCodeService->isValidEventRegistrationToken($token);
        
        if (!$isValid) {
            return Inertia::render('Admin/QRVerificationResult', [
                'success' => false,
                'message' => 'Invalid or expired QR code',
                'event' => $event
            ]);
        }
        
        // Get sub_event_id from query parameter if present
        $subEventId = $request->query('sub_event_id');
        
        // Get verification record to check if already used
        $verification = EventRegistrationVerification::where('verification_token', $token)->first();
        
        if (!$verification) {
            return Inertia::render('Admin/QRVerificationResult', [
                'success' => false,
                'message' => 'Verification record not found',
                'event' => $event
            ]);
        }
        
        // Check if QR code has already been used/verified
        if ($verification->status === 'used') {
            return Inertia::render('Admin/QRVerificationResult', [
                'success' => false,
                'message' => 'QR code has already been used for verification.',
                'event' => $event,
                'verification' => $verification
            ]);
        }
        
        if ($verification->status !== 'active') {
            return Inertia::render('Admin/QRVerificationResult', [
                'success' => false,
                'message' => 'QR code has expired or is no longer valid.',
                'event' => $event,
                'verification' => $verification
            ]);
        }
        
        // Get event registration and user data
        $eventRegistration = $verification->eventRegistration;
        $participant = $eventRegistration->user;
        $user = $participant->user;
        
        // For sub-events, validate that the sub_event_id matches
        if ($subEventId && $eventRegistration->sub_event_id != $subEventId) {
            return Inertia::render('Admin/QRVerificationResult', [
                'success' => false,
                'message' => 'QR code is not valid for this sub-event.',
                'event' => $event
            ]);
        }
        
        // Get sub-event data if this is a sub-event registration
        $subEvent = null;
        if ($eventRegistration->sub_event_id) {
            $subEvent = $eventRegistration->subEvent;
        }
        
        // Show verification confirmation page
        return Inertia::render('Admin/EventRegistrationVerificationConfirm', [
            'event' => $event,
            'subEvent' => $subEvent,
            'eventRegistration' => $eventRegistration,
            'participant' => $participant,
            'user' => $user,
            'verificationToken' => $token
        ]);
    }

    /**
     * Process the event registration QR code verification
     */
    public function verifyEventRegistrationQR(Request $request)
    {
        $request->validate([
            'verification_token' => 'required|string'
        ]);
        
        try {
            $result = $this->qrCodeService->verifyEventRegistrationQR(
                $request->verification_token, 
                Auth::id()
            );
            
            if ($result['success']) {
                return Inertia::render('Admin/QRVerificationResult', [
                    'success' => true,
                    'message' => 'Event registration successfully verified',
                    'data' => $result['data'],
                    'type' => 'event_registration'
                ]);
            } else {
                return Inertia::render('Admin/QRVerificationResult', [
                    'success' => false,
                    'message' => $result['message'],
                    'data' => $result['data'] ?? null,
                    'type' => 'event_registration'
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Event registration QR verification error: ' . $e->getMessage());
            
            return Inertia::render('Admin/QRVerificationResult', [
                'success' => false,
                'message' => 'An error occurred during verification: ' . $e->getMessage(),
                'type' => 'event_registration'
            ]);
        }
    }
}
