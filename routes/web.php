<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\Seller\ProductController as SellerProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => config('app.name'),
        'status' => 'backend_ready',
        'api' => '/api/v1',
        'documentation' => 'See README.md for setup and API routes.',
    ]);
});

Route::prefix('api/v1')->group(function (): void {
    Route::get('/health', [HealthController::class, 'show']);
    Route::get('/csrf-token', fn () => response()->json(['token' => csrf_token()]));

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);

    Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware('auth')->group(function (): void {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::prefix('seller')->middleware('seller')->group(function (): void {
            Route::get('/dashboard', [SellerProductController::class, 'dashboard']);
            Route::get('/products', [SellerProductController::class, 'index']);
            Route::post('/products', [SellerProductController::class, 'store']);
            Route::put('/products/{id}', [SellerProductController::class, 'update']);
            Route::delete('/products/{id}', [SellerProductController::class, 'destroy']);
        });
    });
});
