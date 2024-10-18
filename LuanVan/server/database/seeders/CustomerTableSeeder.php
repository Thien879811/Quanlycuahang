<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CustomerTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('customers')->insert([
            'name' => 'Nguyễn Văn A',
            'phone' => '0987654321',
            'diem' => 1000,
            'password' => Hash::make('password'),
        ]);
        DB::table('customers')->insert([
            'name' => 'Nguyễn Văn B',
            'phone' => '0987654322',
            'diem' => 2000,
            'password' => Hash::make('password'),
        ]);
        DB::table('customers')->insert([
            'name' => 'Nguyễn Văn C',
            'phone' => '0987654323',
            'diem' => 3000,
            'password' => Hash::make('password'),
        ]);
    }
}
