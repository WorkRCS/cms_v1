@extends('layouts.storefront')
@section('title', 'Data Privacy & Your Rights')
@section('meta_description', 'Find out how to request access, correction or deletion of your account information and raise a data privacy concern.')
@section('canonical_url', route('data-privacy'))
@section('content')
<section class="page-hero compact-hero">
    <div class="container">
        <span class="eyebrow">DATA PRIVACY</span>
        <h1>Your data. Your <em>choices.</em></h1>
        <p>How to ask questions or make a privacy request.</p>
    </div>
</section>
<section class="section-space">
    <article class="container legal-content">
        <p class="legal-updated">Last updated: 31 October 2026</p>
        <h2>What the store currently uses</h2>
        <p>The current website uses account details (name, email and optional phone number), any optional delivery-address fields you choose to save (such as house/flat, street, locality, city, district, state and PIN code), encrypted session storage, security tokens and browser local storage for the shopping cart. Passwords are stored as hashes. The current checkout is a preview and does not submit orders or payment details.</p>

        <h2>Your privacy requests</h2>
        <p>You may contact the store to request information about personal data associated with your account, ask for inaccurate details to be corrected, request deletion where legally available, or raise a concern about how information is handled. The store may ask you to verify your identity before acting on a request.</p>

        <h2>How to submit a request</h2>
        <dl class="legal-details">
            <dt>Privacy / support contact</dt><dd>{{ config('store.contact_email') }}</dd>
            <dt>Grievance contact</dt><dd>{{ config('store.grievance_email') }}</dd>
            <dt>Business identity</dt><dd>{{ config('store.legal_name') }}</dd>
            <dt>Business address</dt><dd>{{ config('store.business_address') }}</dd>
        </dl>
        <p>Include the email address associated with your account, the request you are making and enough detail for the store to understand it. Do not email your password, full payment-card details or other unnecessary sensitive information.</p>

        <h2>Applicable data-protection law</h2>
        <p>Requests will be handled under the data-protection and consumer laws that apply to the seller and the individual concerned. Where relevant, the Indian Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025 have phased commencement dates; legal duties apply according to the provisions and dates notified by the Government. This page does not claim that the store has completed every statutory compliance requirement.</p>

        <h2>What happens next</h2>
        <p>The store should acknowledge and assess requests, verify identity where appropriate, respond within the legally required time and explain any lawful reason for retaining information. A formal grievance process and monitored contact channel must be configured before public launch.</p>

        <p class="small text-secondary mt-5">This page is a starter privacy notice. It is not legal advice. Replace all contact placeholders and have the seller's actual data flows and legal obligations reviewed before launch.</p>
    </article>
</section>
@endsection
