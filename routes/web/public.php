<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EventController;
use App\Http\Controllers\VotingController;
use App\Models\Event;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
|
| All public routes that don't require authentication
|
*/

Route::get('/', function () {
    $events = Event::all();
    return Inertia::render('Pages/Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'events' => $events,
    ]);
});

// Public event information routes
Route::prefix('events')->group(function () {
    Route::get('/', [EventController::class, 'index'])->name('events.index');
    Route::get('/{slug}', [EventController::class, 'show'])->name('events.show');
});

// Public voting routes for Hacksphere submissions
Route::prefix('voting')->group(function () {
    Route::get('/hacksphere', [VotingController::class, 'index'])->name('voting.hacksphere');
    
    // Protected voting actions (require authentication)
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::post('/hacksphere/{submission}/vote', [VotingController::class, 'vote'])->name('voting.vote');
        Route::delete('/hacksphere/{submission}/unvote', [VotingController::class, 'unvote'])->name('voting.unvote');
    });
});
