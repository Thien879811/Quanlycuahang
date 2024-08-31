<?php

namespace App\Http\Controllers;

use App\Models\Catalory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function getAll()
    {
        $products = Product::all();

        return response()->json($products);
    }

    public function create(Request $request)
    {
        //Validate the request
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,gif|max:2048', // Adjust validation rules as needed
            'barcode' => 'required|string|unique:products,barcode', // Added barcode validation
            'catalogy_id' => 'required|integer', // Adjust according to your requirements
            // Add other validation rules as needed
        ]);

        $productData = $request->only([
            'product_name',
            'barcode',
            'production_date',
            'expiration_date',
            'quantity',
            'selling_price',
            'catalogy_id',
            'image',
            'factory_id',
            'purchase_price',
        ]);

        // Check if the request has a file
        if ($request->hasFile('image')) {
            // Retrieve the uploaded file
            $file = $request->file('image');

            // Generate a unique file name
            $imageName = time() . '.' . $file->getClientOriginalExtension();

            // Move the file to the public/images directory
            $file->move(public_path('images'), $imageName);
            $imageUrl = asset('images/' . $imageName);

            // Add image URL to product data
            $productData['image'] = $imageUrl;
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No image file provided.'
            ], 400); // 400 Bad Request
        }

        // Check if the product with the given barcode already exists
        $existingProduct = Product::where('barcode', $productData['barcode'])->first();
        if ($existingProduct) {
            return response()->json([
                'success' => false,
                'message' => 'Product already exists.'
            ], 400); // 400 Bad Request
        }

        // Create the new product
        $product = Product::create($productData);

        return response()->json([
            'success' => true,
            'product' => $product,
            'message' => 'Product created successfully.'
        ],200);
    }
}
