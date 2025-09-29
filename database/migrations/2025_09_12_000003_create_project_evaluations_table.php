<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('project_evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_submission_id')->constrained('project_submissions')->onDelete('cascade');
            $table->foreignId('judge_id')->constrained('judges')->onDelete('cascade');
            $table->decimal('problem_solving_relevance_score', 5, 2)->nullable(); // 25%
            $table->decimal('functional_mvp_prototype_score', 5, 2)->nullable(); // 25%
            $table->decimal('technical_execution_score', 5, 2)->nullable(); // 20%
            $table->decimal('creativity_innovation_score', 5, 2)->nullable(); // 10%
            $table->decimal('impact_scalability_score', 5, 2)->nullable(); // 10%
            $table->decimal('presentation_clarity_score', 5, 2)->nullable(); // 10%
            $table->decimal('final_score', 5, 2)->nullable(); // Calculated weighted score
            $table->text('comments')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->timestamps();
            
            // Ensure each judge can only evaluate a submission once
            $table->unique(['project_submission_id', 'judge_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_evaluations');
    }
};
