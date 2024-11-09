<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\DetailOrder;
use App\Models\Pays;
class Orders extends Model
{
    use HasFactory;
    protected $table = 'orders';
    
    protected $fillable = [
        'customer_id',
        'staff_id',
        'status',//0 yeu cau huy, 1 đã thanh toán, 2 yêu cầu hủy, 3 đã hủy
        'pays_id',
        'voucher_code',
        'discount'
    ];
    
    // Add relationships
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
    
    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
    
    public function pays()
    {
        return $this->belongsTo(Pays::class, 'pays_id');
    }
    
    // Add a scope for filtering by status
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function details()
    {
        return $this->hasMany(DetailOrder::class, 'order_id')->with('product');
    }

    public function scopeOrderByCreatedAt($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}
