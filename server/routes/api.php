<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CataloryController;
use App\Http\Controllers\ProductController;
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

    Route::get('/product',[ProductController::class,'getAll']);
    Route::post('/product',[ProductController::class,'create']);

    Route::get('/catalory',[CataloryController::class,'getCatalory']);
   // Route::apiResource('/users',UserController::class);
});

Route::post('login',[AuthController::class,'login']);
Route::post('register',[AuthController::class,'register']);