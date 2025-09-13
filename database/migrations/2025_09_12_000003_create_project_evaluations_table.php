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
            $table->decimal('whole_system_functionality_score', 5, 2)->nullable(); // TKT 6, 30%
            $table->decimal('ui_ux_design_score', 5, 2)->nullable(); // TKT 5-6, 20%
            $table->decimal('backend_logic_score', 5, 2)->nullable(); // TKT 6, 25%
            $table->decimal('ai_model_performance_score', 5, 2)->nullable(); // TKT 5-6, 15%
            $table->decimal('automation_integration_score', 5, 2)->nullable(); // TKT 6, 10%
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
