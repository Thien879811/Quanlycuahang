<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CheckInventory;
use App\Models\CheckInventoryDetail;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use Carbon\Carbon;
class CheckInventoryController extends Controller
{
    public function getAllCheckInventories($timeRange = null)
    {
        try {
            $query = CheckInventory::with(['user', 'checkInventoryDetails.product']);

            switch ($timeRange) {
                case 'today':
                    $query->whereDate('check_date', Carbon::today());
                    break;
                case 'yesterday':
                    $query->whereDate('check_date', Carbon::yesterday());
                    break;
                case 'week':
                    $query->where('check_date', '>=', Carbon::now()->startOfWeek());
                    break;
                case 'month':
                    $query->where('check_date', '>=', Carbon::now()->startOfMonth());
                    break;
                case 'year':
                    $query->where('check_date', '>=', Carbon::now()->startOfYear());
                    break;
                case 'customMonth':
                    if (!request()->has('date')) {
                        return response()->json(['error' => 'Date parameter is required for custom month'], 400);
                    }
                    $date = Carbon::parse(request()->date);
                    $query->whereYear('check_date', $date->year)
                          ->whereMonth('check_date', $date->month);
                    break;
                default:
                    if ($timeRange && Carbon::hasFormat($timeRange, 'Y-m-d')) {
                        $query->whereDate('check_date', Carbon::parse($timeRange));
                    }
            }

            $checkInventories = $query->get();
            return response()->json($checkInventories);

        } catch (\Exception $e) {
            \Log::error('Database error in getAllCheckInventories: ' . $e->getMessage());
            return response()->json([]);
        }
    }

    public function createCheckInventory(Request $request)
    {
        $data = $request->all();

        $checkInventory = CheckInventory::create([
            'check_date' => $data['check_date'],
            'note' => $data['note'],
            'user_id' => $data['user_id'] ?? Auth::id()
        ]);

        foreach ($data['products'] as $productData) {
            CheckInventoryDetail::create([
                'check_inventory_id' => $checkInventory->id,
                'product_id' => $productData['product_id'],
                'quantity' => $productData['quantity'],
                'actual_quantity' => $productData['actual_quantity'],
                'note' => $productData['note'] ?? null
            ]);
        }

        return response()->json($checkInventory->load(['user', 'checkInventoryDetails.product']));
    }

    public function deleteCheckInventory($id)
    {
        $checkInventory = CheckInventory::findOrFail($id);
        
        // Check if this is the latest inventory check
        $latestCheck = CheckInventory::latest('check_date')->first();
        if ($checkInventory->id !== $latestCheck->id) {
            return response()->json(['message' => 'Only the latest inventory check can be deleted'], 403);
        }

        // Restore previous quantities
        foreach ($checkInventory->checkInventoryDetails as $detail) {
            $product = Product::findOrFail($detail->product_id);
            $product->quantity = $detail->quantity; // Restore to system quantity before check
            $product->save();
        }

        $checkInventory->checkInventoryDetails()->delete();
        $checkInventory->delete();
        
        return response()->json(['message' => 'Check inventory deleted successfully']);
    }

    public function updateCheckInventory(Request $request, $id)
    {
        $checkInventory = CheckInventory::findOrFail($id);
        
        // Check if this is the latest inventory check
        $latestCheck = CheckInventory::latest('check_date')->first();
        if ($checkInventory->id !== $latestCheck->id) {
            return response()->json(['message' => 'Only the latest inventory check can be updated'], 403);
        }

        $data = $request->validate([
            'check_date' => 'required|date',
            'note' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer',
            'products.*.actual_quantity' => 'required|integer',
            'products.*.note' => 'nullable|string'
        ]);

        $checkInventory->update([
            'check_date' => $data['check_date'],
            'note' => $data['note'],
            'user_id' => $data['user_id'] ?? Auth::id()
        ]);

        $checkInventory->checkInventoryDetails()->delete();

        foreach ($data['products'] as $productData) {
            CheckInventoryDetail::create([
                'check_inventory_id' => $checkInventory->id,
                'product_id' => $productData['product_id'],
                'quantity' => $productData['quantity'],
                'actual_quantity' => $productData['actual_quantity'],
                'note' => $productData['note'] ?? null
            ]);
        }

        return response()->json($checkInventory->load(['user', 'checkInventoryDetails.product']));
    }

    public function acceptCheckInventory($id)
    {
        $checkInventory = CheckInventory::findOrFail($id);
        $checkInventory->status = '1';
        $checkInventory->save();

        foreach ($checkInventory->checkInventoryDetails as $detail) {
            $product = Product::find($detail->product_id);
            if ($product) {
                $product->quantity = $detail->actual_quantity;
                $product->save();
            }
        }

        return response()->json($checkInventory);
    }
}
