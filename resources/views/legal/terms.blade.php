@extends('layouts.storefront')
@section('title', 'Terms & Conditions')
@section('meta_description', 'Read the Field & Found website terms, account rules and important pre-launch shopping information.')
@section('canonical_url', route('terms'))
@section('content')
<section class="page-hero compact-hero">
    <div class="container">
        <span class="eyebrow">THE IMPORTANT DETAILS</span>
        <h1>Terms & <em>conditions.</em></h1>
        <p>How this website may be used and what to know before shopping.</p>
    </div>
</section>
<section class="section-space">
    <article class="container legal-content">
        <p class="legal-updated">Last updated: 31 October 2026</p>
        <div class="legal-notice">
            <strong>Pre-launch notice:</strong> This website is currently a demonstration storefront. The checkout is a preview only; it does not create an order or accept payment. Do not submit payment details or rely on a product listing as an accepted order.
        </div>

        <h2>1. Who operates this website</h2>
        <p>Field & Found is the storefront name. The seller or legal entity operating the store must be identified before the website is opened for public transactions.</p>
        <dl class="legal-details">
            <dt>Seller / legal business name</dt><dd>{{ config('store.legal_name') }}</dd>
            <dt>Business address</dt><dd>{{ config('store.business_address') }}</dd>
            <dt>Customer support</dt><dd>{{ config('store.contact_email') }} · {{ config('store.contact_phone') }}</dd>
            <dt>Governing law and jurisdiction</dt><dd>{{ config('store.jurisdiction') }}</dd>
        </dl>

        <h2>2. Website use and accounts</h2>
        <p>You must provide accurate account information, keep your password confidential and promptly notify the seller if you suspect unauthorised account use. You may not misuse the website, attempt to bypass security controls, interfere with its operation or upload unlawful or harmful content.</p>

        <h2>3. Product information, prices and availability</h2>
        <p>Product names, descriptions, images, specifications, stock and prices are displayed for information. Demo content may be illustrative and must be replaced with verified seller information before launch. Product images may be representative; the seller should disclose material differences, measurements, ingredients, origin and other legally required details for each real product.</p>
        <p>Prices, applicable taxes, delivery charges, discounts and stock must be confirmed before any future order is accepted. A product displayed on this pre-launch website is not a promise that it is currently available for purchase.</p>

        <h2>4. Orders, payment, shipping and returns</h2>
        <p>Online order placement, payment processing, shipping calculations, cancellation and returns workflows are not yet connected. No purchase contract is formed through the current checkout preview. Before accepting real orders, the seller must publish accurate payment, delivery, cancellation, refund, replacement and return terms, including any product-specific or statutory exceptions.</p>

        <h2>5. Intellectual property</h2>
        <p>Website design, branding, text and software are protected by applicable intellectual-property laws. Product names, marks and images may belong to their respective owners. You may not copy or commercially reuse content without permission from its rights holder.</p>

        <h2>6. Third-party services and availability</h2>
        <p>The website may rely on hosting, database, content-delivery and other service providers. The seller will take reasonable steps to maintain availability and security, but uninterrupted access cannot be guaranteed.</p>

        <h2>7. Liability and changes</h2>
        <p>Nothing in these terms excludes a right or remedy that cannot lawfully be excluded. To the extent permitted by applicable law, the seller is not responsible for indirect loss arising from use of a demonstration or temporarily unavailable website. These terms should be reviewed and adapted before public commerce begins.</p>

        <h2>8. Contact and complaints</h2>
        <p>For questions about these terms, contact {{ config('store.contact_email') }}. Grievance contact: {{ config('store.grievance_email') }}. Replace these configuration placeholders with monitored business contact details before launch.</p>

        <p class="small text-secondary mt-5">This starter text is general information, not legal advice or a declaration of legal compliance. The seller must adapt it to the actual business, products, sales process and applicable jurisdictions and obtain professional review.</p>
    </article>
</section>
@endsection
