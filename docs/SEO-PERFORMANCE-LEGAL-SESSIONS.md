# SEO, performance, legal pages and seven-day sessions

## Automatic SEO included

- Product detail pages render product names, descriptions, prices, stock state, image gallery and product links in the initial HTML response.
- Each published product receives a generated title, meta description, canonical URL, Open Graph/Twitter preview and Schema.org Product + Offer JSON-LD.
- Product pages also include BreadcrumbList JSON-LD. No artificial ratings or reviews are generated.
- Homepage category/product cards and shop catalogue cards are server-rendered, so crawlers can read product links without waiting for JavaScript.
- `/sitemap.xml` includes the homepage, shop, active category URLs, legal pages, every published product URL and product image URLs.
- `/robots.txt` allows public pages and OAI-SearchBot, while excluding private account routes, seller pages, cart, checkout and API paths. GPTBot is configured separately.
- Product create/update/archive actions clear the sitemap and homepage product caches. New slugs are clean and readable, and editing a product title does not unexpectedly change its public URL.
- Product pages use optimized image variants, responsive image sources, dimensions, lazy-loaded thumbnails and a high-priority main image.

These changes make product data and links easier for crawlers to discover. They do not guarantee ranking, indexing, rich results or a ChatGPT Search placement. Search engines decide whether and when to index content and how to rank it. Real product descriptions must be accurate, useful and distinct.

## Merchant listing eligibility

The current checkout is only a preview and does not create orders or accept payments. Product structured data is present, but merchant-listing features generally require a real purchasable product and an accurate purchase/fulfilment journey. Do not expect merchant listing eligibility until real checkout, order, delivery, tax, cancellation and returns information has been implemented and verified.

## Update the local project

From the project folder in the VS Code terminal:

    git pull origin main
    php artisan optimize:clear
    php artisan route:list
    php artisan serve

Then inspect:

- http://127.0.0.1:8000/robots.txt
- http://127.0.0.1:8000/sitemap.xml
- http://127.0.0.1:8000/product/farm-fresh-vegetable-box

A localhost address is not publicly crawlable. Search engines and AI search crawlers need your deployed public HTTPS domain.

## Production configuration

Before public launch, edit the private .env file (never commit it) and replace the example values with real business information:

    APP_URL=https://www.your-real-domain.example
    APP_ENV=production
    APP_DEBUG=false
    SESSION_SECURE_COOKIE=true
    STORE_NAME=Your public store name
    STORE_LEGAL_NAME=Your registered legal seller or business name
    STORE_CONTACT_EMAIL=Your monitored support email
    STORE_CONTACT_PHONE=Your monitored support phone
    STORE_BUSINESS_ADDRESS=Your real business address
    STORE_GRIEVANCE_EMAIL=Your monitored grievance contact
    STORE_JURISDICTION=Your reviewed governing law and jurisdiction

Replace the example domain and every placeholder with the actual domain and seller details. The legal pages intentionally show placeholders until configured. After editing .env, run:

    php artisan optimize:clear

Deploy Laravel with the public/ directory as the web root and serve the site over HTTPS. Secure session cookies must only be enabled after HTTPS is configured.

## Search launch checklist

1. Deploy to a public HTTPS domain and set APP_URL to the preferred canonical host.
2. Open /robots.txt and /sitemap.xml on that public domain. Confirm every URL uses the live domain, not localhost.
3. Verify the domain in Google Search Console and submit the sitemap URL.
4. Run Google's Rich Results Test and URL Inspection on multiple published product pages. Confirm the structured price, currency, availability, image and description match the visible page.
5. Run Lighthouse in Chrome DevTools for both Mobile and Desktop after deployment. Record Performance, Accessibility, Best Practices and SEO. No score has been claimed or measured in this repository update.
6. Review Core Web Vitals using real-user data when traffic is available. Useful targets are LCP at or below 2.5 seconds, INP below 200 milliseconds and CLS below 0.1.
7. Replace demo listings and remote sample images with genuine product images and complete, factual product names, descriptions, specifications, brand/SKU and stock information.
8. Keep products published only when they are actually available for sale. Draft and archived products are excluded from public product routes and sitemap.

## Legal pages and required business information

The Terms & Conditions, Privacy Policy and Data Privacy pages are starter notices, not legal advice and not a compliance certification. Before taking real orders:

- Enter the exact registered seller name, business address, monitored support contact and grievance contact.
- Confirm actual products, prices, taxes, delivery areas/charges, order acceptance, payment methods, cancellation, returns, refunds, warranties and product-specific restrictions.
- Verify actual personal data collected, purposes, lawful basis, retention periods, hosting/database processors, international transfers, security response and privacy-request procedure.
- Review the notices against laws that apply to the seller and customers. For an India-based seller, obtain a current review of the Consumer Protection (E-Commerce) Rules and the commencement schedule of the Digital Personal Data Protection Act, 2023 and DPDP Rules, 2025.
- Implement and monitor the promised support and grievance process. A placeholder email or a static policy page alone does not complete legal compliance.

The current application does not include real order creation, payments, delivery management, cancellation/refund workflows, account deletion, newsletter delivery or analytics integration. Update the policy when these features or any additional service provider is introduced.

## Seven-day login session

The session lifetime is fixed at 10,080 minutes (seven days). The browser session cookie is not configured to expire merely because the browser is closed. Logout invalidates the session immediately. A session can still end earlier if the user logs out, clears browser cookies/site data, changes browser/device, the server invalidates sessions or a security measure ends it. The login endpoint does not issue a separate long-lived remember-me token. Production should use HTTPS and a stable APP_KEY.