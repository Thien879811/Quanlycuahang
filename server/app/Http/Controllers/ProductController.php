<?php

namespace App\Http\Controllers;

use App\Models\Catalory;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function create(Request $request)
    {
        // Validate the request
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,gif|max:2048', // Adjust validation rules as needed
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

            // Optionally, you can use Laravel's Storage facade to store the file
            // $path = $file->storeAs('images', $imageName, 'public');

            // Return a success response with the image name
            return response()->json([
                'success' => true,
                'image' => $imageUrl,
                'message' => 'Image uploaded successfully.'
            ]);
        }

        // Return an error response if no file was uploaded
        return response()->json([
            'success' => false,
            'message' => 'No image file provided.'
        ], 400); // 400 Bad Request
    }

//     public function create(Request $request)
// {
//     $request->validate([
//         'image' => 'required|image|mimes:jpeg,png,gif|max:2048',
//     ]);

//     if ($request->hasFile('image')) {
//         $file = $request->file('image');
//         $imageName = time() . '.' . $file->getClientOriginalExtension();

//         // Store the file in the public disk
//         $filePath = $file->storeAs('images', $imageName, 'public');

//         // Return the URL to access the image
//         $imageUrl = asset('/' . $filePath);

//         return response()->json([
//             'image' => $imageUrl
//         ]);
//     }

//     return response()->json([
//         'error' => 'No image file provided.'
//     ], 400);
// }


      // $product = $request ->all();

        // $catalory = $product['catalogy_id'];

        // if(!is_int($catalory)){
        //     $Catalory = new Catalory;
        //     $find = $Catalory->findCatalory($catalory);
        //     if(!$find){
        //         $catalory= Catalory::create([
        //             'catalogy_name' => $catalory               
        //         ]);
        //         $product['catalogy_id'] = $catalory->id;
        //     }else{
        //         $product['catalogy_id'] =  $find->id;
        //     } 
        // }

        // $image=time().'.'.$product->image->extension();
        // $product->image->move(public_path('images'),$image);
    public function getAll(Request $request){
        $products = Product::all();
    }
}
