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
            $table->foreignId('sub_event_id')->nullable()->after('event_id')->constrained()->onDelete('cascade');
            
            // Add index for better performance
            $table->index(['user_id', 'event_id', 'sub_event_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->dropForeign(['sub_event_id']);
            $table->dropColumn('sub_event_id');
        });
    }
};
