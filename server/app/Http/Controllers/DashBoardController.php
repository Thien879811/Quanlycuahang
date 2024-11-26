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
use App\Models\DestroyProduct;


class DashBoardController extends Controller
{
    public function getSalesOverview(Request $request, $type) {
        try {
            $query = Orders::with(['details.product', 'pays'])
                          ->whereIn('status', [1,2]) // Only count paid orders
                          ->orderBy('created_at', 'desc');
            
            switch($type) {
                case 'today':
                    $query->whereDate('created_at', Carbon::today());
                    break;
                case 'yesterday':
                    $query->whereDate('created_at', Carbon::yesterday());
                    break;
                case 'week':
                    $query->whereBetween('created_at', [
                        Carbon::now()->startOfWeek(),
                        Carbon::now()->endOfWeek()
                    ]);
                    break;
                case 'month':
                    $query->whereYear('created_at', Carbon::now()->year)
                          ->whereMonth('created_at', Carbon::now()->month);
                    break;
                case 'year':
                    $query->whereYear('created_at', Carbon::now()->year);
                    break;
                case 'custom':
                    if (!$request->has('date')) {
                        return response()->json(['error' => 'Date parameter is required for custom range'], 400);
                    }
                    $date = Carbon::parse($request->date);
                    $query->whereDate('created_at', $date);
                    break;
                case 'customMonth':
                    if (!$request->has('date')) {
                        return response()->json(['error' => 'Date parameter is required for custom month'], 400);
                    }
                    $date = Carbon::parse($request->date);
                    $query->whereYear('created_at', $date->year)
                          ->whereMonth('created_at', $date->month);
                    break;
                default:
                    return response()->json(['error' => 'Invalid time range'], 400);
            }

            $orders = $query->get();

            $sales = $orders->count();
            
            $revenue = $orders->sum(function ($order) {
                return $order->details->sum(function ($detail) {
                    return $detail->soluong * $detail->dongia - ($detail->discount ?? 0);
                });
            });

            $cost = $orders->sum(function ($order) {
                return $order->details->sum(function ($detail) {
                    return $detail->soluong * ($detail->product->purchase_price ?? 0);
                });
            });

            $profit = $revenue - $cost;

            return response()->json([
                'sales' => $sales,
                'revenue' => round($revenue, 2),
                'profit' => round($profit, 2), 
                'cost' => round($cost, 2)
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Database error in getSalesOverview: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
                'sales' => 0,
                'revenue' => 0,
                'profit' => 0,
                'cost' => 0
            ], 500);
        }
    }

    public function getInventorySummary(Request $request, $type) {
        try {
            $query = Product::query();
            $quantityInHand = $query->sum('quantity');

            $goodsReceipts = GoodsReceipt::with('details')
                ->where('status', '0') // Only get pending receipts
                ->get();

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
            // Initialize array with 0 values for all months
            $orderSummary = array_fill(1, 12, 0);

            // Get orders grouped by month
            $orders = Orders::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
                ->whereYear('created_at', Carbon::now()->year)
                ->groupBy('month')
                ->get();

            // Fill in actual order counts
            foreach ($orders as $order) {
                $orderSummary[$order->month] = $order->count;
            }

            return response()->json($orderSummary);
        } catch (\Exception $e) {
            \Log::error('Database error in getOrderSummary: ' . $e->getMessage());
            return response()->json(array_fill(1, 12, 0));
        }
    }

    public function getSalesAndPurchaseChartData() {
        try {
            // Initialize arrays for all months with 0 values
            $salesData = array_fill(1, 12, 0);
            $purchaseData = array_fill(1, 12, 0);

            // Get sales data
            $orders = Orders::with('details')
                ->whereIn('status', [1, 2])
                ->whereYear('created_at', Carbon::now()->year)
                ->get();
                
            $salesByMonth = $orders->groupBy(function ($order) {
                return (int)$order->created_at->format('m');
            })->map(function ($orders) {
                return $orders->sum(function ($order) {
                    return $order->details->sum(function ($detail) {
                        return $detail->soluong * $detail->dongia - $detail->discount;
                    });
                });
            });

            // Merge sales data with initialized array
            foreach ($salesByMonth as $month => $value) {
                $salesData[$month] = $value;
            }

            // Get purchase data
            $goodsReceipts = GoodsReceipt::with('details')
                ->whereYear('created_at', Carbon::now()->year)
                ->get();
                
            $purchaseByMonth = $goodsReceipts->groupBy(function ($receipt) {
                return (int)$receipt->created_at->format('m');
            })->map(function ($receipts) {
                return $receipts->sum(function ($receipt) {
                    return $receipt->details->sum(function ($detail) {
                        return $detail->quantity * $detail->price;
                    });
                });
            });

            // Merge purchase data with initialized array
            foreach ($purchaseByMonth as $month => $value) {
                $purchaseData[$month] = $value;
            }

            return response()->json([
                'sales' => $salesData,
                'purchase' => $purchaseData
            ]);
        } catch (\Exception $e) {
            \Log::error('Database error in getSalesAndPurchaseChartData: ' . $e->getMessage());
            return response()->json([
                'sales' => array_fill(1, 12, 0),
                'purchase' => array_fill(1, 12, 0)
            ]);
        }
    }

