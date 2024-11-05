<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Orders;
use Carbon\Carbon;

class DashBoardController extends Controller
{
    public function getSalesOverview(Request $request, $type) {
        try {
            $query = Orders::with('details.product') 
                          ->whereIn('status', [1, 2]) // Only count completed/paid orders
                          ->orderBy('created_at', 'desc');
            
            switch($type) {
                case 'today':
                    $query->where('created_at', '>=', Carbon::today());
                    break;
                case 'yesterday':
                    $query->whereBetween('created_at', [
                        Carbon::yesterday()->startOfDay(),
                        Carbon::yesterday()->endOfDay()
                    ]);
                    break;
                case 'week':
                    $query->where('created_at', '>=', Carbon::now()->startOfWeek());
                    break;
                case 'month':
                    $query->where('created_at', '>=', Carbon::now()->startOfMonth());
                    break;
                case 'year':
                    $query->where('created_at', '>=', Carbon::now()->startOfYear());
                    break;
                case 'custom':
                    if (!$request->has('date')) {
                        return response()->json(['error' => 'Date parameter is required for custom range'], 400);
                    }
                    $date = Carbon::parse($request->date);
                    $query->whereBetween('created_at', [
                        $date->startOfDay(),
                        $date->endOfDay()
                    ]);
                    break;
                default:
                    return response()->json(['error' => 'Invalid time range'], 400);
            }

            $orders = $query->get();

            $sales = $orders->count();
            
            $revenue = $orders->sum(function ($order) {
                return $order->details->sum(function ($detail) {
                    return $detail->soluong * ($detail->dongia - $detail->discount);
                });
            });

            $cost = $orders->sum(function ($order) {
                return $order->details->sum(function ($detail) {
                    return $detail->soluong * ($detail->product->push - $detail->discount);
                });
            });

            $profit = $revenue - $cost;

            return response()->json([
                'sales' => $sales,
                'revenue' => $revenue,
                'profit' => $profit,
                'cost' => $cost
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Database error in getSalesOverview: ' . $e->getMessage());
            return response()->json([
                'sales' => 0,
                'revenue' => 0, 
                'profit' => 0,
                'cost' => 0
            ]);
        }
    }
}
