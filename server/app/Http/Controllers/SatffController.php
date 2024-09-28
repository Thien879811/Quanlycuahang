<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Illuminate\Http\Request;

class SatffController extends Controller
{
    public function getInfoEmployee($user_id){
        $employee = Staff::where('user_id', $user_id)->first();
        return response()->json($employee);
        
    }

    public function getAll(){
        $employee = Staff::all();
        return response()->json( $employee);
    }
}
