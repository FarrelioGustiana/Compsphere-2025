<?php

namespace App\Services\QrCode;

class DefaultQrCodeGenerator implements QrCodeGeneratorInterface
{
    /**
     * Generate QR Code for the given text/URL.
     * This is a placeholder implementation that returns a base64 encoded placeholder image.
     * In production, this should be replaced with a proper QR Code library.
     *
     * @param string $text Text or URL to encode in the QR code
     * @param int $size Size of the QR code
     * @return string Base64 encoded string of the QR code image
     */
    public function generate(string $text, int $size = 200): string
    {
        // This is a placeholder implementation
        // In a real implementation, this would use a QR code library
        
        // For now, we'll return a URL that can be used for manual QR code generation
        // or a base64 encoded SVG placeholder
        
        // Generate a simple SVG placeholder that contains the URL text
        $svg = $this->generatePlaceholderSvg($text, $size);
        
        return 'data:image/svg+xml;base64,' . base64_encode($svg);
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
        $svg = $this->generatePlaceholderSvg($text, $size);
        
        return file_put_contents($path, $svg) !== false;
    }
    
    /**
     * Generate a placeholder SVG that contains the URL text.
     * This is only used until a proper QR code library is installed.
     *
     * @param string $text Text to include in the SVG
     * @param int $size Size of the SVG
     * @return string SVG content
     */
    private function generatePlaceholderSvg(string $text, int $size = 200): string
    {
        // Create a simple SVG with the URL text
        // This is not a real QR code, just a placeholder
        $encodedText = htmlspecialchars($text);
        $fontSize = min(12, $size / 20);
        
        $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="$size" height="$size" viewBox="0 0 $size $size">
    <rect width="100%" height="100%" fill="#f0f0f0"/>
    <rect x="10%" y="10%" width="80%" height="80%" fill="#ffffff" stroke="#000000"/>
    <text x="50%" y="50%" font-family="Arial" font-size="$fontSize" text-anchor="middle">
        QR Code Placeholder
    </text>
    <text x="50%" y="60%" font-family="Arial" font-size="$fontSize" text-anchor="middle">
        $encodedText
    </text>
</svg>
SVG;
        
        return $svg;
    }
}
