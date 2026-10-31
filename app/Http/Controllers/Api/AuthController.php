<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:190'],
            'password' => ['required', 'confirmed', Password::min(10)->letters()->numbers()],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        $email = mb_strtolower(trim($data['email']));

        if (User::where('email', $email)->exists()) {
            throw ValidationException::withMessages([
                'email' => ['An account with this email already exists.'],
            ]);
        }

        $user = User::create([
            'name' => trim($data['name']),
            'email' => $email,
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
            'role' => 'customer',
            'is_active' => true,
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(['message' => 'Account created successfully.', 'user' => $user], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email:rfc', 'max:190'],
            'password' => ['required', 'string'],
        ]);

        $credentials = [
            'email' => mb_strtolower(trim($data['email'])),
            'password' => $data['password'],
            'is_active' => true,
        ];

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The supplied credentials are not valid.'],
            ]);
        }

        $request->session()->regenerate();

        return response()->json(['message' => 'Signed in successfully.', 'user' => $request->user()]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()]);
    }


    public function updateProfile(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'nullable', 'string', 'max:120'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'address' => ['sometimes', 'array'],
            'address.full_name' => ['sometimes', 'nullable', 'string', 'max:120'],
            'address.phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'address.label' => ['sometimes', 'nullable', 'string', 'max:40'],
            'address.house_flat' => ['sometimes', 'nullable', 'string', 'max:160'],
            'address.street_area' => ['sometimes', 'nullable', 'string', 'max:180'],
            'address.landmark' => ['sometimes', 'nullable', 'string', 'max:160'],
            'address.locality' => ['sometimes', 'nullable', 'string', 'max:160'],
            'address.city' => ['sometimes', 'nullable', 'string', 'max:120'],
            'address.district' => ['sometimes', 'nullable', 'string', 'max:120'],
            'address.state' => ['sometimes', 'nullable', 'string', 'max:120'],
            'address.postal_code' => ['sometimes', 'nullable', 'string', 'max:12'],
            'address.country' => ['sometimes', 'nullable', 'string', 'max:80'],
        ]);

        $user = $request->user();

        if (array_key_exists('name', $data) && filled($data['name'])) {
            $user->name = trim($data['name']);
        }

        if (array_key_exists('phone', $data)) {
            $user->phone = $data['phone'] !== null ? trim($data['phone']) : null;
        }

        if (array_key_exists('address', $data)) {
            $address = array_merge((array) ($user->address ?? []), $data['address']);

            $country = trim((string) ($address['country'] ?? ''));
            $postalCode = trim((string) ($address['postal_code'] ?? ''));

            if ($postalCode !== '' && strcasecmp($country ?: 'India', 'India') === 0 && ! preg_match('/^[0-9]{6}$/', $postalCode)) {
                throw ValidationException::withMessages([
                    'address.postal_code' => ['Enter a valid 6-digit Indian PIN code, or leave it blank.'],
                ]);
            }

            $address = array_map(
                static fn ($value) => is_string($value) ? trim($value) : $value,
                $address,
            );

            $user->address = $address;
        }

        $user->save();

        return response()->json([
            'message' => 'Profile details saved successfully.',
            'user' => $user->fresh(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Signed out successfully.']);
    }
}
