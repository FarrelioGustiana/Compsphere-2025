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
        'start_time',
        'end_time',
        'location',
        'max_participants',
        'is_active',
        'additional_info',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_active' => 'boolean',
        'additional_info' => 'array',
    ];

    /**
     * Get the event that owns this sub-event.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get all registrations for this sub-event.
     */
    public function eventRegistrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    /**
     * Get the current registration count for this sub-event.
     */
    public function getCurrentRegistrationCount(): int
    {
        return $this->eventRegistrations()->where('registration_status', '!=', 'cancelled')->count();
    }

    /**
     * Check if this sub-event has reached maximum capacity.
     */
    public function isAtCapacity(): bool
    {
        if (!$this->max_participants) {
            return false;
        }

        return $this->getCurrentRegistrationCount() >= $this->max_participants;
    }

    /**
     * Get available slots for this sub-event.
     */
    public function getAvailableSlots(): ?int
    {
        if (!$this->max_participants) {
            return null;
        }

        return max(0, $this->max_participants - $this->getCurrentRegistrationCount());
    }

    /**
     * Check if registration is still open for this sub-event.
     */
    public function isRegistrationOpen(): bool
    {
        // For Exposphere events, use sequential registration logic
        if ($this->event->event_code === 'exposphere') {
            return $this->isExposphereRegistrationOpen();
        }

        // For other events (like Talksphere), use original logic
        return $this->is_active &&
            $this->end_time < now() &&
            !$this->isAtCapacity();
    }

    /**
     * Check if registration is open for Exposphere sub-events (sequential logic).
     */
    public function isExposphereRegistrationOpen(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        // Exposphere has no capacity limit, so skip capacity check

        $now = now();
        $registrationInfo = $this->additional_info;

        if (!$registrationInfo || !isset($registrationInfo['registration_opens']) || !isset($registrationInfo['registration_closes'])) {
            return false;
        }

        $registrationOpens = \Carbon\Carbon::parse($registrationInfo['registration_opens']);
        $registrationCloses = \Carbon\Carbon::parse($registrationInfo['registration_closes']);

        // Registration is open if current time is between open and close times
        return $now >= $registrationOpens && $now <= $registrationCloses;
    }

    /**
     * Get the status of this sub-event.
     */
    public function getStatusAttribute(): string
    {
        $now = now();

        if (!$this->is_active) {
            return 'inactive';
        }

        if ($this->isAtCapacity()) {
            return 'full';
        }

        // For Exposphere events, check registration status
        if ($this->event->event_code === 'exposphere') {
            return $this->getExposphereStatus();
        }

        if ($now < $this->start_time) {
            return 'upcoming';
        } elseif ($now >= $this->start_time && $now <= $this->end_time) {
            return 'ongoing';
        } else {
            return 'completed';
        }
    }

    /**
     * Get status for Exposphere sub-events.
     */
    public function getExposphereStatus(): string
    {
        $now = now();
        $registrationInfo = $this->additional_info;

        if (!$registrationInfo || !isset($registrationInfo['registration_opens']) || !isset($registrationInfo['registration_closes'])) {
            return 'inactive';
        }

        $registrationOpens = \Carbon\Carbon::parse($registrationInfo['registration_opens']);
        $registrationCloses = \Carbon\Carbon::parse($registrationInfo['registration_closes']);

        // Exposphere never reaches "full" status since there's no capacity limit
        if ($now < $registrationOpens) {
            return 'registration_not_open';
        } elseif ($now >= $registrationOpens && $now <= $registrationCloses && $now < $this->start_time) {
            return 'registration_open';
        } elseif ($now >= $this->start_time && $now <= $this->end_time) {
            return 'ongoing';
        } elseif ($now > $this->end_time) {
            return 'completed';
        } else {
            return 'registration_closed';
        }
    }
}
