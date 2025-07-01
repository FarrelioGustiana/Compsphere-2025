<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration creates the participants table that extends 
     * the user model with participant-specific attributes.
     */
    public function up(): void
    {
        Schema::create('participants', function (Blueprint $table) {
            $table->foreignId('user_id')->primary()->constrained('users')->onDelete('cascade');
            $table->string('encryption_code')->unique();
            $table->string('nik')->unique()->nullable();
            $table->enum('category', ['high_school', 'university', 'non_academic']);
            $table->string('phone_number')->nullable();
            $table->string('job_or_institution')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('domicile')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};
