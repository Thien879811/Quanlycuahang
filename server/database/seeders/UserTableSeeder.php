<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('12345678'),
            'role' => 'admin',
        ]);
        
        DB::table('users')->insert([
            'name' => 'Nhân viên 1',
            'email' => 'employee@gmail.com',
            'password' => bcrypt('12345678'),
            'role' => 'employee',
        ]);

        DB::table('users')->insert([
            'name' => 'Nhân viên 2',
            'email' => 'employee2@gmail.com',
            'password' => bcrypt('12345678'),
            'role' => 'employee',
        ]);
    }
}
