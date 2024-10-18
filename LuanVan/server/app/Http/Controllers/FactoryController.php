<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Factory;

class FactoryController extends Controller
{
    public function getAll(){
        $factory = Factory::with('products')->get();
        return response()->json($factory);
    }

    public function getById($id){
        $factory = Factory::find($id);
        return response()->json($factory);
    }

    public function create(Request $request){
        $factory = Factory::create([
            'factory_name' => $request->factory_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
        ]);
        return response()->json(['success' => true, 'message' => 'Thêm nhà cung cấp thành công']);
    }

    public function update($id, Request $request){
        $factory = Factory::find($id);
        $factory->update([
            'factory_name' => $request->factory_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
        ]);
        return response()->json(['success' => true, 'message' => 'Cập nhật nhà cung cấp thành công']);
    }
}
