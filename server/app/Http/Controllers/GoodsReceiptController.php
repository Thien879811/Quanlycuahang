<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GoodsReceipt;
use App\Models\GoodsReceiptDetail;

class GoodsReceiptController extends Controller
{
    public function createGoodsReceipt(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required',
            'import_date' => 'required',
            'products' => 'required',
        ]);

        $goodsReceipt = GoodsReceipt::create($validated);

        foreach ($validated['products'] as $product) {
            $goodsReceiptDetail = GoodsReceiptDetail::create([
                'goods_receipt_id' => $goodsReceipt->id,
                'product_id' => $product['product_id'],
                'quantity' => $product['quantity'],
                'price' => $product['price'],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Phiếu nhập hàng đã được tạo thành công',
            'goods_receipt' => $goodsReceipt,
        ]);
    }

    public function getAll()
    {
        $goodsReceipts = GoodsReceipt::with(['supplier', 'details.product'])->get();
        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách phiếu nhập hàng thành công',
            'goods_receipts' => $goodsReceipts,
        ]);
    }
}
