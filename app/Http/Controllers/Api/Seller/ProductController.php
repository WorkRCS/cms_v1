<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Services\ProductImageService;
use App\Services\YouTubeVideoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductImageService $images,
        private readonly YouTubeVideoService $youtubeVideos,
    ) {
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
                'total_customers' => User::where('role', 'customer')->count(),
                'active_customer_accounts' => User::where('role', 'customer')->where('is_active', true)->count(),
                'inactive_customer_accounts' => User::where('role', 'customer')->where('is_active', false)->count(),
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
            'video_youtube_url' => ['nullable', 'string', 'max:500', 'url'],
            'video_title' => ['nullable', 'string', 'max:180'],
            'video_layout' => ['nullable', 'in:auto,shorts,standard'],
        ]);

        $category = $this->validatedCategory($data['category_id'], $data['product_type']);

        if (filled($data['video_youtube_url'] ?? null) && $request->hasFile('video')) {
            throw ValidationException::withMessages([
                'video_youtube_url' => ['Choose either a YouTube link or an uploaded video, not both.'],
            ]);
        }

        // Validate supported YouTube hosts before writing any image files.
        $video = filled($data['video_youtube_url'] ?? null)
            ? $this->youtubeVideos->fromUrl(
                $data['video_youtube_url'],
                $data['video_layout'] ?? 'auto',
                $data['video_title'] ?? null,
            )
            : null;

        $images = $this->images->store($data['images'], $data['name']);
        if ($request->hasFile('video')) {
            $video = $this->storeVideo($request);
        }

        $baseSlug = Str::slug($data['name']) ?: 'product';
        $slug = Product::where('slug', $baseSlug)->exists()
            ? $baseSlug.'-'.Str::lower(Str::random(5))
            : $baseSlug;

        $product = Product::create([
            'seller_id' => (string) $request->user()->getKey(),
            'category_id' => (string) $category->getKey(),
            'name' => trim($data['name']),
            'slug' => $slug,
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

        $this->clearPublicCatalogueCache();

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
            'video_youtube_url' => ['sometimes', 'nullable', 'string', 'max:500', 'url'],
            'video_title' => ['sometimes', 'nullable', 'string', 'max:180'],
            'video_layout' => ['sometimes', 'in:auto,shorts,standard'],
            'remove_video' => ['sometimes', 'boolean'],
        ]);

        $productType = $data['product_type'] ?? $product->product_type;
        $categoryId = $data['category_id'] ?? $product->category_id;

        if (isset($data['category_id']) || isset($data['product_type'])) {
            $category = $this->validatedCategory($categoryId, $productType);
            $data['category_id'] = (string) $category->getKey();
        }

        if (isset($data['name'])) {
            $data['name'] = trim($data['name']);
            // Keep published product URLs stable when a seller edits the title.
        }

        $priceMinor = (int) ($data['price_minor'] ?? $product->price_minor);
        $compareAtMinor = array_key_exists('compare_at_price_minor', $data)
            ? $data['compare_at_price_minor']
            : $product->compare_at_price_minor;

        if ($compareAtMinor !== null && (int) $compareAtMinor < $priceMinor) {
            throw ValidationException::withMessages([
                'compare_at_price_minor' => ['The original price must be greater than or equal to the selling price.'],
            ]);
        }

        $previousImages = is_array($product->images) ? $product->images : [];
        $imagesWereReplaced = $request->hasFile('images');

        if ($imagesWereReplaced) {
            $data['images'] = $this->images->store($data['images'], $data['name'] ?? $product->name);
        }

        if (filled($data['video_youtube_url'] ?? null) && $request->hasFile('video')) {
            throw ValidationException::withMessages([
                'video_youtube_url' => ['Choose either a YouTube link or an uploaded video, not both.'],
            ]);
        }

        $previousVideo = is_array($product->video) ? $product->video : [];
        $previousUploadPath = ($previousVideo['type'] ?? null) === 'upload'
            ? ($previousVideo['path'] ?? null)
            : null;
        $videoWasReplaced = false;

        if (filled($data['video_youtube_url'] ?? null)) {
            $data['video'] = $this->youtubeVideos->fromUrl(
                $data['video_youtube_url'],
                $data['video_layout'] ?? 'auto',
                $data['video_title'] ?? null,
            );
            $videoWasReplaced = true;
        } elseif ($request->boolean('remove_video')) {
            $data['video'] = null;
            $videoWasReplaced = true;
        } elseif ($request->hasFile('video')) {
            $data['video'] = $this->storeVideo($request);
            $videoWasReplaced = true;
        } elseif ($previousVideo !== []) {
            // Allow title/layout adjustments without uploading the same video again.
            if (array_key_exists('video_title', $data)) {
                $title = trim((string) ($data['video_title'] ?? ''));
                $previousVideo['title'] = $title !== '' ? mb_substr($title, 0, 180) : null;
                $data['video'] = $previousVideo;
            }

            if (
                isset($data['video_layout']) &&
                in_array($data['video_layout'], ['shorts', 'standard'], true)
            ) {
                $previousVideo['layout'] = $data['video_layout'];
                $data['video'] = $previousVideo;
            }
        }

        unset($data['video_youtube_url'], $data['video_title'], $data['video_layout'], $data['remove_video']);

        $product->fill($data);
        $product->save();

        if ($imagesWereReplaced && $previousImages !== []) {
            $this->images->delete($previousImages);
        }

        if ($videoWasReplaced && is_string($previousUploadPath) && $previousUploadPath !== '') {
            $nextVideo = is_array($product->video) ? $product->video : [];
            if (($nextVideo['path'] ?? null) !== $previousUploadPath) {
                Storage::disk('public')->delete($previousUploadPath);
            }
        }

        $this->clearPublicCatalogueCache();

        return response()->json(['message' => 'Product updated successfully.', 'data' => $product->fresh()]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $product = Product::where('seller_id', (string) $request->user()->getKey())
            ->where('id', $id)
            ->firstOrFail();

        $product->status = 'archived';
        $product->save();
        $this->clearPublicCatalogueCache();

        return response()->json(['message' => 'Product archived successfully.']);
    }

    private function clearPublicCatalogueCache(): void
    {
        Cache::forget('seo.sitemap.v1');
        Cache::forget('storefront.home.featured.v1');
        Cache::forget('storefront.home.featured.v2');
        Cache::forget('storefront.home.latest.v1');
        Cache::forget('storefront.home.latest.v2');
        Cache::forget('storefront.home.latest.v3');
        Cache::forget('storefront.home.videos.v1');
        Cache::forget('storefront.home.videos.v2');
        Cache::forget('storefront.home.videos.v3');
        Cache::forget('storefront.home.videos.v4');
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

        if (! is_string($path) || $path === '') {
            throw new RuntimeException('The server could not save the uploaded product video.');
        }

        $layout = in_array($request->input('video_layout'), ['shorts', 'standard'], true)
            ? $request->input('video_layout')
            : 'standard';
        $title = trim((string) $request->input('video_title', ''));

        return [
            'type' => 'upload',
            'layout' => $layout,
            'title' => $title !== '' ? mb_substr($title, 0, 180) : null,
            'url' => Storage::disk('public')->url($path),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'original_name' => $file->getClientOriginalName(),
        ];
    }
}
