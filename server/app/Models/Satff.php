<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Satff extends Model
{
    use HasFactory;
    protected $table = 'satffs';
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
