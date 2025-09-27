<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\AdminProfile;
use App\Models\JudgeProfile;
use App\Http\Requests\CreateModeratorRequest;
use App\Http\Requests\CreateJudgeRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
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

    /**
     * Display the user management page for super admins.
     */
    public function userManagement(Request $request)
    {
        $user = $request->user();
        
        if (!$user->isSuperAdmin()) {
            return redirect()->route('admin.dashboard')->with('error', 'Super admin access required.');
        }

        // Get statistics for user management
        $stats = [
            'total_admins' => User::where('role', 'admin')->count(),
            'super_admins' => User::whereHas('adminProfile', function($query) {
                $query->where('admin_level', 'super_admin');
            })->count(),
            'moderators' => User::whereHas('adminProfile', function($query) {
                $query->where('admin_level', 'moderator');
            })->count(),
            'judges' => User::where('role', 'judge')->count(),
        ];

        // Get recent admins and judges
        $recentAdmins = User::where('role', 'admin')
            ->with('adminProfile')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $recentJudges = User::where('role', 'judge')
            ->with('judgeProfile')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Admin/UserManagement', [
            'user' => $user,
            'stats' => $stats,
            'recentAdmins' => $recentAdmins,
            'recentJudges' => $recentJudges,
        ]);
    }

    /**
     * Create a new moderator admin account.
     */
    public function createModeratorAdmin(CreateModeratorRequest $request)
    {
        try {
            DB::beginTransaction();

            // Create the user
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'admin',
                'email_verified' => true, // Auto-verify admin accounts
            ]);

            // Create the admin profile
            AdminProfile::create([
                'user_id' => $user->id,
                'admin_level' => 'moderator',
            ]);

            // TODO: Send credentials email if requested
            if ($request->send_credentials) {
                // Mail::to($user->email)->send(new AdminCredentialsEmail($user, $request->password));
            }

            DB::commit();

            return redirect()->back()->with('success', 'Moderator admin account created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create moderator admin: ' . $e->getMessage());
            
            return redirect()->back()->with('error', 'Failed to create moderator admin account. Please try again.');
        }
    }

    /**
     * Create a new judge account.
     */
    public function createJudgeAccount(CreateJudgeRequest $request)
    {
        try {
            DB::beginTransaction();

            // Create the user
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'judge',
                'email_verified' => true, // Auto-verify judge accounts
            ]);

            // Create the judge profile
            JudgeProfile::create([
                'user_id' => $user->id,
                'full_name' => $request->full_name,
            ]);

            // TODO: Send credentials email if requested
            if ($request->send_credentials) {
                // Mail::to($user->email)->send(new JudgeCredentialsEmail($user, $request->password));
            }

            DB::commit();

            return redirect()->back()->with('success', 'Judge account created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create judge account: ' . $e->getMessage());
            
            return redirect()->back()->with('error', 'Failed to create judge account. Please try again.');
        }
    }
}
