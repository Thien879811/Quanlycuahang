<?php

namespace App\Http\Controllers;

use App\Models\LichLamViec;
use Illuminate\Http\Request;
use App\Models\Staff;
use Carbon\Carbon;


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
        if (!$lichLamViec) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy lịch làm việc']);
        }
        
        $lichLamViec->update([
            'date' => $request->date,
            'time_start' => $request->time_start,
            'time_end' => $request->time_end,
            'reason' => $request->reason,
        ]);

        return response()->json(['success' => true, 'message' => 'Cập nhật lịch làm việc thành công']);
    }

    public function getByStaffId($staffId)
    {
        $currentMonth = now()->format('Y-m');
        $lichLamViec = LichLamViec::where('staff_id', $staffId)
            ->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$currentMonth])
            ->get();
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
    public function getPreviousWeek($staff_id, $week)
    {
        try {
            $startDate = Carbon::parse($week)->subWeek()->startOfWeek();
            $endDate = Carbon::parse($week)->subDays();

            $previousSchedules = LichLamViec::where('staff_id', 2)
                ->where('date', '>=', $startDate)
                ->where('date', '<=', $endDate)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $previousSchedules,
                'message' => 'Lấy lịch làm việc tuần trước thành công'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Định dạng ngày không hợp lệ. Vui lòng sử dụng định dạng Y-m-d'
            ], 400);
        }
    }
}
