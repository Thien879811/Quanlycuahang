<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    use HasFactory;
    protected $table = 'staffs';
    protected $fillable = [
        'names',
        'age',
        'address',
        'phone',
        'gioitinh',
        'position_id',
        'user_id',
    ];

    
}
