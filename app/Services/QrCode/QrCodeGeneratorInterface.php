<?php

namespace App\Services\QrCode;

interface QrCodeGeneratorInterface
{
    /**
     * Generate QR Code for the given text/URL.
     *
     * @param string $text Text or URL to encode in the QR code
     * @param int $size Size of the QR code
     * @return string Base64 encoded string of the QR code image
     */
    public function generate(string $text, int $size = 200): string;

    /**
     * Save QR code to a file.
     *
     * @param string $text Text or URL to encode in the QR code
     * @param string $path Path to save the QR code
     * @param int $size Size of the QR code
     * @return bool Whether the operation was successful
     */
    public function saveToFile(string $text, string $path, int $size = 200): bool;
}
