<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <script nonce="{{ request()->attributes->get('csp_nonce') }}">
        try {
            const savedStorefrontLanguage = localStorage.getItem('field-found-language');
            if (['en', 'bn', 'hi'].includes(savedStorefrontLanguage)) {
                document.documentElement.lang = savedStorefrontLanguage === 'bn' ? 'bn-IN' : (savedStorefrontLanguage === 'hi' ? 'hi-IN' : 'en-IN');
                if (savedStorefrontLanguage !== 'en') document.documentElement.setAttribute('data-language-pending', 'true');
            }
        } catch (_) {}
    </script>
    <meta name="theme-color" content="#fffefa">
    @php
        $storeName = config('store.name', 'Field & Found');
        $seoTitle = trim($__env->yieldContent('seo_title', trim($__env->yieldContent('title', $storeName)).' — '.$storeName));
        $seoDescription = trim($__env->yieldContent('meta_description', 'Shop quality farm produce and everyday essentials from one trusted independent seller.'));
        $canonicalUrl = trim($__env->yieldContent('canonical_url', url()->current()));
        $ogImage = trim($__env->yieldContent('og_image', asset('favicon.svg')));
        $ogType = trim($__env->yieldContent('og_type', 'website'));
        $robotsDirective = trim($__env->yieldContent('robots', 'index,follow,max-image-preview:large'));
        $siteGraph = [
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => 'Organization',
                    '@id' => route('home').'#organization',
                    'name' => $storeName,
                    'url' => route('home'),
                ],
                [
                    '@type' => 'WebSite',
                    '@id' => route('home').'#website',
                    'name' => $storeName,
                    'url' => route('home'),
                    'publisher' => ['@id' => route('home').'#organization'],
                    'inLanguage' => 'en',
                ],
            ],
        ];
    @endphp
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="{{ $seoDescription }}">
    <meta name="robots" content="{{ $robotsDirective }}">
    <link rel="canonical" href="{{ $canonicalUrl }}">
    <meta property="og:site_name" content="{{ $storeName }}">
    <meta property="og:type" content="{{ $ogType }}">
    <meta property="og:title" content="{{ $seoTitle }}">
    <meta property="og:description" content="{{ $seoDescription }}">
    <meta property="og:url" content="{{ $canonicalUrl }}">
    <meta property="og:image" content="{{ $ogImage }}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $seoTitle }}">
    <meta name="twitter:description" content="{{ $seoDescription }}">
    <meta name="twitter:image" content="{{ $ogImage }}">
    <title>{{ $seoTitle }}</title>
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link rel="preconnect" href="https://images.unsplash.com" crossorigin>
    <link rel="dns-prefetch" href="//images.unsplash.com">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <link href="{{ asset('assets/css/storefront.css') }}?v=storefront-language-v2-20261031" rel="stylesheet">
    <script type="application/ld+json" nonce="{{ request()->attributes->get('csp_nonce') }}">{!! json_encode($siteGraph, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) !!}</script>
    @stack('structured_data')
    @stack('head')
</head>
<body>
<a class="skip-link" href="#main-content">Skip to main content</a>
<svg xmlns="http://www.w3.org/2000/svg" class="svg-defs" aria-hidden="true">
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></symbol>
    <symbol id="i-bag" viewBox="0 0 24 24"><path d="M5 8h14l1 12H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></symbol>
    <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></symbol>
    <symbol id="i-leaf" viewBox="0 0 24 24"><path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 10-6 8-16Z"/><path d="M4 21c3-6 7-9 13-12"/></symbol>
    <symbol id="i-truck" viewBox="0 0 24 24"><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/></symbol>
    <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></symbol>
    <symbol id="i-play" viewBox="0 0 24 24"><path d="m9 6 10 6-10 6z"/></symbol>
    <symbol id="i-share" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4"/></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></symbol>
    <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
    <symbol id="i-home" viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></symbol>
    <symbol id="i-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></symbol>
    <symbol id="i-sprout" viewBox="0 0 24 24"><path d="M12 21v-9"/><path d="M12 12C6 12 4 8 4 4c5 0 8 2 8 8Z"/><path d="M12 15c0-5 3-8 8-8 0 5-2 8-8 8Z"/></symbol>
