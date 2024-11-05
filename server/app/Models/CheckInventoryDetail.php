<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckInventoryDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'check_inventory_id',
        'product_id',
        'quantity',
        'actual_quantity',
        'note'
    ];

    public function checkInventory()
    {
        return $this->belongsTo(CheckInventory::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
