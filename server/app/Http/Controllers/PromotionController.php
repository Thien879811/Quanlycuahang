<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;
use App\Models\Product;

class PromotionController extends Controller
{
    public function getPromotion()
    {
        $promotions = Promotion::with('product')->get();
        return response()->json($promotions);
    }

    public function create(Request $request)
    {
        $promotionData = $request->all();

        if (!empty($promotionData['product_id'])) {
            $createdPromotions = [];
            
            foreach ($promotionData['product_id'] as $productId) {
                $existingPromotion = Promotion::where('product_id', $productId)
                    ->where(function ($query) use ($promotionData) {
                        $query->where(function ($q) use ($promotionData) {
                            $q->where('start_date', '<=', $promotionData['start_date'])
                              ->where('end_date', '>=', $promotionData['start_date']);
                        })->orWhere(function ($q) use ($promotionData) {
                            $q->where('start_date', '<=', $promotionData['end_date'])
                              ->where('end_date', '>=', $promotionData['end_date']);
                        });
                    })
                    ->first();

                if ($existingPromotion) {
                    return response()->json([
                        'success' => false,
                        'error' => 'Sản phẩm đã có chương trình khuyến mãi trong thời gian này',
                    ], 200);
                }

                $promotion = Promotion::create([
                    'catalory' => $promotionData['catalory'],
                    'name' => $promotionData['name'],
                    'code' => $promotionData['code'] ?? null,
                    'discount_percentage' => $promotionData['discount_percentage'],
                    'product_id' => $productId,
                    'present' => $promotionData['present'] ?? null,
                    'description' => $promotionData['description'] ?? null,
                    'quantity' => $promotionData['quantity'] ?? null,
                    'start_date' => $promotionData['start_date'] ?? null,
                    'end_date' => $promotionData['end_date'] ?? null,
                ]);

                $createdPromotions[] = $promotion;
            }

            return response()->json([
                'success' => true,
                'promotions' => $createdPromotions
            ]);
        } else {
            $promotion = Promotion::create([
                'catalory' => $promotionData['catalory'],
                'name' => $promotionData['name'],
                'code' => $promotionData['code'] ?? null,
                'discount_percentage' => $promotionData['discount_percentage'],
                'present' => $promotionData['present'] ?? null,
                'product_id' => null,
                'description' => $promotionData['description'] ?? null,
                'quantity' => $promotionData['quantity'] ?? null,
                'start_date' => $promotionData['start_date'] ?? null,
                'end_date' => $promotionData['end_date'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'promotion' => $promotion
            ]);
        }
    }

    public function delete($id)
    {
        $promotion = Promotion::find($id);
        $promotion->delete();
        return response()->json(['success' => true, $promotion]);
    }

    public function update(Request $request, $id)
    {
        $promotion = Promotion::find($id);
        $promotion->update($request->all());
        return response()->json($promotion);
    }


    public function Promotion(Request $request)
    {
        $promotions = Promotion::with('product')->where('start_date', '<=', now())->where('end_date', '>=', now())->get();
        foreach ($promotions as $promotion) {
            if($promotion->present){
                $promotion->present = [
                    'product_id' => $promotion->present,
                    'product_name' => Product::find($promotion->present)->product_name,
                    'product_image' => Product::find($promotion->present)->image,
                    'product_price' => Product::find($promotion->present)->selling_price,
                ];
            }
        }
        return response()->json($promotions);
    }

    public function updateQuantity($id)
    {
        $promotion = Promotion::find($id);
        $promotion->quantity = $promotion->quantity - 1;
        $promotion->save();
        return response()->json($promotion);
    }
}



