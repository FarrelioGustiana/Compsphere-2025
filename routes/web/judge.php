<?php

use App\Http\Controllers\JudgeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Judge Routes
|--------------------------------------------------------------------------
|
| All routes related to the judge section of the application
|
*/

Route::group([
    'middleware' => ['auth', 'verified'],
    'prefix' => 'judge'
], function () {
    // Routes that require judge role
    Route::middleware(\App\Http\Middleware\CheckRole::class.':judge')->group(function () {
        Route::get('/dashboard', function () {
            return app()->make(JudgeController::class)->dashboard(request());
        })->name('judge.dashboard');
        
        Route::get('/profile', function () {
            return app()->make(JudgeController::class)->profile(request());
        })->name('judge.profile');
    });
});
