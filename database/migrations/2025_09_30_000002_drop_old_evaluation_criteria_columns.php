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
        // Drop the old columns after data has been migrated
        Schema::table('project_evaluations', function (Blueprint $table) {
            $table->dropColumn([
                'whole_system_functionality_score',
                'ui_ux_design_score',
                'backend_logic_score',
                'ai_model_performance_score',
                'automation_integration_score',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add back the old columns if needed
        Schema::table('project_evaluations', function (Blueprint $table) {
            $table->decimal('whole_system_functionality_score', 5, 2)->nullable();
            $table->decimal('ui_ux_design_score', 5, 2)->nullable();
            $table->decimal('backend_logic_score', 5, 2)->nullable();
            $table->decimal('ai_model_performance_score', 5, 2)->nullable();
            $table->decimal('automation_integration_score', 5, 2)->nullable();
        });
    }
};
