'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { audiowide, vt323 } from '@/frontend/utils/fonts';

// Add PixelatedLine class
class PixelatedLine {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
  opacity: number;
  pixelSize: number;
  direction: 'horizontal' | 'vertical' | 'diagonal';

  constructor(canvas: HTMLCanvasElement, direction: 'horizontal' | 'vertical' | 'diagonal') {
    this.direction = direction;
    this.pixelSize = Math.random() * 4 + 3; // Larger pixel size for better visibility
    
    if (direction === 'horizontal') {
      this.x = 0;
      this.y = Math.random() * canvas.height;
      this.width = canvas.width;
      this.height = Math.random() * 4 + 2; // Thicker lines
      this.speed = (Math.random() * 0.4) + 0.2; // Adjusted for 60fps
    } else if (direction === 'vertical') {
      this.x = Math.random() * canvas.width;
      this.y = 0;
      this.width = Math.random() * 4 + 2; // Thicker lines
      this.height = canvas.height;
      this.speed = (Math.random() * 0.4) + 0.2; // Adjusted for 60fps
    } else {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.width = Math.random() * 4 + 2; // Thicker lines
      this.height = this.width;
      this.speed = (Math.random() * 0.3) + 0.15; // Slower for diagonal
    }
    
    const hue = Math.floor(Math.random() * 60) + 200; // Blue/purple range
    this.color = `hsl(${hue}, 80%, 60%)`; // More saturated colors
    this.opacity = Math.random() * 0.4 + 0.2; // Higher base opacity
  }

  update(canvas: HTMLCanvasElement) {
    if (this.direction === 'horizontal') {
      this.x += this.speed;
      if (this.x > canvas.width) {
        this.x = -this.width;
        this.y = Math.random() * canvas.height;
      }
    } else if (this.direction === 'vertical') {
      this.y += this.speed;
      if (this.y > canvas.height) {
        this.y = -this.height;
        this.x = Math.random() * canvas.width;
      }
    } else {
      this.x += this.speed;
      this.y += this.speed;
      if (this.x > canvas.width || this.y > canvas.height) {
        this.x = Math.random() * canvas.width;
        this.y = -this.height;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    
    // Draw pixelated line
    const pixelCount = this.direction === 'horizontal' 
      ? Math.ceil(this.width / this.pixelSize)
      : Math.ceil(this.height / this.pixelSize);
    
    for (let i = 0; i < pixelCount; i++) {
      const x = this.direction === 'horizontal' 
        ? this.x + (i * this.pixelSize)
        : this.x;
      const y = this.direction === 'horizontal'
        ? this.y
        : this.y + (i * this.pixelSize);
      
      ctx.fillRect(
        Math.round(x), 
        Math.round(y), 
        this.pixelSize, 
        this.pixelSize
      );
    }
    
    ctx.restore();
  }
}



const AiIntegrationSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInView, setIsInView] = useState(false);
  const animationFrameRef = useRef<number>(0);
  const [pixelatedLines, setPixelatedLines] = useState<PixelatedLine[]>([]);

  // Enhanced animation for the floating AI model names, grid mesh and stars
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Observer to check if section is in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    // Adjust canvas size to match container
    const resizeCanvas = () => {
      if (container && canvas) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    // Initial resize
    resizeCanvas();

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);

    // AI model names and business terms
    const terms = [
      'PET-GPT', 'Claude', 'Gemini', 'Llama', 'Mistral',
      'Copilot', 'Bard', 'Falcon', 'GPT-4', 'Anthropic',
      'Business Intelligence', 'AI Integration', 'Neural Networks',
      'Machine Learning', 'NLP', 'Customer Support', 'Data Analytics',
      'ChatBot', 'Language Models', 'Automation'
    ];

    // Particles class to manage floating text with enhanced visibility
    class Particle {
      x: number;
      y: number;
      size: number;
      text: string;
      speed: number;
      color: string;
      opacity: number;
      direction: number;
      glowIntensity: number;

      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.floor(Math.random() * 14) + 10; // Font size between 10-24px
        this.text = terms[Math.floor(Math.random() * terms.length)];
        this.speed = (Math.random() * 0.8) + 0.2; // Increased speed
        
        // Enhanced color palette for better visibility
        const hue = Math.floor(Math.random() * 60) + 220; // 220-280 for blue/purple
        const lightness = Math.floor(Math.random() * 20) + 60; // 60-80% lightness for better visibility
        this.color = `hsl(${hue}, 80%, ${lightness}%)`;
        this.opacity = Math.random() * 0.6 + 0.25; // 0.25 to 0.85 for better visibility
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.glowIntensity = Math.random() * 5 + 3; // For text glow effect
      }

