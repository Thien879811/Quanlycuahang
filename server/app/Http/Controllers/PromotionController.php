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
                $existingPromotion = Promotion::where('product_id', $value)
                    ->where(function ($query) use ($promotion) {
                        $query->where(function ($q) use ($promotion) {
                            $q->where('start_date', '<=', $promotion['start_date'])
                              ->where('end_date', '>=', $promotion['start_date']);
                        })->orWhere(function ($q) use ($promotion) {
                            $q->where('start_date', '<=', $promotion['end_date'])
                              ->where('end_date', '>=', $promotion['end_date']);
                        });
                    })
                    ->first();

                if ($existingPromotion) {
                    return response()->json(['error' => 'Sản phẩm đã có chương trình khuyến mãi trong thời gian này']);
                }

                $promotion = Promotion::create([
                    'catalory' => $promotion['catalory'],
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
        } else {
            $promotion = Promotion::create([
                'catalory' => $promotion['catalory'],
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

    public function delete($id)
    {
        $promotion = Promotion::find($id);
        $promotion->delete();
        return response()->json($promotion);
    }

    public function update(Request $request, $id)
    {
        $promotion = Promotion::find($id);
        $promotion->update($request->all());
        return response()->json($promotion);
    }
}



