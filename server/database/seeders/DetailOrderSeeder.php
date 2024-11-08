<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DetailOrder;
class DetailOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 1; $i <= 2000; $i++) {
            for ($j = 0; $j < rand(1, 5); $j++) {
                $product = \App\Models\Product::find(rand(1, 31)); // Get random product
                $quantity = rand(1, 5);
                DetailOrder::create([
                    'order_id' => $i,
                    'product_id' => $product->id,
                    'dongia' => $product->selling_price,
                    'soluong' => $quantity,
                ]);
                
                // Update product quantity
                $product->quantity = $product->quantity - $quantity;
                $product->save();
            }
        }
    }
}
