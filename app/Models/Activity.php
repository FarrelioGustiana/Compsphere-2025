<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Activity extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'event_id',
        'description',
        'activity_code',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the event that this activity belongs to.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get all verification tokens for this activity.
     */
    public function verifications(): HasMany
    {
        return $this->hasMany(TeamActivityVerification::class);
    }

    /**
     * Check if activity is for Hacksphere event.
     * 
     * @return bool
     */
    public function isHacksphereActivity(): bool
    {
        return $this->event()->where('event_code', 'hacksphere')->exists();
    }
}
