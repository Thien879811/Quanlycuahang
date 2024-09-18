<?php

namespace App\Http\Controllers;

use App\Models\HangSuDung;
use App\Models\Product;
use Illuminate\Http\Request;

class HangSuDungController extends Controller
{
    public function hello(Request $request){
        return response()->json([
            "hello"=>"hello"
    ]);
    }
    public function getAll()
    {
        $hang_su_dung = HangSuDung::all();
        return response()->json($hang_su_dung);
    }

    public function create($product_id, $hang_su_dung, $quantity, $status)
    {
        $hang_su_dung = HangSuDung::create([
            'product_id' => $product_id, 
            'hang_su_dung' => $hang_su_dung,
            'quantity' => $quantity,
            'status' => $status,
        ]);

        return response()->json($hang_su_dung);
    }

    public function update($id, $hang_su_dung, $quantity, $status)
    {
        $hang_su_dung = HangSuDung::find($id);
        $hang_su_dung->update([
            'hang_su_dung' => $hang_su_dung,
            'quantity' => $quantity,
            'status' => $status,
        ]);
    }
    
    public function find($id)
    {
        $hang_su_dung = HangSuDung::find($id);
        return response()->json($hang_su_dung);
    }

    public function get(){
        $hang_su_dung = HangSuDung::with('product')->get();
        return response()->json($hang_su_dung);
    }
}