      update(canvas: HTMLCanvasElement) {
        // Move particles diagonally with varied speeds
        this.x += this.speed * this.direction;
        this.y -= this.speed * 0.6;
        
        // If particle moves out of bounds, reset it
        if (this.x < -150 || this.x > canvas.width + 150 || 
            this.y < -100 || this.y > canvas.height + 100) {
          this.x = Math.random() * canvas.width;
          this.y = canvas.height + 50;
          this.opacity = Math.random() * 0.6 + 0.25;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.font = `${this.size}px 'Courier New', monospace`;
        
        // Add glow effect for better visibility
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.glowIntensity;
        
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
      }
    }

    // Grid line class for mesh background
    class GridLine {
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
      opacity: number;
      speed: number;
      horizontal: boolean;

      constructor(canvas: HTMLCanvasElement, horizontal: boolean) {
        this.horizontal = horizontal;
        
        if (horizontal) {
          this.x = 0;
          this.y = Math.random() * canvas.height;
          this.width = canvas.width;
          this.height = Math.random() * 1.5 + 0.8; // Increased line thickness
          this.speed = (Math.random() * 0.3) + 0.1; // Reduced speed for smoother movement
        } else {
          this.x = Math.random() * canvas.width;
          this.y = 0;
          this.width = Math.random() * 1.5 + 0.8; // Increased line thickness
          this.height = canvas.height;
          this.speed = (Math.random() * 0.3) + 0.1; // Reduced speed for smoother movement
        }
        
        const hue = Math.floor(Math.random() * 40) + 220; // Blue/purple hue
        this.color = `hsl(${hue}, 70%, 50%)`; // Increased saturation
        this.opacity = Math.random() * 0.25 + 0.1; // Increased base opacity
      }

      update(canvas: HTMLCanvasElement) {
        if (this.horizontal) {
          this.y += this.speed;
          if (this.y > canvas.height) {
            this.y = 0;
            this.opacity = Math.random() * 0.15 + 0.05;
          }
        } else {
          this.x += this.speed;
          if (this.x > canvas.width) {
            this.x = 0;
            this.opacity = Math.random() * 0.15 + 0.05;
          }
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
      }
    }

    // Star class for background stars
    class Star {
      x: number;
      y: number;
      radius: number;
      color: string;
      opacity: number;
      pulseSpeed: number;
      pulseDirection: number;

      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 1.2 + 0.3; // Slightly reduced star size
        this.color = `rgb(${180 + Math.random() * 75}, ${180 + Math.random() * 75}, ${255})`; // Adjusted color
        this.opacity = Math.random() * 0.4 + 0.2; // Reduced opacity
        this.pulseSpeed = Math.random() * 0.015 + 0.005; // Slower pulse
        this.pulseDirection = 1;
      }

      update() {
        // Make stars pulse
        this.opacity += this.pulseSpeed * this.pulseDirection;
        if (this.opacity > 0.9) {
          this.pulseDirection = -1;
        } else if (this.opacity < 0.3) {
          this.pulseDirection = 1;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        
        // Add glow effect to stars
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 5;
        ctx.globalAlpha = this.opacity * 0.7;
        ctx.fill();
        ctx.restore();
      }
    }

    // Create particles
    const particles: Particle[] = [];
    const gridLines: GridLine[] = [];
    const stars: Star[] = [];
    
