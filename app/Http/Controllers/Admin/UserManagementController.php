<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AdminProfile;
use App\Models\JudgeProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /**
     * Display the admin management page
     */
    public function adminManagement()
    {
        // Get all admin users with their profiles
        $admins = User::where('role', 'admin')
            ->with('adminProfile')
            ->get()
            ->map(function ($admin) {
                return [
                    'id' => $admin->id,
                    'first_name' => $admin->first_name,
                    'last_name' => $admin->last_name,
                    'email' => $admin->email,
                    'full_name' => $admin->full_name,
                    'admin_level' => $admin->adminProfile ? $admin->adminProfile->admin_level : null,
                    'email_verified' => $admin->email_verified,
                    'created_at' => $admin->created_at,
                ];
            });

        return Inertia::render('Admin/UserManagement/AdminManagement', [
            'admins' => $admins,
        ]);
    }

    /**
     * Display the judge management page
     */
    public function judgeManagement()
    {
        // Get all judge users with their profiles
        $judges = User::where('role', 'judge')
            ->with('judgeProfile')
            ->get()
            ->map(function ($judge) {
                return [
                    'id' => $judge->id,
                    'first_name' => $judge->first_name,
                    'last_name' => $judge->last_name,
                    'email' => $judge->email,
                    'full_name' => $judge->full_name,
                    'judge_full_name' => $judge->judgeProfile ? $judge->judgeProfile->full_name : null,
                    'email_verified' => $judge->email_verified,
                    'created_at' => $judge->created_at,
                ];
            });

        return Inertia::render('Admin/UserManagement/JudgeManagement', [
            'judges' => $judges,
        ]);
    }

    /**
     * Show the form to create a new admin
     */
    public function showCreateAdmin()
    {
        return Inertia::render('Admin/UserManagement/CreateAdmin');
    }

    /**
     * Show the form to create a new judge
     */
    public function showCreateJudge()
    {
        return Inertia::render('Admin/UserManagement/CreateJudge');
    }

    /**
     * Create a new moderator admin
     */
    public function createAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        DB::beginTransaction();
        
        try {
            // Create the user with admin role
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'admin',
                'email_verified' => true, // Auto verify admin emails
            ]);

            // Create the admin profile
            AdminProfile::create([
                'user_id' => $user->id,
                'admin_level' => 'moderator', // Only super_admin can create moderators
            ]);

            DB::commit();

            return redirect()->route('admin.manage.admins')
                ->with('success', 'Admin created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create admin: ' . $e->getMessage()]);
        }
    }

    /**
     * Create a new judge
     */
    public function createJudge(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'full_name' => ['required', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        DB::beginTransaction();
        
        try {
            // Create the user with judge role
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'judge',
                'email_verified' => true, // Auto verify judge emails
            ]);

            // Create the judge profile
            JudgeProfile::create([
                'user_id' => $user->id,
                'full_name' => $request->full_name,
            ]);

            DB::commit();

            return redirect()->route('admin.manage.judges')
                ->with('success', 'Judge created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create judge: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete a user (admin or judge)
     */
    public function deleteUser(Request $request, $userId)
    {
        try {
            $user = User::findOrFail($userId);
            
            // Don't allow deleting self
            if ($request->user()->id === (int)$userId) {
                return back()->withErrors(['error' => 'You cannot delete your own account!']);
            }
            
            // Don't allow deleting super_admin by another super_admin
            if ($user->role === 'admin' && 
                $user->adminProfile && 
                $user->adminProfile->admin_level === 'super_admin') {
                return back()->withErrors(['error' => 'Super admin accounts cannot be deleted!']);
            }

            // Delete the user
            $user->delete();

            return back()->with('success', 'User deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete user: ' . $e->getMessage()]);
        }
    }
}
