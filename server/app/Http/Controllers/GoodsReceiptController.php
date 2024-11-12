<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GoodsReceipt;
use App\Models\GoodsReceiptDetail;
use App\Models\Product;
use App\Models\HangSuDung;
use Carbon\Carbon;
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
            'details' => 'nullable',
            'check_date' => 'required',
        ]);

        $goodsReceipt = GoodsReceipt::find($id);
        $goodsReceipt->update([
            'status' => $validated['status'],
            'check_date' => Carbon::parse($validated['check_date'])->format('Y-m-d H:i:s'),
        ]);
        $goodsReceipt->save();
        if($validated['details']) {
            foreach ($validated['details'] as $detail) {
                $goodsReceiptDetail = GoodsReceiptDetail::find($detail['id']);
                $goodsReceiptDetail->status = $detail['status'];
                $goodsReceiptDetail->note = $detail['note'];
                $goodsReceiptDetail->production_date = $detail['production_date'];
                $goodsReceiptDetail->quantity_receipt = $detail['quantity_receipt'];
                $goodsReceiptDetail->expiration_date = $detail['expiration_date'];
                if ($goodsReceiptDetail->price != $detail['price']) {
                    $goodsReceiptDetail->price = $detail['price'];
                }
                $goodsReceiptDetail->save();

                $product = Product::find($goodsReceiptDetail->product_id);
                
                if ($goodsReceiptDetail->status === '1' && !$goodsReceiptDetail->is_added) {
                    $product->quantity += $goodsReceiptDetail->quantity;
                    $product->purchase_price = $goodsReceiptDetail->price;
                    $product->save();
                    $goodsReceiptDetail->is_added = true;
                    $goodsReceiptDetail->save();
                }
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

                if ($detail->is_added) {
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
    public function getReceipt($type, Request $request)
    {
        try {
            $query = GoodsReceipt::with(['details.product', 'supplier'])
                          ->orderBy('created_at', 'desc');

            switch($type) {
                case 'today':
                    $query->whereDate('created_at', Carbon::today());
                    break;
                case 'yesterday': 
                    $query->whereDate('created_at', Carbon::yesterday());
                    break;
                case 'week':
                    $query->whereBetween('created_at', [
                        Carbon::now()->startOfWeek(),
                        Carbon::now()->endOfWeek()
                    ]);
                    break;
                case 'month':
                    $query->whereYear('created_at', Carbon::now()->year)
                          ->whereMonth('created_at', Carbon::now()->month);
                    break;
                case 'custom':
                    $date = $request->get('date');
                    if (!$date) {
                        return response()->json(['error' => 'Date is required for custom type'], 400);
                    }
                    $query->whereDate('created_at', Carbon::parse($date));
                    break;
                default:
                    return response()->json(['error' => 'Invalid time range'], 400);
            }

            $receipts = $query->get();
            return response()->json([
                'success' => true,
                'goods_receipts' => $receipts
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getReceiptReturn($type, Request $request)
    {
        try {
            $query = GoodsReceipt::with(['details.product', 'supplier'])
                          ->whereHas('details', function($q) {
                              $q->where('status', 4); // Lấy theo trạng thái của detail
                          })
                          ->orderBy('created_at', 'desc');

            switch($type) {
                case 'today':
                    $query->whereDate('updated_at', Carbon::today());
                    break;
                case 'yesterday': 
                    $query->whereDate('updated_at', Carbon::yesterday());
                    break;
                case 'week':
                    $query->whereBetween('updated_at', [
                        Carbon::now()->startOfWeek(),
                        Carbon::now()->endOfWeek()
                    ]);
                    break;
                case 'month':
                    $query->whereYear('updated_at', Carbon::now()->year)
                          ->whereMonth('updated_at', Carbon::now()->month);
                    break;
                case 'custom':
                    $date = $request->get('date');
                    if (!$date) {
                        return response()->json(['error' => 'Date is required for custom type'], 400);
                    }
                    $query->whereDate('updated_at', Carbon::parse($date));
                    break;
                default:
                    return response()->json(['error' => 'Invalid time range'], 400);
            }

            $receipts = $query->get();
            return response()->json([
                'success' => true,
                'goods_receipts' => $receipts
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteReceipt($id)
    {
        $goodsReceipt = GoodsReceipt::find($id);
        $details = GoodsReceiptDetail::where('goods_receipt_id', $id)->get();
        
        foreach ($details as $detail) {
            if ($goodsReceipt->status == 1) { // Nếu phiếu nhập đã kiểm tra
                $product = Product::find($detail->product_id);
                $product->quantity -= $detail->quantity_receipt;
                $product->save();
            }
            $detail->delete();
        }
        
        $goodsReceipt->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Xóa phiếu nhập hàng thành công',
        ]); 
    }

    public function update($id, Request $request){
        $validated = $request->validate([
            'status' => 'required',
            'details' => 'nullable',
            'check_date' => 'required',
            'supplier_id' => 'required',
            'import_date' => 'required',
        ]);

        $goodsReceipt = GoodsReceipt::find($id);
        foreach ($validated['details'] as $detail) {
            $goodsReceiptDetail = GoodsReceiptDetail::find($detail['id']);
            $goodsReceiptDetail->status = $detail['status'];
            $goodsReceiptDetail->note = $detail['note'];
            $goodsReceiptDetail->production_date = $detail['production_date'];
            $goodsReceiptDetail->quantity_receipt = $detail['quantity_receipt'];
            if ($goodsReceiptDetail->price != $detail['price']) {
                $goodsReceiptDetail->price = $detail['price'];
            }
            $goodsReceiptDetail->save();
        }
        $goodsReceipt->supplier_id = $validated['supplier_id'];
        $goodsReceipt->import_date = $validated['import_date'];
        $goodsReceipt->status = $validated['status'];
        $goodsReceipt->check_date = $validated['check_date'];
        $goodsReceipt->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật phiếu nhập hàng thành công',
            'goods_receipt' => $goodsReceipt,
        ]);
    }
}
