<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\GoodsReceipt as GoodsReceiptModel;
use Carbon\Carbon;
use Faker\Factory as Faker;
use App\Models\Factory;

class GoodsReceipt extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $startDate = Carbon::createFromDate(2024, 1, 1);
        $endDate = Carbon::createFromDate(2024, 11, 31);

        $factories = Factory::all();
        
        for ($i = 0; $i < 700; $i++) {
            $randomDate = Carbon::createFromTimestamp(rand($startDate->timestamp, $endDate->timestamp));    
            GoodsReceiptModel::create([
                'supplier_id' => $factories->random()->id,
                'import_date' => $randomDate,
                'status' => 1,
                'check_date' => $randomDate,
                'created_at' => $randomDate,
                'updated_at' => $randomDate,
            ]);
        }
    }
}
