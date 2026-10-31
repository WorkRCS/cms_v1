<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Storefront\ProductPageController;
use App\Http\Controllers\Storefront\HomePageController;
use App\Http\Controllers\Storefront\ShopPageController;
use App\Http\Controllers\Storefront\SeoController;
use Illuminate\Support\Facades\Route;

Route::get('/robots.txt', [SeoController::class, 'robots'])->name('robots');
Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('sitemap');

Route::get('/', HomePageController::class)->name('home');
Route::get('/shop', ShopPageController::class)->name('shop');
Route::get('/product/{slug}', [ProductPageController::class, 'show'])->name('product.show');
Route::view('/terms', 'legal.terms')->name('terms');
Route::view('/privacy-policy', 'legal.privacy')->name('privacy-policy');
Route::view('/data-privacy', 'legal.data-privacy')->name('data-privacy');
Route::view('/login', 'auth.login')->name('login');
Route::view('/register', 'auth.register')->name('register');
Route::view('/cart', 'storefront.cart')->name('cart');
Route::view('/checkout', 'storefront.checkout')->name('checkout');

Route::view('/account', 'customer.account')->middleware('auth')->name('account');
Route::view('/seller', 'seller.dashboard')->middleware(['auth', 'seller'])->name('seller.dashboard');

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
