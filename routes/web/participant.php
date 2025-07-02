<?php

use App\Http\Controllers\ParticipantController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Participant Routes
|--------------------------------------------------------------------------
|
| All routes related to the participant section of the application
|
*/

Route::group([
    'middleware' => ['auth', 'verified'],
    'prefix' => 'participant'
], function () {
    // Routes that require participant role
    Route::middleware(\App\Http\Middleware\CheckRole::class.':participant')->group(function () {
        Route::get('/dashboard', function () {
            return app()->make(ParticipantController::class)->dashboard(request());
        })->name('participant.dashboard');
        
        Route::get('/profile', function () {
            return app()->make(ParticipantController::class)->profile(request());
        })->name('participant.profile');
        
        Route::post('/register-event/{eventId}', function ($eventId) {
            return app()->make(ParticipantController::class)->registerEvent(request(), $eventId);
        })->name('participant.register-event');
        
        Route::post('/update-nik', function () {
            return app()->make(ParticipantController::class)->updateNik(request());
        })->name('participant.update-nik');

        Route::post('/profile/update', [\App\Http\Controllers\ParticipantController::class, 'updateProfile'])->name('participant.profile.update');
    });
});
