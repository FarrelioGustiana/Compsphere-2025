<?php

use App\Http\Controllers\Judge\JudgeController;
use App\Http\Controllers\JudgeController as BaseJudgeController;
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
            return app()->make(BaseJudgeController::class)->dashboard(request());
        })->name('judge.dashboard');
        
        Route::get('/profile', function () {
            return app()->make(BaseJudgeController::class)->profile(request());
        })->name('judge.profile');
        
        // Project evaluation routes
        Route::get('/hacksphere/dashboard', [JudgeController::class, 'dashboard'])
            ->name('judge.hacksphere.dashboard');
            
        Route::get('/hacksphere/submissions', [JudgeController::class, 'submissions'])
            ->name('judge.hacksphere.submissions');
            
        Route::get('/hacksphere/evaluate/{submissionId}', [JudgeController::class, 'evaluate'])
            ->name('judge.hacksphere.evaluate');
            
        Route::post('/hacksphere/evaluate/{submissionId}', [JudgeController::class, 'storeEvaluation'])
            ->name('judge.hacksphere.evaluation.store');
            
        Route::post('/hacksphere/evaluate/{submissionId}/draft', [JudgeController::class, 'saveEvaluationDraft'])
            ->name('judge.hacksphere.evaluation.draft');
            
        Route::get('/hacksphere/leaderboard', [JudgeController::class, 'leaderboard'])
            ->name('judge.hacksphere.leaderboard');
    });
});
