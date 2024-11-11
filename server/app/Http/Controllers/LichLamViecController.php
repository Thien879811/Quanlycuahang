<?php

namespace App\Http\Controllers;

use App\Models\LichLamViec;
use Illuminate\Http\Request;
use App\Models\Staff;


class LichLamViecController extends Controller
{

   
    public function create(Request $request)
    {
        $staff = Staff::find($request->staff_id);
        $schedules = $request->schedules;
        if($staff){
            foreach ($schedules as $schedule) {
                $date = LichLamViec::where('staff_id', $staff->id)->where('date', $schedule['date'])->first();
                if($date){
                    return response()->json(['success' => false, 'message' => 'Ngày đã tồn tại']);
                }
                if($schedule['time_start'] && $schedule['time_end']){
                    LichLamViec::create([
                        'staff_id' => $staff->id,
                        'date' => $schedule['date'],
                        'time_start' => $schedule['time_start'],
                        'time_end' => $schedule['time_end'],
                        'reason' => $schedule['reason'],
                    ]);
                }
            }
            return response()->json(['success' => true, 'message' => 'Tạo lịch làm việc thành công']);
        }
        return response()->json(['success' => false, 'message' => 'Không tìm thấy nhân viên']);
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
        $lichLamViec->save();
        return response()->json(['success' => true, 'message' => 'Cập nhật lịch làm việc thành công']);
    }

    public function getByStaffId($staffId)
    {
        $lichLamViec = LichLamViec::where('staff_id', $staffId)->get();
        return response()->json($lichLamViec);
    }

    public function getAll()
    {
        $lichLamViec = LichLamViec::all();
        return response()->json($lichLamViec);
    }

    public function delete($id)
    {
        $lichLamViec = LichLamViec::find($id);
        if($lichLamViec){
            $lichLamViec->delete();
            return response()->json(['success' => true, 'message' => 'Xóa lịch làm việc thành công']);
        }
        return response()->json(['success' => false, 'message' => 'Không tìm thấy lịch làm việc']);
    }
}
