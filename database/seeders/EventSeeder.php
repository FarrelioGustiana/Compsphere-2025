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
            'description' => 'Kompetisi hackathon untuk mengembangkan solusi inovatif menggunakan teknologi terdepan',
            'registration_open_date' => '2025-07-14 00:00:00',
            'registration_close_date' => '2025-07-31 23:59:59',
            'start_date' => '2025-10-12',
            'end_date' => '2025-10-14',
            'location' => 'Location 1',
            'is_paid_event' => true,
            'is_active' => true,
        ]);

        Event::create([
            'event_code' => 'talksphere',
            'event_name' => 'Talksphere',
            'description' => 'Sesi presentasi dan diskusi dengan para ahli teknologi dan inovator terkemuka',
            'registration_open_date' => '2025-07-14 00:00:00',
            'registration_close_date' => '2025-07-31 23:59:59',
            'start_date' => '2025-10-12',
            'end_date' => '2025-10-14',
            'location' => 'Location 2',
            'is_paid_event' => false,
            'is_active' => true,
        ]);

        Event::create([
            'event_code' => 'festsphere',
            'event_name' => 'Festsphere',
            'description' => 'Festival teknologi dengan berbagai aktivitas menarik dan showcase produk inovatif',
            'registration_open_date' => '2025-07-14 00:00:00',
            'registration_close_date' => '2025-07-31 23:59:59',
            'start_date' => '2025-10-12',
            'end_date' => '2025-10-14',
            'location' => 'Location 3',
            'is_paid_event' => false,
            'is_active' => true,
        ]);

        Event::create([
            'event_code' => 'exposphere',
            'event_name' => 'Exposphere',
            'description' => 'Pameran teknologi dan startup showcase untuk memamerkan inovasi terbaru',
            'registration_open_date' => '2025-07-14 00:00:00',
            'registration_close_date' => '2025-07-31 23:59:59',
            'start_date' => '2025-10-12',
            'end_date' => '2025-10-14',
            'location' => 'Location 4',
            'is_paid_event' => false,
            'is_active' => true,
        ]);
    }
}
