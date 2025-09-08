<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Event;
use App\Models\Team;
use App\Models\TeamActivityVerification;
use App\Services\QRCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;


class TeamQRCodeController extends Controller
{
    protected $qrCodeService;

    public function __construct(QRCodeService $qrCodeService)
    {
        $this->qrCodeService = $qrCodeService;
        // Middleware akan diterapkan melalui route bukan di controller
    }

    /**
     * Display team QR codes for Hacksphere activities
     *
     * @param int $teamId
     * @return \Inertia\Response
     */
    public function showTeamQRCodes($teamId)
    {
        $user = Auth::user();
        $team = Team::findOrFail($teamId);

        // Check if user is team member or leader
        if ($team->team_leader_id !== $user->id && !$team->members()->where('team_members.user_id', $user->id)->exists()) {
            return redirect()->route('participant.dashboard')->with('error', 'You do not have permission to view this team\'s QR codes.');
        }

        // Get Hacksphere event
        $event = Event::where('event_code', 'hacksphere')->firstOrFail();

        // Get all activities for Hacksphere
        $activities = Activity::where('event_id', $event->id)->get();

        // Get all verifications for this team
        $verifications = TeamActivityVerification::where('team_id', $teamId)
            ->whereIn('activity_id', $activities->pluck('id'))
            ->with(['activity'])
            ->get();

        // Organize data for the view
        $qrCodesData = [];
        foreach ($activities as $activity) {
            $verification = $verifications->first(function ($v) use ($activity) {
                return $v->activity_id === $activity->id && $v->status === 'active';
            });

            if (!$verification) {
                // Generate a new verification if none exists or none is active
                $qrData = $this->qrCodeService->generateTeamActivityQR($teamId, $activity->id);

                if ($qrData) {
                    // Buat objek verification dari data yang dikembalikan
                    $verificationObj = TeamActivityVerification::find($qrData['verification_id']);

                    $qrCodesData[] = [
                        'activity' => $activity,
                        'verification' => $verificationObj,
                        'verification_url' => $qrData['verification_url'],
                    ];
                }
            } else {
                // Generate QR code for existing verification
                $verificationUrl = $verification->getVerificationUrl();

                $qrCodesData[] = [
                    'activity' => $activity,
                    'verification' => $verification,
                    'verification_url' => $verificationUrl,
                ];
            }
        }

        return Inertia::render('Participant/TeamQRCodes', [
            'team' => $team,
            'event' => $event,
            'qrCodesData' => $qrCodesData,
        ]);
    }

    /**
     * Regenerate a QR code for a specific team activity
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function regenerateQRCode(Request $request)
    {
        $request->validate([
            'team_id' => 'required|integer|exists:teams,id',
            'activity_id' => 'required|integer|exists:activities,id',
        ]);

        $teamId = $request->team_id;
        $activityId = $request->activity_id;

        $user = Auth::user();
        $team = Team::findOrFail($teamId);

        // Check if user is team leader (only team leader can regenerate QR codes)
        if ($team->team_leader_id !== $user->id) {
            return redirect()->back()->with('error', 'Only team leader can regenerate QR codes.');
        }

        // Regenerate QR code
        $this->qrCodeService->regenerateQRCode($teamId, $activityId);

        return redirect()->back()->with('success', 'QR code has been regenerated successfully.');
    }

    /**
     * Download a QR code image for a specific team activity
     *
     * @param int $teamId
     * @param int $activityId
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function downloadQRCode($teamId, $activityId)
    {
        $user = Auth::user();
        $team = Team::findOrFail($teamId);

        // Check if user is team member or leader
        if ($team->team_leader_id !== $user->id && !$team->members()->where('team_members.user_id', $user->id)->exists()) {
            return redirect()->route('participant.dashboard')->with('error', 'You do not have permission to download this team\'s QR codes.');
        }

        $activity = Activity::findOrFail($activityId);

        // Get verification for this team and activity
        $verification = TeamActivityVerification::where('team_id', $teamId)
            ->where('activity_id', $activityId)
            ->where('status', 'active')
            ->first();

        if (!$verification) {
            $qrData = $this->qrCodeService->generateTeamActivityQR($teamId, $activityId);
            $verification = $qrData['verification'];
        }

        $verificationUrl = $verification->getVerificationUrl();

        // QR Code generation moved to client-side
        // Return a JSON response with verification URL instead
        return response()->json([
            'success' => true,
            'verification_url' => $verificationUrl
        ]);
    }
}
