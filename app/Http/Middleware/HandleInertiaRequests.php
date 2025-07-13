<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        
        // Prepare user data with admin profile if applicable
        $userData = null;
        if ($user) {
            $userData = [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'role' => $user->role,
            ];
            
            // Add admin profile data if user is an admin
            if ($user->role === 'admin' && $user->adminProfile) {
                $userData['adminProfile'] = [
                    'user_id' => $user->adminProfile->user_id,
                    'admin_level' => $user->adminProfile->admin_level,
                ];
            }
        }
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $userData,
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'status' => fn () => $request->session()->get('status'),
            ],
        ];
    }
}
