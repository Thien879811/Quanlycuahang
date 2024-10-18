<?php

namespace Database\Factories;

use App\Models\Orders;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DetailOrder>
 */
class DetailOrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $product = Product::inRandomOrder()->first(); 
        return [
            'order_id' => Orders::factory(),
            'product_id' => $product->id,
            'dongia' => $product->selling_price,
            'soluong' => $this->faker->numberBetween(1, 10),
            'discount' => null,
        ];
    }
}
