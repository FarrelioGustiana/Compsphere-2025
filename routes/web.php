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

<<<<<<< Updated upstream
Route::fallback(function () {
    if (request()->user()) {
        return redirect()->route(request()->user()->role . '.dashboard');
    }
    return redirect('/');
=======
Route::get('/', function () {
    return Inertia::render('Pages/Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');

Route::get('/verify-email', function () {
    return Inertia::render('Auth/VerifyEmail');
})->name('verify-email');

// Sub-event pages
Route::get('/hacksphere', function () {
    return Inertia::render('Pages/Events/Hacksphere');
})->name('hacksphere');

Route::get('/talksphere', function () {
    return Inertia::render('Pages/Events/Talksphere');
})->name('talksphere');

Route::get('/festsphere', function () {
    return Inertia::render('Pages/Events/FestSphere');
})->name('festsphere');

Route::get('/exposphere', function () {
    return Inertia::render('Pages/Events/Exposphere');
})->name('exposphere');

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Pages/Dashboard');
    })->name('dashboard');
>>>>>>> Stashed changes
});
