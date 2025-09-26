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
        Schema::table('event_registrations', function (Blueprint $table) {
            // Drop the old unique constraint
            $table->dropUnique(['user_id', 'event_id']);
            
            // Add new unique constraint that includes sub_event_id
            // This allows users to register for multiple sub-events within the same event
            $table->unique(['user_id', 'event_id', 'sub_event_id'], 'event_registrations_user_event_subevent_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            // Drop the new unique constraint
            $table->dropUnique('event_registrations_user_event_subevent_unique');
            
            // Restore the old unique constraint
            $table->unique(['user_id', 'event_id']);
        });
    }
};
