<?php

namespace Database\Seeders;

use App\Models\AdminProfile;
use App\Models\JudgeProfile;
use App\Models\Participant;
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

        $this->call([
            EventSeeder::class,
        ]);
    }
}
