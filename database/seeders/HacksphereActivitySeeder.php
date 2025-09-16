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
        
        // New activity data
        $activities = [
            [
                'name' => 'Re-registration',
                'description' => 'Participant re-registration at the event venue',
                'activity_code' => 're-registration',
            ],
            [
                'name' => 'Check Point 1',
                'description' => 'First stage progress check',
                'activity_code' => 'checkpoint-1',
            ],
            [
                'name' => 'Check Point 2',
                'description' => 'Second stage progress check',
                'activity_code' => 'checkpoint-2',
            ],
            [
                'name' => 'Check Point 3',
                'description' => 'Third stage progress check',
                'activity_code' => 'checkpoint-3',
            ],
            [
                'name' => 'Check Point 4',
                'description' => 'Final stage progress check',
                'activity_code' => 'checkpoint-4',
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
    }
}