    public function getTopSellingStock($type) {
        try {
            $query = DetailOrder::with(['product', 'order'])
                ->select('product_id')
                ->selectRaw('SUM(soluong) as soldQuantity')
                ->groupBy('product_id')
                ->whereHas('order', function($q) {
                    $q->whereIn('status', [1, 2]); // Only count completed/paid orders
                });

            switch($type) {
                case 'today':
                    $query->whereHas('order', function($q) {
                        $q->where('created_at', '>=', Carbon::today());
                    });
                    break;
                case 'yesterday':
                    $query->whereHas('order', function($q) {
                        $q->whereBetween('created_at', [
                            Carbon::yesterday()->startOfDay(),
                            Carbon::yesterday()->endOfDay()
                        ]);
                    });
                    break;
                case 'week':
                    $query->whereHas('order', function($q) {
                        $q->where('created_at', '>=', Carbon::now()->startOfWeek());
                    });
                    break;
                case 'month':
                    $query->whereHas('order', function($q) {
                        $q->where('created_at', '>=', Carbon::now()->startOfMonth());
                    });
                    break;
                case 'year':
                    $query->whereHas('order', function($q) {
                        $q->where('created_at', '>=', Carbon::now()->startOfYear());
                    });
                    break;
                case 'custom':
                    if (!request()->has('date')) {
                        return response()->json(['error' => 'Date parameter is required for custom range'], 400);
                    }
                    $date = Carbon::parse(request()->date);
                    $query->whereHas('order', function($q) use ($date) {
                        $q->whereBetween('created_at', [
                            $date->startOfDay(),
                            $date->endOfDay()
                        ]);
                    });
                    break;
                case 'customMonth':
                    if (!request()->has('date')) {
                        return response()->json(['error' => 'Date parameter is required for custom month'], 400);
                    }
                    $date = Carbon::parse(request()->date);
                    $query->whereHas('order', function($q) use ($date) {
                        $q->whereYear('created_at', $date->year)
                          ->whereMonth('created_at', $date->month);
                    });
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
            $lowQuantityProducts = Product::where('quantity', '<', 15)
                ->orderBy('quantity', 'asc')
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
            $destroyQuery = DestroyProduct::query();

            switch ($type) {
                case 'today':
                    $query->whereDate('created_at', Carbon::today());
                    $goodsReceiptsQuery->whereDate('created_at', Carbon::today());
                    $destroyQuery->whereDate('created_at', Carbon::today());
                    break;
                case 'yesterday':
                    $query->whereDate('created_at', Carbon::yesterday());
                    $goodsReceiptsQuery->whereDate('created_at', Carbon::yesterday());
                    $destroyQuery->whereDate('created_at', Carbon::yesterday());
                    break;
                case 'week':
                    $query->where('created_at', '>=', Carbon::now()->startOfWeek());
                    $goodsReceiptsQuery->where('created_at', '>=', Carbon::now()->startOfWeek());
                    $destroyQuery->where('created_at', '>=', Carbon::now()->startOfWeek());
                    break;
                case 'month':
                    $query->where('created_at', '>=', Carbon::now()->startOfMonth());
                    $goodsReceiptsQuery->where('created_at', '>=', Carbon::now()->startOfMonth());
                    $destroyQuery->where('created_at', '>=', Carbon::now()->startOfMonth());
                    break;
                case 'year':
                    $query->where('created_at', '>=', Carbon::now()->startOfYear());
                    $goodsReceiptsQuery->where('created_at', '>=', Carbon::now()->startOfYear());
                    $destroyQuery->where('created_at', '>=', Carbon::now()->startOfYear());
                    break;
                case 'customMonth':
                    if (!request()->has('date')) {
                        return response()->json(['error' => 'Date parameter is required for custom month'], 400);
                    }
                    $date = Carbon::parse(request()->date);
                    $query->whereYear('created_at', $date->year)
                          ->whereMonth('created_at', $date->month);
                    $goodsReceiptsQuery->whereYear('created_at', $date->year)
                                     ->whereMonth('created_at', $date->month);
                    $destroyQuery->whereYear('created_at', $date->year)
                                ->whereMonth('created_at', $date->month);
                    break;
                default:
                    if (Carbon::hasFormat($type, 'Y-m-d')) {
                        $query->whereDate('created_at', Carbon::parse($type));
                        $goodsReceiptsQuery->whereDate('created_at', Carbon::parse($type));
                        $destroyQuery->whereDate('created_at', Carbon::parse($type));
                    } else {
                        return response()->json(['error' => 'Invalid date format'], 400);
                    }
            }

            // Tính tổng tiền nhập hàng
            $totalPurchaseCost = $query->sum(\DB::raw('quantity * price'));
            
            // Tính tổng tiền trả hàng
            $totalRefundAmount = $query->whereNotNull('return_quantity')
                ->sum(\DB::raw('return_quantity * price'));

            // Tính tổng số lượng sản phẩm đã hủy
            $totalDestroyedProducts = $destroyQuery->sum('quantity');

            $purchaseData = [
                'purchaseOrders' => $goodsReceiptsQuery->count(),
                'purchaseCost' => $totalPurchaseCost - $totalRefundAmount,
                'canceledOrders' => $totalDestroyedProducts,
                'refundedOrders' => $query->whereNotNull('return_quantity')->sum('return_quantity')
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
