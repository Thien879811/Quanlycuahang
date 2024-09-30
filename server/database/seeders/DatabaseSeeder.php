<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(OrderSeeder::class);
        // $this->call(DetailOrderSeeder::class);

        // $this->call(UserTableSeeder::class);

        // $this->call(CatalogySeeder::class);
        // $this->call(FactSeeder::class);
        // $this->call(ProductSeeder::class);
        // $this->call(PositionSeeder::class);
        // $this->call(CustomerTableSeeder::class);
        // $this->call(StaffsSeeder::class);
        // $this->call(PaysSeeder::class);
        // $this->call(LichLamViecSeeder::class);

        $this->call(PromotionSeeder::class);

    }
}
