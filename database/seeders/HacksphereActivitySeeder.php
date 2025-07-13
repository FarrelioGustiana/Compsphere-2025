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
        
        // Create activities for Hacksphere
        Activity::create([
            'name' => 'Opening Ceremony',
            'event_id' => $hacksphereEvent->id,
            'description' => 'Pembukaan acara Hacksphere dan pengenalan tema hackathon',
            'activity_code' => 'opening-ceremony',
            'is_active' => true,
        ]);
        
        Activity::create([
            'name' => 'Team Registration',
            'event_id' => $hacksphereEvent->id,
            'description' => 'Registrasi dan check-in tim peserta',
            'activity_code' => 'team-registration',
            'is_active' => true,
        ]);
        
        Activity::create([
            'name' => 'Workshop Session',
            'event_id' => $hacksphereEvent->id,
            'description' => 'Workshop teknis untuk mempersiapkan peserta',
            'activity_code' => 'workshop',
            'is_active' => true,
        ]);
        
        Activity::create([
            'name' => 'Hacking Session Day 1',
            'event_id' => $hacksphereEvent->id,
            'description' => 'Sesi pengembangan solusi hari pertama',
            'activity_code' => 'hacking-day1',
            'is_active' => true,
        ]);
        
        Activity::create([
            'name' => 'Mentoring Session',
            'event_id' => $hacksphereEvent->id,
            'description' => 'Sesi mentoring dengan para ahli industri',
            'activity_code' => 'mentoring',
            'is_active' => true,
        ]);
        
        Activity::create([
            'name' => 'Hacking Session Day 2',
            'event_id' => $hacksphereEvent->id,
            'description' => 'Sesi pengembangan solusi hari kedua',
            'activity_code' => 'hacking-day2',
            'is_active' => true,
        ]);
        
        Activity::create([
            'name' => 'Final Presentation',
            'event_id' => $hacksphereEvent->id,
            'description' => 'Presentasi final solusi yang dikembangkan',
            'activity_code' => 'final-presentation',
            'is_active' => true,
        ]);
        
        Activity::create([
            'name' => 'Closing Ceremony',
            'event_id' => $hacksphereEvent->id,
            'description' => 'Pengumuman pemenang dan penutupan acara',
            'activity_code' => 'closing-ceremony',
            'is_active' => true,
        ]);
    }
}
