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
        Schema::table('feedback', function (Blueprint $table) {
            if (!Schema::hasColumn('feedback', 'priority')) {
                $table->enum('priority', ['low', 'medium', 'high'])->default('medium')->after('category');
            }
            
            if (!Schema::hasColumn('feedback', 'status')) {
                $table->enum('status', ['new', 'in_progress', 'resolved', 'closed'])->default('new')->after('priority');
            }
            
            if (!Schema::hasColumn('feedback', 'admin_notes')) {
                $table->text('admin_notes')->nullable()->after('status');
            }
            
            if (!Schema::hasColumn('feedback', 'resolved_at')) {
                $table->timestamp('resolved_at')->nullable()->after('admin_notes');
            }
            
            if (!Schema::hasColumn('feedback', 'resolved_by')) {
                $table->foreignId('resolved_by')->nullable()->constrained('users')->onDelete('set null')->after('resolved_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('feedback', function (Blueprint $table) {
            if (Schema::hasColumn('feedback', 'resolved_by')) {
                $table->dropForeign(['resolved_by']);
                $table->dropColumn('resolved_by');
            }
            
            if (Schema::hasColumn('feedback', 'resolved_at')) {
                $table->dropColumn('resolved_at');
            }
            
            if (Schema::hasColumn('feedback', 'admin_notes')) {
                $table->dropColumn('admin_notes');
            }
            
            if (Schema::hasColumn('feedback', 'status')) {
                $table->dropColumn('status');
            }
            
            if (Schema::hasColumn('feedback', 'priority')) {
                $table->dropColumn('priority');
            }
        });
    }
};
