<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Event;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HacksphereActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();
        
        if (!$hacksphereEvent) {
            $this->command->error('Hacksphere event not found. Please run EventSeeder first.');
            return;
        }
        
        // Clear existing Hacksphere activities to avoid duplicates
        Activity::where('event_id', $hacksphereEvent->id)->delete();
        $this->command->info('Cleared existing Hacksphere activities.');
        
        // Hacksphere activities based on the new schedule
        $activities = [
            // Thursday, October 2, 2025
            [
                'name' => 'Re-registration + Snack',
                'description' => 'Re-registration and welcome snack - Thursday, October 2, 2025',
                'activity_code' => 'day1-registration-snack',
            ],
            [
                'name' => 'Checkpoint - 19:00',
                'description' => 'Evening checkpoint - Thursday, October 2, 2025 at 7 PM',
                'activity_code' => 'day1-checkpoint-1900',
            ],
            [
                'name' => 'Snack - 16:00',
                'description' => 'Afternoon snack - Thursday, October 2, 2025 at 4 PM',
                'activity_code' => 'day1-snack-1600',
            ],
            [
                'name' => 'Snack - 22:00',
                'description' => 'Late night snack - Thursday, October 2, 2025 at 10 PM',
                'activity_code' => 'day1-snack-2200',
            ],
            
            // Friday, October 3, 2025
            [
                'name' => 'Light Snack - 19:00',
                'description' => 'Light snack - Friday, October 3, 2025 at 7 PM',
                'activity_code' => 'day2-light-snack-1900',
            ],
            [
                'name' => 'Checkpoint - 19:00',
                'description' => 'Evening checkpoint - Friday, October 3, 2025 at 7 PM',
                'activity_code' => 'day2-checkpoint-1900',
            ],
            [
                'name' => 'Dinner - 22:00',
                'description' => 'Dinner - Friday, October 3, 2025 at 10 PM',
                'activity_code' => 'day2-heavy-meal-2200',
            ],
            [
                'name' => 'Dinner + Checkpoint + Relocation - 17:00',
                'description' => 'Dinner with checkpoint and relocation - Friday, October 3, 2025 at 5 PM',
                'activity_code' => 'day2-meal-checkpoint-move-1700',
            ],
            
            // Saturday, October 4, 2025
            [
                'name' => 'Snack - 07:00',
                'description' => 'Morning snack - Saturday, October 4, 2025 at 7 AM',
                'activity_code' => 'day3-snack-0700',
            ],
            [
                'name' => 'Lunch - 12:00',
                'description' => 'Lunch - Saturday, October 4, 2025 at 12 PM',
                'activity_code' => 'day3-lunch-1200',
            ],
        ];

        // Loop to create activities
        foreach ($activities as $activity) {
            Activity::create([
                'name' => $activity['name'],
                'event_id' => $hacksphereEvent->id,
                'description' => $activity['description'],
                'activity_code' => $activity['activity_code'],
                'is_active' => true,
            ]);
        }
        
        $this->command->info('Successfully created ' . count($activities) . ' Hacksphere activities.');
    }
}