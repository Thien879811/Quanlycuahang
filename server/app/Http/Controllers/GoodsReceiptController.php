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
            'check_date' => Carbon::createFromFormat('d/m/Y H:i:s', $validated['check_date'])->format('Y-m-d H:i:s'),
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
                $goodsReceiptDetail->quantity_defective = $detail['quantity_defective'];

                if ($goodsReceiptDetail->price != $detail['price']) {
                    $goodsReceiptDetail->price = $detail['price'];
                }
                

                $product = Product::find($goodsReceiptDetail->product_id);
                $product->quantity += $goodsReceiptDetail->quantity;
                $product->purchase_price = $goodsReceiptDetail->price;
                $product->save();

                $goodsReceiptDetail->is_added = true;
                $goodsReceiptDetail->save();
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
            'return_date' => 'required',
        ]);

        $goodsReceipt = GoodsReceipt::find($validated['receipt_id']);

        foreach ($validated['products'] as $product) {
            $detail = GoodsReceiptDetail::find($product['detail_id']);

            if ($detail) {
                $detail->return_quantity = $product['return_quantity'];
                $detail->status = '4';
                $detail->note = $validated['reason'];
                $detail->return_date = Carbon::createFromFormat('d/m/Y H:i:s', $validated['return_date'])->format('Y-m-d H:i:s');
                $detail->save();

                if ($detail->is_added) {
                    $productModel = Product::find($detail->product_id);
                    $productModel->quantity -= $product['return_quantity'];
                    $productModel->save();
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
                    $date = Carbon::parse(request()->has('date') ? request()->input('date') : '');
                    if (!$date) {
                        return response()->json([
                            'error' => 'Date is required for ' . $type . ' type'
                        ], 400);
                    }
                    $query->whereDate('created_at', $date);
                    break;
                case 'custom_month':
                    $date = Carbon::parse(request()->has('date') ? request()->input('date') : '');
                    if (!$date) {
                        return response()->json([
                            'error' => 'Date is required for ' . $type . ' type'
                        ], 400);
                    }
                    $query->whereYear('created_at', $date->year)
                          ->whereMonth('created_at', $date->month);
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
                    $query->whereHas('details', function($q) {
                        $q->whereDate('return_date', Carbon::today());
                    });
                    break;
                case 'yesterday': 
                    $query->whereHas('details', function($q) {
                        $q->whereDate('return_date', Carbon::yesterday());
                    });
                    break;
                case 'week':
                    $query->whereHas('details', function($q) {
                        $q->whereBetween('return_date', [
                            Carbon::now()->startOfWeek(),
                            Carbon::now()->endOfWeek()
                        ]);
                    });
                    break;
                case 'month':
                    $query->whereHas('details', function($q) {
                        $q->whereYear('return_date', Carbon::now()->year)
                          ->whereMonth('return_date', Carbon::now()->month);
                    });
                    break;
                case 'custom':
                    $date = Carbon::parse($request->input('date'));
                    if (!$date) {
                        return response()->json(['error' => 'Date is required for custom type'], 400);
                    }
                    $query->whereHas('details', function($q) use ($date) {
                        $q->whereDate('return_date', $date);
                    });
                    break;
                case 'custom_month':
                    $date = Carbon::parse($request->input('date'));
                    if (!$date) {
                        return response()->json(['error' => 'Date is required for custom month type'], 400);
                    }
                    $query->whereHas('details', function($q) use ($date) {
                        $q->whereYear('return_date', $date->year)
                          ->whereMonth('return_date', $date->month);
                    });
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

    public function createReceipt(Request $request) {
        $validated = $request->validate([
            'supplier_id' => 'required',
            'import_date' => 'required',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|numeric|min:0',
            'products.*.price' => 'required|numeric|min:0',
        ]);

        $goodsReceipt = GoodsReceipt::create([
            'supplier_id' => $validated['supplier_id'],
            'import_date' => $validated['import_date'],
            'status' => '0',
        ]);

        foreach ($validated['products'] as $productData) {
            GoodsReceiptDetail::create([
                'goods_receipt_id' => $goodsReceipt->id,
                'product_id' => $productData['product_id'],
                'quantity' => $productData['quantity'],
                'quantity_receipt' => $productData['quantity'],
                'price' => $productData['price'],
                'status' => '0',
                'production_date' => $productData['production_date'] ?? null,
                'expiration_date' => $productData['expiration_date'] ?? null,
                'quantity_defective' => 0,
                'return_quantity' => 0,
                'note' => '',
                'is_added' => true,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tạo phiếu nhập hàng thành công',
            'goods_receipt' => $goodsReceipt,
        ]);
    }

    public function chinhsua($id, Request $request) {
        $validated = $request->validate([
            'status' => 'required',
            'products' => 'required|array'
        ]);

        $goodsReceipt = GoodsReceipt::find($id);
        if (!$goodsReceipt) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phiếu nhập hàng'
            ], 404);
        }

        // Revert quantities for existing products
        $existingDetails = GoodsReceiptDetail::where('goods_receipt_id', $id)->get();
        foreach ($existingDetails as $detail) {
            if ($detail->is_added) {
                $product = Product::find($detail->product_id);
                if ($product) {
                    $product->quantity -= $detail->quantity;
                    $product->save();
                }
            }
        }

        // Delete existing details
        GoodsReceiptDetail::where('goods_receipt_id', $id)->delete();

        // Create new details and update product quantities
        foreach ($validated['products'] as $product) {
            GoodsReceiptDetail::create([
                'goods_receipt_id' => $goodsReceipt->id,
                'product_id' => $product['product_id'],
                'quantity' => $product['quantity'],
                'quantity_receipt' => $product['quantity'],
                'price' => $product['price'],
                'status' => '0',
                'production_date' => $product['production_date'] ?? null,
                'expiration_date' => $product['expiration_date'] ?? null,
                'quantity_defective' => 0,
                'return_quantity' => 0,
                'note' => '',
                'is_added' => false,
            ]);

            $productModel = Product::find($product['product_id']);
            if ($productModel) {
                $productModel->quantity += $product['quantity'];
                $productModel->purchase_price = $product['price'];
                $productModel->save();
            }
        }

        $goodsReceipt->status = $validated['status'];
        $goodsReceipt->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật phiếu nhập hàng thành công',
            'goods_receipt' => $goodsReceipt,
        ]);
    }
}
