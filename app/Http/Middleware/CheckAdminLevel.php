<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminLevel
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $adminLevel = null): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return redirect()->route('login');
        }

        // Check if user is an admin first
        if ($user->role !== 'admin') {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthorized. Admin access required.'], 403);
            }
            return redirect()->route($user->role . '.dashboard');
        }

        // If no specific admin level is required, just ensure the user is an admin
        if (!$adminLevel) {
            return $next($request);
        }

        // Get admin profile
        $adminProfile = $user->adminProfile;
        
        if (!$adminProfile) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Admin profile not found.'], 403);
            }
            return redirect()->route('admin.dashboard')->with('error', 'Admin profile not configured.');
        }

        // Check if user has the required admin level
        if ($adminLevel === 'super_admin' && $adminProfile->admin_level !== 'super_admin') {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthorized. Super admin access required.'], 403);
            }
            return redirect()->route('admin.dashboard')->with('error', 'Super admin access required.');
        }

        return $next($request);
    }
}
