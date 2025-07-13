<?php

namespace App\Providers;

use App\Services\QrCode\QrCodeGeneratorInterface;
use App\Services\QrCode\GoogleQrCodeGenerator;
use Illuminate\Support\ServiceProvider;

class QrCodeServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(QrCodeGeneratorInterface::class, function ($app) {
            // Sebelumnya kita mencoba menggunakan simplesoftwareio/simple-qrcode
            // Namun karena ada konflik dependency dengan bacon/bacon-qr-code
            // Kita akan menggunakan GoogleQrCodeGenerator sebagai alternatif
            return new GoogleQrCodeGenerator();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
