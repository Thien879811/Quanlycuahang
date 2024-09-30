<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;
    protected $table = 'promotions';

    protected $fillable = [
        'name',
        'code',
        'discount_percentage',
        'product_id',
        'present',
        'description',
        'quantity',
        'start_date',
        'end_date',
    ];
}
