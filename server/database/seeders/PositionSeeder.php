<?php

namespace Database\Seeders;

use App\Models\Position;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    
    {
        Position::create([
            'position' => 'Quản lý',
            'wage' => 1000000,
        ]);
        
        Position::create([
            'position' => 'Nhân viên',
            'wage' => 1000000,
        ]);

        Position::create([
            'position' => 'Nhân viên Part-time',
            'wage' => 20000,
        ]);
 
    }
}
