<?php

namespace App\Http\Controllers;

use App\Events\NewNotification;
use Illuminate\Http\Request;

class EventController extends Controller
{
    use App\Events\NewNotification;

    public function sendNotification()
    {
        $message = 'This is a test notification!';
        event(new NewNotification($message));
        return response()->json(['status' => 'Notification sent!']);
    }

    public function broadcastNewOrder($order)
    {
        try {
            $notification = [
                'id' => $order->id,
                'message' => 'Có đơn hàng mới',
                'created_at' => $order->created_at,
                'total' => $order->details->sum(function($detail) {
                    return $detail->dongia * $detail->soluong - $detail->discount;
                }),
                'items' => $order->details->map(function($detail) {
                    return [
                        'product_name' => $detail->product->product_name,
                        'quantity' => $detail->soluong,
                        'price' => $detail->dongia,
                        'discount' => $detail->discount
                    ];
                })
            ];

            broadcast(new NewNotification($notification))->toOthers();

            return response()->json([
                'success' => true,
                'message' => 'Đã gửi thông báo đơn hàng mới thành công'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false, 
                'message' => 'Có lỗi khi gửi thông báo',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
