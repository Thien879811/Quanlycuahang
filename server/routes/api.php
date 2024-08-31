<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CataloryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\FactoryController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PaymentController;
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

Route::get('/catalory',[CataloryController::class,'getCatalory']);

Route::get('/factory',[FactoryController::class,'getAll']);

Route::post('login',[AuthController::class,'login']);
Route::post('register',[AuthController::class,'register']);

Route::get('/product',[ProductController::class,'getAll']);
Route::post('/product',[ProductController::class,'create']);


Route::controller(CustomerController::class)->group(function () {
    Route::get('/customer/{phone}', 'getOne');
    Route::post('/customer', 'store');
});

Route::controller(OrdersController::class)->group(function () {
    Route::get('/order', 'getOne');
    // Route::post('/order', 'create');
});

Route::post('/order', [OrdersController::class, 'create']);


Route::post('/vnpay/pay', [PaymentController::class, 'pay']);
Route::get('/vnpay/return', [PaymentController::class, 'return']);
Route::post('/vnpay/notify', [PaymentController::class, 'notify']);