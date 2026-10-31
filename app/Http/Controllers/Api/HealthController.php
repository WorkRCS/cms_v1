<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthController extends Controller
{
    public function show(): JsonResponse
    {
        try {
            DB::connection('mongodb')->getMongoDB()->command(['ping' => 1]);

            return response()->json([
                'status' => 'ok',
                'application' => config('app.name'),
                'database' => 'connected',
            ]);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'status' => 'degraded',
                'application' => config('app.name'),
                'database' => 'unavailable',
            ], 503);
        }
    }
}
