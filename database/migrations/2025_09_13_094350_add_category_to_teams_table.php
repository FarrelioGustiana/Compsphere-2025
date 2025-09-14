<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\Team;
use App\Models\Participant;

return new class extends Migration
{

    public function up(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->string('category')->nullable()->after('team_code');
            $table->string('institution')->nullable()->after('category');
        });

        // Migrate existing data: Set team category based on team leader's category
        $teams = DB::table('teams')->get();
        
        foreach ($teams as $team) {
            $leader = DB::table('participants')->where('user_id', $team->team_leader_id)->first();
            if ($leader) {
                DB::table('teams')->where('id', $team->id)->update([
                    'category' => $leader->category,
                    'institution' => $leader->job_or_institution
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->dropColumn('category');
            $table->dropColumn('institution');
        });
    }
};
