<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Event extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'event_code',
        'event_name',
        'description',
        'registration_open_date',
        'registration_close_date',
        'start_date',
        'end_date',
        'location',
        'is_paid_event',
        'is_active'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'registration_open_date' => 'datetime',
        'registration_close_date' => 'datetime',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_paid_event' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Using default auto-incrementing ID

    /**
     * Get the status of the event based on current date and registration dates.
     *
     * @return string
     */
    
    public function getStatusAttribute()
    {
        $now = now();
        
        if ($now < $this->registration_open_date) {
            return 'upcoming';
        } elseif ($now >= $this->registration_open_date && $now <= $this->registration_close_date) {
            return 'registration_open';
        } elseif ($now > $this->registration_close_date && $now < $this->start_date) {
            return 'registration_closed';
        } elseif ($now >= $this->start_date && $now <= $this->end_date) {
            return 'ongoing';
        } else {
            return 'completed';
        }
    }
    
    /**
     * Get all users registered for this event through the pivot table.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'event_registrations')
                    ->withPivot(['registration_date', 'registration_status', 'payment_status', 'payment_amount', 'payment_date', 'invoice_id'])
                    ->withTimestamps();
    }
    
    /**
     * Get all event registrations for this event.
     */
    public function eventRegistrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }
    
    /**
     * Get all activities for this event.
     */
    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }
    
    /**
     * Get all sub-events for this event.
     */
    public function subEvents(): HasMany
    {
        return $this->hasMany(SubEvent::class);
    }
    
    /**
     * Get active sub-events for this event.
     */
    public function activeSubEvents(): HasMany
    {
        return $this->hasMany(SubEvent::class)->where('is_active', true);
    }
    
    /**
     * Check if this event is Hacksphere.
     * 
     * @return bool
     */
    public function isHacksphere(): bool
    {
        return $this->event_code === 'hacksphere';
    }
    
    /**
     * Check if this event is Talksphere.
     * 
     * @return bool
     */
    public function isTalksphere(): bool
    {
        return $this->event_code === 'talksphere';
    }
    
    /**
     * Check if this event has sub-events.
     * 
     * @return bool
     */
    public function hasSubEvents(): bool
    {
        return $this->subEvents()->exists();
    }
}