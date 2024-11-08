<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\GoodsReceipt as GoodsReceiptModel;
use App\Models\GoodsReceiptDetail as GoodsReceiptDetailModel;
use App\Models\Product as ProductModel;

class GoodsReceiptDetail extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $goodsReceipts = GoodsReceiptModel::all();
        $products = ProductModel::all();
        foreach ($goodsReceipts as $goodsReceipt) {
            // Random number of products between 5-10 for each receipt
            $numProducts = rand(5, 10);
            $selectedProducts = $products->random($numProducts);
            
            foreach ($selectedProducts as $product) {
                $goodsReceiptDetail = GoodsReceiptDetailModel::create([
                    'goods_receipt_id' => $goodsReceipt->id,
                    'product_id' => $product->id,
                    'quantity' => rand(1, 5),
                    'price' => $product->purchase_price,
                    'quantity_receipt' => 0,
                    'status' => 1,
                    'note' => null,
                    'production_date' => $product->production_date,
                    'expiration_date' => $product->expiration_date,
                    'return_quantity' => 0,
                    'created_at' => $goodsReceipt->created_at,
                    'updated_at' => $goodsReceipt->updated_at,
                ]);

                $product->quantity += $goodsReceiptDetail->quantity;
                $product->save();
            }
        }
    }
}
