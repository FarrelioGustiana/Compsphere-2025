<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\SubEvent;
use Illuminate\Database\Seeder;

class TalksphereSubEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find the Talksphere event
        $talksphereEvent = Event::where('event_code', 'talksphere')->first();
        
        if (!$talksphereEvent) {
            $this->command->error('Talksphere event not found. Please run EventSeeder first.');
            return;
        }
        
        // Create Seminar sub-event
        SubEvent::create([
            'event_id' => $talksphereEvent->id,
            'sub_event_code' => 'talksphere-seminar',
            'sub_event_name' => 'Talksphere Seminar',
            'description' => 'Join our educational seminar featuring industry experts discussing the latest technological advancements and their impact on various sectors.',
            'start_date' => '2025-10-01 09:00:00',
            'end_date' => '2025-10-01 12:00:00',
            'location' => 'Main Auditorium, President University',
            'max_participants' => 200,
            'is_active' => true,
        ]);
        
        // Create Talkshow sub-event
        SubEvent::create([
            'event_id' => $talksphereEvent->id,
            'sub_event_code' => 'talksphere-talkshow',
            'sub_event_name' => 'Talksphere Talkshow',
            'description' => 'An interactive talkshow with tech leaders and innovators sharing their experiences and insights on emerging technologies and future trends.',
            'start_date' => '2025-10-01 14:00:00',
            'end_date' => '2025-10-01 17:00:00',
            'location' => 'Charles Himawan Auditorium, President University',
            'max_participants' => 150,
            'is_active' => true,
        ]);
        
        $this->command->info('Talksphere sub-events seeded successfully.');
    }
}
