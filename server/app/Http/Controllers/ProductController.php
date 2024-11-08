<?php

namespace App\Http\Controllers;

use App\Models\Catalory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\HangSuDung;
use App\Http\Requests\ProductRequest;
use App\Models\CheckInventory;
use App\Models\CheckInventoryDetail;
use App\Models\DestroyProduct;

class ProductController extends Controller
{
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
        $product = Product::create($productData);

        HangSuDung::create([
            'product_id' => $product->id,
            'hang_su_dung' => $productData['expiration_date'],
            'quantity' => $productData['quantity'],
            'status' => 'active'
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
            $existingProduct->quantity += $productData['quantity'];
            $existingProduct->save();
            
            $hsd = HangSuDung::where('product_id', $existingProduct->id)
                            ->where('hang_su_dung', $productData['expiration_date'])
                            ->first();
                            
            if ($hsd) {
                $hsd->quantity += $productData['quantity'];
                $hsd->save();
                return response()->json([
                    'success' => true,
                    'message' => 'Sản phẩm đã được cập nhật số lượng.'
                ]);
            }

            HangSuDung::create([
                'product_id' => $existingProduct->id,
                'hang_su_dung' => $productData['expiration_date'],
                'quantity' => $productData['quantity'],
                'status' => 'active'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Sản phẩm đã được thêm hạn sử dụng mới.'
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
            $imageUrl = asset('images/' . $imageName);

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

        $product->update($data);

        // Update HangSuDung if expiration_date is provided
        if (isset($data['expiration_date'])) {
            $hangSuDung = HangSuDung::where('product_id', $product->id)
                                    ->where('hang_su_dung', $data['expiration_date'])
                                    ->first();

            if ($hangSuDung) {
                $hangSuDung->quantity = $data['quantity'] ?? $hangSuDung->quantity;
                $hangSuDung->save();
            } else {
                HangSuDung::create([
                    'product_id' => $product->id,
                    'hang_su_dung' => $data['expiration_date'],
                    'quantity' => $data['quantity'] ?? 0,
                    'status' => 'active'
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Sản phẩm đã cập nhật thành công',
            'data' => $product
        ]);
    }

    public function getAllDestroyProduct()
    {
        $destroyProducts = DestroyProduct::with('product')->get();
        return response()->json($destroyProducts);
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
        
        if ($request->hasFile('image')) {
            $imageResult = $this->handleImageUpload($request);
            if ($imageResult['success']) {
                $data['image'] = $imageResult['imageUrl'];
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $imageResult['message']
                ]);
            }
        }

        try {
            DB::beginTransaction();

            $product = Product::findOrFail($data['product_id']);
            if ($product->quantity < $data['quantity']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Số lượng hủy vượt quá số lượng tồn kho'
                ], 400);
            }

            $destroyProduct = DestroyProduct::create([
                'product_id' => $data['product_id'],
                'quantity' => $data['quantity'],
                'destroy_date' => $data['destroy_date'],
                'note' => $data['note'],
                'image' => $data['image'] ?? null,
                'status' => $data['status'],
                'expiration_date' => $data['expiration_date'] ?? null
            ]);

            // Update product quantity
            $product->quantity -= $data['quantity'];
            $product->save();

            // If expiration date is provided, update HangSuDung
            if ($data['expiration_date']) {
                $hangSuDung = HangSuDung::where('product_id', $data['product_id'])
                    ->where('hang_su_dung', $data['expiration_date'])
                    ->first();

                if ($hangSuDung) {
                    if ($hangSuDung->quantity < $data['quantity']) {
                        DB::rollBack();
                        return response()->json([
                            'success' => false,
                            'message' => 'Số lượng hủy vượt quá số lượng trong lô hàng'
                        ], 400);
                    }
                    
                    $hangSuDung->quantity -= $data['quantity'];
                    $hangSuDung->save();
                }
            }

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
}
