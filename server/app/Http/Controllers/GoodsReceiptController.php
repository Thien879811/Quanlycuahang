<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GoodsReceipt;
use App\Models\GoodsReceiptDetail;
use App\Models\Product;
use App\Models\HangSuDung;
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

    public function getReceiptById($id)
    {
        $goodsReceipt = GoodsReceipt::with(['supplier', 'details.product'])->find($id);
        return response()->json([
            'success' => true,
            'message' => 'Lấy phiếu nhập hàng thành công',
            'goods_receipt' => $goodsReceipt,
        ]);
    }

    public function updateReceipt(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required',
            'details' => 'required',
        ]);

        $goodsReceipt = GoodsReceipt::find($id);    
        $goodsReceipt->update([
            'status' => $validated['status'],
        ]);

        $goodsReceipt->save();

        foreach ($validated['details'] as $detail) {

            $goodsReceiptDetail = GoodsReceiptDetail::find($detail['id']);
            $goodsReceiptDetail->status = $detail['status'];
            $goodsReceiptDetail->note = $detail['note'];
            $goodsReceiptDetail->save();  
            if ($goodsReceiptDetail->status === '1') {
                $product = Product::find($goodsReceiptDetail->product_id);
                $product->quantity += $goodsReceiptDetail->quantity;
                $product->save();
                $hangSuDung = HangSuDung::create([
                    'product_id' => $product->id,
                    'quantity' => $goodsReceiptDetail->quantity,
                    'hang_su_dung' => $detail['expiration_date'],
                    'status' => '1',
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật phiếu nhập hàng thành công',
            'goods_receipt' => $goodsReceipt,
        ]);
    }   
    
}
