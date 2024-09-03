<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Catalory;

class CatalogySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Catalory::create([
            'catalogy_name' => 'Cà phê',
        ]);
        Catalory::create([
            'catalogy_name' => 'Trà',
        ]);
        Catalory::create([
            'catalogy_name' => 'Nước',
        ]);
        Catalory::create([
            'catalogy_name' => 'Đồ ăn',
        ]);
    }
}
