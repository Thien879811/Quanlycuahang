<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class customer extends Model
{
    use HasFactory;
    protected $table = 'customers';
    protected $fillable = ['name', 'phone', 'diem'];    

    public function orders()
    {
        return $this->hasMany(Orders::class)->with(['details.product'])->orderBy('created_at', 'desc');
    }
}
