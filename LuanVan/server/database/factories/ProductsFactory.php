<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductsFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        return [
            'product_name' => $this->faker->word(),
            'catalogy_id' => \App\Models\Catalogy::factory(), // Assuming you have a Catalogy factory
            'factory_id' => \App\Models\Factory::factory(), // Assuming you have a Factory factory
            'production_date' => $this->faker->date(),
            'expiration_date' => $this->faker->optional()->date(), // Nullable field
            'image' => $this->faker->imageUrl(),
            'quantity' => $this->faker->numberBetween(1, 100),
            'selling_price' => $this->faker->numberBetween(1000, 10000),
            'purchase_price' => $this->faker->numberBetween(500, 5000),
            'barcode' => $this->faker->unique()->numberBetween(1000000000, 9999999999),
        ];
    }
}
