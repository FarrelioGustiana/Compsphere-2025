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
        Schema::create('activity_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained('activities')->onDelete('cascade');
            
            // Nullable because it could be team or individual verification
            $table->foreignId('team_id')->nullable()->constrained('teams')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            
            // Verification data
            $table->string('verification_token')->unique(); // For URL in QR Code
            $table->boolean('is_verified')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('expires_at')->nullable(); // Optional expiry time for the QR code
            
            $table->timestamps();
            
            // Ensure a verification is either for a team OR an individual, not both
            $table->index(['team_id', 'activity_id']);
            $table->index(['user_id', 'activity_id']);
            
            // Add a check constraint to ensure either team_id or user_id is set, not both
            // This is implemented at the application level since some DB systems don't support check constraints
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_verifications');
    }
};
