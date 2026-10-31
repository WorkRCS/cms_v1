@extends('layouts.storefront')
@section('title', 'Good things, from good places')
@section('meta_description', 'Discover fresh farm produce, garden essentials and thoughtful everyday goods at Field & Found.')
@section('og_image', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=85')
@section('content')
<section class="hero-section">
    <div class="container">
        <div class="hero-panel">
            <div class="hero-content">
                <span class="eyebrow light-eyebrow"><span></span> THE INDEPENDENT STORE</span>
                <h1>Good things.<br><em>Grown with care.</em></h1>
                <p>From the farm to your front door, discover useful essentials and things made to make everyday living a little better.</p>
                <div class="d-flex flex-wrap gap-3 mt-4"><a href="{{ route('shop') }}" class="btn btn-light btn-lg rounded-pill px-4">Explore the shop <svg class="icon ms-2"><use href="#i-arrow"/></svg></a><a href="{{ route('shop', ['product_type'=>'agriculture']) }}" class="hero-text-link">Shop farm goods</a></div>
            </div>
            <div class="hero-art" aria-hidden="true">
                <div class="hero-photo hero-photo-main"></div>
                <div class="hero-photo hero-photo-small"></div>
                <div class="hero-note"><svg class="icon"><use href="#i-leaf"/></svg><span>Closer to<br>the source</span></div>
            </div>
            <div class="hero-index">01 / 03</div>
        </div>
    </div>
</section>

<section class="trust-strip">
    <div class="container"><div class="row g-3">
        <div class="col-6 col-lg-3"><div class="trust-item"><svg class="icon"><use href="#i-leaf"/></svg><span>Thoughtfully selected</span></div></div>
        <div class="col-6 col-lg-3"><div class="trust-item"><svg class="icon"><use href="#i-truck"/></svg><span>Delivery to your door</span></div></div>
        <div class="col-6 col-lg-3"><div class="trust-item"><svg class="icon"><use href="#i-shield"/></svg><span>Secure shopping</span></div></div>
        <div class="col-6 col-lg-3"><div class="trust-item"><svg class="icon"><use href="#i-check"/></svg><span>One independent seller</span></div></div>
    </div></div>
</section>

<section class="section-space">
    <div class="container">
        <div class="section-heading"><div><span class="eyebrow">FIND YOUR SOMETHING</span><h2>Shop by <em>category</em></h2></div><a class="text-link" href="{{ route('shop') }}">View everything <svg class="icon"><use href="#i-arrow"/></svg></a></div>
        @php
            $categoryImages = [
                'fresh-produce' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&q=80',
                'seeds-saplings' => 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=700&q=80',
                'organic-farm-inputs' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&q=80',
                'gardening-tools' => 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=700&q=80',
                'apparel' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&q=80',
                'electronics' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80',
                'watches' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80',
                'bags-travel' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=80',
            ];
        @endphp
        <div class="category-grid" data-category-grid data-server-rendered="true">
            @forelse ($categories as $category)
                @php $categoryImage = $category->image ?: ($categoryImages[$category->slug] ?? null); @endphp
                <a class="category-card" href="{{ route('shop', ['category' => $category->slug]) }}" @if($categoryImage) style="--category-image:url('{{ $categoryImage }}')" @endif>
                    <div>
                        <h3>{{ $category->name }}</h3>
                        <p>{{ $category->product_type === 'agriculture' ? 'Farm & garden' : 'Everyday goods' }}</p>
                    </div>
                </a>
            @empty
                <div class="empty-state">Categories will appear here soon.</div>
            @endforelse
        </div>
    </div>
</section>

<section class="section-space section-tint">
    <div class="container">
        <div class="section-heading"><div><span class="eyebrow">A FEW GOOD PICKS</span><h2>Featured <em>finds</em></h2></div><a class="text-link" href="{{ route('shop', ['featured'=>1]) }}">Shop featured <svg class="icon"><use href="#i-arrow"/></svg></a></div>
        <div class="row g-4" data-featured-grid data-server-rendered="true">
            @forelse ($featuredProducts as $product)
                @include('storefront.partials.product-card', ['product' => $product])
            @empty
                <div class="col-12"><div class="empty-state">No featured products yet.</div></div>
            @endforelse
        </div>
    </div>
</section>

<section class="story-section section-space">
    <div class="container"><div class="row align-items-center g-5">
        <div class="col-lg-6"><div class="story-image"><div class="story-image-main"></div><div class="story-stamp"><span>GOOD</span><strong>by nature</strong></div></div></div>
        <div class="col-lg-5 offset-lg-1"><span class="eyebrow">A STORE WITH A POINT OF VIEW</span><h2 class="display-heading">Small details.<br><em>Meaningful choices.</em></h2><p class="body-copy">We believe shopping should feel simple, honest and a little more personal. This independent store brings together carefully chosen farm products and everyday goods in one easy place.</p><a href="{{ route('shop') }}" class="btn btn-dark rounded-pill px-4 mt-3">Get to know the collection <svg class="icon ms-2"><use href="#i-arrow"/></svg></a></div>
    </div></div>
</section>

<section class="section-space">
    <div class="container"><div class="section-heading"><div><span class="eyebrow">JUST ARRIVED</span><h2>Fresh to the <em>store</em></h2></div><a class="text-link" href="{{ route('shop') }}">Shop all products <svg class="icon"><use href="#i-arrow"/></svg></a></div>
        <div class="row g-4" data-latest-grid data-server-rendered="true">
            @forelse ($latestProducts as $product)
                @include('storefront.partials.product-card', ['product' => $product])
            @empty
                <div class="col-12"><div class="empty-state">Products will appear here soon.</div></div>
            @endforelse
        </div>
    </div>
</section>

<section class="video-feature">
    <div class="container"><div class="video-card">
        <div class="video-copy"><span class="eyebrow light-eyebrow">BEHIND THE GOODS</span><h2>Know where<br><em>good things begin.</em></h2><p>Stories from the people, places and processes behind the products.</p><span class="video-coming"><svg class="icon"><use href="#i-play"/></svg> Store videos coming soon</span></div>
        <div class="video-visual"><div class="video-visual-inner"><svg class="icon"><use href="#i-play"/></svg></div></div>
    </div></div>
</section>

<section id="faq" class="section-space faq-section">
    <div class="container"><div class="row g-5">
        <div class="col-lg-4"><span class="eyebrow">A FEW ANSWERS</span><h2>Good to <em>know.</em></h2><p class="body-copy">A few helpful things before you shop. Still curious? Get in touch with the store.</p><a href="mailto:hello@example.test" class="text-link">Ask us a question <svg class="icon"><use href="#i-arrow"/></svg></a></div>
        <div class="col-lg-7 offset-lg-1"><div class="accordion accordion-flush" id="faqAccordion">
            <div class="accordion-item"><h3 class="accordion-header"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">What kind of products can I shop here?</button></h3><div id="faq1" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion"><div class="accordion-body">The store supports both agriculture and general merchandise, from farm produce and gardening supplies to everyday essentials.</div></div></div>
            <div class="accordion-item"><h3 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">How do I place an order?</button></h3><div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body">Browse a product, choose the quantity and add it to your cart. Checkout and order placement will be enabled once the order backend is connected.</div></div></div>
            <div class="accordion-item"><h3 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">Can product images show different angles?</button></h3><div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body">Yes. Product pages support multiple images with selectable thumbnails. Uploaded images are converted into optimized WebP sizes.</div></div></div>
            <div class="accordion-item"><h3 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">How can I contact the seller?</button></h3><div id="faq4" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body">Use the contact details published by the seller. The demo storefront currently uses a placeholder email which can be changed in the next settings milestone.</div></div></div>
        </div></div>
    </div></div>
</section>
@endsection
