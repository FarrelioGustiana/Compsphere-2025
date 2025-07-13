<?php

use App\Http\Controllers\Participant\TeamQRCodeController;
use App\Http\Controllers\Participant\TeamDashboardController;
use App\Http\Controllers\Participant\ActivityQrController;
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
        
        // Team QR Code routes for Hacksphere
        Route::prefix('teams/{teamId}/qr-codes')->group(function () {
            Route::get('/', [TeamQRCodeController::class, 'showTeamQRCodes'])
                ->name('participant.team.qr-codes');
                
            Route::post('/regenerate', [TeamQRCodeController::class, 'regenerateQRCode'])
                ->name('participant.team.qr-codes.regenerate');
                
            Route::get('/download/{activityId}', [TeamQRCodeController::class, 'downloadQRCode'])
                ->name('participant.team.qr-codes.download');
        });
        
        // Team Dashboard route for Hacksphere
        Route::get('/team/{teamId}', [\App\Http\Controllers\Participant\TeamDashboardController::class, 'show'])
            ->name('participant.team.dashboard');
            
        // Activity QR Code route
        Route::get('/activity-qr/{teamId}/{activityId}', [\App\Http\Controllers\Participant\ActivityQrController::class, 'show'])
            ->name('participant.activity.qr');
    });

    Route::post('/register-hacksphere', [\App\Http\Controllers\ParticipantController::class, 'registerHacksphere'])->name('participant.register-hacksphere');
    Route::post('/validate-team-member-email', [\App\Http\Controllers\ParticipantController::class, 'validateTeamMemberEmail'])->name('participant.validate-team-member-email');
    Route::post('/validate-team-member-nik', [\App\Http\Controllers\ParticipantController::class, 'validateTeamMemberNik'])->name('participant.validate-team-member-nik');
});
