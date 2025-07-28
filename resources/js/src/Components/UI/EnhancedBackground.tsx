import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface EnhancedBackgroundProps {
  className?: string;
}

const EnhancedBackground: React.FC<EnhancedBackgroundProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle system
    const particles: Particle[] = [];
    const connections: Connection[] = [];
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.size = Math.random() * 2 + 0.1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        
        // Colors based on Compsphere palette
        const colors = [
          'rgba(126, 206, 244, 0.6)', // #7ECEF4
          'rgba(30, 136, 229, 0.6)',  // #1E88E5
          'rgba(13, 71, 161, 0.6)',   // #0D47A1
          'rgba(211, 47, 47, 0.6)'    // #D32F2F
        ];
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Boundary check
        if (!canvas) return;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
      }
    }
    
    class Connection {
      p1: Particle;
      p2: Particle;
      
      constructor(p1: Particle, p2: Particle) {
        this.p1 = p1;
        this.p2 = p2;
      }
      
      update() {
        // Nothing to update for connections
      }
      
      draw() {
        if (!ctx) return;
        const distance = Math.sqrt(
          Math.pow(this.p1.x - this.p2.x, 2) + Math.pow(this.p1.y - this.p2.y, 2)
        );
        
        // Only draw connection if particles are close enough
        const maxDistance = 150;
        if (distance < maxDistance) {
          // Opacity based on distance
          const opacity = 1 - distance / maxDistance;
          
          ctx.beginPath();
          ctx.moveTo(this.p1.x, this.p1.y);
          ctx.lineTo(this.p2.x, this.p2.y);
          ctx.strokeStyle = `rgba(126, 206, 244, ${opacity * 0.5})`;
          ctx.lineWidth = 0.3;
          ctx.stroke();
        }
      }
    }
    
    // Initialize particles
    const initializeParticles = () => {
      particles.length = 0;
      connections.length = 0;
      
      // Create particles
      const particleCount = Math.min(Math.floor(window.innerWidth * 0.05), 100);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
      
      // Create connections between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          connections.push(new Connection(particles[i], particles[j]));
        }
      }
    };
    
    initializeParticles();
    window.addEventListener('resize', initializeParticles);
    
    // Grid effect
    const drawGrid = () => {
      if (!ctx) return;
      
      const gridSize = 40;
      const gridColor = 'rgba(255, 255, 255, 0.03)';
      
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.2;
      
      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };
    
    // Glowing orbs
    const drawOrbEffects = () => {
      if (!ctx) return;
      
      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.2,
        canvas.height * 0.3,
        0,
        canvas.width * 0.2,
        canvas.height * 0.3,
        canvas.width * 0.3
      );
      gradient1.addColorStop(0, 'rgba(30, 136, 229, 0.05)');
      gradient1.addColorStop(1, 'rgba(30, 136, 229, 0)');
      
      ctx.beginPath();
      ctx.fillStyle = gradient1;
      ctx.arc(
        canvas.width * 0.2,
        canvas.height * 0.3,
        canvas.width * 0.3,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.8,
        canvas.height * 0.7,
        0,
        canvas.width * 0.8,
        canvas.height * 0.7,
        canvas.width * 0.3
      );
      gradient2.addColorStop(0, 'rgba(211, 47, 47, 0.03)');
      gradient2.addColorStop(1, 'rgba(211, 47, 47, 0)');
      
      ctx.beginPath();
      ctx.fillStyle = gradient2;
      ctx.arc(
        canvas.width * 0.8,
        canvas.height * 0.7,
        canvas.width * 0.3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    };
    
    // Animation loop
    let animationFrame: number;
    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background elements
      drawOrbEffects();
      drawGrid();
      
      // Update and draw connections first (to be behind particles)
      connections.forEach(connection => {
        connection.update();
        connection.draw();
      });
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', initializeParticles);
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <div className={`fixed inset-0 z-0 overflow-hidden ${className}`}>
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0D47A1]/20 to-black"></div>
      
      {/* Canvas for particle system and grid effect */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Additional glow effects */}
      <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-[#1E88E5]/10 to-transparent"></div>
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#D32F2F]/10 to-transparent"></div>
      
      {/* Subtle noise texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')] opacity-30"></div>
    </div>
  );
};

export default EnhancedBackground;
