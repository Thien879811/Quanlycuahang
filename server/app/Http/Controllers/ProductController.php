<?php

namespace App\Http\Controllers;

use App\Models\Catalory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\HangSuDung;
use App\Http\Requests\ProductRequest;
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
            return response()->json($existingProduct, 400);
        }

        //Handle image upload
        $imageResult = $this->handleImageUpload($request);
        if (!$imageResult['success']) {
            return response()->json($imageResult, 400);
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
            'message' => 'Product created successfully.'
        ], 200);
    }


    private function checkExistingProduct($productData)
    {
        $existingProduct = Product::where('barcode', $productData['barcode'])->first();
        if ($existingProduct) {
            $existingProduct->quantity += $productData['quantity'];
            $existingProduct->save();
            $hsd = HangSuDung::where('product_id', $existingProduct->id)->first();
            if ($hsd && $hsd['hang_su_dung'] == $productData['expiration_date']) {
                $hsd['quantity'] += $productData['quantity'];
                $hsd->save();
                return response()->json([
                    'success' => true,
                    'message' => 'Product created successfully.'
                ], 200);
            }

            HangSuDung::create([
                'product_id' => $existingProduct->id,
                'hang_su_dung' => $productData['expiration_date'],
                'quantity' => $productData['quantity'],
                'status' => 'active'
            ]);

            return response()->json([
                'message' => 'Product already exists.'
            ], 200);
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
            return response()->json(['message' => 'Product not found'], 404);
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
                return response()->json(['message' => $imageResult['message']], 400);
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
            'message' => 'Product updated successfully',
            'data' => $product
        ], 200);
    }
}
