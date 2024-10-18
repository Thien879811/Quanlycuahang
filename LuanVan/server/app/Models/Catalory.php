<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Catalory extends Model
{
    use HasFactory;

    protected $table = 'catalogy';

    protected $fillable = [
        'catalogy_name',
    ];

    public function findCatalory($name){
        return $this->where('catalogy_name','LIKE',"%$name%")->get()->first();
    }
}
