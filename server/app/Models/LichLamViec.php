<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LichLamViec extends Model
{
    use HasFactory;
    protected $table = 'lich_lam_viecs';

    protected $fillable = [
        'staff_id',
        'date',
        'time_start',
        'time_end',
        'reason',
        'status',
    ];
}
