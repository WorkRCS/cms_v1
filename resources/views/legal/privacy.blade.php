@extends('layouts.storefront')
@section('title', 'Privacy Policy')
@section('meta_description', 'Learn what personal information Field & Found collects, why it is used and how to contact the store about privacy.')
@section('canonical_url', route('privacy-policy'))
@section('content')
<section class="page-hero compact-hero">
    <div class="container">
        <span class="eyebrow">YOUR INFORMATION</span>
        <h1>Privacy <em>policy.</em></h1>
        <p>How the current Field & Found website handles personal information.</p>
    </div>
</section>
<section class="section-space">
    <article class="container legal-content">
        <p class="legal-updated">Last updated: 31 October 2026</p>
        <div class="legal-notice">
            This policy describes the current pre-launch website implementation. It must be updated before enabling real orders, payments, analytics, advertising, newsletter subscriptions or additional third-party services.
        </div>

        <h2>1. Who is responsible for your information</h2>
        <p>The storefront is operated under the name Field & Found. The seller or legal entity responsible for personal information must be identified as follows:</p>
        <dl class="legal-details">
            <dt>Seller / data controller contact</dt><dd>{{ config('store.legal_name') }}</dd>
            <dt>Business address</dt><dd>{{ config('store.business_address') }}</dd>
            <dt>Privacy contact</dt><dd>{{ config('store.contact_email') }}</dd>
            <dt>Grievance contact</dt><dd>{{ config('store.grievance_email') }}</dd>
        </dl>

        <h2>2. Information the current website handles</h2>
        <ul>
            <li><strong>Account details:</strong> name, email address and optional phone number supplied during registration.</li>
            <li><strong>Authentication and security:</strong> password hashes (not plain-text passwords), session identifiers, CSRF/security tokens and login activity needed to operate and protect accounts.</li>
            <li><strong>Shopping cart:</strong> the current cart is stored in your browser's local storage. It is not currently submitted to a server as an order.</li>
            <li><strong>Technical information:</strong> the hosting platform or server may process standard request, device, diagnostic and security logs.</li>
        </ul>

        <h2>3. Why information is used</h2>
        <p>Information is used to create and authenticate accounts, maintain sessions, show account pages, protect the service, respond to support requests and maintain the website. The current demo checkout does not take payment or create orders.</p>

        <h2>4. Cookies and local storage</h2>
        <p>The website uses a session cookie for authentication and security. The configured session inactivity lifetime is up to seven days, subject to logout, browser settings, server cleanup and security events. The shopping cart uses browser local storage until you clear it or browser data is removed. Essential session and security storage is not an advertising cookie.</p>

        <h2>5. Sharing and service providers</h2>
        <p>Personal information may be processed by hosting, database, security and technical service providers strictly as needed to operate the website. The current codebase does not include a payment gateway, behavioural analytics integration or an active newsletter mailing service. This statement must be revised if any such provider is added.</p>

        <h2>6. Retention and security</h2>
        <p>Account data is retained while an account is active and as long as reasonably necessary for support, security and legal obligations. Session data is designed to expire after the configured session lifetime. Cart information remains in the browser until cleared. Reasonable technical and organisational safeguards should be maintained, but no internet service can promise absolute security.</p>

        <h2>7. Your choices and privacy requests</h2>
        <p>Contact {{ config('store.contact_email') }} to ask about access to, correction of or deletion of account information, or to raise a privacy concern. Requests will be handled subject to identity verification, applicable law and any lawful retention requirement. The production store should implement a documented request-handling and grievance process before launch.</p>

        <h2>8. Children</h2>
        <p>This storefront is not designed to knowingly collect personal information from children. A real seller must set and follow an appropriate age and parental-consent process where required by applicable law.</p>

        <h2>9. Changes and contact</h2>
        <p>This notice may be updated as the website's functionality and legal obligations change. For privacy questions, contact {{ config('store.contact_email') }}. Grievance contact: {{ config('store.grievance_email') }}.</p>

        <p class="small text-secondary mt-5">This is a practical starter notice, not legal advice or a compliance certification. The seller must verify the applicable data-protection laws, processing purposes, lawful basis, retention periods, processors, transfer arrangements and contact details before public launch.</p>
    </article>
</section>
@endsection
