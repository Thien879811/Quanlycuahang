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

Route::middleware('auth:sanctum')->group(function() {
    Route::get('logout',[AuthController::class,'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Route::get('/product',[ProductController::class,'getAll']);
    // Route::post('/product',[ProductController::class,'create']);

    Route::get('/catalory',[CataloryController::class,'getCatalory']);
   // Route::apiResource('/users',UserController::class);
});

Route::middleware(['auth:sanctum', 'role'])->group(function() {
    Route::get('/product',[ProductController::class,'getAll']);
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

Route::post('login',[AuthController::class,'login']);
Route::post('register',[AuthController::class,'register']);
Route::post('logout',[AuthController::class,'logout']);

Route::get('/product',[ProductController::class,'getAll']);
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


Route::get('/employee/{user_id}',[SatffController::class,'getInfoEmployee']);

Route::get('/hang-su-dung',[HangSuDungController::class,'getAll']);
Route::get('/hang-su-dung-product',[HangSuDungController::class,'get']);

