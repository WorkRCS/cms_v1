<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'product_type' => ['nullable', 'in:agriculture,general'],
            'category' => ['nullable', 'string', 'max:100'],
            'featured' => ['nullable', 'boolean'],
            'sort' => ['nullable', 'in:latest,price_low,price_high,name'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:48'],
        ]);

        $query = Product::where('status', 'published');

        if (! empty($filters['product_type'])) {
            $query->where('product_type', $filters['product_type']);
        }

        if (! empty($filters['category'])) {
            $category = Category::where('slug', $filters['category'])
                ->where('is_active', true)
                ->first();

            if (! $category) {
                return response()->json([
                    'data' => [],
                    'meta' => ['current_page' => 1, 'last_page' => 1, 'per_page' => 0, 'total' => 0],
                ]);
            }

            $query->where('category_id', (string) $category->getKey());
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

        $products = $query->paginate($filters['per_page'] ?? 12);

        return response()->json([
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return response()->json(['data' => $product]);
    }
}
