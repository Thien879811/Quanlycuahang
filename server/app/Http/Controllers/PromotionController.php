<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function getPromotion()
    {
        $promotions = Promotion::all();
        return response()->json($promotions);
    }

    public function create(Request $request)
    {

        $promotion = $request->all();


        if ($promotion['product_id']) {     
            foreach ($promotion['product_id'] as $key => $value) {
                $promotion = Promotion::create([
                    'name' => $promotion['name'],
                    'code' => $promotion['code'],
                    'discount_percentage' => $promotion['discount_percentage'],
                    'product_id' => $value,
                    'present' => $promotion['present'],
                    'description' => $promotion['description'],
                    'quantity' => $promotion['quantity'],
                    'start_date' => $promotion['start_date'],
                    'end_date' => $promotion['end_date'],
                ]);
            }
            return response()->json($promotion);
        }else{
            $promotion = Promotion::create([
                'name' => $promotion['name'],
                'code' => $promotion['code'],
                'discount_percentage' => $promotion['discount_percentage'],
                'present' => $promotion['present'],
                'product_id' => null,
                'description' => $promotion['description'],
                'quantity' => $promotion['quantity'],
                'start_date' => $promotion['start_date'],
                'end_date' => $promotion['end_date'],
            ]);
        }
        return response()->json($promotion);
    }
}



