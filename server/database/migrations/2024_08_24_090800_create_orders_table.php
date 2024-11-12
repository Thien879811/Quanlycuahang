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
        // Tạo bảng orders để lưu thông tin đơn hàng
        Schema::create('orders', function (Blueprint $table) {
            // ID tự động tăng
            $table->id();

            // Khóa ngoại tới bảng customers, có thể null và sẽ set null khi customer bị xóa
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
            
            // Khóa ngoại tới bảng staffs (nhân viên), có thể null
            $table->unsignedBigInteger('staff_id')->nullable();
            $table->foreign('staff_id')->references('id')->on('staffs')->nullOnDelete();
            
            // Trạng thái đơn hàng (VD: 0-Đang xử lý, 1-Hoàn thành, 2-Đã hủy)
            $table->integer('status');
            
            // Khóa ngoại tới bảng pays (phương thức thanh toán)
            $table->unsignedBigInteger('pays_id')->nullable();
            $table->foreign('pays_id')->references('id')->on('pays')->nullOnDelete();

            // Mã voucher
            $table->string('voucher_code')->nullable();
            
            // Số tiền giảm giá
            $table->decimal('discount', 10)->default(0);
            
            // Thời gian tạo và cập nhật
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
        Schema::dropIfExists('orders');
    }
};
