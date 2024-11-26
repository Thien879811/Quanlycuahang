<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Orders;
use Illuminate\Http\Request;
use App\Models\DetailOrder;
use App\Models\Product;
use App\Models\Promotion;
use Carbon\Carbon;
use App\Events\NewNotification;
use Illuminate\Support\Facades\DB;

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
                "customer_id" => isset($validated['customer_id']) && $validated['customer_id'] !== '0' ? $validated['customer_id'] : null,
                "staff_id" => $validated['staff_id'] ?? null,
                "status" => "0",
                "pays_id" => $validated['pays_id'] ?? null,
                "voucher_code" => $validated['voucher_code'] ?? null,
                "discount" => $validated['discount'] ?? 0
            ]);
        }
        $order->customer_id = isset($validated['customer_id']) && $validated['customer_id'] !== '0' ? $validated['customer_id'] : null;
        $order->voucher_code = $validated['voucher_code'] ?? null;
        $order->discount = $validated['discount'] ?? 0;
        $order->staff_id = $validated['staff_id'] ?? null;
        $order->pays_id = $validated['pays_id'] ?? null;
        $order->save();

        if (isset($validated['details']) && is_array($validated['details'])) {
            foreach ($validated['details'] as $detailData) {
                if (!isset($detailData['product_id'])) {
                    continue;
                }
                
                $product_id = $detailData['product_id'];
                
                $existingDetail = DetailOrder::where('order_id', $order->id)
                                    ->where('product_id', $product_id)
                                    ->first();
            
                if ($existingDetail) {
                    $existingDetail->soluong = $detailData['soluong'] ?? 0;
                    $existingDetail->discount = $detailData['discount'] ?? 0;
                    $existingDetail->dongia = $detailData['dongia'] ?? 0;
                    $existingDetail->save();
                } else {
                    DetailOrder::create([
                        'order_id' => $order->id,
                        'product_id' => $product_id,
                        'soluong' => $detailData['soluong'] ?? 0,
                        'discount' => $detailData['discount'] ?? 0,
                        'dongia' => $detailData['dongia'] ?? 0,
                    ]);
                }
            }
        } else {
            DetailOrder::where('order_id', $order->id)->delete();
        }
        return response()->json($order, 201);
    }

    public function update(Request $request, $order_id)
    {
        $validated = $request->all();
        $order = Orders::find($order_id);
        
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $order->customer_id = $validated['customer_id'] ?? null;
        $order->staff_id = $validated['staff_id'] ?? 1;
        $order->pays_id = $validated['pays_id'] ?? null;
        $order->voucher_code = $validated['voucher_code'] ?? null;
        $order->discount = $validated['discount'] ?? 0;
        $order->status = $validated['status'] ?? 0;
        $order->save();

        // Get existing order details
        $existingDetails = DetailOrder::where('order_id', $order->id)->get();
        
        // Track processed product IDs
        $processedProductIds = [];

        if (isset($validated['details'])) {
            foreach ($validated['details'] as $detail) {
                $product_id = $detail['product_id'];
                $processedProductIds[] = $product_id;
                
                $orderDetail = DetailOrder::where('order_id', $order->id)
                                        ->where('product_id', $product_id)
                                        ->first();

                if ($detail['soluong'] <= 0) {
                    // Delete if quantity is 0 or less
                    if ($orderDetail) {
                        $orderDetail->delete();
                    }
                    continue;
                }

                if (!$orderDetail) {
                    // Create new detail if not found
                    DetailOrder::create([
                        'order_id' => $order->id,
                        'product_id' => $product_id,
                        'soluong' => $detail['soluong'],
                        'discount' => $detail['discount'] ?? 0,
                        'dongia' => $detail['dongia']
                    ]);
                } else {
                    $orderDetail->soluong = $detail['soluong']; 
                    $orderDetail->discount = $detail['discount'] ?? 0;
                    $orderDetail->dongia = $detail['dongia'];
                    $orderDetail->save();
                }

                // Subtract product quantity if status is 1 or 2
                if ($order->status == '1' || $order->status == '2') {
                    $product = Product::find($product_id);
                    if (!$product) {
                        return response()->json(['error' => 'Product not found'], 404);
                    }
                    $product->quantity -= $detail['soluong'];
                    $product->save();
                }
            }

            // Delete details that weren't in the request
            foreach ($existingDetails as $existingDetail) {
                if (!in_array($existingDetail->product_id, $processedProductIds)) {
                    $existingDetail->delete();
                }
            }
        } else {
            // If no details provided, delete all existing details
            foreach ($existingDetails as $existingDetail) {
                $existingDetail->delete();
            }
        }
        if ($order->voucher_code) {
            Promotion::where('code', $order->voucher_code)
                    ->where('quantity', '>', 0)
                    ->update(['quantity' => DB::raw('quantity - 1')]);
        }
        return response()->json($order, 200);
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
            $query = Orders::with(['details.product', 'pays', 'customer'])
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
                case 'customMonth':
                    if (!$request->has('date')) {
                        return response()->json(['error' => 'Date parameter is required for custom month'], 400);
                    }
                    $date = Carbon::parse($request->date);
                    $query->whereYear('created_at', $date->year)
                          ->whereMonth('created_at', $date->month);
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
        $order->voucher_code = $validated['voucher_code'] ?? null;
        $order->discount = $validated['discount'] ?? 0;
        $order->save();

        Promotion::where('voucher_code', $validated['voucher_code'])->update(['quantity' => DB::raw('quantity - 1')]);

        return response()->json($order);
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
        $order->staff_id = $validated['staff_id'] ?? 1;
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

                        // Update product quantity if order status is 1, 2 or 3
                        if ($order->status == 1 || $order->status == 2) {
                            $product = Product::find($product_id);
                            if ($product) {
                                $product->quantity -= $detail['soluong'];
                                $product->save();
                            }
                        } else if ($order->status == 3) {
                            $product = Product::find($product_id);
                            if ($product) {
                                $product->quantity += $detail['soluong'];
                                $product->save();
                            }
                        }
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

                        // Update product quantity if order status is 1, 2 or 3
                        if ($order->status == 1 || $order->status == 2) {
                            $product = Product::find($product_id);
                            if ($product) {
                                $product->quantity -= $detail['soluong'];
                                $product->save();
                            }
                        } else if ($order->status == 3) {
                            $product = Product::find($product_id);
                            if ($product) {
                                $product->quantity += $detail['soluong'];
                                $product->save();
                            }
                        }
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

    public function deleteOrderProducts($order_id, $product_id)
    {
        DetailOrder::where('order_id', $order_id)->where('product_id', $product_id)->delete();
        return response()->json(['message' => 'Sản phẩm đã được xóa thành công']);
    }

    public function addDiscount($order_id, Request $request)
    {
        $validated = $request->all();
        $order = Orders::find($order_id);
        foreach ($validated['details'] as $detail) {
            $product_id = $detail['product_id'];
            $detail = DetailOrder::where('order_id', $order->id)->where('product_id', $product_id)->first();
            $detail->discount = $validated['discount'];
            $detail->save();
        }
        return response()->json($order);
    }


    //Hủy đơn hàng
    // Phương thức xử lý yêu cầu hủy đơn hàng
    public function cancelOrder($order_id, Request $request)
    {
        $validated = $request->all();
        // Tìm đơn hàng theo ID
        $order = Orders::find($order_id);
        if (!$order) {
            // Trả về lỗi 404 nếu không tìm thấy đơn hàng
            return response()->json(['message' => 'Order not found'], 404);
        }
        $order->previous_status = $order->status;
        $order->status = -1;
        $order->note = $validated['note'];
        $order->save();
        return response()->json($order);
    }

    public function cancelRequest($order_id)
    {
        $order = Orders::find($order_id);
        $order->status = $order->previous_status ?? 1;
        $order->save();
        return response()->json($order);
    }

    public function acceptCancel($order_id)
    {
        $order = Orders::find($order_id);
        $order->status = 3;
        $order->save();
        $orderDetails = DetailOrder::where('order_id', $order_id)->get();
        foreach ($orderDetails as $detail) {
            $product = Product::find($detail->product_id);
            if ($product) {
                $product->quantity += $detail->soluong;
                $product->save();
            }
        }
    }
    public function getOrdersByCustomerId($id, $date)
    {
        $orders = Orders::with(['details.product', 'pays'])
            ->where('customer_id', $id)
            ->whereDate('created_at', $date)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'total' => $order->details->sum(function($detail) {
                        return $detail->dongia * $detail->soluong - $detail->discount;
                    }),
                    'created_at' => $order->created_at,
                    'status' => $order->status,
                    'pay' => $order->pays->tt_hinhthuc,
                    'voucher' => $order->voucher_code,
                    'discount' => $order->discount,
                    'items' => $order->details->map(function($detail) {
                        return [
                            'product_name' => $detail->product->product_name,
                            'quantity' => $detail->soluong,
                            'price' => $detail->dongia,
                            'discount' => $detail->discount
                        ];
                    })
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }
    public function createOrderCustomer(Request $request)
    {

        $validated = $request->all();
        $order = new Orders();
        $order->customer_id = $validated['customer_id'];
        $order->status = $validated['status'];
        $order->pays_id = 2;
        $order->voucher_code = $validated['voucher_code'] ?? null;
        $order->discount = $validated['discount'] ?? 0;
        $order->save();

        foreach ($validated['products'] as $product) {
            $detail = new DetailOrder();
            $detail->order_id = $order->id;
            $detail->product_id = $product['product_id'];
            $detail->soluong = $product['soluong'];
            $detail->dongia = $product['dongia'];
            $detail->discount = $product['discount'];
            $detail->save();

            $productModel = Product::find($product['product_id']);
            if ($productModel) {
                $productModel->quantity -= $product['soluong'];
                $productModel->save();
            }
        }

        $customer = Customer::find($validated['customer_id']);
        $customer->diem += $order->details->sum(function($detail) {
            return $detail->dongia * $detail->soluong;
        }) / 1000;
        $customer->save();

        if ($order->voucher_code) {
            Promotion::where('code', $order->voucher_code)->update(['quantity' => DB::raw('quantity - 1')]);
        }

        broadcast(new NewNotification([
            'id' => $order->id,
            'message' => 'Đã có đơn hàng online vui lòng kiểm tra',
            'created_at' => $order->created_at,
            'total' => $order->details->sum(function($detail) {
                return $detail->dongia * $detail->soluong - $detail->discount;
            }),
            'items' => $order->details->map(function($detail) {
                return [
                    'product_name' => $detail->product->product_name,
                    'quantity' => $detail->soluong,
                    'price' => $detail->dongia,
                    'discount' => $detail->discount
                ];
            })
        ]));

        return response()->json([
            'status' => 'success',
            'data' => $order
        ]);
    }
}


