<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSessionSecurity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Regenerate session ID if it hasn't been regenerated recently
        if (!$request->session()->has('last_activity') || 
            (time() - $request->session()->get('last_activity') > 3600)) {
            $request->session()->regenerate();
            $request->session()->put('last_activity', time());
        }

        // Update last activity time
        $request->session()->put('last_activity', time());
        
        // Set security headers
        $response = $next($request);
        
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        if (app()->environment('production')) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }
        
        return $response;
    }
}
