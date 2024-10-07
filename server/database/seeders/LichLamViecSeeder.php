<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LichLamViec;
class LichLamViecSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        LichLamViec::create([
            'staff_id' => 2,
            'date' => '2024-09-23',
            'time_start' => '07:00',
            'time_end' => '15:00',
            'reason' => '',
        ]);
  
        LichLamViec::create([
            'staff_id' => 2,
            'date' => '2024-09-24',
            'time_start' => '07:00',
            'time_end' => '15:00',
            'reason' => '',
        ]); 
      
        LichLamViec::create([
            'staff_id' => 2,
            'date' => '2024-09-25',
            'time_start' => '07:00',
            'time_end' => '15:00',
            'reason' => '',
        ]); 
         
        LichLamViec::create([
            'staff_id' => 2,
            'date' => '2024-09-26',
            'time_start' => '07:00',
            'time_end' => '15:00',
            'reason' => '',
        ]); 
        
        LichLamViec::create([
            'staff_id' => 2,
            'date' => '2024-09-27',
            'time_start' => '07:00',
            'time_end' => '15:00',
            'reason' => '',
        ]); 
         
        LichLamViec::create([
            'staff_id' => 2,
            'date' => '2024-09-28',
            'time_start' => '07:00',
            'time_end' => '15:00',
            'reason' => '',
        ]); 
     
      
        LichLamViec::create([
            'staff_id' => 2,
            'date' => '2024-09-29',
            'time_start' => '07:00',
            'time_end' => '15:00',
            'reason' => '',
        ]); 
       
      
    }
}
