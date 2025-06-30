<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration creates the participant_details table that extends 
     * the user model with participant-specific attributes.
     */
    public function up(): void
    {
        Schema::create('participant_details', function (Blueprint $table) {
            $table->foreignId('user_id')->primary()->constrained('users')->onDelete('cascade');
            $table->string('encryption_code')->unique();
            $table->string('nik')->unique();
            $table->enum('category', ['high_school', 'university', 'non_academic']);
            $table->string('phone_number')->nullable();
            $table->string('job_or_institution')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('domicile')->nullable();
            $table->enum('payment_status', ['pending', 'paid', 'failed'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participant_details');
    }
};
