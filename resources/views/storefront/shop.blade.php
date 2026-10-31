@extends('layouts.storefront')
@section('title', 'Shop all products')
@section('content')
<section class="page-hero"><div class="container"><span class="eyebrow">THE COLLECTION</span><h1>Find your <em>something.</em></h1><p>Good things for the garden, the home and everything in between.</p></div></section>
<section class="section-space pt-4"><div class="container">
    <div class="shop-toolbar row align-items-center g-3 mb-4">
        <div class="col-lg-5"><div class="search-box"><svg class="icon"><use href="#i-search"/></svg><input class="form-control" id="shopSearch" type="search" placeholder="Search products…" aria-label="Search products"></div></div>
        <div class="col-6 col-lg-3"><select class="form-select" id="shopType" aria-label="Product type"><option value="">All product types</option><option value="agriculture">Farm & garden</option><option value="general">Everyday goods</option></select></div>
        <div class="col-6 col-lg-3"><select class="form-select" id="shopSort" aria-label="Sort products"><option value="latest">Newest first</option><option value="price_low">Price: low to high</option><option value="price_high">Price: high to low</option><option value="name">Name: A to Z</option></select></div>
        <div class="col-lg-1 text-lg-end"><span class="result-count" data-result-count>—</span></div>
    </div>
    <div class="row g-4">
        <aside class="col-lg-3"><div class="filter-panel"><h5>Categories</h5><div class="category-filters" data-shop-categories><span class="text-secondary small">Loading…</span></div><hr><h5>Quick links</h5><a href="{{ route('shop', ['product_type'=>'agriculture']) }}">Farm & garden</a><a href="{{ route('shop', ['product_type'=>'general']) }}">Everyday goods</a><a href="{{ route('shop') }}">All products</a></div></aside>
        <div class="col-lg-9"><div class="row g-4" data-shop-grid><div class="col-12"><div class="loading-line">Loading products…</div></div></div><nav class="mt-5" aria-label="Product pages"><ul class="pagination justify-content-center" data-shop-pagination></ul></nav></div>
    </div>
</div></section>
@endsection
