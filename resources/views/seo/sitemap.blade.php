<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <url>
        <loc>{{ route('home') }}</loc>
    </url>
    <url>
        <loc>{{ route('shop') }}</loc>
    </url>
    <url>
        <loc>{{ route('shop', ['product_type' => 'agriculture']) }}</loc>
    </url>
    <url>
        <loc>{{ route('shop', ['product_type' => 'general']) }}</loc>
    </url>
    <url>
        <loc>{{ route('privacy-policy') }}</loc>
    </url>
    <url>
        <loc>{{ route('data-privacy') }}</loc>
    </url>
    <url>
        <loc>{{ route('terms') }}</loc>
    </url>
    @foreach ($products as $product)
        <url>
            <loc>{{ route('product.show', ['slug' => $product->slug]) }}</loc>
            @if ($product->updated_at)
                <lastmod>{{ $product->updated_at->toAtomString() }}</lastmod>
            @endif
            @foreach (($product->images ?? []) as $image)
                @php
                    $imageUrl = data_get($image, 'variants.large') ?: data_get($image, 'url');
                @endphp
                @if ($imageUrl)
                    <image:image>
                        <image:loc>{{ $imageUrl }}</image:loc>
                    </image:image>
                @endif
            @endforeach
        </url>
    @endforeach
</urlset>
