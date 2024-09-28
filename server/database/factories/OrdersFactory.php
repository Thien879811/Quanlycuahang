<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Staff;
use App\Models\Pays;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrdersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'staff_id' => $this->faker->numberBetween(2, 3),
            'tongcong' => $this->faker->randomFloat(2, 10, 1000),
            'status' => 1,
            'pays_id' => $this->faker->numberBetween(1, 2),
        ];
    }
}

