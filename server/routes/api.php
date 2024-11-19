 <?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CataloryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\FactoryController;
use App\Http\Controllers\HangSuDungController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\SatffController;
use App\Http\Controllers\LichLamViecController;
use App\Http\Controllers\ChamCongController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GoodsReceiptController;
use App\Http\Controllers\CheckInventoryController;
use App\Http\Controllers\DashBoardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/ 
Route::get('/employee/lich-lam-viec/{staff_id}/{week}',[LichLamViecController::class,'getPreviousWeek']);

Route::controller(PromotionController::class)->group(function () {
    Route::get('/promotion', 'getPromotion');
    Route::post('/promotion', 'create');
    Route::delete('/promotion/{id}', 'delete');
    Route::put('/promotion/{id}', 'update');
    Route::put('/promotion/voucher/quantity/{id}', 'updateQuantity');
    Route::get('/promotion/product', 'Promotion');
    Route::get('/promotions/customer', 'getPromotionsCustomer');
    Route::get('/promotions/customer/{id}', 'getPromotionDetail');
    Route::post('/promotions/redeem-point', 'createRedeemPoint');
    Route::get('/promotions/customer/{id}', 'getPromotionByCustomerId');
});

Route::controller(DashBoardController::class)->group(function () {
    Route::get('/dashboard/sales-overview/{type}', 'getSalesOverview');
    Route::get('/dashboard/inventory-summary/{type}', 'getInventorySummary');
    Route::get('/dashboard/product-summary', 'getProductSummary');
    Route::get('/dashboard/order-summary', 'getOrderSummary');
    Route::get('/dashboard/sales-and-purchase-chart-data', 'getSalesAndPurchaseChartData');
    Route::get('/dashboard/top-selling-stock/{type}', 'getTopSellingStock');
    Route::get('/dashboard/low-quantity-stock/{type}', 'getLowQuantityStock');
    Route::get('/dashboard/purchase-data/{type}', 'getPurchaseData');
});
//check inventory api
Route::controller(CheckInventoryController::class)->group(function () {
    Route::get('/check-inventory', 'getAllCheckInventories');
    Route::post('/check-inventory', 'createCheckInventory');
    Route::delete('/check-inventory/{id}', 'deleteCheckInventory');
    Route::put('/check-inventory/{id}', 'updateCheckInventory');
});

//goods receipt api
Route::controller(GoodsReceiptController::class)->group(function () {
    Route::post('/goods-receipt', 'createGoodsReceipt');
    Route::get('/goods-receipt', 'getAll');
    Route::put('/goods-receipt/{id}', 'updateReceipt');
    Route::post('/goods-receipt/return', 'returnReceipt');
    Route::get('/goods-receipt/{type}', 'getReceipt');
    Route::get('/goods-receipt/{type}/return', 'getReceiptReturn');
    Route::delete('/goods-receipt/{id}', 'deleteReceipt');
    Route::put('/goods-receipt/update/{id}', 'update');
    Route::post('/goods-receipt/create', 'createReceipt');
});

//catalog api
Route::get('/catalory',[CataloryController::class,'getCatalory']);
Route::post('/catalory',[CataloryController::class,'create']);


//factory api
Route::get('/factory',[FactoryController::class,'getAll']);
Route::get('/factory/{id}',[FactoryController::class,'getById']);
Route::post('/factory',[FactoryController::class,'create']);
Route::put('/factory/{id}',[FactoryController::class,'update']);
Route::delete('/factory/{id}',[FactoryController::class,'delete']);

//employee api
Route::post('/employee/create-working-schedule',[LichLamViecController::class,'create']);
Route::get('/employee/lich-lam-viec',[LichLamViecController::class,'getAll']);
Route::put('/employee/lich-lam-viec/{id}',[LichLamViecController::class,'update']);
Route::delete('/employee/lich-lam-viec/{id}',[LichLamViecController::class,'delete']);
Route::get('employee/lich-lam-viec/{staff_id}',[LichLamViecController::class,'getByStaffId']);


Route::get('employee/',[SatffController::class,'getAll']);
Route::get('/employee/{user_id}',[SatffController::class,'getInfoEmployee']);
Route::post('/employee/salary',[SatffController::class,'createSalary']);
Route::get('/employee/salary',[SatffController::class,'getAllSalary']);
Route::put('/employee/edit/{id}',[SatffController::class,'update']);

