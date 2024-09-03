<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use Illuminate\Http\Request;
use App\Models\DetailOrder;

class OrdersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
{
    $validated = $request->all();

    // return response()->json($validated, 201);

    // Check for an existing unpaid order
    $order = Orders::where("status", "0")->first();

    if (!$order) {
        // Create a new order if none exist
        $order = Orders::create(
           [
            "customer_id" => $validated['khachhang'] !== '0' ? $validated['khachhang'] : 0,
            "satff_id" => $validated['nhanvien'],
            "status" => "0",
            "tongcong"=>$validated['tonghoadon'],
            "pays_id" =>$validated['pays_id']
           ]
        );
    }

    $order->tongcong = $validated['tonghoadon'];
    $order->customer_id = $validated['khachhang'] !== '0' ? $validated['khachhang'] : 0;
    $order->save();

    if($validated['products']){

    // Handle product details
        foreach ($validated['products'] as $product) {
            $product_id = $product['product_id']; // Hoặc $product->product_id nếu là đối tượng
            
            // Check if the detail exists
            $detail = DetailOrder::where('order_id', $order->id)
                                ->where('product_id', $product_id)
                                ->first();
        
            if ($detail) {
                // Update the quantity if the detail already exists
                $detail->soluong = $product['quantity']; // Adjust as needed for your logic
                $detail->save();
            } else {
                // Create new detail if it does not exist
                DetailOrder::create([
                    'order_id' => $order->id,
                    'product_id' => $product_id,
                    'soluong' => $product['quantity'], // Default quantity or adjust as needed
                    // Add other fields if needed
                    'dongia' => $product['price'],
                ]);
            }
        }
    }
    else{
        $detail = DetailOrder::where('order_id', $order->id)->delete();
    }

    return response()->json($order, 201);
}


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        return response()->json( $validated);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Orders  $orders
     * @return \Illuminate\Http\Response
     */
    public function show(Orders $orders)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Orders  $orders
     * @return \Illuminate\Http\Response
     */
    public function edit(Orders $orders)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Orders  $orders
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Orders $orders)
    {
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Orders  $orders
     * @return \Illuminate\Http\Response
     */
    public function destroy(Orders $orders)
    {
        //
    }

    public function getOne(){
        return response()->json([
            'message'=>'thanhcong'
        ]);
    }

    public function updateOrder(Request $request, $order_id){
        $validated = $request->validate([
            'status' => 'required',
            'pays_id' => 'required'
        ]);
        
        $order = Orders::find($order_id);
        $order->status = $validated['status'];
        $order->pays_id = $validated['pays_id'];
        $order->save();

        return response()->json($order);
    }
}
