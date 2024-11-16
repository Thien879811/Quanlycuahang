<?php

namespace Database\Seeders;

use App\Models\Staff;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StaffsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Staff::create([
            'names' => 'Nguyen Van A',
            'age' => 20,
            'address' => 'Ha Noi',
            'phone' => '0987654321',
            'gioitinh' => 'Nam',
            'position' => 'Nhan vien',
            'user_id' => 1,
            'salary' => '',
        ]);

        Staff::create([
            'names' => 'Nguyen Van B',
            'age' => 20,
            'address' => 'Ha Noi',
            'phone' => '0987654321',
            'gioitinh' => 'Nam',
            'position' => 'Nhan vien',
            'user_id' => 2,
            'salary' => 4700000,
        ]);
        Staff::create([
            'names' => 'Nguyen Van C',
            'age' => 20,
            'address' => 'Ha Noi',
            'phone' => '0987654321',
            'gioitinh' => 'Nam',
            'position' => 'Nhan vien',
            'user_id' => 3,
            'salary' => 4700000,
        ]);
    }
}
