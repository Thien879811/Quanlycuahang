<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Factory;

class FactoryController extends Controller
{
    public function getAll(){
        $factory = Factory::all();
        return response()->json($factory);
    }
}