</svg>

<div class="announcement-bar">
    <div class="container d-flex justify-content-center align-items-center gap-2 text-center">
        <span class="announcement-dot"></span>
        Thoughtfully selected goods, delivered to your door
    </div>
</div>

<nav class="navbar navbar-expand-lg site-nav sticky-top">
    <div class="container">
        <a class="navbar-brand brand-mark" href="{{ route('home') }}"><span class="brand-icon"><svg><use href="#i-leaf"/></svg></span>field<span>&</span>found</a>
        <select id="siteLanguageSelect" class="form-select form-select-sm language-select" aria-label="Choose language">
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
            <option value="hi">हिन्दी</option>
        </select>
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation"><svg class="icon"><use href="#i-menu"/></svg></button>
        <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav mx-auto gap-lg-3">
                <li class="nav-item"><a class="nav-link" href="{{ route('home') }}">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="{{ route('shop') }}">Shop all</a></li>
                <li class="nav-item"><a class="nav-link" href="{{ route('shop', ['product_type' => 'agriculture']) }}">Farm & garden</a></li>
                <li class="nav-item"><a class="nav-link" href="{{ route('shop', ['product_type' => 'general']) }}">Everyday goods</a></li>
            </ul>
            <div class="nav-actions d-flex align-items-center gap-3">
                <a class="icon-link" href="{{ auth()->check() ? (auth()->user()->role === 'seller' ? route('admin.dashboard') : route('account')) : route('login') }}" aria-label="Account"><svg class="icon"><use href="#i-user"/></svg><span class="d-lg-none">Account</span></a>
                <a class="icon-link cart-link" href="{{ route('cart') }}" aria-label="Shopping cart"><svg class="icon"><use href="#i-bag"/></svg><span class="cart-count" data-cart-count>0</span><span class="d-lg-none">Cart</span></a>
            </div>
        </div>
    </div>
</nav>

@php
    $mobileAccountUrl = route('login');
    $mobileAccountLabel = 'Account';
    $mobileAccountActive = request()->routeIs('login', 'register');
    if (auth()->check()) {
        $mobileIsSeller = auth()->user()->role === 'seller';
        $mobileAccountUrl = $mobileIsSeller ? route('admin.dashboard') : route('account');
        $mobileAccountLabel = $mobileIsSeller ? 'Studio' : 'Account';
        $mobileAccountActive = $mobileIsSeller ? request()->routeIs('seller.*', 'admin.dashboard') : request()->routeIs('account');
    }
@endphp
<nav class="mobile-bottom-nav" aria-label="Primary mobile navigation">
    <a class="mobile-nav-item{{ request()->routeIs('home') ? ' active' : '' }}" href="{{ route('home') }}" @if(request()->routeIs('home')) aria-current="page" @endif>
        <svg class="icon"><use href="#i-home"/></svg><span>Home</span>
    </a>
    <a class="mobile-nav-item{{ (request()->routeIs('shop', 'product.show') && !(request()->routeIs('shop') && request()->query('product_type') === 'agriculture')) ? ' active' : '' }}" href="{{ route('shop') }}" @if(request()->routeIs('shop', 'product.show') && !(request()->routeIs('shop') && request()->query('product_type') === 'agriculture')) aria-current="page" @endif>
        <svg class="icon"><use href="#i-grid"/></svg><span>Shop</span>
    </a>
    <a class="mobile-nav-item{{ (request()->routeIs('shop') && request()->query('product_type') === 'agriculture') ? ' active' : '' }}" href="{{ route('shop', ['product_type' => 'agriculture']) }}" @if(request()->routeIs('shop') && request()->query('product_type') === 'agriculture') aria-current="page" @endif>
        <svg class="icon"><use href="#i-sprout"/></svg><span>Farm</span>
    </a>
    <a class="mobile-nav-item{{ request()->routeIs('cart', 'checkout') ? ' active' : '' }}" href="{{ route('cart') }}" @if(request()->routeIs('cart', 'checkout')) aria-current="page" @endif>
        <span class="mobile-nav-icon-wrap"><svg class="icon"><use href="#i-bag"/></svg><span class="mobile-cart-count" data-cart-count>0</span></span><span>Cart</span>
    </a>
    <a class="mobile-nav-item{{ $mobileAccountActive ? ' active' : '' }}" href="{{ $mobileAccountUrl }}" @if($mobileAccountActive) aria-current="page" @endif>
        <svg class="icon"><use href="#i-user"/></svg><span>{{ $mobileAccountLabel }}</span>
    </a>
