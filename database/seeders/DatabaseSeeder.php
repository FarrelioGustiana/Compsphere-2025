<?php

namespace Database\Seeders;

use App\Models\AdminProfile;
use App\Models\JudgeProfile;
use App\Models\ParticipantDetail;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@compsphere.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified' => true,
        ]);
        
        AdminProfile::create([
            'user_id' => $admin->id,
            'admin_level' => 'super_admin',
        ]);
        
        // Create judge user
        $judge = User::create([
            'first_name' => 'Judge',
            'last_name' => 'Expert',
            'email' => 'judge@compsphere.com',
            'password' => Hash::make('password'),
            'role' => 'judge',
            'email_verified' => true,
        ]);
        
        JudgeProfile::create([
            'user_id' => $judge->id,
            'full_name' => 'Judge Expert',
        ]);
        
        // Create participant users
        $participant1 = User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'participant1@example.com',
            'password' => Hash::make('password'),
            'role' => 'participant',
            'email_verified' => true,
        ]);
        
        ParticipantDetail::create([
            'user_id' => $participant1->id,
            'encryption_code' => 'ENC001',
            'nik' => '1234567890123456',
            'category' => 'university',
            'phone_number' => '081234567890',
            'job_or_institution' => 'University of Indonesia',
            'date_of_birth' => '2000-01-01',
            'domicile' => 'Jakarta',
            'payment_status' => 'paid',
        ]);
        
        $participant2 = User::create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'participant2@example.com',
            'password' => Hash::make('password'),
            'role' => 'participant',
            'email_verified' => true,
        ]);
        
        ParticipantDetail::create([
            'user_id' => $participant2->id,
            'encryption_code' => 'ENC002',
            'nik' => '6543210987654321',
            'category' => 'university',
            'phone_number' => '089876543210',
            'job_or_institution' => 'Bandung Institute of Technology',
            'date_of_birth' => '2001-02-02',
            'domicile' => 'Bandung',
            'payment_status' => 'paid',
        ]);
        
        $participant3 = User::create([
            'first_name' => 'Alex',
            'last_name' => 'Johnson',
            'email' => 'participant3@example.com',
            'password' => Hash::make('password'),
            'role' => 'participant',
            'email_verified' => false,
        ]);
        
        ParticipantDetail::create([
            'user_id' => $participant3->id,
            'encryption_code' => 'ENC003',
            'nik' => '9876543210123456',
            'category' => 'high_school',
            'phone_number' => '087654321098',
            'job_or_institution' => 'SMA Negeri 1 Jakarta',
            'date_of_birth' => '2005-03-03',
            'domicile' => 'Jakarta',
            'payment_status' => 'pending',
        ]);
        
        // Create a team
        $team = Team::create([
            'team_name' => 'Awesome Team',
            'profile_picture' => null,
            'team_leader_id' => $participant1->id,
        ]);
        
        // Add members to the team
        $team->members()->attach([$participant1->id, $participant2->id]);
    }
}
