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
            'names' => 'Nhân viên 1',
            'age' => 20,
            'address' => 'Ha Noi',
            'phone' => '0987654321',
            'gioitinh' => 'Nam',
            'position' => 'Nhan vien',
            'user_id' => 2,
            'salary' => 4700000,
        ]);
        Staff::create([
            'names' => 'Nhân viên 2',
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
