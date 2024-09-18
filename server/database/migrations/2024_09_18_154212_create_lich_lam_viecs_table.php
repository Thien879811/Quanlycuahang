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
        Schema::create('lich_lam_viecs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('staff_id')->constrained('staffs');
            $table->date('date');
            $table->time('time_start');
            $table->time('time_end');
            $table->string('reason');
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
        Schema::dropIfExists('lich_lam_viecs');
    }
};
