@extends('layouts.storefront')
@section('title', 'My account')
@section('robots', 'noindex,nofollow')
@section('content')
<section class="page-hero compact-hero"><div class="container"><span class="eyebrow">YOUR ACCOUNT</span><h1>Hello, <em>there.</em></h1><p>Manage your account and shopping activity.</p></div></section>
<section class="section-space"><div class="container"><div class="account-card">
    <div class="account-avatar"><svg class="icon"><use href="#i-user"/></svg></div>
    <div class="flex-grow-1"><h3 data-account-name>Loading account…</h3><p class="text-secondary mb-0" data-account-email></p><span class="badge text-bg-light mt-2" data-account-role>Customer</span></div>
    <button class="btn btn-outline-dark rounded-pill" type="button" data-logout>Sign out</button>
</div>
<div class="row g-4 mt-2"><div class="col-md-6"><div class="account-feature"><h5>My orders</h5><p>Order history and tracking will appear here when the order backend is connected.</p><span class="text-secondary small">Coming in the next milestone</span></div></div><div class="col-md-6"><div class="account-feature"><h5>Saved addresses</h5><p>Keep your delivery information ready for your next purchase.</p><span class="text-secondary small">Coming in the next milestone</span></div></div></div>
</div></section>
@endsection
