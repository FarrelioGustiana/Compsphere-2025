<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $adminProfile = $user->adminProfile;

        // Get statistics for the admin dashboard
        $userStats = [
            'total' => User::count(),
            'participants' => User::where('role', 'participant')->count(),
            'judges' => User::where('role', 'judge')->count(),
            'admins' => User::where('role', 'admin')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'user' => $user,
            'adminProfile' => $adminProfile,
            'userStats' => $userStats,
        ]);
    }

    /**
     * Display the admin profile.
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $adminProfile = $user->adminProfile;

        return Inertia::render('Admin/Profile', [
            'user' => $user,
            'adminProfile' => $adminProfile,
        ]);
    }

    /**
     * Display the user management page.
     */

    /**
     * Display event participants for a specific event
     * 
     * @param Request $request
     * @param string $eventCode
     * @return \Inertia\Response
     */

    /**
     * Display the user management page.
     */
    public function users(Request $request)
    {
        // Get and sanitize filters
        $search = $request->input('search');
        $role = $request->input('role');

        // Debug logging to track what's happening
        Log::debug('Users filter request:', [
            'search' => $search,
            'role' => $role,
            'all_parameters' => $request->all()
        ]);

        $users = User::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($role, function ($query, $role) {
                $query->where('role', $role);
            })
            ->select('id', 'first_name', 'last_name', 'email', 'role', 'email_verified', 'created_at')
            ->paginate(10)
            ->withQueryString();

        // Explicitly set the filters to ensure they're preserved
        $filters = [
            'search' => $search,
            'role' => $role
        ];

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $filters,
        ]);
    }
}
