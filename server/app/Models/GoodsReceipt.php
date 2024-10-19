<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoodsReceipt extends Model
{
    use HasFactory;
    protected $table = 'goods_receipts';
    protected $fillable = ['supplier_id', 'import_date', 'status'];
    public function supplier()
    {
        return $this->belongsTo(Factory::class, 'supplier_id');
    }
    public function details()
    {
        return $this->hasMany(GoodsReceiptDetail::class, 'goods_receipt_id')->with('product');
    }
}
