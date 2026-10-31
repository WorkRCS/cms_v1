# Field & Found — Single-seller Storefront

A single-seller B2C ecommerce starter for agriculture products and general merchandise, built with Laravel, MongoDB, Bootstrap and vanilla JavaScript.

## Stack

- PHP 8.3+
- Laravel 13
- MongoDB with mongodb/laravel-mongodb
- Blade views + HTML5 + Bootstrap 5.3 + custom CSS
- Vanilla JavaScript (same-origin JSON API calls)
- Session authentication, CSRF protection and seller-role middleware
- PHP GD WebP image processing

## Current implementation

### Storefront
- Responsive homepage with dynamic categories and featured/latest products
- Shop catalogue with search, product-type and category filters, sorting and pagination
- Product details with multi-image gallery, image thumbnails, attributes and product video
- Browser-persisted cart (localStorage)
- Customer registration, login, logout and account page
- Checkout preview (order placement is not yet connected)

### Seller area
- Authenticated seller dashboard and product counts
- Product list and archive action
- Add product form with agriculture/general product type
- Multiple product image upload (1–8 files) and optional MP4/WebM video
- Server-side conversion to WebP thumbnail, medium and large variants

### Backend
- MongoDB connection and health endpoint
- Customer registration/login/logout and current-user endpoint
- Seller-only dashboard and product management APIs
- Public product and category APIs
- Local-only demo seeder: 8 categories and 8 published products (4 agriculture + 4 general)
- MongoDB indexes for email, category slug, product slug and catalogue lookups

Orders, payment gateway, customer order history, coupon and video CMS are future milestones. The checkout page intentionally explains this rather than pretending to submit a real order.

## Requirements

- PHP 8.3 or later
- Composer 2
- MongoDB Server or MongoDB Atlas
- PHP extensions: mongodb, gd with WebP support, fileinfo, mbstring, openssl, curl, dom, xml
- Writable storage/ directory

## Windows + VS Code setup

### 1. Install PHP

Install PHP 8.3+ for Windows from the official downloads page: https://www.php.net/downloads.php?os=windows

Use the x64 build. Add the folder containing php.exe to the Windows PATH. Open a new PowerShell and verify:

    php -v

Enable the required extensions in php.ini, including extension=gd and extension=mongodb (the MongoDB extension must be installed for the PHP version you use). Check active extensions with:

    php -m

GD must list WebP support. If mongodb is missing, install the matching Windows DLL from the official PECL MongoDB extension releases and enable it in the same php.ini used by the CLI.

### 2. Install Composer

Download and run the official Windows Installer: https://getcomposer.org/Composer-Setup.exe

When prompted, select the correct php.exe. The installer adds Composer and PHP to PATH. Close PowerShell completely, open a new PowerShell and verify:

    composer -V
    php -v

If PowerShell says "composer is not recognized", Composer is not installed or its PATH entry has not been loaded. Reopen the terminal after installation. The official Composer Windows installer guide is at https://getcomposer.org/doc/00-intro.md#installation-windows.

### 3. Install project dependencies

From the project directory:

    composer install

Create your local environment file:

    Copy-Item .env.example .env

Generate an application key:

    php artisan key:generate

### 4. Configure MongoDB

Run MongoDB locally on 127.0.0.1:27017, or use a MongoDB Atlas URI. The local .env should contain:

    DB_CONNECTION=mongodb
    DB_URI=mongodb://127.0.0.1:27017
    DB_DATABASE=storefront

Never commit .env or real database credentials.

### 5. Seed demo products and run the site

The sample .env.example includes local-only demo seller values:

- Email: owner@example.test
- Password: LocalDemoOnly!Change123

Set APP_ENV=local and make sure DEMO_SELLER_PASSWORD is present in your private .env. Change the sample password before sharing the app.

Run:

    php artisan db:seed
    php artisan storage:link
    php artisan serve

Open:

- Storefront: http://127.0.0.1:8000/
- Shop: http://127.0.0.1:8000/shop
- Seller login: http://127.0.0.1:8000/login
- Seller dashboard: http://127.0.0.1:8000/seller
- MongoDB health: http://127.0.0.1:8000/api/v1/health

No Node.js or npm build is required for this first frontend milestone. Bootstrap CSS/JS are loaded from jsDelivr, while the store-specific CSS and JavaScript are local files under public/assets/.

