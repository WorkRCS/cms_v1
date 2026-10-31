<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsSeller
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->role !== 'seller' || ! $user->is_active) {
            return response()->json(['message' => 'Seller access is required.'], 403);
        }

        return $next($request);
    }
}
