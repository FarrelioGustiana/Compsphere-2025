<?php

namespace App\Services;

use App\Models\Activity;
use App\Models\Event;
use App\Models\Team;
use App\Models\TeamActivityVerification;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
// Removed QrCode facade dependency - will generate URLs only

class QRCodeService
{
    /**
     * Generate a QR code for a specific team activity
     * 
     * @param int $teamId
     * @param int $activityId
     * @return array|null QR code data or null if error
     */
    public function generateTeamActivityQR(int $teamId, int $activityId): ?array
    {
        try {
            $team = Team::findOrFail($teamId);
            $activity = Activity::findOrFail($activityId);
            $event = Event::findOrFail($activity->event_id);

            // First check if a verification already exists and is still active
            $verification = TeamActivityVerification::where('team_id', $teamId)
                ->where('activity_id', $activityId)
                ->where('status', 'active')
                ->first();

            // If no active verification exists, create a new one
            if (!$verification) {
                $verification = new TeamActivityVerification();
                $verification->team_id = $teamId;
                $verification->activity_id = $activityId;
                $verification->verification_token = $this->generateUniqueToken();
                $verification->status = 'active';
                $verification->save();
            }

            // Generate the verification URL
            $verificationUrl = $this->getVerificationUrl($event->event_code, $activity->activity_code, $verification->verification_token);
            
            // No longer generating QR code image on server-side
            // QR code will be generated on client side using JavaScript library

            return [
                'verification_id' => $verification->id,
                'team_id' => $team->id,
                'team_name' => $team->team_name,
                'activity_id' => $activity->id,
                'activity_name' => $activity->name,
                'verification_token' => $verification->verification_token,
                'verification_url' => $verificationUrl,
                // QR code will be generated on client side
                'status' => $verification->status
            ];
        } catch (\Exception $e) {
            Log::error('Error generating QR code: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Generate all QR codes for a team's activities in an event
     * 
     * @param int $teamId
     * @param int $eventId
     * @return array
     */
    public function bulkGenerateTeamQRCodes(int $teamId, int $eventId): array
    {
        $activities = Activity::where('event_id', $eventId)
            ->where('is_active', true)
            ->get();
        
        $results = [];
        
        foreach ($activities as $activity) {
            $qrCode = $this->generateTeamActivityQR($teamId, $activity->id);
            if ($qrCode) {
                $results[] = $qrCode;
            }
        }
        
        return $results;
    }

    /**
     * Verify a QR code using its token
     * 
     * @param string $token
     * @param int $adminId
     * @return array
     */
    public function verifyQRCode(string $token, int $adminId): array
    {
        try {
            DB::beginTransaction();
            
            // Find the verification record
            $verification = TeamActivityVerification::where('verification_token', $token)
                ->where('status', 'active')
                ->lockForUpdate()
                ->first();
            
            if (!$verification) {
                // Check if it exists but is not active
                $inactiveVerification = TeamActivityVerification::where('verification_token', $token)
                    ->where('status', '!=', 'active')
                    ->first();
                
                if ($inactiveVerification) {
                    $status = $inactiveVerification->status === 'used' ? 'already verified' : 'expired';
                    
                    DB::commit();
                    return [
                        'success' => false,
                        'message' => 'This QR code has been ' . $status . '.',
                        'data' => [
                            'verification' => $inactiveVerification,
                            'team' => $inactiveVerification->team,
                            'activity' => $inactiveVerification->activity,
                            'event' => $inactiveVerification->activity->event
                        ]
                    ];
                }
                
                DB::commit();
                return [
                    'success' => false,
                    'message' => 'Invalid verification token.'
                ];
            }
            
            // Mark as verified
            $verification->status = 'used';
            $verification->verified_at = now();
            $verification->verified_by = $adminId;
            $verification->save();
            
            // Get related data
            $team = Team::find($verification->team_id);
            $activity = Activity::find($verification->activity_id);
            $event = $activity ? Event::find($activity->event_id) : null;
            $admin = User::find($adminId);
            
            DB::commit();
            
            return [
                'success' => true,
                'message' => 'Activity verification successful.',
                'data' => [
                    'verification' => $verification,
                    'team' => $team,
                    'activity' => $activity,
                    'event' => $event,
                    'admin' => $admin
                ]
            ];
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error verifying QR code: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'An error occurred during verification: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Regenerate a QR code for a team activity
     * 
     * @param int $teamId
     * @param int $activityId
     * @return array|null
     */
    public function regenerateQRCode(int $teamId, int $activityId): ?array
    {
        try {
            // Invalidate any existing active QR codes
            TeamActivityVerification::where('team_id', $teamId)
                ->where('activity_id', $activityId)
                ->where('status', 'active')
                ->update(['status' => 'expired']);
            
            // Generate a new QR code
            return $this->generateTeamActivityQR($teamId, $activityId);
        } catch (\Exception $e) {
            Log::error('Error regenerating QR code: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Check if a verification token is valid
     * 
     * @param string $token
     * @return bool
     */
    public function isValidToken(string $token): bool
    {
        return TeamActivityVerification::where('verification_token', $token)
            ->where('status', 'active')
            ->exists();
    }

    /**
     * Generate a unique verification token
     * 
     * @return string
     */
    protected function generateUniqueToken(): string
    {
        $token = Str::random(32);
        
        // Ensure token is unique
        while (TeamActivityVerification::where('verification_token', $token)->exists()) {
            $token = Str::random(32);
        }
        
        return $token;
    }

    /**
     * Get the verification URL for a token
     * 
     * @param string $eventCode
     * @param string $activityCode
     * @param string $token
     * @return string
     */
    protected function getVerificationUrl(string $eventCode, string $activityCode, string $token): string
    {
        // Ambil team_code dari token verification
        $verification = TeamActivityVerification::where('verification_token', $token)->first();
        
        if (!$verification) {
            return url("/admin/verify/{$eventCode}/{$activityCode}/{$token}");
        }
        
        $team = Team::find($verification->team_id);
        $teamCode = $team ? $team->team_code : 'unknown';
        
        // Format URL yang lebih deskriptif
        return url("/admin/{$eventCode}/{$activityCode}/{$teamCode}");
    }
}
