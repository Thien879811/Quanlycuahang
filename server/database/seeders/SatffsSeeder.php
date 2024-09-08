<?php

namespace Database\Seeders;

use App\Models\Satff;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SatffsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Satff::create([
            'names' => 'Nguyen Van A',
            'age' => 20,
            'address' => 'Ha Noi',
            'phone' => '0987654321',
            'gioitinh' => 'Nam',
            'position_id' => 1,
            'user_id' => 1,
        ]);

        Satff::create([
            'names' => 'Nguyen Van B',
            'age' => 20,
            'address' => 'Ha Noi',
            'phone' => '0987654321',
            'gioitinh' => 'Nam',
            'position_id' => 2,
            'user_id' => 2,
        ]);
    }
}
