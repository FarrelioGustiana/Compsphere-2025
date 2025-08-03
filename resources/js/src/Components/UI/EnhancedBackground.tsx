"use client";

import type React from "react";

const OptimizedBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden">
            {/* Base gradient - using CSS instead of canvas */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-950/20 to-black" />

            {/* Simplified animated orbs using CSS */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float animation-delay-1000" />

            {/* CSS Grid pattern instead of canvas */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Simple CSS stars instead of complex particle system */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full animate-twinkle"
                        style={{
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            opacity: Math.random() * 0.7 + 0.3,
                        }}
                    />
                ))}
            </div>

            {/* Noise texture */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')] opacity-20" />
        </div>
    );
};

export default OptimizedBackground;
