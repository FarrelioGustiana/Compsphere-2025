<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role = null): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }
        
        // If no specific role is required, just ensure the user is authenticated
        if (!$role) {
            return $next($request);
        }
        
        // Check if user has the required role
        if ($request->user()->role !== $role) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthorized.'], 403);
            }
            
            // Redirect to appropriate dashboard based on user role
            return redirect()->route($request->user()->role . '.dashboard');
        }

        return $next($request);
    }
}
