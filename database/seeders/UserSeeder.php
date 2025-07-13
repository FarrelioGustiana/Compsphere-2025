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
            'first_name' => 'Farrelio',
            'last_name' => 'Gustiana',
            'email' => 'farrelio@gmail.com',
            'password' => Hash::make('Farrelio@123'),
            'role' => 'participant',
        ]);

        User::create([
            'first_name' => 'James',
            'last_name' => 'Bond',
            'email' => 'james@gmail.com',
            'password' => Hash::make('James@123'),
            'role' => 'participant',
        ]);

        User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@gmail.com',
            'password' => Hash::make('John@123'),
            'role' => 'participant',
        ]);
    }
}
