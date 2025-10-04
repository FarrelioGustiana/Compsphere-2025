<?php

use App\Http\Controllers\Admin\QRVerificationController;
use App\Http\Controllers\Admin\TalksphereController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VotingController;
use App\Http\Middleware\CheckAdminLevel;
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
    Route::middleware(\App\Http\Middleware\CheckRole::class . ':admin')->group(function () {
        Route::get('/dashboard', function () {
            return app()->make(AdminController::class)->dashboard(request());
        })->name('admin.dashboard');

        Route::get('/profile', function () {
            return app()->make(AdminController::class)->profile(request());
        })->name('admin.profile');

        Route::get('/users', function () {
            return app()->make(AdminController::class)->users(request());
        })->name('admin.users');

        // Super Admin Only Routes
        Route::middleware(CheckAdminLevel::class . ':super_admin')->group(function () {
            Route::get('/user-management', [AdminController::class, 'userManagement'])->name('admin.user-management');
            Route::post('/create-moderator', [AdminController::class, 'createModeratorAdmin'])->name('admin.create-moderator');
            Route::post('/create-judge', [AdminController::class, 'createJudgeAccount'])->name('admin.create-judge');
        });

        // QR Code Verification Routes
        Route::get('/qr-scanner', [QRVerificationController::class, 'showScanner'])->name('admin.qr.scanner');
        Route::get('/qr-verify/{event_code}/{activity_code}/{token}', [QRVerificationController::class, 'showVerificationConfirm'])->name('admin.qr.verify');
        Route::post('/qr-verify', [QRVerificationController::class, 'processVerification'])->name('admin.qr.process');
        Route::post('/qr-verification/verify', [QRVerificationController::class, 'verifyQRCode'])->name('admin.qr-verification.verify');
        Route::get('/qr-result/{verification_id}', [QRVerificationController::class, 'showVerificationResult'])->name('admin.qr.result');

        // QR Code Verification URL - this should be accessed via QR Code scanning
        Route::get('/verify/{eventCode}/{activityCode}/{verificationToken}', [QRVerificationController::class, 'showVerificationPage'])
            ->name('admin.qr-verification.page');

        // Event Registration QR Code Verification Routes
        Route::get('/verify-registration/{eventCode}/{userId}/{token}', [QRVerificationController::class, 'showEventRegistrationVerificationPage'])
            ->name('admin.qr-verification.event-registration');
        Route::post('/verify-registration', [QRVerificationController::class, 'verifyEventRegistrationQR'])
            ->name('admin.qr-verification.event-registration.process');

        // Hacksphere Admin Routes
        Route::prefix('hacksphere')->group(function () {
            // Default route - redirect to dashboard
            Route::get('/', function () {
                return redirect()->route('admin.hacksphere.dashboard');
            });
            
            Route::get('/dashboard', [\App\Http\Controllers\Admin\HacksphereController::class, 'dashboard'])->name('admin.hacksphere.dashboard');
            Route::get('/activities', [\App\Http\Controllers\Admin\HacksphereController::class, 'activities'])->name('admin.hacksphere.activities');
            Route::get('/teams', [\App\Http\Controllers\Admin\HacksphereController::class, 'teams'])->name('admin.hacksphere.teams');
            Route::get('/teams/{team_id}/members', [\App\Http\Controllers\Admin\HacksphereController::class, 'teamDetails'])->name('admin.hacksphere.team.details');
            Route::get('/countdown', [\App\Http\Controllers\Admin\HacksphereCountdownController::class, 'index'])->name('admin.hacksphere.countdown');

            Route::post('/verify-payment/{user_id}', [\App\Http\Controllers\Admin\HacksphereController::class, 'verifyPayment'])->name('admin.hacksphere.verify-payment');
            Route::post('/reject-payment/{user_id}', [\App\Http\Controllers\Admin\HacksphereController::class, 'rejectPayment'])->name('admin.hacksphere.reject-payment');
            Route::post('/verify-team-payment/{team_id}', [\App\Http\Controllers\Admin\HacksphereController::class, 'verifyTeamPayment'])->name('admin.hacksphere.verify-team-payment');
            Route::post('/reject-team-payment/{team_id}', [\App\Http\Controllers\Admin\HacksphereController::class, 'rejectTeamPayment'])->name('admin.hacksphere.reject-team-payment');
            Route::post('/change-team-registration-status', [\App\Http\Controllers\Admin\HacksphereController::class, 'changeTeamRegistrationStatus'])->name('admin.hacksphere.change-team-registration-status');
            
            // Project Submission Routes
            Route::get('/submissions', [\App\Http\Controllers\Admin\HacksphereController::class, 'submissions'])->name('admin.hacksphere.submissions');
            Route::get('/submissions/{submission_id}', [\App\Http\Controllers\Admin\HacksphereController::class, 'submissionDetails'])->name('admin.hacksphere.submissions.show');
            Route::get('/leaderboard', [\App\Http\Controllers\Admin\HacksphereController::class, 'leaderboard'])->name('admin.hacksphere.leaderboard');
            Route::get('/payments', [\App\Http\Controllers\Admin\HacksphereController::class, 'payments'])->name('admin.hacksphere.payments');
            
            // Winner Management Routes
            Route::get('/winners', [\App\Http\Controllers\Admin\HacksphereController::class, 'winners'])->name('admin.hacksphere.winners');
            Route::post('/winners/{submission_id}/set', [\App\Http\Controllers\Admin\HacksphereController::class, 'setWinner'])->name('admin.hacksphere.winners.set');
            
            // Voting Statistics Routes
            Route::get('/voting-stats', [VotingController::class, 'getVotingStats'])->name('admin.hacksphere.voting-stats');
            Route::get('/voting-results', function () {
                return \Inertia\Inertia::render('Admin/HacksphereVotingResults');
            })->name('admin.hacksphere.voting-results');
        });

        // Talksphere Admin Routes
        Route::get('/talksphere', [TalksphereController::class, 'index'])->name('admin.talksphere.dashboard');
        Route::get('/talksphere/sub-event/{subEventId}', [TalksphereController::class, 'showSubEvent'])->name('admin.talksphere.sub-event');
        Route::get('/talksphere/sub-event/{subEventId}/export', [TalksphereController::class, 'exportSubEvent'])->name('admin.talksphere.sub-event.export');
        Route::get('/talksphere/participants', [\App\Http\Controllers\Admin\EventParticipantsController::class, 'participants'])->name('admin.talksphere.participants')->defaults('eventCode', 'talksphere');

        // Festsphere Admin Routes
        Route::get('/festsphere/participants', [\App\Http\Controllers\Admin\EventParticipantsController::class, 'participants'])->name('admin.festsphere.participants')->defaults('eventCode', 'festsphere');

        // Exposphere Admin Routes
        Route::get('/exposphere/participants', [\App\Http\Controllers\Admin\EventParticipantsController::class, 'participants'])->name('admin.exposphere.participants')->defaults('eventCode', 'exposphere');

        // Feedback Management Routes
        Route::prefix('feedback')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\FeedbackController::class, 'index'])->name('admin.feedback.index');
            Route::get('/{feedback}', [\App\Http\Controllers\Admin\FeedbackController::class, 'show'])->name('admin.feedback.show');
            Route::put('/{feedback}', [\App\Http\Controllers\Admin\FeedbackController::class, 'update'])->name('admin.feedback.update');
            Route::delete('/{feedback}', [\App\Http\Controllers\Admin\FeedbackController::class, 'destroy'])->name('admin.feedback.destroy');
            Route::post('/bulk-update', [\App\Http\Controllers\Admin\FeedbackController::class, 'bulkUpdate'])->name('admin.feedback.bulk-update');
        });
        
        // New descriptive URL format for QR Code scanning - must be LAST because it's a catch-all
        Route::get('/{eventCode}/{activityCode}/{teamCode}', [QRVerificationController::class, 'verifyByTeamCode'])
            ->name('admin.qr-verification.team-code');
    });
});
