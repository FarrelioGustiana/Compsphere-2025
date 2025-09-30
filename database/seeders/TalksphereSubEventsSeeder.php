<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\SubEvent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TalksphereSubEventsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get Talksphere event
        $talksphereEvent = Event::where('event_code', 'talksphere')->first();
        
        if (!$talksphereEvent) {
            $this->command->error('Talksphere event not found. Please run the events seeder first.');
            return;
        }

        $subEvents = [
            [
                'event_id' => $talksphereEvent->id,
                'sub_event_code' => 'talksphere_seminar',
                'sub_event_name' => 'Seminar',
                'description' => '',
                'start_time' => '2025-10-01 06:30:00',
                'end_time' => '2025-10-01 15:00:00',
                'location' => 'Fablab, President University',
                'max_participants' => 150,
                'is_active' => true,
                'additional_info' => [
                    'speakers' => [
                        [
                            'name' => 'Livander Restu',
                        ]
                    ]
                ]
            ],
            [
                'event_id' => $talksphereEvent->id,
                'sub_event_code' => 'talksphere_workshop',
                'sub_event_name' => 'Workshop',
                'description' => '',
                'start_time' => '2025-10-01 10:00:00',
                'end_time' => '2025-10-01 12:00:00',
                'location' => 'Charles Hirmawan Auditorium, President University',
                'max_participants' => 150,
                'is_active' => true,
                'additional_info' => [
                    'mentors' => [
                        [
                            'name' => 'Ahmad Fadhil N., Ph.D.',
                            'title' => 'Computer Science Lecturer',
                        ],
                        [
                            'name' => 'Williem M. Sc',
                            'title' => 'Computer Science Lecturer',
                        ]
                    ]
                ]
            ],
            [
                'event_id' => $talksphereEvent->id,
                'sub_event_code' => 'talksphere_talkshow',
                'sub_event_name' => 'Talkshow',
                'description' => '',
                'start_time' => '2025-10-02 09:00:00',
                'end_time' => '2025-10-02 11:00:00',
                'location' => 'Fablab, President University',
                'max_participants' => 150,
                'is_active' => true,
                'additional_info' => [
                    'guests' => [
                        [
                            'name' => 'Farras Givari',
                        ]
                    ]
                ]
            ],
            
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

        $this->command->info('Talksphere sub-events seeded successfully!');
    }
}
