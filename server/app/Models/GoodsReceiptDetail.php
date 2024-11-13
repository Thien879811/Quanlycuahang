<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoodsReceiptDetail extends Model
{
    use HasFactory;
    //0 tạo phiếu nhập, 1 đủ hàng, 2 thiếu, 3 sản phẩm lỗi, 4 trả hàng
    protected $table = 'goods_receipt_details';
    protected $fillable = [
        'goods_receipt_id',
        'status',
        'product_id',
        'quantity',
        'price',
        'quantity_receipt',
        'quantity_defective',
        'note',
        'production_date',
        'expiration_date',
        'return_quantity'
    ];
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
    public function goodsReceipt()
    {
        return $this->belongsTo(GoodsReceipt::class, 'goods_receipt_id');
    }
}
