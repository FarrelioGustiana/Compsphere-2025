<?php

namespace App\Services;

use App\Models\Activity;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\EventRegistrationVerification;
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

    /**
     * Generate a QR code for an event registration
     * 
     * @param int $userId
     * @param int $eventId
     * @param int|null $subEventId
     * @return array|null QR code data or null if error
     */
    public function generateEventRegistrationQR(int $userId, int $eventId, ?int $subEventId = null): ?array
    {
        try {
            // Find the event registration
            $query = EventRegistration::where('user_id', $userId)
                ->where('event_id', $eventId);
            
            if ($subEventId) {
                $query->where('sub_event_id', $subEventId);
            } else {
                $query->whereNull('sub_event_id');
            }
            
            $eventRegistration = $query->first();

            if (!$eventRegistration) {
                $subEventText = $subEventId ? " and sub_event_id: $subEventId" : "";
                Log::error('Event registration not found for user_id: ' . $userId . ', event_id: ' . $eventId . $subEventText);
                return null;
            }

            $event = Event::findOrFail($eventId);
            $participant = $eventRegistration->user;
            $user = $participant->user;

            // Check if user is already registered (verified)
            if ($eventRegistration->registration_status === 'registered') {
                // Return existing verification data even if used, for display purposes
                $verification = EventRegistrationVerification::where('event_registration_id', $eventRegistration->id)
                    ->orderBy('verified_at', 'desc')
                    ->first();
                    
                if ($verification) {
                    // Generate the verification URL
                    $verificationUrl = $verification->getVerificationUrl();
                    
                    return [
                        'verification_id' => $verification->id,
                        'event_registration_id' => $eventRegistration->id,
                        'event_id' => $event->id,
                        'event_name' => $event->event_name,
                        'event_code' => $event->event_code,
                        'user_id' => $user->id,
                        'user_name' => $user->full_name,
                        'verification_token' => $verification->verification_token,
                        'verification_url' => $verificationUrl,
                        'status' => 'verified' // Show as verified instead of used
                    ];
                }
            }

            // Check if a verification already exists and is still active
            $verification = EventRegistrationVerification::where('event_registration_id', $eventRegistration->id)
                ->where('status', 'active')
                ->first();

            // If no active verification exists, create a new one
            if (!$verification) {
                $verification = new EventRegistrationVerification();
                $verification->event_registration_id = $eventRegistration->id;
                $verification->verification_token = $this->generateUniqueRegistrationToken();
                $verification->status = 'active';
                $verification->save();
            }

            // Generate the verification URL
            $verificationUrl = $verification->getVerificationUrl();
            
            return [
                'verification_id' => $verification->id,
                'event_registration_id' => $eventRegistration->id,
                'event_id' => $event->id,
                'event_name' => $event->event_name,
                'event_code' => $event->event_code,
                'user_id' => $user->id,
                'user_name' => $user->full_name,
                'verification_token' => $verification->verification_token,
                'verification_url' => $verificationUrl,
                'status' => $verification->status
            ];
        } catch (\Exception $e) {
            Log::error('Error generating event registration QR code: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Verify an event registration QR code using its token
     * 
     * @param string $token
     * @param int $adminId
     * @return array
     */
    public function verifyEventRegistrationQR(string $token, int $adminId): array
    {
        try {
            DB::beginTransaction();
            
            // Find the verification record
            $verification = EventRegistrationVerification::where('verification_token', $token)
                ->where('status', 'active')
                ->lockForUpdate()
                ->first();
            
            if (!$verification) {
                // Check if it exists but is not active
                $inactiveVerification = EventRegistrationVerification::where('verification_token', $token)
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
                            'event_registration' => $inactiveVerification->eventRegistration,
                            'event' => $inactiveVerification->eventRegistration->event,
                            'user' => $inactiveVerification->eventRegistration->user->user
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
            $eventRegistration = EventRegistration::find($verification->event_registration_id);
            $event = $eventRegistration ? Event::find($eventRegistration->event_id) : null;
            $participant = $eventRegistration ? $eventRegistration->user : null;
            $user = $participant ? $participant->user : null;
            $admin = User::find($adminId);
            
            // Note: We removed the double check for registration_status === 'registered' 
            // because for sub-events, registration_status is set to 'registered' immediately upon registration
            // The verification status is tracked by the verification record status (active/used/expired)
            
            // Log successful verification
            Log::info('QR code verification successful', [
                'token' => $token,
                'admin_id' => $adminId,
                'event_registration_id' => $verification->event_registration_id,
                'event_id' => $eventRegistration->event_id,
                'sub_event_id' => $eventRegistration->sub_event_id,
                'user_id' => $eventRegistration->user_id
            ]);
            
            // Return success response
            DB::commit();
            return [
                'success' => true,
                'message' => 'Event registration verification successful.',
                'data' => [
                    'verification' => $verification,
                    'event_registration' => $eventRegistration,
                    'event' => $event,
                    'participant' => $participant,
                    'user' => $user,
                    'admin' => $admin
                ]
            ];
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error verifying event registration QR code: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'An error occurred during verification: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Regenerate a QR code for an event registration
     * 
     * @param int $userId
     * @param int $eventId
     * @param int|null $subEventId
     * @return array|null
     */
    public function regenerateEventRegistrationQR(int $userId, int $eventId, ?int $subEventId = null): ?array
    {
        try {
            // Find the event registration
            $query = EventRegistration::where('user_id', $userId)
                ->where('event_id', $eventId);
            
            if ($subEventId) {
                $query->where('sub_event_id', $subEventId);
            } else {
                $query->whereNull('sub_event_id');
            }
            
            $eventRegistration = $query->first();

            if (!$eventRegistration) {
                return null;
            }

            // Invalidate any existing active QR codes
            EventRegistrationVerification::where('event_registration_id', $eventRegistration->id)
                ->where('status', 'active')
                ->update(['status' => 'expired']);
            
            // Generate a new QR code
            return $this->generateEventRegistrationQR($userId, $eventId, $subEventId);
        } catch (\Exception $e) {
            Log::error('Error regenerating event registration QR code: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Check if an event registration verification token is valid
     * 
     * @param string $token
     * @return bool
     */
    public function isValidEventRegistrationToken(string $token): bool
    {
        return EventRegistrationVerification::where('verification_token', $token)
            ->where('status', 'active')
            ->exists();
    }

    /**
     * Generate a unique verification token for event registrations
     * 
     * @return string
     */
    protected function generateUniqueRegistrationToken(): string
    {
        $token = Str::random(32);
        
        // Ensure token is unique
        while (EventRegistrationVerification::where('verification_token', $token)->exists()) {
            $token = Str::random(32);
        }
        
        return $token;
    }
}
