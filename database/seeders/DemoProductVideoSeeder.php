<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class DemoProductVideoSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local')) {
            $this->command?->warn('Demo product videos are restricted to APP_ENV=local.');
            return;
        }

        $videos = [
            'farm-fresh-vegetable-box' => [
                'type' => 'youtube',
                'provider' => 'youtube',
                'video_id' => 'j_ZOWRaWBbM',
                'url' => 'https://www.youtube.com/watch?v=j_ZOWRaWBbM',
                'embed_url' => 'https://www.youtube-nocookie.com/embed/j_ZOWRaWBbM?playsinline=1&rel=0',
                'thumbnail_url' => 'https://i.ytimg.com/vi/j_ZOWRaWBbM/hqdefault.jpg',
                'layout' => 'shorts',
                'title' => 'Organic vegetable harvesting — demo Short',
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
        Cache::forget('storefront.home.featured.v1');
        Cache::forget('storefront.home.latest.v1');
        Cache::forget('seo.sitemap.v1');
    }
}
