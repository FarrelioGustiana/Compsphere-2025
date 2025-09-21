<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\AdminProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'first_name' => env('SUPER_ADMIN_FIRST_NAME'),
            'last_name' => env('SUPER_ADMIN_LAST_NAME'),
            'email' => env('SUPER_ADMIN_EMAIL'),
            'password' => Hash::make(env('SUPER_ADMIN_PASSWORD')),
            'role' => 'admin',
            'email_verified' => true,
        ]);

        AdminProfile::create([
            'user_id' => $user->id,
            'admin_level' => 'super_admin',
        ]);
    }
}
