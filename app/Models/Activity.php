<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
    
    /**
     * Get all teams that are associated with this activity through verifications.
     */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_activity_verifications')
                    ->withPivot(['verification_token', 'status', 'verified_at', 'verified_by'])
                    ->withTimestamps();
    }
}
