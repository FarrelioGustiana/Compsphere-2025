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
        'whole_system_functionality_score',
        'ui_ux_design_score',
        'backend_logic_score',
        'ai_model_performance_score',
        'automation_integration_score',
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
        'whole_system_functionality_score' => 'float',
        'ui_ux_design_score' => 'float',
        'backend_logic_score' => 'float',
        'ai_model_performance_score' => 'float',
        'automation_integration_score' => 'float',
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
        'whole_system_functionality_score' => 0.30, // 30%
        'ui_ux_design_score' => 0.20,               // 20%
        'backend_logic_score' => 0.25,              // 25%
        'ai_model_performance_score' => 0.15,       // 15%
        'automation_integration_score' => 0.10,     // 10%
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
