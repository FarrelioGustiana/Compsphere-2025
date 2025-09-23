<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'sub_event_code',
        'sub_event_name',
        'description',
        'start_date',
        'end_date',
        'location',
        'max_participants',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
        'max_participants' => 'integer',
    ];

    /**
     * Get the parent event.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get all registrations for this sub-event.
     */
    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    /**
     * Get the count of participants registered for this sub-event.
     */
    public function getParticipantCountAttribute(): int
    {
        return $this->registrations()->count();
    }

    /**
     * Check if the sub-event has reached its maximum capacity.
     */
    public function isAtCapacity(): bool
    {
        if (!$this->max_participants) {
            return false;
        }

        return $this->participant_count >= $this->max_participants;
    }
}