</nav>

<main id="main-content" tabindex="-1">
    @yield('content')
</main>

<footer class="site-footer">
    <div class="container">
        <div class="row gy-4 pb-5">
            <div class="col-lg-4">
                <a class="navbar-brand brand-mark footer-brand" href="{{ route('home') }}"><span class="brand-icon"><svg><use href="#i-leaf"/></svg></span>field<span>&</span>found</a>
                <p class="footer-copy mt-3">A little closer to the source. Discover thoughtful farm goods and everyday essentials, all from one independent store.</p>
            </div>
            <div class="col-6 col-lg-2 offset-lg-1">
                <h6>Explore</h6><a href="{{ route('shop') }}">Shop all</a><a href="{{ route('shop', ['product_type'=>'agriculture']) }}">Farm & garden</a><a href="{{ route('shop', ['product_type'=>'general']) }}">Everyday goods</a>
            </div>
            <div class="col-6 col-lg-2">
                <h6>Help & policies</h6><a href="{{ route('home') }}#faq">FAQs</a><a href="mailto:{{ config('store.contact_email') }}">Contact us</a><a href="{{ route('login') }}">My account</a><a href="{{ route('terms') }}">Terms & conditions</a><a href="{{ route('privacy-policy') }}">Privacy policy</a><a href="{{ route('data-privacy') }}">Data privacy & rights</a>
            </div>
            <div class="col-lg-3">
                <h6>Good things, occasionally.</h6><p class="footer-copy">Join our list for product news and seasonal updates.</p>
                <form class="newsletter-form d-flex" data-newsletter-form><input type="email" class="form-control" placeholder="Your email address" aria-label="Your email address" required><button class="btn btn-light" type="submit" aria-label="Subscribe"><svg class="icon"><use href="#i-arrow"/></svg></button></form>
            </div>
        </div>
        <div class="footer-bottom d-flex flex-column flex-md-row justify-content-between gap-2"><span>© {{ date('Y') }} Field & Found. Demo storefront.</span><span>Made for better everyday shopping.</span></div>
    </div>
</footer>

<div class="modal fade" id="confirmActionModal" tabindex="-1" aria-labelledby="confirmActionTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content feedback-modal-content">
            <div class="modal-body p-4">
                <h2 class="h5" id="confirmActionTitle">Confirm action</h2>
                <p id="confirmActionMessage" class="text-secondary"></p>
                <div class="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" class="btn btn-outline-secondary rounded-pill" data-confirm-cancel data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-dark rounded-pill" id="confirmActionApprove">Continue</button>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="feedbackModal" tabindex="-1" aria-labelledby="feedbackModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content feedback-modal-content">
            <div class="modal-body text-center p-4">
                <div class="feedback-modal-icon" id="feedbackModalIcon" aria-hidden="true"><svg class="icon"><use href="#i-check"/></svg></div>
                <h2 class="h5 mt-3" id="feedbackModalTitle">Done</h2>
                <p class="feedback-modal-message mb-4" id="feedbackModalMessage" role="status" aria-live="polite"></p>
                <button type="button" class="btn btn-dark rounded-pill px-4" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<script src="{{ asset('assets/js/vendor/purify.min.js') }}" nonce="{{ request()->attributes->get('csp_nonce') }}" defer></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous" nonce="{{ request()->attributes->get('csp_nonce') }}" defer></script>
<script src="{{ asset('assets/js/storefront.js') }}?v=storefront-admin-video-v2-20261031" nonce="{{ request()->attributes->get('csp_nonce') }}" defer></script>
<script src="{{ asset('assets/js/storefront-i18n.js') }}?v=storefront-language-v12-20261031" nonce="{{ request()->attributes->get('csp_nonce') }}" defer></script>
@stack('scripts')
</body>
</html>
