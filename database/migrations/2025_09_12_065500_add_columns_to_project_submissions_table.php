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
            $table->foreignId('team_id')->constrained()->onDelete('cascade');
            $table->string('project_title');
            $table->text('project_description');
            $table->string('presentation_url');
            $table->string('youtube_url');
            $table->string('github_url');
            $table->timestamp('submitted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_submissions', function (Blueprint $table) {
            $table->dropForeign(['team_id']);
            $table->dropColumn([
                'team_id',
                'project_title',
                'project_description',
                'presentation_url',
                'youtube_url',
                'github_url',
                'submitted_at'
            ]);
        });
    }
};
