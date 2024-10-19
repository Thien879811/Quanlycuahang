<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoodsReceiptDetail extends Model
{
    use HasFactory;
    protected $table = 'goods_receipt_details';
    protected $fillable = ['goods_receipt_id', 'product_id', 'quantity', 'price'];
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
