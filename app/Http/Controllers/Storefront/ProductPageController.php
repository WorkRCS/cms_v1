<?php

namespace App\\Http\\Controllers\\Storefront;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Product;
use Illuminate\\View\\View;

class ProductPageController extends Controller
{
    public function show(string $slug): View
    {
        $product = Product::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return view('storefront.product', compact('product'));
    }
}
