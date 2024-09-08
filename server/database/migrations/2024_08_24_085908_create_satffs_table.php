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
        Schema::create('satffs', function (Blueprint $table) {
            $table->id();
            $table->string('names');
            $table->integer('age');
            $table->string('address');
            $table->string('phone');
            $table->string('gioitinh');
            $table->foreignId('position_id')->constrained('positions');
            $table->foreignId('user_id')->constrained('users');
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
        Schema::dropIfExists('satffs');
    }
};
