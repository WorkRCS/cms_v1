@extends('layouts.storefront')
@php
    $images = is_array($product->images) ? $product->images : [];
    $primaryImage = collect($images)->firstWhere('is_primary', true) ?? ($images[0] ?? null);
    $mainImageUrl = data_get($primaryImage, 'variants.large') ?: data_get($primaryImage, 'url') ?: asset('favicon.svg');
    $mainImageAlt = data_get($primaryImage, 'alt') ?: $product->name;
    $imageUrls = collect($images)->map(fn ($image) => data_get($image, 'variants.large') ?: data_get($image, 'url'))->filter()->values()->all();
    if (count($imageUrls) === 0) {
        $imageUrls = [$mainImageUrl];
    }
    $plainDescription = trim(preg_replace('/\s+/', ' ', strip_tags((string) ($product->short_description ?: $product->description))));
    $seoDescription = \Illuminate\Support\Str::limit($plainDescription ?: ('Shop '.$product->name.' at '.config('store.name', 'Field & Found').'.'), 155, '…');
    $currency = strtoupper((string) ($product->currency ?: 'INR'));
    $formattedPrice = number_format(((int) $product->price_minor) / 100, 2, '.', '');
    $availability = $product->track_inventory === false || (int) $product->stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock';
    $productSchema = [
        '@context' => 'https://schema.org',
        '@type' => 'Product',
        'name' => (string) $product->name,
        'description' => $plainDescription,
        'image' => $imageUrls,
        'url' => route('product.show', ['slug' => $product->slug]),
        'category' => $product->product_type === 'agriculture' ? 'Farm and garden' : 'Everyday goods',
        'offers' => [
            '@type' => 'Offer',
            'url' => route('product.show', ['slug' => $product->slug]),
            'price' => $formattedPrice,
            'priceCurrency' => $currency,
            'availability' => $availability,
            'itemCondition' => 'https://schema.org/NewCondition',
        ],
    ];
    if ($product->brand) {
        $productSchema['brand'] = ['@type' => 'Brand', 'name' => (string) $product->brand];
    }
    if ($product->sku) {
        $productSchema['sku'] = (string) $product->sku;
    }
    if (! empty($product->attributes) && is_array($product->attributes)) {
        $productSchema['additionalProperty'] = collect($product->attributes)->map(fn ($value, $key) => [
            '@type' => 'PropertyValue',
            'name' => (string) $key,
            'value' => is_scalar($value) ? (string) $value : json_encode($value),
        ])->values()->all();
    }
    $breadcrumbSchema = [
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => route('home')],
            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Shop', 'item' => route('shop')],
            ['@type' => 'ListItem', 'position' => 3, 'name' => (string) $product->name, 'item' => route('product.show', ['slug' => $product->slug])],
        ],
    ];
    $thumbnailImages = collect($images);
@endphp
@section('title', $product->name.' | '.config('store.name', 'Field & Found'))
@section('meta_description', $seoDescription)
@section('canonical_url', route('product.show', ['slug' => $product->slug]))
@section('og_title', $product->name.' | '.config('store.name', 'Field & Found'))
@section('og_description', $seoDescription)
@section('og_image', $mainImageUrl)
@section('og_type', 'product')
@push('head')
    <link rel="preload" as="image" href="{{ $mainImageUrl }}" fetchpriority="high">
@endpush
@push('structured_data')
    <script type="application/ld+json">{!! json_encode($productSchema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) !!}</script>
    <script type="application/ld+json">{!! json_encode($breadcrumbSchema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) !!}</script>
