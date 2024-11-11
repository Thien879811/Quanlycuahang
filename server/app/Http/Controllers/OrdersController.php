<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Orders;
use Illuminate\Http\Request;
use App\Models\DetailOrder;
use App\Models\Product;
use App\Models\Promotion;
use Carbon\Carbon;

class OrdersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function getOrders(Request $request)
    {
        $order = Orders::with('details.product')->where('status', '=', 0)->first();
        if(!$order) {
            $order = Orders::create([
                "customer_id" => null,
                "staff_id" => null,
                "status" => 0,
                "pays_id" => null,
            ]);
        }
        $order->load('details.product');
        return response()->json($order);
    }



    
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
                "pays_id" => $validated['pays_id'],
                "voucher_code" => $validated['voucher_code'] ?? null,
                "discount" => $validated['discount'] ?? 0
            ]);
        }
        $order->customer_id = $validated['khachhang'] !== '0' ? $validated['khachhang'] : null;
        $order->voucher_code = $validated['voucher_code'] ?? null;
        $order->discount = $validated['discount'] ?? 0;
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

    public function updateOrder(Request $request, $order_id)
    {
        $validated = $request->validate([
            'status' => 'required',
            'pays_id' => 'nullable',
            'products' => 'nullable',
        ]);
        
        $order = Orders::findOrFail($order_id);
        $oldStatus = $order->status;
        $newStatus = $validated['status'];
        
        // Handle status 3 (cancelled) first
        if ($newStatus == '3') {
            // Only allow cancellation if order was not already cancelled
            if ($oldStatus == '3') {
                return response()->json([
                    'error' => 'Order is already cancelled'
                ], 400);
            }

            $order->status = $newStatus;
            if ($validated['pays_id']) {
                $order->pays_id = $validated['pays_id'];
            }
            $order->save();
            
            // Return inventory quantities
            $details = DetailOrder::where('order_id', $order->id)->get();
            foreach ($details as $item) {
                $product = Product::findOrFail($item->product_id);
                $product->quantity += $item->soluong;
                $product->save();
            }
            return response()->json($details);
        }

        // Handle status 1 or 2 (confirmed/processing)
        if (($newStatus == '1' || $newStatus == '2') && $oldStatus != '1' && $oldStatus != '2') {
            // Check and update inventory
            $details = DetailOrder::where('order_id', $order->id)->get();
            foreach ($details as $item) {
                $product = Product::findOrFail($item->product_id);
                if ($product->quantity < $item->soluong) {
                    return response()->json([
                        'error' => "Not enough quantity for product: {$product->product_name}"
                    ], 400);
                }
                $product->quantity -= $item->soluong;
                $product->save();
            }
            
            $order->status = $newStatus;
            if ($validated['pays_id']) {
                $order->pays_id = $validated['pays_id'];
            }
            $order->save();
            return response()->json($details);
        }

        // Handle other status changes
        $order->status = $newStatus;
        if ($validated['pays_id']) {
            $order->pays_id = $validated['pays_id'];
        }
        $order->save();

        // Update order details if products are provided
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
        }

        $details = DetailOrder::where('order_id', $order->id)->get();
        return response()->json($details);
    }


    public function getOrder($type, Request $request)
    {
        try {
            $query = Orders::with(['details.product', 'pays'])
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
                    if (!$request->has('date')) {
                        return response()->json(['error' => 'Date parameter is required for custom range'], 400);
                    }
                    $date = Carbon::parse($request->date);
                    $query->whereDate('created_at', $date);
                    break;
                default:
                    return response()->json(['error' => 'Invalid time range'], 400);
            }

            $orders = $query->get();
            return response()->json($orders);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function updateVoucher(Request $request, $order_id)
    {
        $validated = $request->validate([
            'voucher_code' => 'nullable|string',
            'discount' => 'nullable|numeric'
        ]);

        $order = Orders::find($order_id);
        $order->voucher_code = $validated['voucher_code'];
        $order->discount = $validated['discount'];
        $order->save();

        return response()->json($order);
    }

    public function cancelOrder($order_id)
    {
        $order = Orders::find($order_id);
        $order->status = -1;
        $order->save();
    }

    public function get($order_id)
    {
        return response()->json(Orders::find($order_id));
    }



    public function updateOrderProducts($order_id, Request $request)
    {
        $validated = $request->all();
        
        $order = Orders::find($order_id);

        if (!$order) {
            $order = Orders::create([
                "customer_id" => $validated['customer_id'] !== '0' ? $validated['customer_id'] : null,
                "staff_id" => $validated['staff_id'],
                "status" => $validated['status'],
                "pays_id" => $validated['pays_id'],
                "voucher_code" => $validated['voucher_code'] ?? null,
                "discount" => $validated['discount'] ?? 0
            ]);
        }

        $order->customer_id = $validated['customer_id'] !== '0' ? $validated['customer_id'] : null;
        $order->staff_id = $validated['staff_id'] ?? null;
        $order->status = $validated['status'] ?? 0;
        $order->pays_id = $validated['pays_id'] ?? null;
        $order->voucher_code = $validated['voucher_code'] ?? null;
        $order->discount = $validated['discount'] ?? 0;
        $order->save();

        if ($validated['details']) {
            // Get existing details
            $existingDetails = DetailOrder::where('order_id', $order->id)->get();
            
            foreach ($validated['details'] as $detail) {
                $product_id = $detail['product_id'];
                
                $existingDetail = DetailOrder::where('order_id', $order->id)
                                    ->where('product_id', $product_id)
                                    ->first();
            
                if ($existingDetail) {
                    if ($detail['soluong'] <= 0) {
                        // If quantity is 0 or negative, delete the detail
                        $existingDetail->delete();
                    } else {
                        $existingDetail->soluong = $detail['soluong'];
                        $existingDetail->discount = $detail['discount'];
                        $existingDetail->save();
                    }
                } else {
                    if ($detail['soluong'] > 0) {
                        DetailOrder::create([
                            'order_id' => $order->id,
                            'product_id' => $product_id,
                            'soluong' => $detail['soluong'],
                            'discount' => $detail['discount'],
                            'dongia' => $detail['dongia'],
                        ]);
                    }
                }
            }

            // Remove details that are no longer in the request
            $newProductIds = collect($validated['details'])->pluck('product_id')->toArray();
            DetailOrder::where('order_id', $order->id)
                      ->whereNotIn('product_id', $newProductIds)
                      ->delete();
        } else {
            DetailOrder::where('order_id', $order->id)->delete();
        }

        return response()->json($order, 201);
    }

}
