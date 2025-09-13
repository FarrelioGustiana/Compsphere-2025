import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.tsx"],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "resources/js"),
            "@css": path.resolve(__dirname, "resources/css"),
            "/assets": path.resolve(__dirname, "public/assets"),
            "/fonts": path.resolve(__dirname, "public/fonts"),
        },
    },
    server: {
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: [
                        'react', 
                        'react-dom',
                        'lucide-react',
                        '@inertiajs/react'
                    ]
                    // Removed UI chunk that was causing issues
                }
            }
        },
        chunkSizeWarningLimit: 1000,
    },
});
