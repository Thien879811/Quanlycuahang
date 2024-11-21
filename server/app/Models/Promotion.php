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
        'catalory',
        'code',
        'discount_percentage',
        'product_id',
        'present',
        'description',
        'quantity',
        'start_date',
        'customer_id',
        'max_value',
        'min_value',
        'end_date',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
