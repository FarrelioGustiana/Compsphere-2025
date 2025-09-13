<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Judge extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'specialization',
        'bio',
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
     * Get the user associated with this judge.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all evaluations created by this judge.
     */
    public function evaluations(): HasMany
    {
        return $this->hasMany(ProjectEvaluation::class);
    }

    /**
     * Get the number of pending evaluations for this judge.
     *
     * @return int
     */
    public function getPendingEvaluationsCountAttribute(): int
    {
        // Get all submissions that don't have a completed evaluation by this judge
        $evaluatedSubmissionIds = $this->evaluations()
            ->where('is_completed', true)
            ->pluck('project_submission_id');
        
        return ProjectSubmission::whereNotIn('id', $evaluatedSubmissionIds)
            ->whereNotNull('submitted_at')
            ->count();
    }

    /**
     * Get the number of completed evaluations by this judge.
     *
     * @return int
     */
    public function getCompletedEvaluationsCountAttribute(): int
    {
        return $this->evaluations()->where('is_completed', true)->count();
    }
}
