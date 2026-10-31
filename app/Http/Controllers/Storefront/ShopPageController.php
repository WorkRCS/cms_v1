<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ShopPageController extends Controller
{
    public function __invoke(Request $request): View
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'product_type' => ['nullable', 'in:agriculture,general'],
            'category' => ['nullable', 'string', 'max:100'],
            'featured' => ['nullable', 'boolean'],
            'sort' => ['nullable', 'in:latest,price_low,price_high,name'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $query = Product::query()->where('status', 'published');

        if (! empty($filters['product_type'])) {
            $query->where('product_type', $filters['product_type']);
        }

        if (! empty($filters['category'])) {
            $category = Category::query()
                ->where('slug', $filters['category'])
                ->where('is_active', true)
                ->first();

            $query->where('category_id', $category ? (string) $category->getKey() : '__no_matching_category__');
        }

        if (! empty($filters['q'])) {
            $term = trim($filters['q']);
            $query->where(function ($builder) use ($term): void {
                $builder->where('name', 'like', '%'.$term.'%')
                    ->orWhere('short_description', 'like', '%'.$term.'%')
                    ->orWhere('brand', 'like', '%'.$term.'%');
            });
        }

        if (array_key_exists('featured', $filters)) {
            $query->where('is_featured', (bool) $filters['featured']);
        }

        match ($filters['sort'] ?? 'latest') {
            'price_low' => $query->orderBy('price_minor', 'asc'),
            'price_high' => $query->orderBy('price_minor', 'desc'),
            'name' => $query->orderBy('name', 'asc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $products = $query->paginate(12)->withQueryString();

        $categoriesQuery = Category::query()
            ->where('is_active', true)
            ->orderBy('sort_order');

        if (! empty($filters['product_type'])) {
            $categoriesQuery->where('product_type', $filters['product_type']);
        }

        $categories = $categoriesQuery->get();

        return view('storefront.shop', compact('products', 'categories', 'filters'));
    }
}
