<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Factory;

class FactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Factory::create([
            'factory_name' => 'Cty TNHH ABC',
            'address' => 'Hà Nội',
            'phone' => '0987654321',
            'email' => 'abc@gmail.com',
        ]);
        Factory::create([
            'factory_name' => 'Cty TNHH XYZ',
            'address' => 'Hải Phòng',
            'phone' => '0987654321',
            'email' => 'xyz@gmail.com',
            
        ]);
        Factory::create([
            'factory_name' => 'Cty TNHH QWE',
            'address' => 'Cà Mau',
            'phone' => '0987654321',
            'email' => 'qwe@gmail.com',
        ]);
    }
}
