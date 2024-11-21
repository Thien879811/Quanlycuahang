<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Factory;
use App\Models\GoodsReceipt;
use App\Models\GoodsReceiptDetail;
class FactoryController extends Controller
{
    public function getAll(){
        $factory = Factory::all();
        return response()->json($factory);
    }

    public function getById($id){
        $factory = Factory::find($id);
        return response()->json($factory);
    }

    public function create(Request $request){
        $factory = Factory::create([
            'factory_name' => $request->factory_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
        ]);
        return response()->json(['success' => true, 'message' => 'Thêm nhà cung cấp thành công']);
    }

    public function update($id, Request $request){
        $factory = Factory::find($id);
        $factory->update([
            'factory_name' => $request->factory_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
        ]);
        return response()->json(['success' => true, 'message' => 'Cập nhật nhà cung cấp thành công']);
    }

    public function getHistoryReceive($id){
        // Lấy tất cả đơn nhập từ nhà cung cấp này
        $receipts = GoodsReceipt::where('supplier_id', $id)->get();
        
        // Tính tổng số đơn nhập
        $totalReceipts = $receipts->count();

        // Tính tổng số lượng sản phẩm đã trả
        $totalReturnedQuantity = GoodsReceiptDetail::whereIn('goods_receipt_id', $receipts->pluck('id'))
            ->where('status', 4) // Giả sử status 4 là đã trả hàng
            ->sum('return_quantity');

        // Tính tổng tiền đã nhập bằng cách nhân số lượng với giá
        $totalAmount = GoodsReceiptDetail::whereIn('goods_receipt_id', $receipts->pluck('id'))
            ->selectRaw('SUM(quantity * price) as total')
            ->first()
            ->total;

        // Tính tổng tiền đã hoàn trả
        $totalReturnedAmount = GoodsReceiptDetail::whereIn('goods_receipt_id', $receipts->pluck('id'))
            ->where('status', 4)
            ->selectRaw('SUM(return_quantity * price) as total')
            ->first()
            ->total;

        // Lấy danh sách sản phẩm từ các phiếu nhập
        $products = GoodsReceiptDetail::whereIn('goods_receipt_id', $receipts->pluck('id'))
            ->with('product')
            ->select('product_id')
            ->selectRaw('SUM(quantity) as total_quantity')
            ->selectRaw('SUM(return_quantity) as total_returned')
            ->selectRaw('SUM(quantity * price) as total_amount')
            ->selectRaw('SUM(return_quantity * price) as total_returned_amount')
            ->groupBy('product_id')
            ->get();

        return response()->json([
            'total_receipts' => $totalReceipts,
            'total_returned_quantity' => $totalReturnedQuantity,
            'total_amount' => $totalAmount,
            'total_returned_amount' => $totalReturnedAmount,
            'net_amount' => $totalAmount - $totalReturnedAmount,
            'products' => $products
        ]);
    }
}
