<?php

namespace App\Http\Controllers;
use App\Models\Staff;
use App\Models\ChamCong;
use Illuminate\Http\Request;

class ChamCongController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $chamCong = ChamCong::all();
        return response()->json($chamCong);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        
        $chamCong = $request->all();

        $checkIn = ChamCong::where('staff_id', $chamCong['staff_id'])->where('date', $chamCong['date'])->first();
        if($checkIn){
            return response()->json(
                ['message' => 'Check in already exists'],
                400
            );
        }
        else{
            $chamCong = ChamCong::create($chamCong);
            return response()->json($chamCong);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    
    public function update(Request $request, $id)
    {
        $chamCong = ChamCong::find($id);
        $chamCong->update($request->all());
        $chamCong->save();

        return response()->json(
           $chamCong,
           200
        );
    }

    public function getByStaffIdAndDay($staff_id, $day)
    {
        $chamCong = ChamCong::where('staff_id', $staff_id)->where('date', $day)->first();
        return response()->json($chamCong);
    }
}

