@extends('layouts.storefront')
@section('title', 'Checkout')
@section('robots', 'noindex,nofollow')
@section('content')
<section class="page-hero compact-hero"><div class="container"><span class="eyebrow">ALMOST THERE</span><h1>Checkout <em>preview.</em></h1><p>Your delivery and payment details will be collected here.</p></div></section>
<section class="section-space"><div class="container"><div class="checkout-preview mx-auto">
    <div class="checkout-icon"><svg class="icon"><use href="#i-bag"/></svg></div><h2>Order placement is the next step.</h2><p class="body-copy">The cart is working locally in your browser. We will connect address validation, delivery charges, Cash on Delivery, online payment and secure order creation after the order APIs are added.</p>
    <div class="d-flex gap-2 justify-content-center flex-wrap mt-4"><a href="{{ route('cart') }}" class="btn btn-outline-dark rounded-pill px-4">Back to cart</a><a href="{{ route('shop') }}" class="btn btn-dark rounded-pill px-4">Continue shopping</a></div>
</div></div></section>
@endsection
