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
        Schema::create('event_registration_verifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('event_registration_id');
            $table->string('verification_token', 64)->unique();
            $table->enum('status', ['active', 'used', 'expired'])->default('active');
            $table->timestamp('verified_at')->nullable();
            $table->unsignedBigInteger('verified_by')->nullable();
            $table->timestamps();

            $table->foreign('event_registration_id')->references('id')->on('event_registrations')->onDelete('cascade');
            $table->foreign('verified_by')->references('id')->on('users')->onDelete('set null');
            
            $table->index(['verification_token', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_registration_verifications');
    }
};
