<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventRegistrationVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_registration_id',
        'verification_token',
        'status',
        'verified_at',
        'verified_by',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    /**
     * Get the event registration that owns this verification.
     */
    public function eventRegistration(): BelongsTo
    {
        return $this->belongsTo(EventRegistration::class);
    }

    /**
     * Get the admin who verified this registration.
     */
    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Get the verification URL for this token.
     */
    public function getVerificationUrl(): string
    {
        $eventRegistration = $this->eventRegistration;
        $event = $eventRegistration->event;
        $participant = $eventRegistration->user;
        $user = $participant->user;
        
        // Format: /admin/verify-registration/{eventCode}/{userId}/{token}
        $baseUrl = "/admin/verify-registration/{$event->event_code}/{$user->id}/{$this->verification_token}";
        
        // Add sub_event_id parameter if this is a sub-event registration
        if ($eventRegistration->sub_event_id) {
            $baseUrl .= "?sub_event_id={$eventRegistration->sub_event_id}";
        }
        
        return url($baseUrl);
    }
}
