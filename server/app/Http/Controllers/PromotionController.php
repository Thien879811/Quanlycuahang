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
}

