<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\SubEvent;

class ExposphereSubEventsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find Exposphere event
        $exposphereEvent = Event::where('event_code', 'exposphere')->first();

        if (!$exposphereEvent) {
            $this->command->error('Exposphere event not found. Please run the events seeder first.');
            return;
        }

        $subEvents = [
            [
                'event_id' => $exposphereEvent->id,
                'sub_event_code' => 'exposphere_day1',
                'sub_event_name' => 'Exposphere Day 1',
                'description' => 'First day of Exposphere - Innovation and Technology Showcase. Explore cutting-edge technologies and innovative solutions from industry leaders.',
                'start_time' => '2025-10-01 08:00:00',
                'end_time' => '2025-10-01 17:00:00',
                'location' => 'President University Convention Center',
                'max_participants' => null,
                'is_active' => true,
                'additional_info' => [
                    'registration_opens' => '2025-09-30 00:00:00', // H-1
                    'registration_closes' => '2025-10-01 23:59:59', // End of 
                ]
            ],
            [
                'event_id' => $exposphereEvent->id,
                'sub_event_code' => 'exposphere_day2',
                'sub_event_name' => 'Exposphere Day 2',
                'description' => 'Second day of Exposphere - Digital Transformation and Future Tech. Discover the latest trends in digital transformation and emerging technologies.',
                'start_time' => '2025-10-02 08:00:00',
                'end_time' => '2025-10-02 17:00:00',
                'location' => 'President University Convention Center',
                'max_participants' => null,
                'is_active' => true,
                'additional_info' => [
                    'registration_opens' => '2025-10-01 23:59:59', // After Day 1 ends
                    'registration_closes' => '2025-10-02 23:59:59', // End of event day
                ]
            ],
            [
                'event_id' => $exposphereEvent->id,
                'sub_event_code' => 'exposphere_day3',
                'sub_event_name' => 'Exposphere Day 3',
                'description' => 'Final day of Exposphere - Sustainability and Green Technology. Focus on sustainable technology solutions and environmental innovations.',
                'start_time' => '2025-10-03 08:00:00',
                'end_time' => '2025-10-03 17:00:00',
                'location' => 'President University Convention Center',
                'max_participants' => null,
                'is_active' => true,
                'additional_info' => [
                    'registration_opens' => '2025-10-02 23:59:59', // After Day 2 ends
                    'registration_closes' => '2025-10-03 23:59:59', // End of event day
                ]
            ]
        ];

        foreach ($subEvents as $subEventData) {
            SubEvent::updateOrCreate(
                [
                    'event_id' => $subEventData['event_id'],
                    'sub_event_code' => $subEventData['sub_event_code']
                ],
                $subEventData
            );
        }

        $this->command->info('Exposphere sub-events seeded successfully!');
    }
}
