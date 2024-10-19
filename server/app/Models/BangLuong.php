<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BangLuong extends Model
{
    use HasFactory;
    protected $table = 'bang_luongs';
    protected $fillable = [
        'staff_id',
        'mouth',
        'bassic_wage',
        'allowance',
        'insurance',
        'other_deduction',
        'total',
        'note',
        'status',
        'work_day',
        'overtime',
        'salary_overtime',
        'advance',
    ];
}


// hiển thị thông tin nhân viên + lương + phụ cấp nếu có - Chỉnh sửa lương + phụ cấp

//- Tạo bảng lương - nhân viên