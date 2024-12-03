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
        // Tạo bảng 'staffs' trong cơ sở dữ liệu
        Schema::create('staffs', function (Blueprint $table) {
            $table->id(); // Tạo cột 'id' là khóa chính, tự động tăng
            $table->string('names'); // Cột 'names' kiểu chuỗi để lưu tên nhân viên
            $table->integer('age')->nullable(); // Cột 'age' kiểu số nguyên để lưu tuổi
            $table->string('address')->nullable(); // Cột 'address' kiểu chuỗi để lưu địa chỉ
            $table->string('phone'); // Cột 'phone' kiểu chuỗi để lưu số điện thoại
            $table->string('gioitinh')->nullable(); // Cột 'gioitinh' kiểu chuỗi để lưu giới tính
            $table->string('position')->nullable();
            $table->decimal('salary', 10, 2)->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // Tạo khóa ngoại liên kết với bảng 'users'
            $table->timestamps(); // Tạo hai cột 'created_at' và 'updated_at' để lưu thời gian tạo và cập nhật
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('staffs');
    }
};
