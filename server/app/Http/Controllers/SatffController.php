<?php

namespace App\Http\Controllers;

use App\Models\Satff;
use Illuminate\Http\Request;

class SatffController extends Controller
{
    public function getInfoEmployee($user_id){
        $employee = Satff::where('user_id', $user_id)->first();
        return response()->json($employee);
    }
}
