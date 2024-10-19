<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HangSuDung extends Model
{
    use HasFactory;

    protected $table = 'hang_su_dungs';
    protected $fillable = [
        'product_id',
        'hang_su_dung',
        'quantity',
        'status',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
