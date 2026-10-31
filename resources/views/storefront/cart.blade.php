@extends('layouts.storefront')
@section('title', 'Your cart')
@section('robots', 'noindex,nofollow')
@section('content')
<section class="page-hero compact-hero"><div class="container"><span class="eyebrow">YOUR PICKS</span><h1>Your <em>cart.</em></h1><p>A little collection of good things.</p></div></section>
<section class="section-space pt-4"><div class="container"><div class="row g-5">
    <div class="col-lg-8"><div data-cart-items><div class="loading-line">Loading your cart…</div></div></div>
    <div class="col-lg-4"><aside class="cart-summary"><h2>Order summary</h2><div class="summary-line"><span>Subtotal</span><strong data-cart-subtotal>₹0.00</strong></div><div class="summary-line"><span>Delivery</span><span>Calculated at checkout</span></div><hr><div class="summary-line summary-total"><span>Total</span><strong data-cart-total>₹0.00</strong></div><a class="btn btn-dark btn-lg rounded-pill w-100 mt-3" href="{{ route('checkout') }}">Continue to checkout</a><p class="small text-secondary mt-3 mb-0">Checkout and order placement will be enabled in the next backend milestone.</p></aside></div>
</div></div></section>
@endsection
