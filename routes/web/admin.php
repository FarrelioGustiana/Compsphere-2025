<?php

use App\Http\Controllers\Admin\QRVerificationController;
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

        // QR Code Verification Routes
        Route::get('/qr-scanner', [QRVerificationController::class, 'showScanner'])->name('admin.qr.scanner');
        Route::get('/qr-verify/{event_code}/{activity_code}/{token}', [QRVerificationController::class, 'showVerificationConfirm'])->name('admin.qr.verify');
        Route::post('/qr-verify', [QRVerificationController::class, 'processVerification'])->name('admin.qr.process');
        Route::post('/qr-verification/verify', [QRVerificationController::class, 'verifyQRCode'])->name('admin.qr-verification.verify');
        Route::get('/qr-result/{verification_id}', [QRVerificationController::class, 'showVerificationResult'])->name('admin.qr.result');

        // QR Code Verification URL - this should be accessed via QR Code scanning
        Route::get('/verify/{eventCode}/{activityCode}/{verificationToken}', [QRVerificationController::class, 'showVerificationPage'])
            ->name('admin.qr-verification.page');
            
        // New descriptive URL format for QR Code scanning
        Route::get('/{eventCode}/{activityCode}/{teamCode}', [QRVerificationController::class, 'verifyByTeamCode'])
            ->name('admin.qr-verification.team-code');
            
        // Hacksphere Admin Routes
        Route::prefix('hacksphere')->group(function () {
            Route::get('/activities', [\App\Http\Controllers\Admin\HacksphereController::class, 'activities'])->name('admin.hacksphere.activities');
            Route::get('/teams', [\App\Http\Controllers\Admin\HacksphereController::class, 'teams'])->name('admin.hacksphere.teams');
            Route::get('/team/{team_id}', [\App\Http\Controllers\Admin\HacksphereController::class, 'teamDetails'])->name('admin.hacksphere.team.details');
        });
        
        // Talksphere Admin Routes
        Route::get('/talksphere/participants', [\App\Http\Controllers\Admin\EventParticipantsController::class, 'participants'])->name('admin.talksphere.participants')->defaults('eventCode', 'talksphere');
        
        // Festsphere Admin Routes
        Route::get('/festsphere/participants', [\App\Http\Controllers\Admin\EventParticipantsController::class, 'participants'])->name('admin.festsphere.participants')->defaults('eventCode', 'festsphere');
        
        // Exposphere Admin Routes
        Route::get('/exposphere/participants', [\App\Http\Controllers\Admin\EventParticipantsController::class, 'participants'])->name('admin.exposphere.participants')->defaults('eventCode', 'exposphere');
    });
});
