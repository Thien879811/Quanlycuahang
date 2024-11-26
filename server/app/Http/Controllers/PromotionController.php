<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Customer;

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
                    'max_value' => $promotionData['max_value'] ?? null,
                    'min_value' => $promotionData['min_value'] ?? null,
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
                'max_value' => $promotionData['max_value'] ?? null,
                'min_value' => $promotionData['min_value'] ?? null,
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

    public function getPromotionsCustomer()
    {
        $promotions = Promotion::with('product')
            ->whereNull('customer_id')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->get();
        return response()->json($promotions);
    }

    public function createRedeemPoint(Request $request)
    {
        $voucher = $request->input('voucher');
        $customerId = $request->input('customer_id');

        // Tìm khách hàng và kiểm tra điểm
        $customer = Customer::find($customerId);
        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy khách hàng'
            ], 404);
        }

        if ($customer->diem < $voucher['points']) {
            return response()->json([
                'success' => false, 
                'message' => 'Không đủ điểm để đổi voucher'
            ], 400);
        }

        $promotion = new Promotion();
        $promotion->name = 'Voucher giảm giá ' . $voucher['discount'];
        $promotion->catalory = '2'; // Voucher đổi điểm
        
        // Tạo mã voucher ngẫu nhiên gồm chữ và số
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $code = '';
        for ($i = 0; $i < 8; $i++) {
            $code .= $characters[rand(0, strlen($characters) - 1)];
        }
        $promotion->code = $code;
        
        $promotion->discount_percentage = (float) str_replace('%', '', $voucher['discount']);
        $promotion->max_value = str_replace('.000đ', '', $voucher['max_value']);
        $promotion->min_value = str_replace('.000đ', '', $voucher['minSpend']);
        $promotion->start_date = now();
        $promotion->customer_id = $customerId;
        $promotion->quantity = 1;
        $promotion->end_date = now()->addDays(30);
        $promotion->save();

        // Cập nhật điểm khách hàng
        $customer->diem = $customer->diem - $voucher['points'];
        $customer->save();

        return response()->json([
            'success' => true,
            'message' => 'Đổi điểm thành công',
            'data' => [
                'promotion' => $promotion,
                'customer' => $customer
            ]
        ]);
    }
    public function getPromotionByCustomerId($customerId)
    {
        $promotions = Promotion::where('customer_id', $customerId)
                              ->where('quantity', '>', 0)
                              ->where('end_date', '>=', now())
                              ->get();

        if ($promotions->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy voucher nào'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $promotions
        ]);
    }

    public function getPromotionCode()
    {
        $promotions = Promotion::whereNotNull('code')
                              ->where('end_date', '>=', now())
                              ->where('quantity', '>', 0)
                              ->get();
        return response()->json([
            'success' => true,
            'data' => $promotions
        ]);
    }

}



