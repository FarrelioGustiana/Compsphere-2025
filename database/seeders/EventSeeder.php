<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Event::create([
            'event_code' => 'hacksphere',
            'event_name' => 'Hacksphere',
            'description' => 'A Hackathon Competition where individuals or teams collaborate to create a solution for a given problem or case study.',
            'registration_open_date' => '2025-07-14 00:00:00',
            'registration_close_date' => '2025-07-31 23:59:59',
            'start_date' => '2025-10-2',
            'end_date' => '2025-10-4',
            'location' => 'Fablab, President University.',
            'is_paid_event' => true,
            'is_active' => true,
        ]);

        Event::create([
            'event_code' => 'talksphere',
            'event_name' => 'Talksphere',
            'description' => 'Talkshow and seminar sessions featuring notable speakers, discussing the latest happenings in the technological world',
            'registration_open_date' => '2025-07-14 00:00:00',
            'registration_close_date' => '2025-07-31 23:59:59',
            'start_date' => '2025-10-2',
            'end_date' => '2025-10-2',
            'location' => 'Fablab, President University.',
            'is_paid_event' => false,
            'is_active' => true,
        ]);

        Event::create([
            'event_code' => 'festsphere',
            'event_name' => 'Festsphere',
            'description' => 'A festival celebrating the talents and accomplishments of the faculty of computer science, featuring mesmerizing performance and awarding sessions',
            'registration_open_date' => '2025-07-14 00:00:00',
            'registration_close_date' => '2025-07-31 23:59:59',
            'start_date' => '2025-10-4',
            'end_date' => '2025-10-4',
            'location' => 'Charles Hirmawan Auditorium, President University.',
            'is_paid_event' => false,
            'is_active' => true,
        ]);

        Event::create([
            'event_code' => 'exposphere',
            'event_name' => 'Exposphere',
            'description' => 'Pameran teknologi dan startup showcase untuk memamerkan inovasi terbaru',
            'registration_open_date' => '2025-07-14 00:00:00',
            'registration_close_date' => '2025-07-31 23:59:59',
            'start_date' => '2025-10-1',
            'end_date' => '2025-10-4',
            'location' => 'President University Convention Center (PUCC)',
            'is_paid_event' => false,
            'is_active' => false,
        ]);
    }
}
