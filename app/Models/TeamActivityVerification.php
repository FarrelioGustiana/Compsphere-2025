<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamActivityVerification extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'team_id',
        'activity_id',
        'verification_token',
        'status',
        'verified_at',
        'verified_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'verified_at' => 'datetime',
    ];

    /**
     * Get the team that owns this verification.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the activity that this verification belongs to.
     */
    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    /**
     * Get the admin who verified this activity.
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Check if verification token is valid (still active).
     * 
     * @return bool
     */
    public function isValid(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Mark verification as used.
     * 
     * @param int $adminId
     * @return bool
     */
    public function markAsUsed(int $adminId): bool
    {
        $this->status = 'used';
        $this->verified_at = now();
        $this->verified_by = $adminId;
        return $this->save();
    }

    /**
     * Generate QR code URL for this verification.
     * 
     * @return string
     */
    public function getVerificationUrl(): string
    {
        $activity = $this->activity;
        $event = $activity->event;
        $team = $this->team;
        
        return url("/admin/{$event->event_code}/{$activity->activity_code}/{$team->team_code}");
    }
}
