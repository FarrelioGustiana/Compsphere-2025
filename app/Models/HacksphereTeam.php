<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HacksphereTeam extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'team_name',
        'team_code',
        'team_leader_id',
    ];

    /**
     * Get the team leader.
     */
    public function leader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'team_leader_id');
    }

    /**
     * Get the team members.
     */
    public function members(): HasMany
    {
        return $this->hasMany(HacksphereTeamMember::class, 'team_id');
    }

    /**
     * Get the activity verifications for the team.
     */
    public function activityVerifications(): HasMany
    {
        return $this->hasMany(ActivityVerification::class, 'team_id');
    }
}
