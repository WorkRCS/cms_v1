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
        // Cache only plain arrays. Laravel 13 intentionally blocks arbitrary
        // PHP object unserialization unless each class is explicitly allow-listed.
        $categoryRows = Cache::remember('storefront.home.categories.v2', now()->addMinutes(5), fn () =>
            Category::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get()
                ->map(fn (Category $category): array => [
                    'name' => (string) $category->name,
                    'slug' => (string) $category->slug,
                    'product_type' => (string) $category->product_type,
                    'image' => $category->image ? (string) $category->image : null,
                ])
                ->all()
        );
        $categories = collect($categoryRows)->map(fn (array $row) => (object) $row);

        $featuredRows = Cache::remember('storefront.home.featured.v2', now()->addMinutes(2), fn () =>
            Product::query()
                ->where('status', 'published')
                ->where('is_featured', true)
                ->orderBy('created_at', 'desc')
                ->limit(4)
                ->get()
                ->map(fn (Product $product): array => $this->cacheableProduct($product))
                ->all()
        );
        $featuredProducts = collect($featuredRows)->map(fn (array $row) => (object) $row);

        $latestRows = Cache::remember('storefront.home.latest.v3', now()->addMinutes(2), fn () =>
            Product::query()
                ->where('status', 'published')
                ->orderBy('created_at', 'desc')
                ->limit(8)
                ->get()
                ->map(fn (Product $product): array => $this->cacheableProduct($product))
                ->all()
        );
        $latestProducts = collect($latestRows)->map(fn (array $row) => (object) $row);

        $videoRows = Cache::remember('storefront.home.videos.v4', now()->addMinutes(5), fn () =>
            Product::query()
                ->where('status', 'published')
                ->whereNotNull('video.url')
                ->orderBy('updated_at', 'desc')
                ->get(['name', 'slug', 'video', 'short_description', 'images', 'updated_at'])
                ->map(function (Product $product): array {
                    $video = is_array($product->video) ? $product->video : [];
                    $firstImage = is_array($product->images) ? ($product->images[0] ?? []) : [];

                    return [
                        'name' => (string) $product->name,
                        'slug' => (string) $product->slug,
                        'short_description' => (string) ($product->short_description ?? ''),
                        'video' => [
                            'type' => $video['type'] ?? 'upload',
                            'url' => $video['url'] ?? '',
                            'embed_url' => $video['embed_url'] ?? '',
                            'thumbnail_url' => $video['thumbnail_url'] ?? null,
                            'layout' => $video['layout'] ?? 'standard',
                            'title' => $video['title'] ?? null,
                        ],
                        // Only keep the one small fallback image used by this rail.
                        // Gallery variants and private upload metadata stay out of the cache.
                        'images' => [[
                            'url' => data_get($firstImage, 'url'),
                            'variants' => [
                                'medium' => data_get($firstImage, 'variants.medium'),
                            ],
                        ]],
                    ];
                })
                ->all()
        );
        $videoProducts = collect($videoRows)->map(fn (array $row) => (object) $row);

        // Split the full video catalogue between two opposite-direction rails.
        // Every product appears once instead of duplicating all cards in the DOM.
        $videoProductsLeft = $videoProducts->filter(fn ($product, $index) => $index % 2 === 0)->values();
        $videoProductsRight = $videoProducts->filter(fn ($product, $index) => $index % 2 === 1)->reverse()->values();

        return view('storefront.home', compact(
            'categories',
            'featuredProducts',
            'latestProducts',
            'videoProducts',
            'videoProductsLeft',
            'videoProductsRight',
        ));
    }
    /**
     * Return only view-required scalar and array values. This avoids storing
     * MongoDB BSON objects or Eloquent models in Laravel 13's hardened cache.
     */
    private function cacheableProduct(Product $product): array
    {
        $images = is_array($product->images) ? $product->images : [];
        $safeImages = [];

        foreach ($images as $image) {
            $safeImages[] = [
                'url' => data_get($image, 'url') ? (string) data_get($image, 'url') : null,
                'alt' => data_get($image, 'alt') ? (string) data_get($image, 'alt') : null,
                'is_primary' => (bool) data_get($image, 'is_primary', false),
                'variants' => [
                    'thumbnail' => data_get($image, 'variants.thumbnail') ? (string) data_get($image, 'variants.thumbnail') : null,
                    'medium' => data_get($image, 'variants.medium') ? (string) data_get($image, 'variants.medium') : null,
                    'large' => data_get($image, 'variants.large') ? (string) data_get($image, 'variants.large') : null,
                ],
            ];
        }

        $video = is_array($product->video) ? $product->video : [];

        return [
            'name' => (string) $product->name,
            'slug' => (string) $product->slug,
            'product_type' => (string) $product->product_type,
            'brand' => $product->brand ? (string) $product->brand : null,
            'price_minor' => (int) $product->price_minor,
            'compare_at_price_minor' => $product->compare_at_price_minor !== null
                ? (int) $product->compare_at_price_minor
                : null,
            'images' => $safeImages,
            'video' => $video !== [] ? [
                'type' => $video['type'] ?? null,
                'url' => $video['url'] ?? null,
            ] : null,
        ];
    }

}
