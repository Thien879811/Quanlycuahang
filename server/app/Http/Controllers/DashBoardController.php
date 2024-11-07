<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Orders;
use Carbon\Carbon;
use App\Models\CheckInventory;
use App\Models\Product;
use App\Models\GoodsReceipt;
use App\Models\Factory;
use App\Models\Catalory;
use App\Models\DetailOrder;
use App\Models\GoodsReceiptDetail;


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
                    return $detail->soluong * $detail->dongia - $detail->discount;
                });
            });

            $cost = $orders->sum(function ($order) {
                return $order->details->sum(function ($detail) {
                    return $detail->soluong * $detail->product->purchase_price;
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

    public function getInventorySummary(Request $request, $type) {
        try {
            $query = Product::query();
            $quantityInHand = $query->sum('quantity');

            $goodsReceipts = GoodsReceipt::with('details')->get();

            $quantityToBeReceived = $goodsReceipts->sum(function ($goodsReceipt) {
                return $goodsReceipt->details->sum('quantity');
            });

            return response()->json([
                'quantityInHand' => $quantityInHand,
                'quantityToBeReceived' => $quantityToBeReceived
            ]);

        } catch (\Exception $e) {
            \Log::error('Database error in getInventorySummary: ' . $e->getMessage());
            return response()->json([
                'quantityInHand' => 0,
                'quantityToBeReceived' => 0
            ]);
        }
    }

    public function getProductSummary() {
        try {
            $numberOfSuppliers = Factory::count();
            $numberOfCategories = Catalory::count();

            return response()->json([
                'numberOfSuppliers' => $numberOfSuppliers,
                'numberOfCategories' => $numberOfCategories
            ]);
        } catch (\Exception $e) {
            \Log::error('Database error in getProductSummary: ' . $e->getMessage());
            return response()->json([
                'numberOfSuppliers' => 0,
                'numberOfCategories' => 0
            ]); 
        }
    }

    public function getOrderSummary() {
        try {
            $orders = Orders::get();
            $orderSummary = $orders->groupBy(function ($order) {
                return $order->created_at->format('m');
            })->map(function ($orders) {
                return $orders->count();
            });

            return response()->json($orderSummary);
        } catch (\Exception $e) {
            \Log::error('Database error in getOrderSummary: ' . $e->getMessage());
            return response()->json(array_fill(1, 12, 0));
        }
    }

    public function getSalesAndPurchaseChartData() {
        try {
            $data = DetailOrder::with('product')->get();
            $data = $data->groupBy(function ($detail) {
                return $detail->created_at->format('m');
            })->map(function ($details) {
                return $details->sum(function ($detail) {
                    return $detail->soluong * $detail->dongia - $detail->discount;
                });
            });

            $goodsReceipts = GoodsReceiptDetail::get();
            $goodsReceipts = $goodsReceipts->groupBy(function ($goodsReceipt) {
                return $goodsReceipt->created_at->format('m');
            })->map(function ($goodsReceipts) {
                return $goodsReceipts->sum(function ($goodsReceipt) {
                    return $goodsReceipt->quantity * $goodsReceipt->price;
                });
            });

            return response()->json([
                'sales' => $data,
                'purchase' => $goodsReceipts
            ]);
        } catch (\Exception $e) {
            \Log::error('Database error in getSalesAndPurchaseChartData: ' . $e->getMessage());
            return response()->json([
                'sales' => [],
                'purchase' => []
            ]);
        }
    }

    public function getTopSellingStock($type) {
        try {
            $query = DetailOrder::with('product')
                ->select('product_id')
                ->selectRaw('SUM(soluong) as soldQuantity')
                ->groupBy('product_id');

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
                default:
                    return response()->json(['error' => 'Invalid time range'], 400);
            }

            $topProducts = $query->orderBy('soldQuantity', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->product->product_name,
                        'soldQuantity' => $item->soldQuantity,
                        'remainingQuantity' => $item->product->quantity,
                        'price' => $item->product->selling_price
                    ];
                });

            return response()->json($topProducts);

        } catch (\Exception $e) {
            \Log::error('Database error in getTopSellingStock: ' . $e->getMessage());
            return response()->json([]);
        }
    }

    public function getLowQuantityStock($type) {
        try {
            $lowQuantityProducts = Product::orderBy('quantity', 'asc')
                ->limit(10)
                ->get()
                ->map(function ($product) {
                    return [
                        'title' => $product->product_name,
                        'avatar' => $product->image,
                        'description' => "Còn lại: {$product->quantity} sản phẩm"
                    ];
                });

            return response()->json($lowQuantityProducts);
        } catch (\Exception $e) {
            \Log::error('Database error in getLowQuantityStock: ' . $e->getMessage());
            return response()->json([]);
        }
    }

    public function getPurchaseData($type) {
        try {
            $query = GoodsReceiptDetail::query();
            $goodsReceiptsQuery = GoodsReceipt::query();

            switch ($type) {
                case 'today':
                    $query->whereDate('created_at', Carbon::today());
                    $goodsReceiptsQuery->whereDate('created_at', Carbon::today());
                    break;
                case 'yesterday':
                    $query->whereDate('created_at', Carbon::yesterday());
                    $goodsReceiptsQuery->whereDate('created_at', Carbon::yesterday());
                    break;
                case 'week':
                    $query->where('created_at', '>=', Carbon::now()->startOfWeek());
                    $goodsReceiptsQuery->where('created_at', '>=', Carbon::now()->startOfWeek());
                    break;
                case 'month':
                    $query->where('created_at', '>=', Carbon::now()->startOfMonth());
                    $goodsReceiptsQuery->where('created_at', '>=', Carbon::now()->startOfMonth());
                    break;
                case 'year':
                    $query->where('created_at', '>=', Carbon::now()->startOfYear());
                    $goodsReceiptsQuery->where('created_at', '>=', Carbon::now()->startOfYear());
                    break;
                default:
                    if (Carbon::hasFormat($type, 'Y-m-d')) {
                        $query->whereDate('created_at', Carbon::parse($type));
                        $goodsReceiptsQuery->whereDate('created_at', Carbon::parse($type));
                    } else {
                        return response()->json(['error' => 'Invalid date format'], 400);
                    }
            }

            $purchaseData = [
                'purchaseOrders' => $goodsReceiptsQuery->count(),
                'purchaseCost' => $query->sum(\DB::raw('quantity * price')),
                'canceledOrders' => $query->where('status', 4)->count(),
                'refundedOrders' => $query->whereNotNull('return_quantity')->count()
            ];

            return response()->json($purchaseData);

        } catch (\Exception $e) {
            \Log::error('Database error in getPurchaseData: ' . $e->getMessage());
            return response()->json([
                'purchaseOrders' => 0,
                'purchaseCost' => 0,
                'canceledOrders' => 0,
                'refundedOrders' => 0
            ]);
        }
    }
}
