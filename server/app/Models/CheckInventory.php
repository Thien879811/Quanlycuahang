<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckInventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'check_date',
        'note',
        'user_id'
    ];

    public function checkInventoryDetails()
    {
        return $this->hasMany(CheckInventoryDetail::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasManyThrough(Product::class, CheckInventoryDetail::class, 'check_inventory_id', 'id', 'id', 'product_id');
    }
}
