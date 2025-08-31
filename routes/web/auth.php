<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\VerificationController;
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
    
    Route::post('/register', [AuthController::class, 'register'])
        ->name('register.store');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/email/verify', [VerificationController::class, 'notice'])
        ->name('verification.notice');

    Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
        ->middleware(['signed'])
        ->name('verification.verify');

    Route::post('/email/verification-notification', [VerificationController::class, 'resend'])
        ->middleware(['throttle:6,1'])
        ->name('verification.send');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])
        ->name('logout');
});
