<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectSubmission extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'team_id',
        'project_title',
        'project_description',
        'presentation_url',
        'youtube_url',
        'github_url',
        'submitted_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    /**
     * Get the team that owns this submission.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get all evaluations for this submission.
     */
    public function evaluations(): HasMany
    {
        return $this->hasMany(ProjectEvaluation::class);
    }

    /**
     * Get the submission status.
     *
     * @return string
     */
    public function getStatusAttribute(): string
    {
        if (!$this->submitted_at) {
            return 'draft';
        }
        
        $evaluationsCount = $this->evaluations()->where('is_completed', true)->count();
        
        if ($evaluationsCount === 0) {
            return 'submitted';
        } else {
            return 'evaluated';
        }
    }

    /**
     * Get the average final score from all completed evaluations.
     *
     * @return float|null
     */
    public function getAverageFinalScoreAttribute(): ?float
    {
        $completedEvaluations = $this->evaluations()->where('is_completed', true)->get();
        
        if ($completedEvaluations->isEmpty()) {
            return null;
        }
        
        return $completedEvaluations->avg('final_score');
    }
}
