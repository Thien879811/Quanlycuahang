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
            'customer_id' => null,
            'staff_id' => $this->faker->numberBetween(1, 2),
            'tongcong' => $this->faker->numberBetween(10000, 1000000), // Assuming 'tongcong' is in cents
            'status' => $this->faker->numberBetween(0, 3), // Assuming status can be 0, 1, 2, or 3
            'pays_id' => $this->faker->numberBetween(1, 2),
        ];
    }
}
