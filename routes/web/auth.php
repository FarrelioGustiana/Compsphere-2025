<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Authentication routes
Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        if (request()->user()) {
            return redirect()->route(request()->user()->role . '.dashboard');
        }
        return Inertia::render('Auth/Login');
    })->name('login');
    
    Route::post('/login', [AuthController::class, 'login'])
        ->name('login.store');
        
    Route::get('/register', function () {
        if (request()->user()) {
            return redirect()->route(request()->user()->role . '.dashboard');
        }
        return Inertia::render('Auth/Register');
    })->name('register');
});

Route::get('/verify-email', function () {
    return Inertia::render('Auth/VerifyEmail');
})->name('verify-email');

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])
        ->name('logout');
});
