<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\EventRegistrationVerification;
use App\Services\QRCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventRegistrationQRController extends Controller
{
    protected $qrCodeService;

    public function __construct(QRCodeService $qrCodeService)
    {
        $this->qrCodeService = $qrCodeService;
    }

    /**
     * Display QR code for event registration (alias for showQRCode)
     *
     * @param string $eventCode
     * @return \Inertia\Response
     */
    public function show($eventCode)
    {
        return $this->showQRCode($eventCode);
    }

    /**
     * Display QR code for event registration
     *
     * @param string $eventCode
     * @return \Inertia\Response
     */
    public function showQRCode($eventCode)
    {
        $user = Auth::user();
        $event = Event::where('event_code', $eventCode)->firstOrFail();
        
        // Check if user is registered for this event
        $eventRegistration = EventRegistration::where('user_id', $user->participant->user_id)
            ->where('event_id', $event->id)
            ->first();
            
        if (!$eventRegistration) {
            return redirect()->route('participant.dashboard')->with('error', 'You are not registered for this event.');
        }

        // Only allow QR codes for Festsphere and Exposphere (Talksphere uses sub-event QR codes)
        if (!in_array($event->event_code, ['festsphere', 'exposphere'])) {
            return redirect()->route('participant.dashboard')->with('error', 'QR codes are not available for this event.');
        }



        // Generate or get existing QR code
        $qrCodeData = $this->qrCodeService->generateEventRegistrationQR($user->participant->user_id, $event->id);

        if (!$qrCodeData) {
            return redirect()->route('participant.dashboard')->with('error', 'Unable to generate QR code.');
        }

        return Inertia::render('Participant/EventRegistrationQR', [
            'event' => $event,
            'eventRegistration' => $eventRegistration,
            'qrCodeData' => $qrCodeData,
        ]);
    }

    /**
     * Regenerate QR code for event registration
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function regenerateQRCode(Request $request)
    {
        $request->validate([
            'event_code' => 'required|string|exists:events,event_code',
        ]);

        $user = Auth::user();
        $event = Event::where('event_code', $request->event_code)->firstOrFail();

        // Check if user is registered for this event
        $eventRegistration = EventRegistration::where('user_id', $user->participant->user_id)
            ->where('event_id', $event->id)
            ->first();
            
        if (!$eventRegistration) {
            return redirect()->back()->with('error', 'You are not registered for this event.');
        }

        // Check if user is already verified
        if ($eventRegistration->registration_status === 'registered') {
            return back()->with('error', 'Cannot regenerate QR code for already verified registration.');
        }

        // Regenerate QR code
        $qrCodeData = $this->qrCodeService->regenerateEventRegistrationQR($user->participant->user_id, $event->id);

        if (!$qrCodeData) {
            return back()->with('error', 'Unable to regenerate QR code.');
        }

        return back()->with('success', 'QR code regenerated successfully.');
    }

    /**
     * Download QR code image
     *
     * @param string $eventCode
     * @return \Illuminate\Http\JsonResponse
     */
    public function downloadQRCode($eventCode)
    {
        $user = Auth::user();
        $event = Event::where('event_code', $eventCode)->firstOrFail();

        // Check if user is registered for this event
        $eventRegistration = EventRegistration::where('user_id', $user->participant->user_id)
            ->where('event_id', $event->id)
            ->first();
            
        if (!$eventRegistration) {
            return response()->json(['error' => 'You are not registered for this event.'], 403);
        }

        // Get QR code data
        $qrCodeData = $this->qrCodeService->generateEventRegistrationQR($user->participant->user_id, $event->id);

        if (!$qrCodeData) {
            return response()->json(['error' => 'Unable to generate QR code.'], 500);
        }

        return response()->json([
            'success' => true,
            'verification_url' => $qrCodeData['verification_url']
        ]);
    }
}
