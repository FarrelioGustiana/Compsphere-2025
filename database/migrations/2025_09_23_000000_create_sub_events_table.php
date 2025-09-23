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
        Schema::create('sub_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->string('sub_event_code')->unique();
            $table->string('sub_event_name');
            $table->text('description')->nullable();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->string('location')->nullable();
            $table->integer('max_participants')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Add sub_event_id to event_registrations table
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->foreignId('sub_event_id')->nullable()->after('event_id')->constrained('sub_events')->nullOnDelete();
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
        
        Schema::dropIfExists('sub_events');
    }
};
