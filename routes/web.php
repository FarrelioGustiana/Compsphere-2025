<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Import domain-specific route files
require __DIR__ . '/web/public.php';
require __DIR__ . '/web/auth.php';
require __DIR__ . '/web/participant.php';
require __DIR__ . '/web/admin.php';
require __DIR__ . '/web/judge.php';

// Fallback route for authenticated users
use Illuminate\Support\Facades\Route;

Route::fallback(function () {
    if (request()->user()) {
        return redirect()->route(request()->user()->role . '.dashboard');
    }
    return redirect('/');
});

