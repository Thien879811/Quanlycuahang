<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChamCong extends Model
{
    use HasFactory;
    protected $table = 'cham_congs';
    protected $fillable = [
        'staff_id',
        'date',
        'time_start',
        'time_end',
        'status',
        'reason',
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
}
