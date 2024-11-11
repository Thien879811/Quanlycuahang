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
        $chamCong = ChamCong::with('staff')->get();
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

        $checkIn = ChamCong::where('staff_id', $chamCong['staff_id'])
                          ->where('date', $chamCong['date'])
                          ->first();

        if ($checkIn) {
            return response()->json([
                'success' => false,
                'message' => 'Check in already exists'
            ], 400);
        }

        $newChamCong = ChamCong::create($chamCong);
        return response()->json([
            'success' => true,
            'message' => 'Chấm công đã được tạo thành công',
            'data' => $newChamCong
        ]);
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
        
        if (!$chamCong) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bản ghi chấm công'
            ], 404);
        }

        $chamCong->update($request->all());
        $chamCong->save();

        return response()->json([
            'success' => true,
            'message' => 'Chấm công đã được cập nhật thành công',
            'data' => $chamCong
        ]);
    }

    public function getByStaffIdAndDay($staff_id, $day)
    {
        $chamCong = ChamCong::where('staff_id', $staff_id)
                           ->where('date', $day)
                           ->first();
                           
        return response()->json([
            'success' => true,
            'data' => $chamCong
        ]);
    }

    public function getAttendance(Request $request)
    {
        $attendance = ChamCong::with('staff')->get();
        return response()->json($attendance);
    }
}
