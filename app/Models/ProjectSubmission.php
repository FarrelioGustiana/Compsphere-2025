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
        'is_winner_problem_solving',
        'is_winner_technical_execution',
        'is_winner_presentation',
        'is_overall_winner',
        'winner_assigned_by',
        'winner_assigned_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'submitted_at' => 'datetime',
        'is_winner_problem_solving' => 'boolean',
        'is_winner_technical_execution' => 'boolean',
        'is_winner_presentation' => 'boolean',
        'is_overall_winner' => 'boolean',
        'winner_assigned_at' => 'datetime',
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
     * Get all votes for this submission.
     */
    public function votes(): HasMany
    {
        return $this->hasMany(ProjectSubmissionVote::class);
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

    /**
     * Get the total vote count for this submission.
     *
     * @return int
     */
    public function getVoteCountAttribute(): int
    {
        return $this->votes()->count();
    }

    /**
     * Check if a specific user has voted for this submission.
     *
     * @param int $userId
     * @return bool
     */
    public function hasUserVoted(int $userId): bool
    {
        return $this->votes()->where('user_id', $userId)->exists();
    }

    /**
     * Get the admin who assigned winner status.
     */
    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'winner_assigned_by');
    }

    /**
     * Check if this submission has any winner status.
     *
     * @return bool
     */
    public function isWinner(): bool
    {
        return $this->is_winner_problem_solving 
            || $this->is_winner_technical_execution 
            || $this->is_winner_presentation 
            || $this->is_overall_winner;
    }

    /**
     * Get all winner categories for this submission.
     *
     * @return array
     */
    public function getWinnerCategories(): array
    {
        $categories = [];
        
        if ($this->is_winner_problem_solving) {
            $categories[] = 'Problem-Solving & Creativity';
        }
        if ($this->is_winner_technical_execution) {
            $categories[] = 'Technical Execution';
        }
        if ($this->is_winner_presentation) {
            $categories[] = 'Presentation & Clarity';
        }
        if ($this->is_overall_winner) {
            $categories[] = 'Overall Winner';
        }
        
        return $categories;
    }
}
