@extends('layouts.storefront')
@section('title', 'Product details')
@section('content')
<div class="container section-space" id="productDetail" data-product-slug="{{ $slug }}">
    <nav aria-label="breadcrumb" class="mb-4"><ol class="breadcrumb small"><li class="breadcrumb-item"><a href="{{ route('home') }}">Home</a></li><li class="breadcrumb-item"><a href="{{ route('shop') }}">Shop</a></li><li class="breadcrumb-item active">Product</li></ol></nav>
    <div class="row g-5">
        <div class="col-lg-7"><div class="product-gallery">
            <div class="product-main-image"><img src="https://placehold.co/900x900/f3f0e8/65735e?text=Loading+product" alt="Product image" data-product-main></div>
            <div class="product-thumbnails" data-product-thumbnails></div>
        </div></div>
        <div class="col-lg-5"><div class="product-info-panel">
            <span class="eyebrow" data-product-type>PRODUCT</span><h1 data-product-name>Loading product…</h1>
            <div class="product-rating"><span>★★★★★</span><small>Demo product</small></div>
            <div class="product-price-line"><strong data-product-price>—</strong><del data-product-old-price></del><span class="discount-pill" data-product-discount hidden></span></div>
            <p class="body-copy" data-product-short></p>
            <div class="stock-note" data-product-stock></div>
            <div class="quantity-row"><label for="productQty">Quantity</label><div class="quantity-control"><button type="button" data-qty-minus aria-label="Decrease quantity">−</button><input id="productQty" type="number" min="1" value="1"><button type="button" data-qty-plus aria-label="Increase quantity">+</button></div></div>
            <div class="d-grid gap-2 mt-4"><button class="btn btn-dark btn-lg rounded-pill" type="button" data-add-to-cart>Add to cart</button><a href="{{ route('cart') }}" class="btn btn-outline-dark btn-lg rounded-pill">View cart</a></div>
            <div class="product-benefits"><div><svg class="icon"><use href="#i-truck"/></svg><span>Delivery details at checkout</span></div><div><svg class="icon"><use href="#i-shield"/></svg><span>Secure account and session</span></div></div>
            <hr class="my-4"><h5>Product description</h5><p class="body-copy" data-product-description>Product information will appear here.</p>
            <div class="product-attributes" data-product-attributes></div>
            <div class="product-video-wrap" data-product-video hidden><h5>Product video</h5><video controls class="w-100 rounded-4" data-product-video-player></video></div>
        </div></div>
    </div>
</div>
@endsection
