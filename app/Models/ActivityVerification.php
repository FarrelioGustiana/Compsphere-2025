<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityVerification extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'activity_id',
        'team_id',
        'user_id',
        'verification_token',
        'is_verified',
        'verified_at',
        'verified_by',
        'expires_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_verified' => 'boolean',
        'verified_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Add validation to ensure either team_id or user_id is set, but not both
        static::saving(function (ActivityVerification $verification) {
            if ((!$verification->team_id && !$verification->user_id) || 
                ($verification->team_id && $verification->user_id)) {
                throw new \Exception('A verification must belong to either a team or a user, not both or neither.');
            }
        });
    }

    /**
     * Get the activity that owns the verification.
     */
    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    /**
     * Get the team that owns the verification.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the user that owns the verification.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who verified the activity.
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Check if the verification is expired.
     */
    public function isExpired(): bool
    {
        return $this->is_verified || 
               ($this->expires_at !== null && now()->greaterThan($this->expires_at));
    }

    /**
     * Generate verification URL based on type (team or individual).
     */
    public function getVerificationUrl(): string
    {
        if ($this->team_id) {
            $team = $this->team;
            $eventCode = $this->activity->event->event_code;
            return url("/admin/{$eventCode}/{$this->activity->name}/{$team->team_code}");
        } elseif ($this->user_id) {
            $eventCode = $this->activity->event->event_code;
            $encryptionCode = $this->user->participant->encryption_code;
            return url("/admin/{$eventCode}/{$this->activity->name}/{$encryptionCode}");
        }
        
        throw new \Exception('Cannot generate URL: invalid verification entity.');
    }
}
