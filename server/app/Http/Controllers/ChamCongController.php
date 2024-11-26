<?php

namespace App\Http\Controllers;
use App\Models\Staff;
use App\Models\ChamCong;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Events\EmployeeLeave;
use App\Models\LichLamViec;

class ChamCongController extends Controller
{
    public function createLeaveRequest(Request $request)
    {
        $leaveRequest = $request->all();


        $newLeaveRequest = ChamCong::create([
            'staff_id' => $leaveRequest['staff_id'],
            'date' => $leaveRequest['date'],
            'time_start' => '00:00:00',
            'time_end' => '00:00:00',
            'reason' => $leaveRequest['reason'],
            'status' => $leaveRequest['status']
        ]);

        LichLamViec::where('staff_id', $leaveRequest['staff_id'])
            ->where('date', $leaveRequest['date'])
            ->update(['status' => -1]);


        broadcast(new EmployeeLeave($newLeaveRequest));


        return response()->json($newLeaveRequest);
    }
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
                'message' => 'Bạn đã chấm công'
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

        $chamCong->time_end = $request->time_end;
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
                           ->where('date', Carbon::parse($day)->format('Y-m-d'))
                           ->first();
                           
        return response()->json([
            'success' => true,
            'data' => $chamCong
        ]);
    }

    public function getAttendance(Request $request,$month = null)
    {
        $attendance = ChamCong::with('staff');
        if ($month) {
            $attendance->whereMonth('date', $month);
        }
        $attendance = $attendance->get();
        return response()->json($attendance);
    }

    public function getAttendanceByMonth($id, $month = null)
    {
        $attendance = ChamCong::with('staff')
            ->where('staff_id', $id)
            ->whereMonth('date', $month)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $attendance
        ]);
    }
}
