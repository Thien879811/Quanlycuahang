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
        // Tạo bảng 'promotions' trong cơ sở dữ liệu
        Schema::create('promotions', function (Blueprint $table) {
            $table->id(); // Tạo cột 'id' là khóa chính tự động tăng
            $table->string('name'); // Tên của chương trình khuyến mãi
            $table->string('code')->nullable(); // Mã khuyến mãi, có thể để trống
            $table->decimal('discount_percentage', 5)->nullable(); // Phần trăm giảm giá, tối đa 100.00%, có thể để trống
            $table->unsignedBigInteger('product_id')->nullable(); // Liên kết với bảng 'products', có thể để trống
            $table->foreign('product_id')->references('id')->on('products')->onDelete('set null');
            $table->string('present')->nullable(); // Quà tặng kèm, có thể để trống
            $table->string('description')->nullable(); // Mô tả khuyến mãi, có thể để trống
            $table->string('quantity')->nullable(); // Số lượng khuyến mãi, có thể để trống
            $table->date('start_date')->nullable(); // Ngày bắt đầu khuyến mãi, có thể để trống
            $table->date('end_date')->nullable(); // Ngày kết thúc khuyến mãi, có thể để trống
            $table->string('catalory')->nullable();
            $table->string('max_value')->nullable();
            $table->string('min_value')->nullable(); // Số lượng voucher tối thiểu có thể đổi, có thể để trống
            $table->unsignedBigInteger('customer_id')->nullable(); // Liên kết với bảng 'customers', có thể để trống
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('set null');
            $table->timestamps(); // Tự động tạo cột 'created_at' và 'updated_at'
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Xóa bảng 'promotions' nếu nó tồn tại
        Schema::dropIfExists('promotions');
    }
};
