<?php

namespace Database\Seeders;

use App\Models\pays;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaysSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        pays::create([
            'tt_hinhthuc' => 'Tiền mặt'
        ]);
        
        pays::create([
            'tt_hinhthuc' => 'Chuyển khoản'
        ]);
    }
}