@endpush
@section('content')
<div class="container section-space" id="productDetail" data-product-slug="{{ $product->slug }}">
    <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb small">
            <li class="breadcrumb-item"><a href="{{ route('home') }}">Home</a></li>
            <li class="breadcrumb-item"><a href="{{ route('shop') }}">Shop</a></li>
            <li class="breadcrumb-item active" aria-current="page">{{ $product->name }}</li>
        </ol>
    </nav>
    <div class="row g-5">
        <div class="col-lg-7">
            <div class="product-gallery">
                <div class="product-main-image">
                    <img
                        src="{{ $mainImageUrl }}"
                        @if (data_get($primaryImage, 'variants.medium') && data_get($primaryImage, 'variants.large'))
                            srcset="{{ data_get($primaryImage, 'variants.medium') }} 640w, {{ data_get($primaryImage, 'variants.large') }} 1200w"
                        @endif
                        sizes="(max-width: 991px) 100vw, 58vw"
                        alt="{{ $mainImageAlt }}"
                        width="1200"
                        height="1200"
                        decoding="async"
                        fetchpriority="high"
                        data-product-main
                    >
                </div>
                <div class="product-thumbnails" data-product-thumbnails>
                    @foreach ($thumbnailImages as $index => $image)
                        @php
                            $thumbnailUrl = data_get($image, 'variants.thumbnail') ?: data_get($image, 'url');
                            $largeUrl = data_get($image, 'variants.large') ?: data_get($image, 'url');
                        @endphp
                        @if ($thumbnailUrl)
                            <button class="product-thumb{{ $index === 0 ? ' active' : '' }}" type="button" data-image-index="{{ $index }}" aria-label="View product image {{ $index + 1 }}">
                                <img src="{{ $thumbnailUrl }}" alt="{{ data_get($image, 'alt') ?: ($product->name.' image '.($index + 1)) }}" width="82" height="82" loading="lazy" decoding="async" data-large-image="{{ $largeUrl }}">
                            </button>
                        @endif
                    @endforeach
                </div>
            </div>
        </div>
        <div class="col-lg-5">
            <div class="product-info-panel">
                <span class="eyebrow" data-product-type>{{ $product->product_type === 'agriculture' ? 'FARM & GARDEN' : 'EVERYDAY GOODS' }}</span>
                <h1 data-product-name>{{ $product->name }}</h1>
                @if ($product->brand)
                    <p class="small text-secondary mb-2">{{ $product->brand }}</p>
                @endif
                <div class="product-price-line">
                    <strong data-product-price>₹{{ number_format(((int) $product->price_minor) / 100, 2) }}</strong>
                    <del data-product-old-price>@if ($product->compare_at_price_minor && $product->compare_at_price_minor > $product->price_minor) ₹{{ number_format(((int) $product->compare_at_price_minor) / 100, 2) }} @endif</del>
                    <span class="discount-pill" data-product-discount @if (!$product->compare_at_price_minor || $product->compare_at_price_minor <= $product->price_minor) hidden @endif>
                        @if ($product->compare_at_price_minor && $product->compare_at_price_minor > $product->price_minor)
                            {{ (int) round((1 - ($product->price_minor / $product->compare_at_price_minor)) * 100) }}% off
                        @endif
                    </span>
                </div>
                @if ($product->short_description)
                    <p class="body-copy" data-product-short>{{ $product->short_description }}</p>
                @else
                    <p class="body-copy" data-product-short>{{ \Illuminate\Support\Str::limit($plainDescription, 180) }}</p>
                @endif
                <div class="stock-note" data-product-stock>
                    {{ $product->track_inventory === false ? 'Available' : ((int) $product->stock > 0 ? $product->stock.' in stock' : 'Out of stock') }}
                </div>
                <div class="quantity-row">
                    <label for="productQty">Quantity</label>
                    <div class="quantity-control">
                        <button type="button" data-qty-minus aria-label="Decrease quantity">−</button>
                        <input id="productQty" type="number" min="1" value="1" inputmode="numeric" aria-label="Quantity">
                        <button type="button" data-qty-plus aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <div class="d-grid gap-2 mt-4">
                    <button class="btn btn-dark btn-lg rounded-pill" type="button" data-add-to-cart>Add to cart</button>
                    <a href="{{ route('cart') }}" class="btn btn-outline-dark btn-lg rounded-pill">View cart</a>
                </div>
                <div class="product-benefits">
                    <div><svg class="icon"><use href="#i-truck"/></svg><span>Delivery details at checkout</span></div>
                    <div><svg class="icon"><use href="#i-shield"/></svg><span>Secure account and session</span></div>
                </div>
                <hr class="my-4">
                <h2 class="h5">Product description</h2>
                <p class="body-copy" data-product-description>{{ $product->description ?: $product->short_description }}</p>
                @if (is_array($product->attributes) && count($product->attributes))
                    <div class="product-attributes" data-product-attributes>
                        @foreach ($product->attributes as $key => $value)
                            <div class="attribute-chip">
                                <small>{{ str($key)->replace(['_', '-'], ' ')->title() }}</small>
                                <strong>{{ is_scalar($value) ? $value : json_encode($value) }}</strong>
                            </div>
                        @endforeach
                    </div>
                @else
                    <div class="product-attributes" data-product-attributes></div>
                @endif
                @if (is_array($product->video) && !empty($product->video['url']))
                    <div class="product-video-wrap mt-4" data-product-video>
                        <h2 class="h5">Product video</h2>
                        <video controls class="w-100 rounded-4" preload="none" data-product-video-player src="{{ $product->video['url'] }}"></video>
                    </div>
                @else
                    <div class="product-video-wrap" data-product-video hidden><h2 class="h5">Product video</h2><video controls class="w-100 rounded-4" preload="none" data-product-video-player></video></div>
                @endif
            </div>
        </div>
    </div>
</div>
<script type="application/json" id="initialProductData">@json($product->toArray())</script>
@endsection
