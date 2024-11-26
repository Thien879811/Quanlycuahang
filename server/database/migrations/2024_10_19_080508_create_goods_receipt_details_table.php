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
        Schema::create('goods_receipt_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('goods_receipt_id')->nullable();
            $table->foreign('goods_receipt_id')
                ->references('id')
                ->on('goods_receipts')
                ->onDelete('set null');
            $table->unsignedBigInteger('product_id')->nullable(); 
            $table->foreign('product_id')
                ->references('id')
                ->on('products')
                ->onDelete('set null');
            $table->integer('quantity');
            $table->decimal('price', 10);
            $table->integer('quantity_receipt')->default(0);
            $table->integer('quantity_defective')->default(0);
            $table->string('status')->nullable(); 
            $table->string('note')->nullable();
            $table->integer('return_quantity')->nullable()->default(0);
            $table->date('production_date')->nullable();
            $table->date('expiration_date')->nullable();
            $table->date('return_date')->nullable();
            $table->boolean('is_added')->default(false);
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
        Schema::dropIfExists('goods_receipt_details');
    }
};
