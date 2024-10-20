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
<<<<<<< HEAD
            'catalogy_name' => 'Nước giải khác',
        ]);
        Catalory::create([
            'catalogy_name' => 'Mì ăn liền',
        ]);
        Catalory::create([
            'catalogy_name' => 'Snack',
        ]);
        Catalory::create([
            'catalogy_name' => 'Kẹo',
=======
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
>>>>>>> 60f6a0aa052873cde43c9d5c60ab60def300748c
        ]);
    }
}
