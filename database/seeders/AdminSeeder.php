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
            'first_name' => 'Admin',
            'last_name' => 'Super',
            'email' => 'admin@admin.com',
            'password' => Hash::make('IniSuperAdmin@123'),
            'role' => 'admin',
        ]);

        AdminProfile::create([
            'user_id' => $user->id,
            'admin_level' => 'super_admin',
        ]);
    }
}
