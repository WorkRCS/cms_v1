@extends('layouts.storefront')
@section('title', 'Sign in')
@section('robots', 'noindex,nofollow')
@section('content')
<section class="auth-section"><div class="container"><div class="auth-card">
    <span class="eyebrow">WELCOME BACK</span><h1>Good to see <em>you.</em></h1><p class="body-copy">Sign in to manage your account and keep shopping.</p>
    <form id="loginForm" class="mt-4" novalidate>
        <div class="mb-3"><label for="loginEmail" class="form-label">Email address</label><input id="loginEmail" name="email" type="email" class="form-control form-control-lg" autocomplete="email" required></div>
        <div class="mb-3"><label for="loginPassword" class="form-label">Password</label><input id="loginPassword" name="password" type="password" class="form-control form-control-lg" autocomplete="current-password" required></div>
        <p class="small text-secondary mb-4">Your secure session can remain active for up to 7 days on this device. Signing out ends it immediately.</p>
        <div class="form-message" data-form-message role="alert"></div>
        <button type="submit" class="btn btn-dark btn-lg rounded-pill w-100">Sign in</button>
    </form>
    <p class="auth-switch">New around here? <a href="{{ route('register') }}">Create an account</a></p>
    <div class="demo-credentials"><strong>Local demo seller</strong><span>owner@example.test</span><span>LocalDemoOnly!Change123</span><small>For local testing only. Change these before sharing the app.</small></div>
</div></div></section>
@endsection
