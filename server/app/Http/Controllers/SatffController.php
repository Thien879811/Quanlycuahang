<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Illuminate\Http\Request;
use App\Models\Salary;
use App\Models\ChamCong;
use App\Models\BangLuong;
use Carbon\Carbon;

class SatffController extends Controller
{
    public function update(Request $request, $id){
        $data = $request->all();
        $employee = Staff::find($id);
        $employee->names = $data['names'];
        $employee->age = $data['age']; 
        $employee->address = $data['address'];
        $employee->phone = $data['phone'];
        $employee->gioitinh = $data['gioitinh'];
        $employee->save();
        return response()->json(['success' => true, 'message' => 'Cập nhật thông tin nhân viên thành công', 'employee' => $employee]);
    }
    // Phương thức này lấy thông tin của một nhân viên dựa trên user_id
    public function getInfoEmployee($user_id){
        $employee = Staff::find($user_id);
        return response()->json($employee);
    }

    // Phương thức này lấy thông tin của tất cả nhân viên
    public function getAll(){
        $employee = Staff::all();
        return response()->json($employee);
    }

    // Phương thức này tạo bảng lương cho nhiều nhân viên
    public function createSalary(Request $request)
    {
        // Lấy danh sách ID nhân viên và tháng từ request
        $employeeIds = $request->input('employeeIds');
        $month = $request->input('month');

        // Validate the month format
        try {
            $monthDate = Carbon::parse($month);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid date format for month'], 400);
        }

        $salaries = [];

        // Lặp qua từng nhân viên
        foreach ($employeeIds as $employeeId) {

            $findWorkStaff = ChamCong::where('staff_id', $employeeId)
                ->whereMonth('date', $monthDate->month)
                ->whereYear('date', $monthDate->year)
                ->get();

            if($findWorkStaff->count() == 0){
                return response()->json(['error' => 'Nhân viên '.$employeeId.' không có dữ liệu chấm công trong tháng']);
            }

            $findPayroll = BangLuong::where('staff_id', $employeeId)
                ->whereMonth('mouth', $monthDate->month)
                ->whereYear('mouth', $monthDate->year)
                ->get();

            if($findPayroll->count() > 0){
                return response()->json(['error' => 'Bảng lương trong tháng này đã tồn tại']);
            }

        
            // Lấy dữ liệu chấm công của nhân viên trong tháng
            $chamCongs = ChamCong::where('staff_id', $employeeId)
                ->whereMonth('date', $monthDate->month)
                ->whereYear('date', $monthDate->year)
                ->get();

            $totalWorkingHours = 0;
            $overtimeHours = 0;
            $workDay = 0;
            $totalSalary = 0;
            $notWorkDay = 0;
            // Tính tổng số giờ làm việc và số giờ làm thêm
            foreach ($chamCongs as $chamCong) {
                $workingHours = Carbon::parse($chamCong->time_start)->diffInHours(Carbon::parse($chamCong->time_end));
                $totalWorkingHours += $workingHours;

                if ($workingHours >= 8) {
                    $overtimeHours += $workingHours - 8;
                    $workDay++;
                }
            }

            if($workDay > 26){
                $overtimeHours = $overtimeHours + ($workDay - 26) * 8;
                $workDay = 26;
            }else{
                $notWorkDay = 26 - $workDay;
            }


            // Lấy thông tin nhân viên và tính lương
            $staff = Staff::find($employeeId);

            $baseSalary = $staff->salary;

            $totalSalaryNotWorkDay =($notWorkDay * $baseSalary / 26);

            $overtimePay = $overtimeHours * ($baseSalary / 160) * 1.5; // Giả sử 160 giờ làm việc mỗi tháng và hệ số làm thêm giờ là 1.5

            $totalSalary = $baseSalary + $overtimePay - $totalSalaryNotWorkDay;

            
            
            //Tạo bản ghi lương mới
            $salary = new BangLuong();
            $salary->staff_id = $employeeId;
            $salary->mouth = $monthDate->format('Y-m-d');
            $salary->bassic_wage = $baseSalary;
            $salary->overtime =  $overtimeHours;
            $salary->salary_overtime = $overtimePay;
            $salary->total = $totalSalary;
            $salary->work_day = $workDay;
            $salary->save();

            $salaries[] = $salary;
        }

        // Trả về danh sách lương đã tạo
        return response()->json($salaries);
    }

    public function getNgayCong($date, $staff_id){
        try {
            $parsedDate = Carbon::parse($date);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid date format'], 400);
        }

        $chamCongs = ChamCong::where('staff_id', $staff_id)
            ->whereMonth('date', $parsedDate->month)
            ->whereYear('date', $parsedDate->year)
            ->get();
        return response()->json($chamCongs);
    }

    public function getAllSalary(){
        $salaries = BangLuong::all();
        return response()->json($salaries);
    }
}
