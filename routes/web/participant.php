<?php

use App\Http\Controllers\Participant\TeamQRCodeController;
use App\Http\Controllers\Participant\TeamDashboardController;
use App\Http\Controllers\Participant\ActivityQrController;
use App\Http\Controllers\Participant\EventRegistrationQRController;
use App\Http\Controllers\SubEventQRController;
use App\Http\Controllers\Participant\PaymentStatusController;
use App\Http\Controllers\Participant\ProjectSubmissionController;
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
        
        Route::post('/register-event/{eventId}', [ParticipantController::class, 'registerEvent'])
            ->name('participant.register-event');
            
        Route::post('/register-sub-event/{subEventId}', [ParticipantController::class, 'registerSubEvent'])
            ->name('participant.register-sub-event');
            
        Route::post('/events/{eventId}/twibbon', [ParticipantController::class, 'updateTwibbonLink'])
            ->name('participant.update-twibbon');
        
        Route::post('/update-nik', function () {
            return app()->make(ParticipantController::class)->updateNik(request());
        })->name('participant.update-nik');

        Route::post('/profile/update', [\App\Http\Controllers\ParticipantController::class, 'updateProfile'])->name('participant.profile.update');
        
        // Payment Status route for Hacksphere (no middleware needed)
        Route::get('/hacksphere/payment-status/{teamId}', [PaymentStatusController::class, 'show'])
            ->name('participant.hacksphere.payment-status');
        
        // Team QR Code routes for Hacksphere (with payment verification middleware)
        Route::prefix('teams/{teamId}/qr-codes')->middleware('\App\Http\Middleware\VerifyHackspherePayment')->group(function () {
            Route::get('/', [TeamQRCodeController::class, 'showTeamQRCodes'])
                ->name('participant.team.qr-codes');
                
            Route::post('/regenerate', [TeamQRCodeController::class, 'regenerateQRCode'])
                ->name('participant.team.qr-codes.regenerate');
                
            Route::get('/download/{activityId}', [TeamQRCodeController::class, 'downloadQRCode'])
                ->name('participant.team.qr-codes.download');
        });
        
        // Team Dashboard route for Hacksphere (with payment verification middleware)
        Route::get('/team/{teamId}', [\App\Http\Controllers\Participant\TeamDashboardController::class, 'show'])
            ->middleware(\App\Http\Middleware\VerifyHackspherePayment::class)
            ->name('participant.team.dashboard');
            
        Route::get('/activity-qr/{teamId}/{activityId}', [\App\Http\Controllers\Participant\ActivityQrController::class, 'show'])
            ->middleware(\App\Http\Middleware\VerifyHackspherePayment::class)
            ->name('participant.activity.qr');
            
        // QR Code routes
        Route::get('/activity-qr/{teamId}/{activityId}', [ActivityQrController::class, 'show'])->name('activity-qr');
        Route::get('/event-registration/qr-code/{eventCode}', [EventRegistrationQRController::class, 'show'])->name('event-registration.qr-code');
        
        // Sub-event QR Code routes
        Route::get('/sub-event/qr-code/{subEventId}', [SubEventQRController::class, 'show'])->name('sub-event.qr-code');
        Route::post('/sub-event/qr-code/{subEventId}/regenerate', [SubEventQRController::class, 'regenerate'])->name('sub-event.qr-code.regenerate');
        
        // Hacksphere Registration Routes
        Route::post('/register-hacksphere', [\App\Http\Controllers\ParticipantController::class, 'registerHacksphere'])
            ->name('participant.register-hacksphere');
        Route::post('/validate-team-member-email', [\App\Http\Controllers\ParticipantController::class, 'validateTeamMemberEmail'])
            ->name('participant.validate-team-member-email');
        Route::post('/validate-team-member-nik', [\App\Http\Controllers\ParticipantController::class, 'validateTeamMemberNik'])
            ->name('participant.validate-team-member-nik');
            
        // Project Submission Routes (with payment verification middleware)
        Route::prefix('team/{teamId}/submission')->middleware('\App\Http\Middleware\VerifyHackspherePayment')->group(function () {
            Route::get('/', [ProjectSubmissionController::class, 'show'])
                ->name('participant.team.submission');
            Route::post('/', [ProjectSubmissionController::class, 'store'])
                ->name('participant.team.submission.store');
            Route::put('/', [ProjectSubmissionController::class, 'update'])
                ->name('participant.team.submission.update');
            Route::post('/draft', [ProjectSubmissionController::class, 'saveDraft'])
                ->name('participant.team.submission.draft');
        });
    });
});
