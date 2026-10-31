<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Category::where('is_active', true);

        if ($request->filled('product_type')) {
            $request->validate(['product_type' => ['in:agriculture,general']]);
            $query->where('product_type', $request->string('product_type')->toString());
        }

        return response()->json([
            'data' => $query->orderBy('sort_order')->orderBy('name')->get(),
        ]);
    }
}
