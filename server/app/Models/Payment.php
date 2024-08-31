<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $table ='payments';

    protected $fillable = [
        'txn_ref' ,
        'amount' ,
        'response_code',
        'order_info' ,
    ];


}

// NCB
// 9704198526191432198
// NGUYEN VAN A
// 07/15
// 123456