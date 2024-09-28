<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory;
    protected $table = 'orders';
    
    protected $fillable = [
        'customer_id',
        'staff_id',
        'tongcong',
        'status',
        'pays_id'
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
    
    public function payment()
    {
        return $this->belongsTo(Payment::class, 'pays_id');
    }
    
    // Add a scope for filtering by status
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
