<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, add the new columns if they don't exist
        if (!Schema::hasColumn('project_evaluations', 'problem_solving_relevance_score')) {
            Schema::table('project_evaluations', function (Blueprint $table) {
                $table->decimal('problem_solving_relevance_score', 5, 2)->nullable();
                $table->decimal('functional_mvp_prototype_score', 5, 2)->nullable();
                $table->decimal('technical_execution_score', 5, 2)->nullable();
                $table->decimal('creativity_innovation_score', 5, 2)->nullable();
                $table->decimal('impact_scalability_score', 5, 2)->nullable();
                $table->decimal('presentation_clarity_score', 5, 2)->nullable();
            });
        }

        // Then migrate data from old columns to new ones
        $evaluations = DB::table('project_evaluations')->get();
        
        foreach ($evaluations as $evaluation) {
            // Map old scores to new criteria based on their relative importance
            // This is an approximation - actual mapping should be discussed with stakeholders
            DB::table('project_evaluations')
                ->where('id', $evaluation->id)
                ->update([
                    // Map whole_system_functionality (30%) to problem_solving_relevance (25%)
                    'problem_solving_relevance_score' => $evaluation->whole_system_functionality_score,
                    
                    // Map backend_logic (25%) to functional_mvp_prototype (25%)
                    'functional_mvp_prototype_score' => $evaluation->backend_logic_score,
                    
                    // Map ui_ux_design (20%) to technical_execution (20%)
                    'technical_execution_score' => $evaluation->ui_ux_design_score,
                    
                    // Map ai_model_performance (15%) to creativity_innovation (10%) and impact_scalability (10%)
                    'creativity_innovation_score' => $evaluation->ai_model_performance_score,
                    'impact_scalability_score' => $evaluation->ai_model_performance_score,
                    
                    // Map automation_integration (10%) to presentation_clarity (10%)
                    'presentation_clarity_score' => $evaluation->automation_integration_score,
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Migrate data back from new columns to old ones
        $evaluations = DB::table('project_evaluations')->get();
        
        foreach ($evaluations as $evaluation) {
            DB::table('project_evaluations')
                ->where('id', $evaluation->id)
                ->update([
                    'whole_system_functionality_score' => $evaluation->problem_solving_relevance_score,
                    'backend_logic_score' => $evaluation->functional_mvp_prototype_score,
                    'ui_ux_design_score' => $evaluation->technical_execution_score,
                    'ai_model_performance_score' => $evaluation->creativity_innovation_score,
                    'automation_integration_score' => $evaluation->presentation_clarity_score,
                ]);
        }

        // Then remove the new columns
        Schema::table('project_evaluations', function (Blueprint $table) {
            $table->dropColumn([
                'problem_solving_relevance_score',
                'functional_mvp_prototype_score',
                'technical_execution_score',
                'creativity_innovation_score',
                'impact_scalability_score',
                'presentation_clarity_score',
            ]);
        });
    }
};
