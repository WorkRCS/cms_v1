<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        // A fresh nonce is generated for each response and shared with Blade so
        // only the scripts rendered by this application can execute.
        $nonce = base64_encode(random_bytes(18));
        $request->attributes->set('csp_nonce', $nonce);

        /** @var Response $response */
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), fullscreen=(self "https://www.youtube-nocookie.com")');

        $directives = [
            "default-src 'self'",
            "base-uri 'self'",
            "object-src 'none'",
            "frame-ancestors 'self'",
            "form-action 'self'",
            "script-src 'nonce-{$nonce}' 'strict-dynamic' 'self' https://cdn.jsdelivr.net",
            "script-src-attr 'none'",
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
            "img-src 'self' data: https://images.unsplash.com https://i.ytimg.com https://placehold.co",
            "font-src 'self' data: https://cdn.jsdelivr.net",
            "connect-src 'self'",
            "frame-src https://www.youtube-nocookie.com",
            "media-src 'self' blob:",
            "worker-src 'self' blob:",
            "trusted-types default dompurify",
            "require-trusted-types-for 'script'",
        ];

        if (app()->environment('production') && $request->isSecure()) {
            $directives[] = 'upgrade-insecure-requests';
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=63072000',
            );
        }

        $response->headers->set('Content-Security-Policy', implode('; ', $directives));

        return $response;
    }
}
