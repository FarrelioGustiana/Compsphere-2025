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
    public function handle(Request $request, Closure $next, string $level = null): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }
        
        $user = $request->user();
        
        // Check if user is an admin
        if ($user->role !== 'admin') {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthorized. Admin access required.'], 403);
            }
            
            // Redirect to appropriate dashboard based on user role
            return redirect()->route($user->role . '.dashboard');
        }
        
        // If no specific admin level is required, just ensure the user is admin
        if (!$level) {
            return $next($request);
        }
        
        // Check if admin has the required level
        if (!$user->adminProfile || $user->adminProfile->admin_level !== $level) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthorized. Required admin level: ' . $level], 403);
            }
            
            // Redirect to admin dashboard with insufficient permissions message
            return redirect()->route('admin.dashboard')->with('error', 'You do not have the required permissions for this action.');
        }

        return $next($request);
    }
}
