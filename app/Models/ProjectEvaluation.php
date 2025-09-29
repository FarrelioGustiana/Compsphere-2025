<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectEvaluation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'project_submission_id',
        'judge_id',
        'problem_solving_relevance_score',
        'functional_mvp_prototype_score',
        'technical_execution_score',
        'creativity_innovation_score',
        'impact_scalability_score',
        'presentation_clarity_score',
        'final_score',
        'comments',
        'is_completed',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'problem_solving_relevance_score' => 'float',
        'functional_mvp_prototype_score' => 'float',
        'technical_execution_score' => 'float',
        'creativity_innovation_score' => 'float',
        'impact_scalability_score' => 'float',
        'presentation_clarity_score' => 'float',
        'final_score' => 'float',
        'is_completed' => 'boolean',
    ];

    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'is_completed' => false,
    ];

    /**
     * The weight for each scoring criterion.
     */
    const WEIGHTS = [
        'problem_solving_relevance_score' => 0.25, // 25%
        'functional_mvp_prototype_score' => 0.25,  // 25%
        'technical_execution_score' => 0.20,       // 20%
        'creativity_innovation_score' => 0.10,     // 10%
        'impact_scalability_score' => 0.10,        // 10%
        'presentation_clarity_score' => 0.10,      // 10%
    ];

    /**
     * Get the project submission that owns this evaluation.
     */
    public function projectSubmission(): BelongsTo
    {
        return $this->belongsTo(ProjectSubmission::class);
    }

    /**
     * Get the judge that created this evaluation.
     */
    public function judge(): BelongsTo
    {
        return $this->belongsTo(Judge::class);
    }

    /**
     * Calculate the weighted final score based on individual criterion scores.
     *
     * @return float|null
     */
    public function calculateFinalScore(): ?float
    {
        // Check if any required score is missing
        foreach (self::WEIGHTS as $criterion => $weight) {
            if ($this->$criterion === null) {
                return null;
            }
        }

        // Calculate weighted sum
        $finalScore = 0;
        foreach (self::WEIGHTS as $criterion => $weight) {
            $finalScore += $this->$criterion * $weight;
        }

        return round($finalScore, 2);
    }

    /**
     * Update the final score based on individual criterion scores.
     *
     * @return void
     */
    public function updateFinalScore(): void
    {
        $this->final_score = $this->calculateFinalScore();
        $this->save();
    }

    /**
     * Check if all required scores have been provided.
     *
     * @return bool
     */
    public function areAllScoresProvided(): bool
    {
        foreach (self::WEIGHTS as $criterion => $weight) {
            if ($this->$criterion === null) {
                return false;
            }
        }
        
        return true;
    }
}
