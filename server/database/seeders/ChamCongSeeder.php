<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ChamCong;
use Carbon\Carbon;
use App\Models\Staff;
class ChamCongSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $staff_ids = Staff::pluck('id')->toArray();
        $months = range(9, 11);
        
        foreach ($staff_ids as $staff_id) {
            foreach ($months as $month) {
                $days_in_month = cal_days_in_month(CAL_GREGORIAN, $month, 2024);
                
                for ($day = 1; $day <= $days_in_month; $day++) {
                    $date = sprintf('2024-%02d-%02d', $month, $day);
                    
                    ChamCong::create([
                        'staff_id' => $staff_id,
                        'date' => $date,
                        'time_start' => '08:00:00',
                        'time_end' => '17:00:00',
                        'status' => 'Chưa tính',
                        'reason' => 'null'
                    ]);
                }
            }
        }
    }
}
