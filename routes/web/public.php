<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
|
| All public routes that don't require authentication
|
*/

// Homepage
Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Public event information routes
Route::prefix('events')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Events/Index');
    })->name('events');
    
    Route::get('/{slug}', function ($slug) {
        return Inertia::render('Events/Show', ['eventSlug' => $slug]);
    })->name('events.show');
});
