<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    
    protected $table = 'products';

    protected $fillable = [
        // Tên sản phẩm
        'product_name',
        
        // Mã vạch sản phẩm
        'barcode',
        
        // Ngày sản xuất
        'production_date',
        
        // Ngày hết hạn
        'expiration_date',
        
        // Số lượng sản phẩm
        'quantity',
        
        // Giá bán
        'selling_price',
        
        // ID danh mục sản phẩm
        'catalogy_id',
        
        // Đường dẫn hình ảnh sản phẩm
        'image',
        
        // ID nhà máy sản xuất
        'factory_id',
        
        // Giá mua vào
        'purchase_price',
    ];

    // Optionally, specify any attributes that should be cast to a specific type
    protected $casts = [
        'production_date' => 'date',
        'expiration_date' => 'date',
        'quantity' => 'integer',
    ];

    public function hangSuDung()
    {
        return $this->hasMany(HangSuDung::class)->select();
    }
}

