<?php

namespace App\Models;

use App\Models\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DestroyProduct extends Model
{
    use HasFactory;

    protected $table = 'destroy_products';

    protected $fillable = [
        'product_id',
        'quantity',
        'destroy_date',
        'note',
        'image',
        'status',  //0 yêu cầu hủy, 1 đã hủy
        'expiration_date'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
