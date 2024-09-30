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
            'code' => '',
            'discount_percentage' => 10,
            'product_id' => 1,
            'present' => '',
            'description' => 'Giảm 10% khi mua 2 sản phẩm',
            'quantity' => 2,
            'start_date' => '2024-9-11',
            'end_date' => '2024-12-21',
        ]);

        Promotion::create([
            'name' => 'Khuyến mãi 2',
            'code' => '',
            'discount_percentage' => 5,
            'product_id' => 2,
            'present' => '',
            'description' => 'Giảm 5% cho sản phẩm',
            'quantity' => null,
            'start_date' => '2024-9-11',
            'end_date' => '2024-12-21',
        ]);

        
    }
}
