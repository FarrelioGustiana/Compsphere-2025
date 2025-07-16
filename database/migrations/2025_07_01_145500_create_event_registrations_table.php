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
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id(); // Primary key auto-incrementing untuk setiap pendaftaran

            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('user_id')->on('participants')->onDelete('cascade');
            $table->unsignedBigInteger('event_id');
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');

            $table->timestamp('registration_date')->useCurrent(); // Default current timestamp
            $table->enum('registration_status', ['pending', 'registered', 'cancelled'])->default('pending');

            // Kolom-kolom pembayaran
            $table->enum('payment_status', ['pending', 'paid', 'failed'])->nullable(); // Nullable karena tidak semua event berbayar
            $table->decimal('payment_amount', 10, 2)->nullable();
            $table->timestamp('payment_date')->nullable();
            $table->string('invoice_id')->unique()->nullable(); // Unique dan Nullable

            $table->timestamps(); // created_at dan updated_at

            // Constraint unik untuk memastikan satu user hanya bisa register satu kali ke satu event
            $table->unique(['user_id', 'event_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_registrations');
    }
};