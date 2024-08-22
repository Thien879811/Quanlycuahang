<?php

namespace App\Http\Controllers;

use App\Models\Catalory;
use Illuminate\Http\Request;

class CataloryController extends Controller
{
    public function create(){
        
    }

    public function getCatalory(Request $request){
        $cat = Catalory::all();
        return response()->json(
            $cat
        );
    }
}
