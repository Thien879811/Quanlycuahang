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

        $goodsReceipt = GoodsReceipt::create([
            'supplier_id' => $validated['supplier_id'],
            'import_date' => $validated['import_date'],
            'status' => '0',
        ]);

        foreach ($validated['products'] as $product) {
            GoodsReceiptDetail::create([
                'goods_receipt_id' => $goodsReceipt->id,
                'product_id' => $product['product_id'],
                'quantity' => $product['quantity'],
                'quantity_receipt' => '0',
                'price' => $product['price'],
                'status' => '0',
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
            'check_date' => 'required',
        ]);

        $goodsReceipt = GoodsReceipt::find($id);
        $goodsReceipt->update([
            'status' => $validated['status'],
            'check_date' => $validated['check_date'],
        ]);

        foreach ($validated['details'] as $detail) {
            $goodsReceiptDetail = GoodsReceiptDetail::find($detail['id']);
            $goodsReceiptDetail->status = $detail['status'];
            $goodsReceiptDetail->note = $detail['note'];
            $goodsReceiptDetail->production_date = $detail['production_date'];
            $goodsReceiptDetail->quantity_receipt = $detail['quantity_receipt'];
            $goodsReceiptDetail->expiration_date = $detail['expiration_date'];
            $goodsReceiptDetail->save();

            $product = Product::find($goodsReceiptDetail->product_id);
            
            if ($goodsReceiptDetail->status === '1') {
                $product->quantity += $goodsReceiptDetail->quantity;
                $product->save();
                
                HangSuDung::create([
                    'product_id' => $product->id,
                    'quantity' => $goodsReceiptDetail->quantity,
                    'hang_su_dung' => $detail['expiration_date'],
                    'status' => '1',
                ]);
            } elseif ($goodsReceiptDetail->status === '0') {
                $product->quantity += $goodsReceiptDetail->quantity_receipt;
                $product->save();
                
                HangSuDung::create([
                    'product_id' => $product->id,
                    'quantity' => $goodsReceiptDetail->quantity_receipt,
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

    public function returnReceipt(Request $request)
    {
        $validated = $request->validate([
            'receipt_id' => 'required',
            'products' => 'required',
            'reason' => 'required',
        ]);

        $goodsReceipt = GoodsReceipt::find($validated['receipt_id']);

        foreach ($validated['products'] as $product) {
            $detail = GoodsReceiptDetail::find($product['detail_id']);
            if ($detail) {
                $detail->return_quantity = $product['return_quantity'];
                $detail->status = '4';
                $detail->note = $validated['reason'];
                $detail->save();

                if ($detail->status === '2' || $detail->status === '1') {
                    $productModel = Product::find($detail->product_id);
                    if ($productModel) {
                        $productModel->quantity -= $product['return_quantity'];
                        $productModel->save();
                    }
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Trả hàng thành công',
            'goods_receipt' => $goodsReceipt,
        ]);
    }
}
