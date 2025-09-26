<?php

namespace App\Http\Controllers;

use App\Models\EventRegistration;
use App\Models\SubEvent;
use App\Services\QRCodeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubEventQRController extends Controller
{
    protected $qrCodeService;

    public function __construct(QRCodeService $qrCodeService)
    {
        $this->qrCodeService = $qrCodeService;
    }

    /**
     * Display QR code for a specific sub-event registration
     */
    public function show(Request $request, $subEventId)
    {
        $user = $request->user();
        
        // Find the sub-event
        $subEvent = SubEvent::with('event')->findOrFail($subEventId);
        
        // Check if user is registered for this sub-event
        $registration = EventRegistration::where('user_id', $user->id)
            ->where('event_id', $subEvent->event_id)
            ->where('sub_event_id', $subEvent->id)
            ->first();

        if (!$registration) {
            return redirect()->back()->with('error', 'You are not registered for this sub-event.');
        }

        // Generate QR code for this specific sub-event registration
        $qrData = $this->qrCodeService->generateEventRegistrationQR(
            $user->id, 
            $subEvent->event_id, 
            $subEvent->id
        );

        if (!$qrData) {
            return redirect()->back()->with('error', 'Unable to generate QR code. Please try again.');
        }

        return Inertia::render('Participant/SubEventQR', [
            'subEvent' => $subEvent,
            'registration' => $registration,
            'qrData' => $qrData,
            'user' => $user,
        ]);
    }

    /**
     * Regenerate QR code for a sub-event registration
     */
    public function regenerate(Request $request, $subEventId)
    {
        $user = $request->user();
        
        // Find the sub-event
        $subEvent = SubEvent::with('event')->findOrFail($subEventId);
        
        // Check if user is registered for this sub-event
        $registration = EventRegistration::where('user_id', $user->id)
            ->where('event_id', $subEvent->event_id)
            ->where('sub_event_id', $subEvent->id)
            ->first();

        if (!$registration) {
            return response()->json(['error' => 'You are not registered for this sub-event.'], 404);
        }

        // Regenerate QR code
        $qrData = $this->qrCodeService->regenerateEventRegistrationQR(
            $user->id, 
            $subEvent->event_id, 
            $subEvent->id
        );

        if (!$qrData) {
            return response()->json(['error' => 'Unable to regenerate QR code.'], 500);
        }

        return response()->json([
            'success' => true,
            'qrData' => $qrData,
            'message' => 'QR code regenerated successfully.'
        ]);
    }
}
