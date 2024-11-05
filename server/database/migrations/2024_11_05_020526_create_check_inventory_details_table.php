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
        Schema::create('check_inventory_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('check_inventory_id')->constrained('check_inventories');
            $table->foreignId('product_id')->constrained('products');
            $table->integer('quantity');
            $table->integer('actual_quantity');
            $table->string('note')->nullable();
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
        Schema::dropIfExists('check_inventory_details');
    }
};
