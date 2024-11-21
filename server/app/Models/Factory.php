<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Factory extends Model
{
    use HasFactory;

    protected $table = 'factory';

    protected $fillable = [
        'factory_name',
        'address',
        'phone',
        'email',
    ];
}
