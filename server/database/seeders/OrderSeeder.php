<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Orders;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create orders with status 1 across different months and dates
        for ($i = 0; $i < 1500; $i++) {
            $month = rand(1, 12);
            $day = rand(1, 28); // Using 28 to be safe for all months
            $date = Carbon::create(2024, $month, $day);
            
            Orders::create([
                'status' => 1,
                'pays_id' => 1,
                'created_at' => $date,
                'updated_at' => $date
            ]);
        }

        // Create orders with status 2 across different months and dates
        for ($i = 0; $i < 500; $i++) {
            $month = rand(1, 12);
            $day = rand(1, 28);
            $date = Carbon::create(2024, $month, $day);

            Orders::create([
                'status' => 2, 
                'pays_id' => 2,
                'created_at' => $date,
                'updated_at' => $date
            ]);
        }
    }
}