## API routes

All JSON APIs use /api/v1.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | /api/v1/health | Public | Application and MongoDB health |
| GET | /api/v1/csrf-token | Public | Obtain CSRF token for browser requests |
| GET | /api/v1/categories | Public | Active categories |
| GET | /api/v1/products | Public | Published product catalogue |
| GET | /api/v1/products/{slug} | Public | Product details and gallery |
| POST | /api/v1/auth/register | Guest | Create customer |
| POST | /api/v1/auth/login | Guest | Sign in |
| GET | /api/v1/auth/me | Authenticated | Current user |
| POST | /api/v1/auth/logout | Authenticated | Sign out |
| GET | /api/v1/seller/dashboard | Seller | Product summary |
| GET | /api/v1/seller/products | Seller | List seller's products |
| POST | /api/v1/seller/products | Seller | Create product |
| PUT | /api/v1/seller/products/{id} | Seller | Update seller-owned product |
| DELETE | /api/v1/seller/products/{id} | Seller | Archive seller-owned product |

Catalogue query examples:

    /api/v1/products?product_type=agriculture
    /api/v1/products?product_type=general
    /api/v1/products?category=fresh-produce
    /api/v1/products?q=seed&sort=price_low
    /api/v1/products?featured=1&per_page=8

Allowed sort values: latest, price_low, price_high, name. Prices use integer minor units; for INR, 34900 means ₹349.00.

## Image uploads

The seller product form accepts 1–8 JPG/JPEG/PNG/WebP files up to 8 MB each. The backend validates the images and writes WebP versions at up to 320px, 640px and 1200px. Optional product videos accept MP4/WebM up to 50 MB.

Uploads are stored on Laravel's public disk. Run php artisan storage:link to expose the storage path locally. Demo product images are remote Unsplash examples; replace them with real product images before public launch.

## Browser security

The JSON endpoints are in Laravel's web middleware stack to use same-origin session cookies. Browser POST/PUT/DELETE requests acquire a CSRF token from /api/v1/csrf-token and send it in X-CSRF-TOKEN. The JavaScript uses credentials: same-origin.

Registration always creates a customer role; there is no public seller registration. Seller pages and APIs require an active, authenticated seller. Login and registration are rate-limited. Use HTTPS and SESSION_SECURE_COOKIE=true outside local development.

## Verification commands

    php artisan route:list
    php artisan storefront:ping-mongodb
    php artisan db:seed
    php artisan serve

Then browse the homepage, filter agriculture/general products, open a product and test its image gallery, add items to the cart, sign in with the local demo seller and publish a test product.

## Production checklist

- Set APP_ENV=production, APP_DEBUG=false, a unique APP_KEY, and secure cookies behind HTTPS.
- Replace local demo credentials and never seed demo records in production.
- Use a least-privilege MongoDB database user and restrict database network access.
- Keep .env, backups, logs and original/private uploads outside the public web root.
- Serve the Laravel public/ directory as the web root.
- Configure backups, monitoring, production object storage, payment and order workflows before accepting real customer orders.

## SEO, performance, legal pages and sessions

The storefront now includes server-rendered product details and catalogue cards, generated product metadata and Product/Offer + BreadcrumbList JSON-LD, canonical URLs, crawler directives, a dynamic product/category image sitemap and cache invalidation when products change. The homepage and shop render their initial catalogue content in HTML instead of waiting for client-side API calls.

Public policy routes:

- /terms
- /privacy-policy
- /data-privacy

These are starter policy notices. Before public launch, set real seller, support, address and grievance details using the STORE_* settings described in docs/SEO-PERFORMANCE-LEGAL-SESSIONS.md, then obtain a review against the laws that apply to the business. The current checkout is still a preview, not a working order/payment flow.

The login session lifetime is fixed at seven days (10,080 minutes); closing the browser does not intentionally end it. Logout invalidates the session immediately. Production must use HTTPS and SESSION_SECURE_COOKIE=true.

Read the full deployment, SEO/Search Console, Lighthouse and legal launch checklist in [docs/SEO-PERFORMANCE-LEGAL-SESSIONS.md](docs/SEO-PERFORMANCE-LEGAL-SESSIONS.md). Lighthouse scores and search rankings are not guaranteed and must be tested on the deployed public domain.
