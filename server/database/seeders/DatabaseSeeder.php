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
        

        $this->call(UserTableSeeder::class);
        $this->call(CatalogySeeder::class);
        $this->call(FactSeeder::class);
        $this->call(ProductSeeder::class);
        $this->call(CustomerTableSeeder::class);
        $this->call(StaffsSeeder::class);
        $this->call(PaysSeeder::class);
        
        $this->call(LichLamViecSeeder::class);
        // $this->call(ChamCongSeeder::class);

        // $this->call(PromotionSeeder::class);

        // $this->call(GoodsReceipt::class);
        // $this->call(GoodsReceiptDetail::class);
        // $this->call(OrderSeeder::class);
        // $this->call(DetailOrderSeeder::class);

        
        
    }
}
