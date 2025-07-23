<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'first_name' => 'Sartorial',
            'last_name' => 'Shooter',
            'email' => 'sartorial@gmail.com',
            'password' => Hash::make('Sartorial@123'),
            'role' => 'participant',
        ]);

        User::create([
            'first_name' => 'Wick',
            'last_name' => 'John',
            'email' => 'Wick@gmail.com',
            'password' => Hash::make('Wick@123'),
            'role' => 'participant',
        ]);

        User::create([
            'first_name' => 'Michael',
            'last_name' => 'Corleone',
            'email' => 'michael@gmail.com',
            'password' => Hash::make('Michael@123'),
            'role' => 'participant',
        ]);
    }
}
