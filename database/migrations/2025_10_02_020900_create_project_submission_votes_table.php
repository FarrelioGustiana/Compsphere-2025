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
        Schema::create('project_submission_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_submission_id')->constrained()->onDelete('cascade');
            $table->timestamp('voted_at');
            $table->timestamps();
            
            // Ensure one vote per user per submission
            $table->unique(['user_id', 'project_submission_id']);
            
            // Add index for faster queries
            $table->index(['project_submission_id', 'voted_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_submission_votes');
    }
};