    // Determine counts based on canvas size
    const particleCount = Math.min(40, Math.floor((canvas.width * canvas.height) / 25000));
    const gridLineCount = Math.min(30, Math.floor((canvas.width + canvas.height) / 100));
    const starCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 10000));
    
    // Initialize objects
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas));
    }

    for (let i = 0; i < gridLineCount; i++) {
      gridLines.push(new GridLine(canvas, i % 2 === 0));
    }

    for (let i = 0; i < starCount; i++) {
      stars.push(new Star(canvas));
    }

    // Connect nodes function for network-like effect
    const connectNodes = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
      const maxDistance = 150; // Maximum distance to draw connections
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx.strokeStyle = `rgba(100, 120, 255, ${opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      if (!isInView) {
        animationFrameId = window.requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars first (background layer)
      stars.forEach((star) => {
        star.update();
        star.draw(ctx);
      });
      
      // Draw grid lines (middle layer)
      gridLines.forEach((line) => {
        line.update(canvas);
        line.draw(ctx);
      });
      
      // Connect particles to create network effect
      connectNodes(ctx, particles);
      
      // Draw particles (foreground layer)
      particles.forEach((particle) => {
        particle.update(canvas);
        particle.draw(ctx);
      });
      
      animationFrameId = window.requestAnimationFrame(animate);
    };
    
    animate();

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isInView]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    handleResize();

    // Initialize pixelated lines
    const newPixelatedLines = [
      ...Array(2).fill(null).map(() => new PixelatedLine(canvas, 'horizontal')),
      ...Array(2).fill(null).map(() => new PixelatedLine(canvas, 'vertical')),
      ...Array(1).fill(null).map(() => new PixelatedLine(canvas, 'diagonal'))
    ];
    setPixelatedLines(newPixelatedLines);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || pixelatedLines.length === 0) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update pixelated lines
      pixelatedLines.forEach(line => {
        line.update(canvas);
        line.draw(ctx);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [pixelatedLines]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl"
      ref={containerRef}
      style={{ minHeight: "300px" }}
      className="md:min-h-[400px]"
    >
      {/* Canvas background with floating AI terms */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ 
          filter: 'contrast(1.2) brightness(0.95)',
          imageRendering: 'pixelated'
        }}
      />
      
      {/* Content overlay */}
      <div className="relative z-10 py-4 md:py-8">
        {/* NEX-DEVS Specialty Banner - Enhanced */}
        <div className="flex justify-center mb-3 md:mb-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.7,
              ease: [0.19, 1, 0.22, 1] // Custom easing for smoother animation
            }}
            className="relative group"
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>
            
            {/* Main banner */}
            <div className="bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-indigo-600/10 px-4 md:px-8 py-2 md:py-3 rounded-full backdrop-blur-md relative">
              {/* Animated border */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 via-purple-500/50 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Text content */}
              <div className="relative flex items-center gap-2">
                <motion.span
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-base md:text-lg lg:text-xl font-bold"
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-gradient">NEX-DEVS</span>
                </motion.span>
                <span className="text-blue-100 text-base md:text-lg lg:text-xl font-semibold tracking-wider">MAIN SPECIALTY</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Title with Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-4 md:mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl -m-2 md:-m-4"></div>
            <h2 className={`${audiowide.className} text-lg md:text-xl lg:text-3xl font-bold text-white mb-2 md:mb-3 px-3 md:px-6 py-2 md:py-4 bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-xl md:rounded-2xl shadow-xl relative z-10`}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                AI INTEGRATION
              </span>{" "}
              <span className="text-white">/</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                CHATBOT DEVELOPMENT
              </span>
            </h2>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="max-w-3xl mt-2 md:mt-4 px-3 md:px-4 py-2 md:py-3 bg-black/30 backdrop-blur-md rounded-lg md:rounded-xl border border-blue-500/20"
          >
            <p className="text-blue-100 text-xs md:text-sm lg:text-base">
              Transform your business with cutting-edge AI solutions. Our custom chatbots and AI integrations 
              enhance customer experiences, automate tasks, and provide valuable insights.
            </p>
          </motion.div>
        </motion.div>
        
        {/* AI Service Cards - Enhanced Modern Look */}
        <div className="mt-3 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 max-w-5xl mx-auto px-3 md:px-4">
          {/* Custom AI Chatbot Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.19, 1, 0.22, 1]
            }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            className="group bg-gradient-to-br from-black/80 to-blue-900/10 backdrop-blur-lg rounded-xl overflow-hidden cursor-pointer transform-gpu relative pixelated-border-blue"
            style={{
              border: '2px solid transparent',
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.8), rgba(30,58,138,0.1)),
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(59,130,246,0.3) 2px,
                  rgba(59,130,246,0.3) 4px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(59,130,246,0.3) 2px,
                  rgba(59,130,246,0.3) 4px
                )
              `,
              backgroundClip: 'padding-box, border-box, border-box',
              imageRendering: 'pixelated'
            }}
          >
            <Link href="/ai-services/custom-chatbot">
              <div className="p-3 md:p-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></div>
                
                <div className="relative transition-transform duration-300 ease-out group-hover:translate-x-1">
                  <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
                    <div className="text-lg md:text-xl p-2 md:p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span role="img" aria-label="robot">🤖</span>
                    </div>
                    <h3 className={`${audiowide.className} text-lg md:text-xl font-bold text-white`}>Custom AI Chatbot</h3>
                  </div>
                  <p className={`${vt323.className} text-gray-300 mb-3 md:mb-6 text-sm md:text-base`}>
                    Personalized AI chatbot solutions tailored to your business needs, with natural language understanding and 24/7 customer support capabilities.
                  </p>
                  <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <span>View Details</span>
                    <motion.svg 
                      className="w-5 h-5 ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </motion.svg>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
          
          {/* AI Business Integration Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.19, 1, 0.22, 1]
            }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            className="group bg-gradient-to-br from-black/80 to-purple-900/10 backdrop-blur-lg rounded-xl overflow-hidden cursor-pointer transform-gpu relative pixelated-border-purple"
            style={{
              border: '2px solid transparent',
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.8), rgba(88,28,135,0.1)),
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(147,51,234,0.3) 2px,
                  rgba(147,51,234,0.3) 4px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(147,51,234,0.3) 2px,
                  rgba(147,51,234,0.3) 4px
                )
              `,
              backgroundClip: 'padding-box, border-box, border-box',
              imageRendering: 'pixelated'
            }}
          >
            {/* Available Now - No Lock */}

            <Link href="/ai-services/business-integration">
              <div className="p-3 md:p-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></div>

                <div className="relative transition-transform duration-300 ease-out group-hover:translate-x-1">
                  <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
                    <div className="text-lg md:text-xl p-2 md:p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span role="img" aria-label="brain">🧠</span>
                    </div>
                    <h3 className={`${audiowide.className} text-lg md:text-xl font-bold text-white`}>AI Business Integration</h3>
                  </div>
                  <p className={`${vt323.className} text-gray-300 mb-3 md:mb-6 text-sm md:text-base`}>
                    Seamlessly integrate AI into your existing business workflows to automate processes, analyze data, and gain actionable insights.
                  </p>
                  <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                    <span>View Details</span>
                    <motion.svg
                      className="w-4 md:w-5 h-4 md:h-5 ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </motion.svg>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
        
        {/* Enhanced Promotional Banner */}
        <div className="flex justify-center mt-4 md:mt-8 px-3 md:px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 px-3 md:px-5 py-3 md:py-4 rounded-lg md:rounded-xl text-center max-w-4xl border border-blue-500/30 backdrop-blur-md shadow-lg shadow-blue-900/10 relative overflow-hidden"
          >
            {/* Animated glow effects */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            
            <h3 className={`${audiowide.className} text-base md:text-lg font-bold text-white mb-1 md:mb-2 relative`}>Ready to harness the power of AI?</h3>
            <p className={`${vt323.className} text-blue-200 text-sm md:text-base mb-2 md:mb-4 relative`}>
              Our AI solutions are built on state-of-the-art language models with enterprise-grade security and customization.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs relative">
              <div className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full backdrop-blur-md shadow-inner shadow-blue-500/10">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  24/7 Customer Support
                </span>
              </div>
              <div className="bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-full backdrop-blur-md shadow-inner shadow-indigo-500/10">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  Multi-language Support
                </span>
              </div>
              <div className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full backdrop-blur-md shadow-inner shadow-purple-500/10">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Data Analytics
                </span>
              </div>
              <div className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full backdrop-blur-md shadow-inner shadow-cyan-500/10">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                  Seamless Integration
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Add this CSS at the top of your file or in your global styles */}
        <style jsx global>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes pixelated-glow {
            0%, 100% {
              filter: brightness(1) contrast(1.2);
              box-shadow: 0 0 10px rgba(59,130,246,0.3);
            }
            50% {
              filter: brightness(1.1) contrast(1.3);
              box-shadow: 0 0 20px rgba(59,130,246,0.5);
            }
          }

          @keyframes pixelated-glow-purple {
            0%, 100% {
              filter: brightness(1) contrast(1.2);
              box-shadow: 0 0 10px rgba(147,51,234,0.3);
            }
            50% {
              filter: brightness(1.1) contrast(1.3);
              box-shadow: 0 0 20px rgba(147,51,234,0.5);
            }
          }

          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 8s ease infinite;
          }

          .pixelated-border-blue {
            animation: pixelated-glow 3s ease-in-out infinite;
          }

          .pixelated-border-purple {
            animation: pixelated-glow-purple 3s ease-in-out infinite;
          }

          .transform-gpu {
            transform: translateZ(0);
            backface-visibility: hidden;
            perspective: 1000px;
          }


          }
        `}</style>
      </div>
    </motion.div>
  );
};

export default AiIntegrationSection; 