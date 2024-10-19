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
        Schema::create('bang_luongs', function (Blueprint $table) {
            $table->id(); // Tạo cột id tự động tăng làm khóa chính
            $table->foreignId('staff_id')->constrained('staffs'); // Tạo khóa ngoại liên kết với bảng staffs
            $table->date('mouth')->nullable(); // Cột ngày tháng, có thể để trống (nullable)
            $table->string('bassic_wage')->nullable(); // Lương cơ bản, kiểu chuỗi, có thể để trống
            $table->string('allowance')->nullable(); // Phụ cấp, kiểu chuỗi, có thể để trống
            $table->string('insurance')->nullable(); // Bảo hiểm, kiểu chuỗi, có thể để trống
            $table->string('other_deduction')->nullable(); // Các khoản khấu trừ khác, kiểu chuỗi, có thể để trống
            $table->string('total')->nullable(); // Tổng lương, kiểu chuỗi, có thể để trống
            $table->string('note')->nullable(); // Ghi chú, kiểu chuỗi, có thể để trống
            $table->string('status')->nullable(); // Trạng thái, kiểu chuỗi, có thể để trống
            $table->string('work_day')->nullable();
            $table->string('overtime')->nullable();
            $table->string('salary_overtime')->nullable();
            $table->string('advance')->nullable();
            $table->timestamps(); // Tự động tạo hai cột created_at và updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bang_luongs');
    }
};
