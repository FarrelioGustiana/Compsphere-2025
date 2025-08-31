<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

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
        $users = User::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('first_name', 'like', "%{$search}%")
                          ->orWhere('last_name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->input('role'), function ($query, $role) {
                $query->where('role', $role);
            })
            ->select('id', 'first_name', 'last_name', 'email', 'role', 'email_verified', 'created_at')
            ->paginate(10)
            ->withQueryString();
            
        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }
}
