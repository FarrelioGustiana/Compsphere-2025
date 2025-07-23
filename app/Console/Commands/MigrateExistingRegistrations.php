<?php

namespace App\Console\Commands;

use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateExistingRegistrations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:existing-registrations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate existing event registrations from pivot table to EventRegistration model';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting migration of existing registrations...');

        // Get all existing registrations from pivot table
        $pivotRegistrations = DB::table('event_registrations')
            ->select('user_id', 'event_id', 'registration_date', 'registration_status', 'payment_status', 'payment_amount', 'payment_date', 'invoice_id', 'created_at', 'updated_at')
            ->get();

        $migratedCount = 0;
        $skippedCount = 0;

        foreach ($pivotRegistrations as $pivotReg) {
            // Check if EventRegistration record already exists
            $existingRecord = EventRegistration::where('user_id', $pivotReg->user_id)
                ->where('event_id', $pivotReg->event_id)
                ->first();

            if ($existingRecord) {
                $skippedCount++;
                continue;
            }

            // Create EventRegistration record
            try {
                EventRegistration::create([
                    'user_id' => $pivotReg->user_id,
                    'event_id' => $pivotReg->event_id,
                    'registration_date' => $pivotReg->registration_date ?? $pivotReg->created_at,
                    'registration_status' => $pivotReg->registration_status ?? 'pending',
                    'payment_status' => $pivotReg->payment_status,
                    'payment_amount' => $pivotReg->payment_amount,
                    'payment_date' => $pivotReg->payment_date,
                    'invoice_id' => $pivotReg->invoice_id,
                    'created_at' => $pivotReg->created_at,
                    'updated_at' => $pivotReg->updated_at,
                ]);

                $migratedCount++;
            } catch (\Exception $e) {
                $this->error("Failed to migrate registration for user_id: {$pivotReg->user_id}, event_id: {$pivotReg->event_id}");
                $this->error("Error: " . $e->getMessage());
            }
        }

        $this->info("Migration completed!");
        $this->info("Migrated: {$migratedCount} registrations");
        $this->info("Skipped: {$skippedCount} registrations (already exist)");

        return 0;
    }
}
