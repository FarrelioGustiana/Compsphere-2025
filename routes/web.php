<?php

use Illuminate\Support\Facades\Route;

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

// Public countdown display for Hacksphere - accessible without authentication
use App\Http\Controllers\Admin\HacksphereCountdownController;
Route::get('/hacksphere/countdown', [HacksphereCountdownController::class, 'publicDisplay'])->name('hacksphere.countdown.public');

// Fallback route for SPA navigation
use Inertia\Inertia;

Route::fallback(function () {
    // If user is authenticated, redirect to their dashboard
    if (request()->user()) {
        return redirect()->route(request()->user()->role . '.dashboard');
    }

    // For SPA navigation return the NotFound page
    return Inertia::render('NotFound');
});
