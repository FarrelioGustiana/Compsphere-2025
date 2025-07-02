<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| All routes related to the admin section of the application
|
*/

Route::group([
    'middleware' => ['auth', 'verified'],
    'prefix' => 'admin'
], function () {
    // Routes that require admin role
    Route::middleware(\App\Http\Middleware\CheckRole::class.':admin')->group(function () {
        Route::get('/dashboard', function () {
            return app()->make(AdminController::class)->dashboard(request());
        })->name('admin.dashboard');
        
        Route::get('/profile', function () {
            return app()->make(AdminController::class)->profile(request());
        })->name('admin.profile');
        
        Route::get('/users', function () {
            return app()->make(AdminController::class)->users(request());
        })->name('admin.users');
    });
});
