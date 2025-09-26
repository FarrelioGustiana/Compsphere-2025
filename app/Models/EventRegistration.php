<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EventRegistration extends Model
{
    use HasFactory;

    protected $table = 'event_registrations';

    protected $fillable = [
        'user_id',
        'event_id',
        'sub_event_id',
        'registration_date',
        'registration_status',
        'payment_status',
        'payment_amount',
        'payment_date',
        'invoice_id',
        'twibbon_link',
    ];

    protected $casts = [
        'registration_date' => 'datetime',
        'payment_date' => 'datetime',
        'payment_amount' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(Participant::class, 'user_id', 'user_id');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get the sub-event for this registration.
     */
    public function subEvent(): BelongsTo
    {
        return $this->belongsTo(SubEvent::class);
    }

    /**
     * Get all verifications for this event registration.
     */
    public function verifications(): HasMany
    {
        return $this->hasMany(EventRegistrationVerification::class);
    }

    /**
     * Get the active verification for this event registration.
     */
    public function activeVerification()
    {
        return $this->verifications()->where('status', 'active')->first();
    }
}