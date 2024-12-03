<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Promotion;
class PromotionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Promotion::create([
            'name' => 'Khuyến mãi 1',
            'catalory' => '1',
            'code' => null,
            'discount_percentage' => 10,
            'product_id' => 1,
            'present' => null,
            'description' => 'Khuyến mãi đồ uống',
            'quantity' => null,
            'start_date' => now(),
            'end_date' => now()->addDays(30),
        ]);
    }
}
