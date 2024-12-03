<?php

namespace App\Http\Controllers;

use App\Models\Catalory;
use App\Models\Factory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\HangSuDung;
use App\Http\Requests\ProductRequest;
use App\Models\DestroyProduct;
use Carbon\Carbon;

class ProductController extends Controller
{
    public function getProduct()
    {
        $products = Product::with(['catalory', 'promotion' => function($query) {
            $query->where('end_date', '>', now());
        }])->get();


        $products = $products->map(function ($product) {
            if ($product->promotion->isNotEmpty() && $product->promotion[0]->present) {
                $presentProduct = Product::find($product->promotion[0]->present);
                if ($presentProduct) {
                    $product->promotion[0]->present = [
                        'id' => $presentProduct->id,
                        'product_name' => $presentProduct->product_name,
                        'image' => $presentProduct->image,
                        'selling_price' => $presentProduct->selling_price
                    ];
                }
            }
            return $product;
        });

        return response()->json($products);
    }

    public function getAll()   
    {
        $products = Product::all();
        return response()->json($products);
    }

    public function create(ProductRequest $request)
    {
        //Validate the request
        $productData = $request->validated();
        
        // Check if the product with the given barcode already exists
        $existingProduct = $this->checkExistingProduct($productData);

        if ($existingProduct) {
            return $existingProduct; // Return the response from checkExistingProduct
        }

        //Handle image upload
        $imageResult = $this->handleImageUpload($request);
        if (!$imageResult['success']) {
            return response()->json([
                'success' => false,
                'message' => $imageResult['message']
            ]);
        }

        $productData['image'] = $imageResult['imageUrl'];

        // Create the new product
        $product = Product::create([
            ...$productData,
            'quantity' => $productData['quantity'] ?? 0
        ]);
        return response()->json([
            'success' => true,
            'product' => $product,
            'message' => 'Sản phẩm đã tạo thành công.'
        ]);
    }

    private function checkExistingProduct($productData)
    {
        $existingProduct = Product::where('barcode', $productData['barcode'])->first();
        if ($existingProduct) {
            $existingProduct->quantity += isset($productData['quantity']) ? $productData['quantity'] : 0;
            $existingProduct->save();
            return response()->json([
                'success' => false,
                'message' => 'Đã tồn tại sản phẩm với mã vạch này'
            ]);
        }

        return false;
    }

    private function handleImageUpload(Request $request)
    {
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imageName = time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images'), $imageName);
            $imageUrl = '/images/' . $imageName;

            return [
                'success' => true,
                'imageUrl' => $imageUrl
            ];
        }

