<?php

namespace App\Http\Controllers;

use App\Models\Catalory;
use Illuminate\Http\Request;

class CataloryController extends Controller
{
    public function create(Request $request){
        $catalory = Catalory::create([
            'catalogy_name' => $request->catalogy_name,
        ]);
        return response()->json($catalory);
    }

    public function getCatalory(Request $request){
        $cat = Catalory::all();
        return response()->json(
            $cat
        );
    }
}
