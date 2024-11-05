<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Orders;
class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 0; $i < 15; $i++) {
            Orders::create([
                'status' => 1,
                'pays_id' => 1,
            ]);
        }
        for ($i = 0; $i < 5; $i++) {
            Orders::create([
                'status' => 2,
                'pays_id' => 2,
            ]);
        }
    }
}
