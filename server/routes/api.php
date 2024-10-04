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
use Illuminate\Http\Request;
use Illuminate\Http\Response;
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

Route::post('login',[AuthController::class,'login']);
Route::post('register',[AuthController::class,'register']);
Route::post('/logout',[AuthController::class,'logout']);
Route::get('/product',[ProductController::class,'getAll']);

Route::controller(PromotionController::class)->group(function () {
    Route::get('/promotion', 'getPromotion');
    Route::post('/promotion', 'create');
    Route::delete('/promotion/{id}', 'delete');
    Route::put('/promotion/{id}', 'update');
});

Route::middleware('auth:sanctum')->group(function() {
    
    Route::get('/logout',[AuthController::class,'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/catalory',[CataloryController::class,'getCatalory']);

  
    //employee
    Route::prefix('employee')->group(function () {  
        Route::get('/{user_id}',[SatffController::class,'getInfoEmployee']);
        Route::get('/',[SatffController::class,'getAll']);

        //get work schedule
        Route::controller(LichLamViecController::class)->group(function () {
            Route::get('/lich-lam-viec/{staff_id}', 'getByStaffId');
        });

        //attendance
        Route::controller(ChamCongController::class)->group(function () {
            Route::post('/check-in', 'create');
            Route::put('/check-out/{id}', 'update');
            Route::get('/cham-cong/{staff_id}/{day}', 'getByStaffIdAndDay');
            Route::get('/', 'index');
            Route::put('/{id}', 'update');
        });

    });

    Route::post('/check-login-status',[AuthController::class,'checkLoginStatus']);
    Route::get('/current-user',[AuthController::class,'getCurrentUser']);
    Route::post('/verify-token',[AuthController::class,'verifyToken']);
});

Route::middleware(['auth:sanctum', 'role'])->group(function() {
    
    //Route::post('/product', [ProductController::class, 'create']);
    // Các route khác chỉ dành cho admin
});

Route::middleware(['auth:sanctum', 'role:admin,manager'])->group(function() {
//    Route::get('/product', [ProductController::class, 'getAll']);
    // Các route dành cho cả admin và manager
});

Route::middleware(['auth:sanctum', 'role:admin,manager,employee'])->group(function() {
 //   Route::get('/catalory', [CataloryController::class, 'getCatalory']);
    // Các route dành cho tất cả nhân viên đã đăng nhập
});

Route::get('/factory',[FactoryController::class,'getAll']);




Route::post('/product',[ProductController::class,'create']);
Route::put('/product/{id}',[ProductController::class,'update']);


Route::controller(CustomerController::class)->group(function () {
    Route::get('/customer/{phone}', 'getOne');
    Route::post('/customer', 'create');
    Route::put('/customer/{id}', 'update');

});

Route::controller(OrdersController::class)->group(function () {
    Route::get('/orders', 'getAll');
    // Route::post('/order', 'create');
});
Route::post('/orders', [OrdersController::class, 'create']);
Route::put('/orders/{order_id}', [OrdersController::class, 'updateOrder']);
Route::get('/orders/detail/{order_id}', [OrdersController::class, 'getDetail']);
Route::get('/orders', [OrdersController::class, 'getAll']);



Route::post('/vnpay/pay', [PaymentController::class, 'pay']);
Route::get('/vnpay/return', [PaymentController::class, 'return']);
Route::post('/vnpay/notify', [PaymentController::class, 'notify']);




Route::get('/hang-su-dung',[HangSuDungController::class,'getAll']);
Route::get('/hang-su-dung-product',[HangSuDungController::class,'get']);




///php artisan serve --host=10.0.2.16 


