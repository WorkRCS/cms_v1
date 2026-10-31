<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DemoProductVideoSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local')) {
            $this->command?->warn('Demo product videos are restricted to APP_ENV=local.');
            return;
        }

        $database = DB::connection('mongodb')->getMongoDB();
        $database->selectCollection('products')->createIndex(
            ['status' => 1, 'video.url' => 1, 'updated_at' => -1],
            ['name' => 'products_published_videos'],
        );
        $database->selectCollection('products')->createIndex(
            ['seller_id' => 1, 'created_at' => -1],
            ['name' => 'products_seller_created'],
        );
        $database->selectCollection('products')->createIndex(
            ['status' => 1, 'created_at' => -1],
            ['name' => 'products_status_created'],
        );
        $database->selectCollection('users')->createIndex(
            ['role' => 1, 'is_active' => 1, 'created_at' => -1],
            ['name' => 'users_by_role_status_created'],
        );
        $database->selectCollection('users')->createIndex(
            ['role' => 1, 'created_at' => -1],
            ['name' => 'users_customers_created'],
        );
        $database->selectCollection('users')->createIndex(
            ['role' => 1, 'name' => 1],
            ['name' => 'users_customers_name'],
        );
        $database->selectCollection('users')->createIndex(
            ['role' => 1, 'email' => 1],
            ['name' => 'users_customers_email'],
        );

        $videos = [
            'farm-fresh-vegetable-box' => [
                'type' => 'youtube',
                'provider' => 'youtube',
                'video_id' => 'j_ZOWRaWBbM',
                'url' => 'https://www.youtube.com/watch?v=j_ZOWRaWBbM',
                'embed_url' => 'https://www.youtube-nocookie.com/embed/j_ZOWRaWBbM?playsinline=1&rel=0',
                'thumbnail_url' => 'https://i.ytimg.com/vi/j_ZOWRaWBbM/hqdefault.jpg',
                'layout' => 'shorts',
                'title' => 'Organic vegetable harvesting — GetMyHarvest demo Short',
            ],
            'garden-hand-trowel' => [
                'type' => 'youtube',
                'provider' => 'youtube',
                'video_id' => '4AKiaL4UoC8',
                'url' => 'https://www.youtube.com/watch?v=4AKiaL4UoC8',
                'embed_url' => 'https://www.youtube-nocookie.com/embed/4AKiaL4UoC8?playsinline=1&rel=0',
                'thumbnail_url' => 'https://i.ytimg.com/vi/4AKiaL4UoC8/hqdefault.jpg',
                'layout' => 'standard',
                'title' => 'FAO home vegetable garden harvest — demo video',
            ],
        ];

        foreach ($videos as $slug => $video) {
            $product = Product::query()->where('slug', $slug)->first();

            if (! $product) {
                $this->command?->warn("Demo product not found; skipped video for {$slug}.");
                continue;
            }

            $product->video = $video;
            $product->save();
            $this->command?->info("Added demo video to {$product->name}.");
        }

        Cache::forget('storefront.home.videos.v1');
        Cache::forget('storefront.home.videos.v2');
        Cache::forget('storefront.home.videos.v3');
        Cache::forget('storefront.home.featured.v1');
        Cache::forget('storefront.home.latest.v1');
        Cache::forget('seo.sitemap.v1');
    }
}
