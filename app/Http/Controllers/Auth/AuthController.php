<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Display the login view.
     */
    public function showLogin()
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => true,
        ]);
    }

    /**
     * Handle an authentication attempt.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            $request->session()->regenerate();

            $user = Auth::user();
            
            // Redirect based on user role
            return redirect()->route($user->role . '.dashboard');
        }

        throw ValidationException::withMessages([
            'email' => trans('auth.failed'),
        ]);
    }

    /**
     * Log the user out of the application.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
    
    /**
     * Handle a registration request.
     */
    public function register(Request $request)
    {
        $creator = app(\App\Actions\Fortify\CreateNewUser::class);
        
        $user = $creator->create($request->all());
        
        Auth::login($user);
        
        return redirect()->route('verification.notice');
    }
}
