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
        $startDate = Carbon::createFromDate(2024, 1, 1);
        $endDate = Carbon::createFromDate(2024, 11, 30); // Fixed incorrect date (November has 30 days)
        
        // Create orders with status 1 across different months and dates
        for ($i = 0; $i < 12000; $i++) {
            $randomDate = Carbon::createFromTimestamp(
                rand($startDate->timestamp, $endDate->timestamp)
            );
            
            Orders::create([
                'status' => 1,
                'pays_id' => 1,
                'created_at' => $randomDate,
                'updated_at' => $randomDate
            ]);
        }

        // Create orders with status 2 across different months and dates
        for ($i = 0; $i < 2000; $i++) {
            $randomDate = Carbon::createFromTimestamp(
                rand($startDate->timestamp, $endDate->timestamp)
            );

            Orders::create([
                'status' => 2, 
                'pays_id' => 2,
                'created_at' => $randomDate,
                'updated_at' => $randomDate
            ]);
        }
    }
}
