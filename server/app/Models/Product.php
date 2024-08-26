<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    
    protected $table = 'products';

    protected $fillable = [
        'product_name',
        'barcode',
        'production_date',
        'expiration_date',
        'quantity',
        'selling_price',
        'catalogy_id',
        'image',
        'factory_id',
        'purchase_price',

    ];

    // Optionally, specify any attributes that should be cast to a specific type
    protected $casts = [
        'production_date' => 'date',
        'expiration_date' => 'date',
        'quantity' => 'integer',
        'selling_price' => 'decimal:2',
    ];
}

