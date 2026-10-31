@php
    $cardImages = is_array($product->images) ? $product->images : [];
    $cardPrimary = collect($cardImages)->firstWhere('is_primary', true) ?? ($cardImages[0] ?? null);
    $cardMediumVariant = data_get($cardPrimary, 'variants.medium');
    $cardThumbnailVariant = data_get($cardPrimary, 'variants.thumbnail');
    $cardImage = $cardMediumVariant ?: $cardThumbnailVariant ?: data_get($cardPrimary, 'url') ?: asset('favicon.svg');
    $cardImageLarge = $cardMediumVariant ? data_get($cardPrimary, 'variants.large') : null;
    if (! $cardMediumVariant && ! $cardThumbnailVariant && str_contains($cardImage, 'images.unsplash.com/')) {
        $cardImage = preg_replace('/([?&])w=\\d+/', '$1w=640', $cardImage);
        $cardImage = preg_replace('/([?&])q=\\d+/', '$1q=68', $cardImage);
        $cardImage .= (str_contains($cardImage, '?') ? '&' : '?').'auto=format&fit=crop';
    }
    $cardType = $product->product_type === 'agriculture' ? 'Farm & garden' : 'Everyday goods';
@endphp
<div class="col-6 col-md-4 col-xl-3">
    <article class="product-card">
        <a class="product-card-media" href="{{ route('product.show', ['slug' => $product->slug]) }}">
            <img
                src="{{ $cardImage }}"
                @if ($cardImageLarge && $cardImageLarge !== $cardImage)
                    srcset="{{ $cardImage }} 640w, {{ $cardImageLarge }} 1200w"
                @endif
                sizes="(max-width: 767px) 50vw, (max-width: 1199px) 33vw, 25vw"
                alt="{{ data_get($cardPrimary, 'alt') ?: $product->name }}" data-i18n-ignore
                width="640"
                height="736"
                loading="lazy"
                decoding="async"
            >
            <span class="product-tag">{{ $cardType }}</span>
            @if (($product->video['type'] ?? null) === 'youtube')
                <span class="product-video-badge"><svg class="icon"><use href="#i-play"/></svg> Watch video</span>
            @endif
        </a>
        <div class="product-card-body">
            <div class="product-card-type" @if($product->brand) data-i18n-ignore @endif>{{ $product->brand ?: $cardType }}</div>
            <h3><a href="{{ route('product.show', ['slug' => $product->slug]) }}">{{ $product->name }}</a></h3>
            <div class="product-card-price">
                ₹{{ number_format(((int) $product->price_minor) / 100, 2) }}
                @if ($product->compare_at_price_minor > $product->price_minor)
                    <del>₹{{ number_format(((int) $product->compare_at_price_minor) / 100, 2) }}</del>
                @endif
            </div>
        </div>
    </article>
</div>