Route::post('/employee/cham-cong',[ChamCongController::class,'create']);
Route::put('/employee/cham-cong/{id}',[ChamCongController::class,'update']);
Route::post('/employee/check-in',[ChamCongController::class,'create']);
Route::put('/employee/check-out/{id}',[ChamCongController::class,'update']);
Route::get('/employee/cham-cong/{staff_id}/{day}',[ChamCongController::class,'getByStaffIdAndDay']);
Route::get('/employee/cham-cong',[ChamCongController::class,'index']);
Route::put('/employee/{id}',[ChamCongController::class,'update']);
Route::get('/employee/attendance/{month?}',[ChamCongController::class,'getAttendance']);
Route::get('/employee/attendance/{id}/{month?}',[ChamCongController::class,'getAttendanceByMonth']);
Route::post('/employee/leave-request',[ChamCongController::class,'createLeaveRequest']);


Route::post('login',[AuthController::class,'login']);
Route::post('login-customer',[AuthController::class,'loginCustomer']);
Route::post('register',[AuthController::class,'register']);
Route::post('register-customer',[AuthController::class,'registerCustomer']);
Route::post('/logout',[AuthController::class,'logout']);

Route::get('/product',[ProductController::class,'getAll']);
Route::post('/product',[ProductController::class,'create']);
Route::post('/product/{id}',[ProductController::class,'update']);
Route::get('/product/inventory',[HangSuDungController::class,'getAll']);
Route::get('/product/destroy',[ProductController::class,'getAllDestroyProduct']);
Route::post('/product/destroy/create',[ProductController::class,'createDestroyProduct']);
Route::delete('/product/{id}',[ProductController::class,'delete']);
Route::get('/product/destroy',[ProductController::class,'getDestroyProduct']);
Route::put('/product/destroy/{id}',[ProductController::class,'updateDestroyProductStatus']);
Route::put('/product/update-quantity/{id}',[ProductController::class,'updateQuantity']);
Route::get('/product/customer',[ProductController::class,'getProduct']);

Route::controller(UserController::class)->group(function () {
    Route::get('/users/{id}', 'getUserById');
    Route::post('/users', 'createUser');
    Route::put('/users/{id}', 'updateUser');
    Route::get('/users/{id}/staff', 'getStaffByUserId');
    Route::get('/users', 'getAll');
    Route::delete('/users/{id}', 'deleteUser');
});

Route::middleware('auth:sanctum')->group(function() {
    
    Route::get('/logout',[AuthController::class,'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });


    Route::post('/check-login-status',[AuthController::class,'checkLoginStatus']);
    Route::get('/current-user',[AuthController::class,'getCurrentUser']);
    Route::post('/verify-token',[AuthController::class,'verifyToken']);
});

Route::controller(CustomerController::class)->group(function () {
    Route::get('/customer/{phone}', 'getOne');
    Route::post('/customer', 'create');
    Route::put('/customer/{id}', 'update');
    Route::get('/customer/{id}', 'get');
    Route::get('/customer', 'getAll');
    Route::get('/customer/{id}/info-buy', 'getInfoBuy');
    Route::put('/customer/change-password', 'changePassword');
    Route::get('/customer/{id}/info', 'getInfo');
});

Route::controller(OrdersController::class)->group(function () {
    Route::get('/orders', 'getAll');
    // Route::post('/order', 'create');
});

Route::post('/orders', [OrdersController::class, 'create']);
Route::put('/orders/{order_id}', [OrdersController::class, 'update']);
Route::get('/orders/order-products',[OrdersController::class,'getOrders']);
Route::post('/orders/order-products/{order_id}',[OrdersController::class,'updateOrderProducts']);
Route::put('/orders/cancel/{order_id}',[OrdersController::class,'cancelOrder']);
Route::get('/orders/detail/{order_id}', [OrdersController::class, 'getDetail']);
Route::get('/orders', [OrdersController::class, 'getAll']);
Route::post('/orders/{type}', [OrdersController::class, 'getOrder']);
Route::put('/orders/voucher/{order_id}', [OrdersController::class, 'updateVoucher']);
Route::get('/orders/{order_id}', [OrdersController::class, 'get']);
Route::delete('/orders/products/{order_id}/{product_id}', [OrdersController::class, 'deleteOrderProducts']);
Route::post('/orders/add-discount/{order_id}', [OrdersController::class, 'addDiscount']);
Route::post('/orders/cancel/{order_id}', [OrdersController::class, 'cancelOrder']);
Route::put('/orders/accept-cancel/{order_id}', [OrdersController::class, 'acceptCancel']);
Route::put('/orders/cancel-request/{order_id}', [OrdersController::class, 'cancelRequest']);
Route::get('/orders/customer/{id}/{date}', [OrdersController::class, 'getOrdersByCustomerId']);
Route::post('/orders/customer', [OrdersController::class, 'createOrderCustomer']);



Route::post('/vnpay/pay', [PaymentController::class, 'pay']);
Route::get('/vnpay/return', [PaymentController::class, 'return']);
Route::post('/vnpay/notify', [PaymentController::class, 'notify']);





///php artisan serve --host=192.168.101.11


