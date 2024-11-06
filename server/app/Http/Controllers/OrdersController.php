<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Orders;
use Illuminate\Http\Request;
use App\Models\DetailOrder;
use App\Models\Product;

class OrdersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAll()
    {
        $orders = Orders::with('details.product')->get();
        $data = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'customer_id' => $order->customer_id,
                'staff_id' => $order->staff_id,
                'pays_id' => $order->pays_id,
                'status' => $order->status,
                'created_at' => $order->created_at,
                'details' => $order->details->map(function ($detail) {
                    return [
                        'product_id' => $detail->product_id,
                        'product_name' => $detail->product->product_name,
                        'soluong' => $detail->soluong,
                        'dongia' => $detail->dongia,
                        'discount' => $detail->discount,
                    ];
                }),
            ];
        });
        return response()->json($data);
    }

    public function getDetail($order_id)
    {
        $order = Orders::findOrFail($order_id);
        $details = DetailOrder::where('order_id', $order_id)->get();
        
        $products = Product::whereIn('id', $details->pluck('product_id'))->get();
        
        $result = $details->map(function ($detail) use ($products) {
            $product = $products->firstWhere('id', $detail->product_id);
            return [
                'product_id' => $detail->product_id,
                'name' => $product ? $product->product_name : 'Unknown',
                'quantity' => $detail->soluong,
                'price' => $product ? $product->selling_price : 0,
                'discount' => $detail->discount,
            ];
        });
        
        $customer = Customer::find($order->customer_id);
        $customerName = $customer ? $customer->name : 'Unknown';
        $staffName = $order->staff ? $order->staff->name : 'Unknown';
        
        return response()->json([
            'products' => $result,
            'customer_name' => $customerName,
            'pays_id' => $order->pays_id,
            'staff_name' => $staffName,
            'created_at' => $order->created_at,
            'tongcong' => $order->tongcong,
            'status' => $order->status,
            'id' => $order->id
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $validated = $request->all();

        $order = Orders::where("status", "0")->first();

        if (!$order) {
            $order = Orders::create([
                "customer_id" => $validated['khachhang'] !== '0' ? $validated['khachhang'] : null,
                "staff_id" => $validated['nhanvien'],
                "status" => "0",
                "tongcong" => $validated['tonghoadon'],
                "pays_id" => $validated['pays_id'],
            ]);
        }
        $order->customer_id = $validated['khachhang'] !== '0' ? $validated['khachhang'] : null;
        $order->save();

        if ($validated['products']) {
            foreach ($validated['products'] as $product) {
                $product_id = $product['product_id'];
                
                $detail = DetailOrder::where('order_id', $order->id)
                                    ->where('product_id', $product_id)
                                    ->first();
            
                if ($detail) {
                    $detail->soluong = $product['quantity'];
                    $detail->discount = $product['discount'];
                    $detail->save();
                } else {
                    DetailOrder::create([
                        'order_id' => $order->id,
                        'product_id' => $product_id,
                        'soluong' => $product['quantity'],
                        'discount' => $product['discount'],
                        'dongia' => $product['price'],
                    ]);
                }
            }
        } else {
            DetailOrder::where('order_id', $order->id)->delete();
        }

        return response()->json($order, 201);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        return response()->json($validated);
    }

    public function getOne()
    {
        return response()->json([
            'message' => 'thanhcong'
        ]);
    }

    public function updateOrder(Request $request, $order_id)
    {
        $validated = $request->validate([
            'status' => 'required',
            'pays_id' => 'required'
        ]);
        
        $order = Orders::find($order_id);
        $order->status = $validated['status'];
        $order->pays_id = $validated['pays_id'];
        $order->save();

        if ($order->status == '1' || $order->status == '2') {
            $details = DetailOrder::where('order_id', $order->id)->get();

            foreach ($details as $item) {
                $product = Product::find($item->product_id);
                $product->quantity = $product->quantity - $item->soluong;
                $product->save();
            }
        }

        return response()->json($details);
    }
}
