<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local')) {
            $this->command?->warn('Demo data is restricted to APP_ENV=local. No demo records were inserted.');
            return;
        }

        $database = DB::connection('mongodb')->getMongoDB();
        $database->selectCollection('users')->createIndex(['email' => 1], ['unique' => true, 'name' => 'users_email_unique']);
        $database->selectCollection('categories')->createIndex(['slug' => 1], ['unique' => true, 'name' => 'categories_slug_unique']);
        $database->selectCollection('products')->createIndex(['slug' => 1], ['unique' => true, 'name' => 'products_slug_unique']);
        $database->selectCollection('products')->createIndex(
            ['product_type' => 1, 'status' => 1, 'created_at' => -1],
            ['name' => 'products_public_catalog'],
        );
        $database->selectCollection('products')->createIndex(
            ['seller_id' => 1, 'status' => 1],
            ['name' => 'products_by_seller'],
        );

        $email = mb_strtolower((string) env('DEMO_SELLER_EMAIL', 'owner@example.test'));
        $password = (string) env('DEMO_SELLER_PASSWORD', '');

        if ($password === '') {
            $this->command?->error('Set DEMO_SELLER_PASSWORD in your local .env before running db:seed.');
            return;
        }

        $seller = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Demo Store Owner',
                'password' => Hash::make($password),
                'role' => 'seller',
                'is_active' => true,
            ],
        );

        $categoryRows = [
            ['name' => 'Fresh Produce', 'slug' => 'fresh-produce', 'product_type' => 'agriculture', 'description' => 'Fresh farm-grown fruits and vegetables.', 'sort_order' => 1],
            ['name' => 'Seeds & Saplings', 'slug' => 'seeds-saplings', 'product_type' => 'agriculture', 'description' => 'Seeds and starter plants for growing.', 'sort_order' => 2],
            ['name' => 'Organic Farm Inputs', 'slug' => 'organic-farm-inputs', 'product_type' => 'agriculture', 'description' => 'Farm-friendly organic inputs and plant care.', 'sort_order' => 3],
            ['name' => 'Gardening Tools', 'slug' => 'gardening-tools', 'product_type' => 'agriculture', 'description' => 'Useful tools for farms and home gardens.', 'sort_order' => 4],
            ['name' => 'Apparel', 'slug' => 'apparel', 'product_type' => 'general', 'description' => 'Everyday clothing and accessories.', 'sort_order' => 5],
            ['name' => 'Electronics', 'slug' => 'electronics', 'product_type' => 'general', 'description' => 'Useful electronic products.', 'sort_order' => 6],
            ['name' => 'Watches', 'slug' => 'watches', 'product_type' => 'general', 'description' => 'Watches and personal accessories.', 'sort_order' => 7],
            ['name' => 'Bags & Travel', 'slug' => 'bags-travel', 'product_type' => 'general', 'description' => 'Bags for daily use and travel.', 'sort_order' => 8],
        ];

        $categories = [];
        foreach ($categoryRows as $row) {
            $categories[$row['slug']] = Category::updateOrCreate(
                ['slug' => $row['slug']],
                $row + ['is_active' => true],
            );
        }

        $image = static fn (string $url, string $alt, int $sort): array => [
            'url' => $url,
            'alt' => $alt,
            'is_primary' => $sort === 1,
            'sort_order' => $sort,
            'format' => 'jpg',
            'variants' => [],
        ];

        $products = [
            [
                'name' => 'Farm Fresh Vegetable Box', 'slug' => 'farm-fresh-vegetable-box', 'category' => 'fresh-produce',
                'product_type' => 'agriculture', 'brand' => 'Demo Farm',
                'short_description' => 'A seasonal selection of fresh farm vegetables.',
                'description' => 'A demo farm produce box for testing the storefront catalogue. Replace this text, images and price with real seller information.',
                'price_minor' => 34900, 'compare_at_price_minor' => 39900, 'stock' => 45,
                'attributes' => ['unit' => 'box', 'origin' => 'Local farm'], 'tags' => ['fresh', 'vegetables', 'farm'], 'is_featured' => true,
                'images' => [
                    $image('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=85', 'Fresh vegetable selection', 1),
                    $image('https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=1200&q=85', 'Fresh produce close-up', 2),
                    $image('https://images.unsplash.com/photo-1518843875459-f738682238a6?w=1200&q=85', 'Farm vegetables from another angle', 3),
                ],
                'video' => [
                    'type' => 'youtube',
                    'provider' => 'youtube',
                    'video_id' => 'j_ZOWRaWBbM',
                    'url' => 'https://www.youtube.com/watch?v=j_ZOWRaWBbM',
                    'embed_url' => 'https://www.youtube-nocookie.com/embed/j_ZOWRaWBbM?playsinline=1&rel=0',
                    'thumbnail_url' => 'https://i.ytimg.com/vi/j_ZOWRaWBbM/hqdefault.jpg',
                    'layout' => 'shorts',
                    'title' => 'Organic vegetable harvesting — GetMyHarvest demo Short',
                ],
            ],
            [
                'name' => 'Premium Wheat Seeds - 1 kg', 'slug' => 'premium-wheat-seeds-1kg', 'category' => 'seeds-saplings',
                'product_type' => 'agriculture', 'brand' => 'Demo Farm',
                'short_description' => 'Quality seed pack for seasonal cultivation.',
                'description' => 'Demo listing for agricultural seed products. Add verified variety, germination and usage information before selling a real product.',
                'price_minor' => 19900, 'compare_at_price_minor' => 24900, 'stock' => 80,
                'attributes' => ['weight' => '1 kg', 'type' => 'Wheat seed'], 'tags' => ['wheat', 'seeds', 'agriculture'], 'is_featured' => true,
                'images' => [
                    $image('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&q=85', 'Wheat crop in a field', 1),
                    $image('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=85', 'Agricultural field', 2),
                    $image('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=85', 'Golden field at sunrise', 3),
                ],
            ],
            [
                'name' => 'Cold Pressed Neem Oil - 500 ml', 'slug' => 'cold-pressed-neem-oil-500ml', 'category' => 'organic-farm-inputs',
                'product_type' => 'agriculture', 'brand' => 'Demo Farm',
                'short_description' => 'Plant-care oil for garden and farm use.',
                'description' => 'Sample product for organic farm inputs. Review label directions and local regulations before publishing a real listing.',
                'price_minor' => 27900, 'compare_at_price_minor' => 32900, 'stock' => 35,
                'attributes' => ['volume' => '500 ml', 'type' => 'Neem oil'], 'tags' => ['neem', 'organic', 'plant-care'], 'is_featured' => false,
                'images' => [
                    $image('https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=85', 'Natural oil bottle', 1),
                    $image('https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200&q=85', 'Plant based care product', 2),
                    $image('https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=1200&q=85', 'Bottle product detail', 3),
                ],
            ],
            [
                'name' => 'Garden Hand Trowel', 'slug' => 'garden-hand-trowel', 'category' => 'gardening-tools',
                'product_type' => 'agriculture', 'brand' => 'Field Tools',
                'short_description' => 'A handy tool for planting and garden maintenance.',
                'description' => 'A sample gardening tool listing. Update material, dimensions and care instructions to match the actual item.',
                'price_minor' => 18900, 'compare_at_price_minor' => 22900, 'stock' => 24,
                'attributes' => ['material' => 'Metal and wood', 'use' => 'Gardening'], 'tags' => ['tool', 'garden', 'hand-tool'], 'is_featured' => false,
                'images' => [
                    $image('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=85', 'Gardening tools', 1),
                    $image('https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=85', 'Garden hand tools', 2),
                    $image('https://images.unsplash.com/photo-1599685315640-7ec1f4d5f1a2?w=1200&q=85', 'Tool and garden detail', 3),
                ],
                'video' => [
                    'type' => 'youtube',
                    'provider' => 'youtube',
                    'video_id' => '4AKiaL4UoC8',
                    'url' => 'https://www.youtube.com/watch?v=4AKiaL4UoC8',
                    'embed_url' => 'https://www.youtube-nocookie.com/embed/4AKiaL4UoC8?playsinline=1&rel=0',
                    'thumbnail_url' => 'https://i.ytimg.com/vi/4AKiaL4UoC8/hqdefault.jpg',
                    'layout' => 'standard',
                    'title' => 'FAO home vegetable garden harvest — demo video',
                ],
            ],
            [
                'name' => 'Everyday Cotton T-Shirt', 'slug' => 'everyday-cotton-tshirt', 'category' => 'apparel',
                'product_type' => 'general', 'brand' => 'Everyday',
                'short_description' => 'A simple cotton t-shirt for daily wear.',
                'description' => 'General merchandise demo product. Add the real size chart, fabric details and colour variants before publishing.',
                'price_minor' => 49900, 'compare_at_price_minor' => 69900, 'stock' => 60,
                'attributes' => ['fabric' => 'Cotton', 'fit' => 'Regular'], 'tags' => ['clothing', 'cotton', 'tshirt'], 'is_featured' => true,
                'images' => [
                    $image('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=85', 'Cotton t-shirt front view', 1),
                    $image('https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&q=85', 'Casual t-shirt styling', 2),
                    $image('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&q=85', 'Apparel product detail', 3),
                ],
            ],
            [
                'name' => 'Wireless Over-Ear Headphones', 'slug' => 'wireless-over-ear-headphones', 'category' => 'electronics',
                'product_type' => 'general', 'brand' => 'Sound Demo',
                'short_description' => 'Wireless headphones for everyday listening.',
                'description' => 'Demo electronics listing. Replace with verified battery, connectivity, warranty and compatibility specifications.',
                'price_minor' => 159900, 'compare_at_price_minor' => 199900, 'stock' => 18,
                'attributes' => ['connectivity' => 'Bluetooth', 'type' => 'Over-ear'], 'tags' => ['audio', 'headphones', 'wireless'], 'is_featured' => true,
                'images' => [
                    $image('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85', 'Wireless headphones product view', 1),
                    $image('https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&q=85', 'Headphones side view', 2),
                    $image('https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=85', 'Headphones detail view', 3),
                ],
            ],
            [
                'name' => 'Minimal Analog Wristwatch', 'slug' => 'minimal-analog-wristwatch', 'category' => 'watches',
                'product_type' => 'general', 'brand' => 'Northline',
                'short_description' => 'A clean analogue watch design.',
                'description' => 'General product demo listing. Add exact case size, movement, strap material and warranty details before launch.',
                'price_minor' => 129900, 'compare_at_price_minor' => 169900, 'stock' => 12,
                'attributes' => ['movement' => 'Analog', 'style' => 'Minimal'], 'tags' => ['watch', 'accessory', 'lifestyle'], 'is_featured' => false,
                'images' => [
                    $image('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=85', 'Minimal watch front view', 1),
                    $image('https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1200&q=85', 'Watch on wrist', 2),
                    $image('https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1200&q=85', 'Watch product detail', 3),
                ],
            ],
            [
                'name' => 'Everyday Canvas Backpack', 'slug' => 'everyday-canvas-backpack', 'category' => 'bags-travel',
                'product_type' => 'general', 'brand' => 'Trail Day',
                'short_description' => 'A practical backpack for everyday carry.',
                'description' => 'Sample general merchandise product. Add actual dimensions, capacity, compartment and material information before selling.',
                'price_minor' => 89900, 'compare_at_price_minor' => 109900, 'stock' => 27,
                'attributes' => ['material' => 'Canvas', 'use' => 'Daily carry'], 'tags' => ['backpack', 'bag', 'travel'], 'is_featured' => false,
                'images' => [
                    $image('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=85', 'Canvas backpack front view', 1),
                    $image('https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1200&q=85', 'Backpack side detail', 2),
                    $image('https://images.unsplash.com/photo-1581605405669-f2334b6d2f16?w=1200&q=85', 'Backpack product detail', 3),
                ],
            ],
        ];

        foreach ($products as $row) {
            $category = $categories[$row['category']];
            unset($row['category']);

            Product::updateOrCreate(
                ['slug' => $row['slug']],
                $row + [
                    'seller_id' => (string) $seller->getKey(),
                    'category_id' => (string) $category->getKey(),
                    'currency' => 'INR',
                    'track_inventory' => true,
                    'status' => 'published',
                ],
            );
        }

        Cache::forget('storefront.home.videos.v1');
        Cache::forget('storefront.home.featured.v1');
        Cache::forget('storefront.home.latest.v1');
        Cache::forget('seo.sitemap.v1');

        $this->command?->info('Demo seller, 8 categories and 8 demo products have been seeded.');
    }
}
