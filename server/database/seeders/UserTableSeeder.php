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
            'name' => 'Nguyễn Văn A',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('thien879811'),
            'role' => 'admin',
        ]);
        
        DB::table('users')->insert([
            'name' => 'Nguyễn Văn B',
            'email' => 'employee@gmail.com',
            'password' => bcrypt('thien879811'),
            'role' => 'employee',
        ]);
    }
}
