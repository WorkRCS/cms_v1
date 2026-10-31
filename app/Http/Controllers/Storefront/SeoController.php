<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SeoController extends Controller
{
    public function sitemap(): Response
    {
        $xml = Cache::remember('seo.sitemap.v1', now()->addHour(), function (): string {
            $products = Product::query()
                ->where('status', 'published')
                ->orderBy('slug')
                ->get(['slug', 'updated_at']);

            $categories = Category::query()
                ->where('is_active', true)
                ->orderBy('slug')
                ->get(['slug', 'updated_at']);

            return response()
                ->view('seo.sitemap', compact('products', 'categories'))
                ->getContent();
        });

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600, s-maxage=3600',
        ]);
    }

    public function robots(): Response
    {
        $sitemapUrl = route('sitemap');

        $rules = implode("\n", [
            'User-agent: *',
            'Allow: /',
            'Disallow: /account',
            'Disallow: /seller',
            'Disallow: /login',
            'Disallow: /register',
            'Disallow: /cart',
            'Disallow: /checkout',
            'Disallow: /api/',
            '',
            'User-agent: OAI-SearchBot',
            'Allow: /',
            'Disallow: /account',
            'Disallow: /seller',
            'Disallow: /login',
            'Disallow: /register',
            'Disallow: /cart',
            'Disallow: /checkout',
            'Disallow: /api/',
            '',
            'User-agent: ChatGPT-User',
            'Allow: /',
            'Disallow: /account',
            'Disallow: /seller',
            'Disallow: /login',
            'Disallow: /register',
            'Disallow: /cart',
            'Disallow: /checkout',
            'Disallow: /api/',
            '',
            'User-agent: GPTBot',
            'Disallow: /',
            '',
            'Sitemap: '.$sitemapUrl,
            '',
        ]);

        return response($rules, 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
