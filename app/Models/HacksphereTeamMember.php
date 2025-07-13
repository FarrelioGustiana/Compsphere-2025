<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HacksphereTeamMember extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'team_id',
        'user_id',
        'role', // 'leader', 'member-1', 'member-2'
    ];

    /**
     * Get the user associated with the team member.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the team associated with the team member.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(HacksphereTeam::class);
    }
}