        return [
            'success' => false,
            'message' => 'No image file provided.'
        ];
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm không tồn tại'
            ]);
        }

        $data = $request->all();

        if ($request->hasFile('image')) {
            $imageResult = $this->handleImageUpload($request);
            if ($imageResult['success']) {
                // Delete old image if exists
                if ($product->image) {
                    $oldImagePath = public_path(str_replace(url('/'), '', $product->image));
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }
                $data['image'] = $imageResult['imageUrl'];
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $imageResult['message']
                ]);
            }
        }

        $product->update([
            ...$data,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sản phẩm đã cập nhật thành công',
            'data' => $product
        ]);
    }

    public function getAllDestroyProduct($type = null, Request $request)
    {
        try {
            $query = DestroyProduct::with('product')
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
                    $date = Carbon::parse($request->input('date'));
                    if (!$date) {
                        return response()->json(['error' => 'Date is required for custom type'], 400);
                    }
                    $query->whereDate('created_at', $date);
                    break;
                case 'custom_month':
                    $date = Carbon::parse($request->input('date'));
                    if (!$date) {
                        return response()->json(['error' => 'Date is required for custom month type'], 400);
                    }
                    $query->whereYear('created_at', $date->year)
                          ->whereMonth('created_at', $date->month);
                    break;
            }

            $destroyProducts = $query->get();
            return response()->json([
                'success' => true,
                'data' => $destroyProducts
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function createDestroyProduct(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:1',
            'destroy_date' => 'required|date',
            'note' => 'required|string',
            'status' => 'required|string',
            'expiration_date' => 'nullable|date'
        ]);
        

        try {
            DB::beginTransaction();

            $destroyProduct = DestroyProduct::create([
                'product_id' => $data['product_id'],
                'quantity' => $data['quantity'],
                'destroy_date' => $data['destroy_date'],
                'note' => $data['note'],
                'image' => $data['image'] ?? null,
                'status' => 'pending',
                'expiration_date' => $data['expiration_date'] ?? null
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Đã tạo phiếu hủy sản phẩm thành công',
                'data' => $destroyProduct
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi tạo phiếu hủy sản phẩm',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function delete($id)
    {
        $product = Product::find($id);
        $product->delete();
        return response()->json(['success' => true, 'message' => 'Sản phẩm đã xóa thành công']);
    }

    public function getDestroyProduct($type, Request $request)
    {
        $query = DestroyProduct::with('product');

        switch ($type) {
            case 'today':
                $query->whereDate('created_at', Carbon::today());
                break;
            case 'week':
                $query->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
                break;
            case 'month':
                $query->whereMonth('created_at', Carbon::now()->month)
                      ->whereYear('created_at', Carbon::now()->year);
                break;
            case 'custom':
                if (!$request->has('date')) {
                    return response()->json(['error' => 'Date is required for custom type'], 400);
                }
                $date = $request->input('date');
                if (!is_string($date)) {
                    return response()->json(['error' => 'Date must be a string'], 400);
                }
                try {
                    $parsedDate = Carbon::parse($date);
                    $query->whereDate('created_at', $parsedDate);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Invalid date format'], 400);
                }
                break;
            case 'custom_month':
                if (!$request->has('date')) {
                    return response()->json(['error' => 'Date is required for custom month type'], 400);
                }
                $date = $request->input('date');
                if (!is_string($date)) {
                    return response()->json(['error' => 'Date must be a string'], 400);
                }
                try {
                    $parsedDate = Carbon::parse($date);
                    $query->whereMonth('created_at', $parsedDate->month)
                          ->whereYear('created_at', $parsedDate->year);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Invalid date format'], 400);
                }
                break;
        }

        $destroyProducts = $query->get();

        return response()->json([
            'success' => true,
            'data' => $destroyProducts
        ]);
    }

    public function updateDestroyProductStatus(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $destroyProduct = DestroyProduct::findOrFail($id);
            $data = $request->validate([
                'status' => 'required|in:approved,rejected',
                'note' => 'nullable|string' // Changed to nullable
            ]);

            if ($data['status'] === 'approved') {
                // Get the product
                $product = Product::findOrFail($destroyProduct->product_id);
                
                // Update product quantity
                $product->quantity -= $destroyProduct->quantity;
                $product->save();

                // If there's an expiration date, update HangSuDung
                if ($destroyProduct->expiration_date) {
                    $hangSuDung = HangSuDung::where('product_id', $destroyProduct->product_id)
                                          ->where('hang_su_dung', $destroyProduct->expiration_date)
                                          ->first();
                    if ($hangSuDung) {
                        $hangSuDung->quantity -= $destroyProduct->quantity;
                        $hangSuDung->save();
                    }
                }
            }

            // Update destroy product status
            $destroyProduct->status = $data['status'];
            $destroyProduct->note = $data['note'] ?? null; // Use null if note is not provided
            $destroyProduct->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Đã cập nhật trạng thái phiếu hủy thành công',
                'data' => $destroyProduct
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi cập nhật trạng thái phiếu hủy',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function get(){
        $product = Product::all();
        return response()->json($product);
    } 

    public function getInfoInventory(){
        $product = Product::all();
        $catalog = Catalory::all();
        $factory = Factory::all();
        return response()->json([
            'product' => $product,
            'catalog' => $catalog,
            'factory' => $factory
        ]);
    }
}
 