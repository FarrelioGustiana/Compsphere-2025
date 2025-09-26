<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\EventRegistration;
use App\Models\EventRegistrationVerification;
use App\Services\QRCodeService;

class RegenerateSubEventQRCodes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'qr:regenerate-sub-events';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Regenerate QR codes for sub-event registrations to include sub_event_id parameter';

    protected $qrCodeService;

    public function __construct(QRCodeService $qrCodeService)
    {
        parent::__construct();
        $this->qrCodeService = $qrCodeService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting QR code regeneration for sub-events...');

        // Get all sub-event registrations that have QR codes
        $subEventRegistrations = EventRegistration::whereNotNull('sub_event_id')
            ->with(['event', 'subEvent', 'user'])
            ->get();

        $this->info("Found {$subEventRegistrations->count()} sub-event registrations");

        $regenerated = 0;
        $errors = 0;

        foreach ($subEventRegistrations as $registration) {
            try {
                // Check if verification record exists
                $verification = EventRegistrationVerification::where('event_registration_id', $registration->id)->first();
                
                if ($verification) {
                    $this->line("Regenerating QR for User {$registration->user_id}, Event {$registration->event->event_name}, Sub-Event {$registration->subEvent->sub_event_name}");
                    
                    // Mark old verification as expired
                    $verification->update(['status' => 'expired']);
                    
                    // Generate new QR code
                    $newQRData = $this->qrCodeService->generateEventRegistrationQR(
                        $registration->user_id,
                        $registration->event_id,
                        $registration->sub_event_id
                    );
                    
                    if ($newQRData) {
                        $regenerated++;
                        $this->info("✓ Regenerated QR for registration ID {$registration->id}");
                    } else {
                        $errors++;
                        $this->error("✗ Failed to regenerate QR for registration ID {$registration->id}");
                    }
                } else {
                    // No existing verification, generate new one
                    $newQRData = $this->qrCodeService->generateEventRegistrationQR(
                        $registration->user_id,
                        $registration->event_id,
                        $registration->sub_event_id
                    );
                    
                    if ($newQRData) {
                        $regenerated++;
                        $this->info("✓ Generated new QR for registration ID {$registration->id}");
                    } else {
                        $errors++;
                        $this->error("✗ Failed to generate QR for registration ID {$registration->id}");
                    }
                }
                
            } catch (\Exception $e) {
                $errors++;
                $this->error("✗ Error processing registration ID {$registration->id}: " . $e->getMessage());
            }
        }

        $this->info("\n=== QR Code Regeneration Complete ===");
        $this->info("Successfully regenerated: {$regenerated}");
        $this->error("Errors: {$errors}");
        
        return Command::SUCCESS;
    }
}
