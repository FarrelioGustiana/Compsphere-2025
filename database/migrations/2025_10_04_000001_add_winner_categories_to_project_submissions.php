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
        Schema::table('project_submissions', function (Blueprint $table) {
            // Winner categories based on judging criteria
            $table->boolean('is_winner_problem_solving')->default(false)->after('submitted_at');
            $table->boolean('is_winner_technical_execution')->default(false)->after('is_winner_problem_solving');
            $table->boolean('is_winner_presentation')->default(false)->after('is_winner_technical_execution');
            $table->boolean('is_overall_winner')->default(false)->after('is_winner_presentation');
            
            // Track who assigned the winner status
            $table->unsignedBigInteger('winner_assigned_by')->nullable()->after('is_overall_winner');
            $table->timestamp('winner_assigned_at')->nullable()->after('winner_assigned_by');
            
            // Foreign key for admin who assigned
            $table->foreign('winner_assigned_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_submissions', function (Blueprint $table) {
            $table->dropForeign(['winner_assigned_by']);
            $table->dropColumn([
                'is_winner_problem_solving',
                'is_winner_technical_execution',
                'is_winner_presentation',
                'is_overall_winner',
                'winner_assigned_by',
                'winner_assigned_at'
            ]);
        });
    }
};
