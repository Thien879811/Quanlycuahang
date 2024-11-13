<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function get($id){
        $customer = Customer::find($id);
        return response()->json($customer);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'diem' => 'required',
        ]);
        $customer = Customer::find($id);
        $customer->diem = $customer->diem + $validated['diem'];
        $customer->save();
        return response()->json($customer);
    }

    public function getOne($phone){
        $customer = Customer::where("phone",$phone)->first();

        if($customer){
            return response()->json($customer);
        }

        return response()->json(['error' => 'Không tìm thấy khách hàng']);
    }

    public function create(Request $request){
        $validated = $request->validate([
            'name' => 'required',
            'phone' => 'required',
            'diem' => 'required',
        ]);

        $existingCustomer = Customer::where('phone', $validated['phone'])->first();
        if ($existingCustomer) {
            return response()->json(['error' => 'Số điện thoại đã tồn tại'], 400);
        }

        $customer = Customer::create($validated);
        return response()->json($customer);
    }

    public function getAll(){
        $customers = Customer::all();
        return response()->json($customers);
    }

    public function getInfoBuy($id){
        $customer = Customer::with(['orders.details.product'])->find($id);

        if (!$customer) {
            return response()->json(['error' => 'Không tìm thấy khách hàng'], 404);
        }

        // Get total number of orders and total spent
        $totalOrders = $customer->orders->count();

        $totalSpent = $customer->orders->sum('total_amount');

        // Get top 5 most purchased products with details
        $topProducts = collect();
        foreach ($customer->orders as $order) {
            foreach ($order->details as $detail) {
                $product = $detail->product;
                if (!$product) continue;

                $existingProduct = $topProducts->where('id', $product->id)->first();
                
                if ($existingProduct) {
                    $existingProduct->quantity += $detail->soluong;
                    $existingProduct->total_spent += $detail->soluong * $detail->dongia;
                } else {
                    $product->quantity = $detail->soluong;
                    $product->total_spent = $detail->soluong * $detail->dongia;
                    $topProducts->push($product);
                }
            }
        }

        $topProducts = $topProducts->sortByDesc('quantity')
            ->take(5)
            ->map(function($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->product_name,
                    'barcode' => $product->barcode,
                    'quantity' => $product->quantity,
                    'total_spent' => $product->total_spent,
                    'image' => $product->image
                ];
            })
            ->values();

        return response()->json([
            'total_orders' => $totalOrders,
            'total_spent' => $totalSpent,
            'top_products' => $topProducts,
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'points' => $customer->diem
            ],
            'customer_info' => $customer
        ]);
    }
}
