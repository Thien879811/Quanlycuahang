<?php

namespace App\Http\Controllers;

use App\Models\LichLamViec;
use Illuminate\Http\Request;

class LichLamViecController extends Controller
{
    public function create(Request $request)
    {
        $staff = Staff::find($request->staff_id);
        $lichLamViec = LichLamViec::create([
            'staff_id' => $staff->id,
            'date' => $request->date,
            'time_start' => $request->time_start,
            'time_end' => $request->time_end,
            'reason' => $request->reason,
        ]);
        return response()->json($lichLamViec);
    }

    public function update(Request $request, $id)
    {
        $lichLamViec = LichLamViec::find($id);
        $lichLamViec->update([
            'date' => $request->date,
            'time_start' => $request->time_start,
            'time_end' => $request->time_end,
            'reason' => $request->reason,
        ]);
    }

    public function getByStaffId($staffId)
    {
        $lichLamViec = LichLamViec::where('staff_id', $staffId)->get();
        return response()->json($lichLamViec);
    }
}
