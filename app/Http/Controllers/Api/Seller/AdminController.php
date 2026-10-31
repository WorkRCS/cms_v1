<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * List customer accounts only. Password hashes and other private fields
     * are intentionally never included in this response.
     */
    public function customers(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:10', 'max:50'],
        ]);

        $query = User::query()
            ->where('role', 'customer')
            ->orderBy('created_at', 'desc');

        if (filled($filters['q'] ?? null)) {
            $term = trim($filters['q']);
            $query->where(function ($builder) use ($term): void {
                $builder->where('name', 'like', '%'.$term.'%')
                    ->orWhere('email', 'like', '%'.$term.'%');
            });
        }

        $customers = $query->paginate($filters['per_page'] ?? 25);

        return response()->json([
            'data' => array_map(static function (User $customer): array {
                return [
                    'id' => (string) $customer->getKey(),
                    'name' => (string) $customer->name,
                    'email' => (string) $customer->email,
                    'phone' => $customer->phone,
                    'address' => collect(is_array($customer->address) ? $customer->address : [])
                        ->only([
                            'label',
                            'house_flat',
                            'street_area',
                            'landmark',
                            'locality',
                            'city',
                            'district',
                            'state',
                            'postal_code',
                            'country',
                        ])
                        ->filter(fn ($value) => is_scalar($value) && trim((string) $value) !== '')
                        ->all(),
                    'is_active' => (bool) $customer->is_active,
                    'created_at' => $customer->created_at?->toISOString(),
                ];
            }, $customers->items()),
            'meta' => [
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total(),
            ],
        ]);
    }
}
