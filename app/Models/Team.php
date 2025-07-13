<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'team_name',
        'profile_picture',
        'team_leader_id',
        'team_code',
    ];

    /**
     * Get the team leader (participant) that owns the team.
     */
    public function leader(): BelongsTo
    {
        return $this->belongsTo(Participant::class, 'team_leader_id', 'user_id');
    }

    /**
     * Get the members (participants) of the team.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(Participant::class, 'team_members', 'team_id', 'user_id');
    }
    
    /**
     * Get all activity verifications for this team.
     */
    public function activityVerifications(): HasMany
    {
        return $this->hasMany(TeamActivityVerification::class);
    }
    
    /**
     * Get all activities this team is registered for through verifications.
     */
    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(Activity::class, 'team_activity_verifications')
                    ->withPivot(['verification_token', 'status', 'verified_at', 'verified_by'])
                    ->withTimestamps();
    }
    
    /**
     * Generate verification tokens for all activities of a specific event.
     * 
     * @param int $eventId
     * @return array
     */
    public function generateActivityVerifications(int $eventId): array
    {
        // Get all activities for the event
        $activities = Activity::where('event_id', $eventId)->get();
        $createdVerifications = [];
        
        foreach ($activities as $activity) {
            // Generate a unique verification token
            $verificationToken = $this->generateUniqueVerificationToken();
            
            // Create verification record
            $verification = TeamActivityVerification::create([
                'team_id' => $this->id,
                'activity_id' => $activity->id,
                'verification_token' => $verificationToken,
                'status' => 'active',
            ]);
            
            $createdVerifications[] = $verification;
        }
        
        return $createdVerifications;
    }
    
    /**
     * Generate a unique verification token.
     * 
     * @return string
     */
    private function generateUniqueVerificationToken(): string
    {
        // Generate a random token
        do {
            $token = bin2hex(random_bytes(16)); // 32 character hex string
        } while (TeamActivityVerification::where('verification_token', $token)->exists());
        
        return $token;
    }
}
