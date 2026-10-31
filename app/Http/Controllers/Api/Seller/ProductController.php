<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Services\ProductImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    public function __construct(private readonly ProductImageService $images)
    {
    }

    public function dashboard(Request $request): JsonResponse
    {
        $sellerId = (string) $request->user()->getKey();
        $products = Product::where('seller_id', $sellerId);

        return response()->json([
            'summary' => [
                'total_products' => (clone $products)->count(),
                'published_products' => (clone $products)->where('status', 'published')->count(),
                'draft_products' => (clone $products)->where('status', 'draft')->count(),
                'low_stock_products' => (clone $products)->where('stock', '<=', 5)->count(),
                'agriculture_products' => (clone $products)->where('product_type', 'agriculture')->count(),
                'general_products' => (clone $products)->where('product_type', 'general')->count(),
            ],
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $products = Product::where('seller_id', (string) $request->user()->getKey())
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:180'],
            'category_id' => ['required', 'string', 'max:80'],
            'product_type' => ['required', 'in:agriculture,general'],
            'sku' => ['nullable', 'string', 'max:80'],
            'brand' => ['nullable', 'string', 'max:100'],
            'short_description' => ['nullable', 'string', 'max:300'],
            'description' => ['required', 'string', 'max:20000'],
            'price_minor' => ['required', 'integer', 'min:1'],
            'compare_at_price_minor' => ['nullable', 'integer', 'min:1', 'gte:price_minor'],
            'stock' => ['required', 'integer', 'min:0'],
            'track_inventory' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'status' => ['sometimes', 'in:draft,published'],
            'attributes' => ['sometimes', 'array'],
            'tags' => ['sometimes', 'array', 'max:20'],
            'images' => ['required', 'array', 'min:1', 'max:8'],
            'images.*' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'video' => ['nullable', 'file', 'mimes:mp4,webm', 'max:51200'],
        ]);

        $category = $this->validatedCategory($data['category_id'], $data['product_type']);
        $images = $this->images->store($data['images'], $data['name']);
        $video = $request->hasFile('video') ? $this->storeVideo($request) : null;

        $product = Product::create([
            'seller_id' => (string) $request->user()->getKey(),
            'category_id' => (string) $category->getKey(),
            'name' => trim($data['name']),
            'slug' => Str::slug($data['name']).'-'.Str::lower(Str::random(6)),
            'sku' => $data['sku'] ?? null,
            'brand' => $data['brand'] ?? null,
            'product_type' => $data['product_type'],
            'short_description' => $data['short_description'] ?? null,
            'description' => $data['description'],
            'price_minor' => (int) $data['price_minor'],
            'compare_at_price_minor' => isset($data['compare_at_price_minor']) ? (int) $data['compare_at_price_minor'] : null,
            'currency' => 'INR',
            'stock' => (int) $data['stock'],
            'track_inventory' => (bool) ($data['track_inventory'] ?? true),
            'images' => $images,
            'video' => $video,
            'attributes' => $data['attributes'] ?? [],
            'tags' => $data['tags'] ?? [],
            'is_featured' => (bool) ($data['is_featured'] ?? false),
            'status' => $data['status'] ?? 'draft',
        ]);

        return response()->json(['message' => 'Product created successfully.', 'data' => $product], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $product = Product::where('seller_id', (string) $request->user()->getKey())
            ->where('id', $id)
            ->firstOrFail();

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:180'],
            'category_id' => ['sometimes', 'required', 'string', 'max:80'],
            'product_type' => ['sometimes', 'required', 'in:agriculture,general'],
            'sku' => ['sometimes', 'nullable', 'string', 'max:80'],
            'brand' => ['sometimes', 'nullable', 'string', 'max:100'],
            'short_description' => ['sometimes', 'nullable', 'string', 'max:300'],
            'description' => ['sometimes', 'required', 'string', 'max:20000'],
            'price_minor' => ['sometimes', 'required', 'integer', 'min:1'],
            'compare_at_price_minor' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'track_inventory' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'status' => ['sometimes', 'in:draft,published,archived'],
            'attributes' => ['sometimes', 'array'],
            'tags' => ['sometimes', 'array', 'max:20'],
            'images' => ['sometimes', 'array', 'min:1', 'max:8'],
            'images.*' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'video' => ['sometimes', 'nullable', 'file', 'mimes:mp4,webm', 'max:51200'],
        ]);

        $productType = $data['product_type'] ?? $product->product_type;
        $categoryId = $data['category_id'] ?? $product->category_id;

        if (isset($data['category_id']) || isset($data['product_type'])) {
            $category = $this->validatedCategory($categoryId, $productType);
            $data['category_id'] = (string) $category->getKey();
        }

        if (isset($data['name'])) {
            $data['name'] = trim($data['name']);
            $data['slug'] = Str::slug($data['name']).'-'.Str::lower(Str::random(6));
        }

        $priceMinor = (int) ($data['price_minor'] ?? $product->price_minor);
        $compareAtMinor = $data['compare_at_price_minor'] ?? $product->compare_at_price_minor;

        if ($compareAtMinor !== null && (int) $compareAtMinor < $priceMinor) {
            throw ValidationException::withMessages([
                'compare_at_price_minor' => ['The original price must be greater than or equal to the selling price.'],
            ]);
        }

        if ($request->hasFile('images')) {
            $data['images'] = $this->images->store($data['images'], $data['name'] ?? $product->name);
        }

        if ($request->hasFile('video')) {
            $data['video'] = $this->storeVideo($request);
        }

        $product->fill($data);
        $product->save();

        return response()->json(['message' => 'Product updated successfully.', 'data' => $product->fresh()]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $product = Product::where('seller_id', (string) $request->user()->getKey())
            ->where('id', $id)
            ->firstOrFail();

        $product->status = 'archived';
        $product->save();

        return response()->json(['message' => 'Product archived successfully.']);
    }

    private function validatedCategory(string $categoryId, string $productType): Category
    {
        $category = Category::find($categoryId);

        if (! $category || ! $category->is_active || $category->product_type !== $productType) {
            throw ValidationException::withMessages([
                'category_id' => ['Choose an active category matching the selected product type.'],
            ]);
        }

        return $category;
    }

    private function storeVideo(Request $request): array
    {
        $file = $request->file('video');
        $path = $file->store('products/videos', 'public');

        return [
            'url' => Storage::disk('public')->url($path),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'original_name' => $file->getClientOriginalName(),
        ];
    }
}
