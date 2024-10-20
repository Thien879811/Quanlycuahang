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
        ]);
    }
}
