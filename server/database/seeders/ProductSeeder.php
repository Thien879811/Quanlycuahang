<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Product::create([
            'product_name' => 'Cà phê'  ,
            'barcode' => '1234567890',
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/1725266806.png',
            'factory_id' => 1,
            'purchase_price' => 10000,
        ]);
        Product::create([
            'product_name' => 'Cà phê',
            'barcode' => '1234567890',
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/1725266806.png',
            'factory_id' => 1,
            'purchase_price' => 10000,
        ]);
    }


}
