<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Orders;
class pays extends Model
{
    use HasFactory;
    protected $table = 'pays';
    protected $fillable = ['tt_hinhthuc'];

    public function orders()
    {
        return $this->hasMany(Orders::class, 'pays_id');
    }
}
