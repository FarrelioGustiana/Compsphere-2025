import React from "react";

const Hacksphere: React.FC = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-pink-500 text-white p-8">
        <h1 className="text-4xl font-bold mb-4">Hacksphere</h1>
        <p className="max-w-xl text-lg text-center mb-8">
            Kompetisi hackathon untuk mengembangkan solusi inovatif menggunakan teknologi terdepan
        </p>
        <span className="bg-white/20 rounded px-4 py-2 text-sm">12-14 Oktober 2025</span>
    </div>
);

export default Hacksphere;
