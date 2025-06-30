<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Team extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'team_name',
        'profile_picture',
        'team_leader_id',
    ];

    /**
     * Get the team leader (participant) that owns the team.
     */
    public function leader(): BelongsTo
    {
        return $this->belongsTo(ParticipantDetail::class, 'team_leader_id', 'user_id');
    }

    /**
     * Get the members (participants) of the team.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(ParticipantDetail::class, 'team_members', 'team_id', 'user_id');
    }
}
