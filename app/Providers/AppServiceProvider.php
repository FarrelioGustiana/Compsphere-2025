<?php

namespace App\Providers;

use App\Services\QRCodeService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register QRCodeService as singleton
        $this->app->singleton(QRCodeService::class, function ($app) {
            return new QRCodeService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
