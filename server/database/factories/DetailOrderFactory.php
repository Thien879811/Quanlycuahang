<?php

namespace Database\Factories;

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
        return [
            'order_id' => $this->faker->numberBetween(3, 10),
            'product_id' => $this->faker->numberBetween(1, 10),
            'soluong' => $this->faker->numberBetween(1, 10),
            'dongia' => $this->faker->randomFloat(2, 10, 1000),
        ];
    }
}
