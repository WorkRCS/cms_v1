# Storefront — Laravel + MongoDB Backend

A single-seller B2C storefront backend. It supports both agriculture products and general merchandise in one catalogue.

## Technology

- PHP 8.3+
- Laravel 13
- MongoDB with the official mongodb/laravel-mongodb integration
- Session-based authentication for the same-origin HTML/JavaScript storefront
- JSON APIs designed for the planned Bootstrap frontend
- GD with WebP support for product image processing

## Backend milestone included

- MongoDB connection and health endpoint
- Customer registration, login, logout and current-user endpoint
- Seller-only protected dashboard and product management
- Public product and category catalogue APIs
- Product type filter: agriculture or general
- Multiple product images with thumbnail, medium and large WebP variants
- Product video upload (MP4/WebM)
- Local-only demo seller, 8 categories and 8 products (4 agriculture + 4 general)
- MongoDB indexes for account email, category slug, product slug and seller/catalogue lookups

The frontend and checkout/order workflow will be added in a later milestone.

## Requirements

- PHP 8.3 or later
- Composer 2
- MongoDB Server or MongoDB Atlas
- PHP extensions: mongodb, gd (GD must include WebP support), fileinfo, mbstring, openssl
- A writable storage/ directory

## VS Code / local setup

1. Clone this repository and open it in VS Code.
2. Install PHP dependencies with: composer install
3. Create your local environment file with: cp .env.example .env
   On Windows PowerShell use: Copy-Item .env.example .env
4. Generate the Laravel application key with: php artisan key:generate
5. Start MongoDB locally on port 27017, or set DB_URI and DB_DATABASE in .env to your MongoDB Atlas connection and database name.
6. Seed the local database with: php artisan db:seed
7. Create the public storage symlink with: php artisan storage:link
8. Start the backend with: php artisan serve

Open http://127.0.0.1:8000/. The root endpoint returns a small JSON status document. API health is available at http://127.0.0.1:8000/api/v1/health.

### Local demo seller

The example .env values seed this local-only seller:

- Email: owner@example.test
- Password: LocalDemoOnly!Change123

Change the demo password in .env before using the application on any shared network. The seeder refuses to create demo records unless APP_ENV=local. Do not use the example credentials in production.

The seeder creates eight categories and eight published demo products, with four products of each type. Each product includes three image entries so the future product details page can exercise a gallery. Demo image URLs are remote Unsplash URLs; newly uploaded seller images are processed and stored locally as WebP.

## MongoDB notes

Set the following in .env for local MongoDB:

    DB_CONNECTION=mongodb
    DB_URI=mongodb://127.0.0.1:27017
    DB_DATABASE=storefront

For Atlas, use the connection URI supplied by Atlas. Do not commit real database credentials or the .env file.

The first local seed creates these indexes:

- users.email (unique)
- categories.slug (unique)
- products.slug (unique)
- Product catalogue and seller lookup compound indexes

## API routes

All endpoints use the /api/v1 prefix and return JSON.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | /api/v1/health | Public | Application and MongoDB health |
| GET | /api/v1/csrf-token | Public | Obtain the current CSRF token |
| GET | /api/v1/categories | Public | List active categories |
| GET | /api/v1/products | Public | List published products |
| GET | /api/v1/products/{slug} | Public | Product details and image gallery |
| POST | /api/v1/auth/register | Guest | Create a customer account |
| POST | /api/v1/auth/login | Guest | Sign in |
| GET | /api/v1/auth/me | Customer/Seller | Current authenticated user |
| POST | /api/v1/auth/logout | Customer/Seller | Sign out |
| GET | /api/v1/seller/dashboard | Seller | Product summary |
| GET | /api/v1/seller/products | Seller | List seller-owned products |
| POST | /api/v1/seller/products | Seller | Create a product |
| PUT | /api/v1/seller/products/{id} | Seller | Update a seller-owned product |
| DELETE | /api/v1/seller/products/{id} | Seller | Archive a seller-owned product |

### Catalogue filters

Examples:

- /api/v1/products?product_type=agriculture
- /api/v1/products?product_type=general
- /api/v1/products?category=fresh-produce
- /api/v1/products?q=seed&sort=price_low
- /api/v1/products?featured=1&per_page=8

Allowed sort values: latest, price_low, price_high, name.

Prices are stored as integer minor units to avoid floating-point money calculations. For INR, 34900 represents ₹349.00.

## Browser authentication and CSRF

The API is intentionally served through Laravel's web middleware so the future same-origin HTML/Bootstrap/JavaScript storefront can use secure, HTTP-only session cookies. Keep credentials and cookies on the same origin.

For state-changing browser requests:

1. Call GET /api/v1/csrf-token first.
2. Send the returned token in the X-CSRF-TOKEN request header.
3. Keep browser credentials enabled with credentials: same-origin.

The login and registration endpoints are rate limited. Registration always assigns the customer role; public visitors cannot self-register as a seller. Seller routes require an authenticated account whose role is seller and whose account is active.

## Product image uploads

Seller product creation accepts images[] (1–8 files; JPG/JPEG/PNG/WebP; max 8 MB each). The backend validates uploaded images, converts them to WebP and writes three sizes:

- thumbnail: up to 320 px
- medium: up to 640 px
- large: up to 1200 px

The response and MongoDB document include the URL, alt text, display order and variant URLs. Video uploads accept MP4/WebM up to 50 MB. Uploaded files are stored on Laravel's public disk; run php artisan storage:link to publish the storage path.

## Quick verification

    php artisan storefront:ping-mongodb
    php artisan route:list
    curl http://127.0.0.1:8000/api/v1/products?product_type=agriculture
    curl http://127.0.0.1:8000/api/v1/products?product_type=general

For browser testing, seed first and sign in using the local demo seller credentials above. Product create/update requests should use multipart form data when attaching images or video.

## Security and production checklist

- Set APP_ENV=production, APP_DEBUG=false, a unique APP_KEY and SESSION_SECURE_COOKIE=true behind HTTPS.
- Replace demo credentials and never run the local demo seeder in production.
- Use a least-privilege MongoDB database user and restrict network access to the database.
- Keep .env, backups and logs outside the public web root.
- Serve public/ as the web server document root.
- Configure HTTPS, rate limits, backups, monitoring and a production object-storage disk before launch.
- Review real product descriptions, pricing, shipping, tax and return-policy rules before accepting orders.
