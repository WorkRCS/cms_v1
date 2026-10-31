@extends('layouts.storefront')
@section('title', 'Shop farm produce & everyday essentials')
@section('meta_description', 'Explore farm produce, seeds, garden supplies and useful everyday goods from Field & Found.')
@php
    $shopCanonicalParams = [];
    if (!empty($filters['category'])) {
        $shopCanonicalParams['category'] = $filters['category'];
    } elseif (!empty($filters['product_type'])) {
        $shopCanonicalParams['product_type'] = $filters['product_type'];
    }
    $shopCanonical = route('shop', $shopCanonicalParams);
    $shopHasSearchFilters = !empty($filters['q'])
        || !empty($filters['featured'])
        || (($filters['sort'] ?? 'latest') !== 'latest')
        || $products->currentPage() > 1;
@endphp
@section('canonical_url', $shopCanonical)
@section('robots', $shopHasSearchFilters ? 'noindex,follow' : 'index,follow,max-image-preview:large')
@section('content')
<section class="page-hero"><div class="container"><span class="eyebrow">THE COLLECTION</span><h1>Find your <em>something.</em></h1><p>Good things for the garden, the home and everything in between.</p></div></section>
<section class="section-space pt-4"><div class="container">
    <div class="shop-toolbar row align-items-center g-3 mb-4">
        <div class="col-lg-5"><div class="search-box"><svg class="icon"><use href="#i-search"/></svg><input class="form-control" id="shopSearch" type="search" placeholder="Search products…" aria-label="Search products" value="{{ $filters['q'] ?? '' }}"></div></div>
        <div class="col-6 col-lg-3"><select class="form-select" id="shopType" aria-label="Product type"><option value="" @selected(empty($filters['product_type']))>All product types</option><option value="agriculture" @selected(($filters['product_type'] ?? '') === 'agriculture')>Farm & garden</option><option value="general" @selected(($filters['product_type'] ?? '') === 'general')>Everyday goods</option></select></div>
        <div class="col-6 col-lg-3"><select class="form-select" id="shopSort" aria-label="Sort products"><option value="latest" @selected(($filters['sort'] ?? 'latest') === 'latest')>Newest first</option><option value="price_low" @selected(($filters['sort'] ?? '') === 'price_low')>Price: low to high</option><option value="price_high" @selected(($filters['sort'] ?? '') === 'price_high')>Price: high to low</option><option value="name" @selected(($filters['sort'] ?? '') === 'name')>Name: A to Z</option></select></div>
        <div class="col-lg-1 text-lg-end"><span class="result-count" data-result-count>{{ $products->total() }} items</span></div>
    </div>
    <div class="row g-4">
        <aside class="col-lg-3"><div class="filter-panel"><h2>Categories</h2><div class="category-filters" data-shop-categories data-server-rendered="true">
            <button class="category-filter-btn{{ empty($filters['category']) ? ' active' : '' }}" data-category="">All categories</button>
            @foreach ($categories as $category)
                <button class="category-filter-btn{{ ($filters['category'] ?? '') === $category->slug ? ' active' : '' }}" data-category="{{ $category->slug }}" data-category-name>{{ $category->name }}</button>
            @endforeach
        </div><hr><h2>Quick links</h2><a href="{{ route('shop', ['product_type'=>'agriculture']) }}">Farm & garden</a><a href="{{ route('shop', ['product_type'=>'general']) }}">Everyday goods</a><a href="{{ route('shop') }}">All products</a></div></aside>
        <div class="col-lg-9"><div class="row g-4" data-shop-grid data-server-rendered="true" data-current-page="{{ $products->currentPage() }}">
                @forelse ($products as $product)
                    @include('storefront.partials.product-card', ['product' => $product])
                @empty
                    <div class="col-12"><div class="empty-state">No products match those filters. Try another search.</div></div>
                @endforelse
            </div><nav class="mt-5" aria-label="Product pages"><ul class="pagination justify-content-center" data-shop-pagination>
                @for ($page = 1; $page <= $products->lastPage(); $page++)
                    <li class="page-item{{ $page === $products->currentPage() ? ' active' : '' }}">
                        <button class="page-link" type="button" data-page="{{ $page }}" @if($page === $products->currentPage()) aria-current="page" @endif>{{ $page }}</button>
                    </li>
                @endfor
            </ul></nav></div>
    </div>
</div></section>
@endsection
