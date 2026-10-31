<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Illuminate\View\View;

class HomePageController extends Controller
{
    public function __invoke(): View
    {
        $categories = Cache::remember('storefront.home.categories.v1', now()->addMinutes(5), fn () =>
            Category::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get()
        );

        $featuredProducts = Cache::remember('storefront.home.featured.v1', now()->addMinutes(2), fn () =>
            Product::query()
                ->where('status', 'published')
                ->where('is_featured', true)
                ->orderBy('created_at', 'desc')
                ->limit(4)
                ->get()
        );

        $latestProducts = Cache::remember('storefront.home.latest.v1', now()->addMinutes(2), fn () =>
            Product::query()
                ->where('status', 'published')
                ->orderBy('created_at', 'desc')
                ->limit(8)
                ->get()
        );

        $videoProducts = Cache::remember('storefront.home.videos.v1', now()->addMinutes(2), fn () =>
            Product::query()
                ->where('status', 'published')
                ->whereNotNull('video.url')
                ->orderBy('updated_at', 'desc')
                ->limit(3)
                ->get()
        );

        return view('storefront.home', compact('categories', 'featuredProducts', 'latestProducts', 'videoProducts'));
    }
}
