<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Promotion;
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

    public function getAll(Request $request){
        $query = Customer::query();
        
        if ($request->has('date')) {
            $date = $request->date;
            $query->where(function($q) use ($date) {
                $q->whereDate('created_at', $date)
                  ->orWhereHas('orders', function($q) use ($date) {
                      $q->whereDate('created_at', $date);
                  });
            });
        }
        
        if ($request->has('month')) {
            $month = $request->month;
            $query->where(function($q) use ($month) {
                $q->whereMonth('created_at', $month)
                  ->orWhereHas('orders', function($q) use ($month) {
                      $q->whereMonth('created_at', $month);
                  });
            });
        }

        $customers = $query->get();
        return response()->json($customers);
    }

    public function getInfoBuy($id){
        $customer = Customer::with(['orders.details.product'])->find($id);

        if (!$customer) {
            return response()->json(['error' => 'Không tìm thấy khách hàng'], 404);
        }

        // Get orders from last month only
        $lastMonth = now()->subMonth();
        $orders = $customer->orders->filter(function($order) use ($lastMonth) {
            return $order->created_at >= $lastMonth;
        });

        // Get total number of orders and total spent for last month
        $totalOrders = $orders->count();
        $totalSpent = $orders->sum('total_amount');

        // Get top 5 most purchased products with details from last month
        $topProducts = collect();
        foreach ($orders as $order) {
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

    public function changePassword(Request $request){
        $validated = $request->validate([
            'customer_id' => 'required',
            'old_password' => 'required',
            'new_password' => 'required',
        ]);

        $customer = Customer::find($validated['customer_id']);
        if (!$customer) {
            return response()->json(['error' => 'Không tìm thấy khách hàng'], 404);
        }

        if (!Hash::check($validated['old_password'], $customer->password)) {
            return response()->json(['error' => 'Mật khẩu hiện tại không đúng'], 400);
        }

        $customer->password = Hash::make($validated['new_password']);
        $customer->save();

        return response()->json(['message' => 'Đổi mật khẩu thành công']);
    }

    public function getInfo($id){
        $customer = Customer::find($id);
        return response()->json($customer);
    }

    public function getHistoryRedeemPoint($id){
        $promotions = Promotion::where('customer_id', $id)->get();
        return response()->json($promotions);
    }
}
