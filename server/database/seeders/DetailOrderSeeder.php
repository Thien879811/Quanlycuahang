<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DetailOrder;
use App\Models\Orders;
use App\Models\Product;

class DetailOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $orders = Orders::all();
        foreach ($orders as $order) {
            // Generate 1-10 order details for each order
            $numDetails = rand(1, 10);
            
            for ($i = 0; $i < $numDetails; $i++) {
                $product = Product::find(rand(1, 31)); // Get random product
                
                if (!$product) {
                    continue;
                }

                $quantity = min(rand(1, 5), $product->quantity); // Don't order more than available
                
                if ($quantity <= 0) {
                    continue;
                }

                DetailOrder::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'dongia' => $product->selling_price,
                    'soluong' => $quantity,
                ]);
                
                // Update product quantity
                $product->quantity -= $quantity;
                $product->save();
            }
        }
    }
}
