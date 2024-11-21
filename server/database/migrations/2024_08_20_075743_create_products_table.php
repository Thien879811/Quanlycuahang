<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_name');
            $table->foreignId('catalogy_id')->constrained('catalogy');
            $table->date('production_date');  
            $table->date('expiration_date')->nullable();
            $table->string('image');
            $table->integer('quantity')->default(0);
            $table->integer('selling_price');
            $table->integer('purchase_price');
            $table->string('barcode');
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
