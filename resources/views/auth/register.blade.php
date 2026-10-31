@extends('layouts.storefront')
@section('title', 'Create an account')
@section('content')
<section class="auth-section"><div class="container"><div class="auth-card">
    <span class="eyebrow">JOIN THE STORE</span><h1>Your good things<br><em>start here.</em></h1><p class="body-copy">Create an account to save your details and keep track of future orders.</p>
    <form id="registerForm" class="mt-4" novalidate>
        <div class="mb-3"><label for="registerName" class="form-label">Full name</label><input id="registerName" name="name" type="text" class="form-control form-control-lg" autocomplete="name" required maxlength="120"></div>
        <div class="mb-3"><label for="registerEmail" class="form-label">Email address</label><input id="registerEmail" name="email" type="email" class="form-control form-control-lg" autocomplete="email" required></div>
        <div class="mb-3"><label for="registerPhone" class="form-label">Mobile number (optional)</label><input id="registerPhone" name="phone" type="tel" class="form-control form-control-lg" autocomplete="tel"></div>
        <div class="mb-3"><label for="registerPassword" class="form-label">Password</label><input id="registerPassword" name="password" type="password" class="form-control form-control-lg" minlength="10" autocomplete="new-password" required><div class="form-text">At least 10 characters, including letters and numbers.</div></div>
        <div class="mb-3"><label for="registerPasswordConfirm" class="form-label">Confirm password</label><input id="registerPasswordConfirm" name="password_confirmation" type="password" class="form-control form-control-lg" autocomplete="new-password" required></div>
        <div class="form-message" data-form-message role="alert"></div>
        <button type="submit" class="btn btn-dark btn-lg rounded-pill w-100">Create account</button>
    </form>
    <p class="auth-switch">Already have an account? <a href="{{ route('login') }}">Sign in</a></p>
</div></div></section>
@endsection
