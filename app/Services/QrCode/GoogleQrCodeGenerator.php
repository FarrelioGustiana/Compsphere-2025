<?php

namespace App\Services\QrCode;

class GoogleQrCodeGenerator implements QrCodeGeneratorInterface
{
    /**
     * Generate QR Code for the given text/URL using Google Charts API.
     * This is a reliable alternative if we can't install local libraries.
     *
     * @param string $text Text or URL to encode in the QR code
     * @param int $size Size of the QR code (Google API accepts 100-547)
     * @return string Data URL of the QR code image
     */
    public function generate(string $text, int $size = 200): string
    {
        // Ensure size is within Google's limits
        $size = max(100, min(547, $size));
        
        // Build the Google Charts API URL
        $encodedText = urlencode($text);
        $url = "https://chart.googleapis.com/chart?chs={$size}x{$size}&cht=qr&chl={$encodedText}&choe=UTF-8";
        
        // For production we could cache this to avoid excessive API calls
        // But for demonstration, we'll use the direct URL
        return $url;
    }

    /**
     * Save QR code to a file.
     *
     * @param string $text Text or URL to encode in the QR code
     * @param string $path Path to save the QR code
     * @param int $size Size of the QR code
     * @return bool Whether the operation was successful
     */
    public function saveToFile(string $text, string $path, int $size = 200): bool
    {
        $url = $this->generate($text, $size);
        
        // Download the image from Google Charts API
        $qrCodeImage = @file_get_contents($url);
        
        if ($qrCodeImage === false) {
            return false;
        }
        
        // Save the image to the specified path
        return file_put_contents($path, $qrCodeImage) !== false;
    }
}
