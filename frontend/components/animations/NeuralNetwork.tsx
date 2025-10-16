'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number;
  pulse: number;
  baseSize?: number; // Individual base size for visual variety
}

interface NeuralNetworkProps {
  color?: string;
  lineColor?: string;
  pointCount?: number;
  connectionRadius?: number;
  speed?: number;
  containerBounds?: boolean; // New prop to contain within parent
}

export default function NeuralNetwork({
  color = '#00D4FF', // Professional cyan with better visibility
  lineColor = '#00FF9F', // Enhanced green with professional look
  pointCount = 35, // Increased for more richness while maintaining performance
  connectionRadius = 140, // Slightly increased for better connectivity
  speed = 0.25, // Slightly reduced for smoother, more professional movement
  containerBounds = true // Default to contained within parent
}: NeuralNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Optimized resize handler with container bounds support
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance

    if (containerBounds && container) {
      // Use container dimensions for hero section containment
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * pixelRatio;
      canvas.height = rect.height * pixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    } else {
      // Use full viewport for global effect
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }
    ctx.scale(pixelRatio, pixelRatio);
  }, [containerBounds]);

  // Helper function to get canvas dimensions
  const getCanvasDimensions = useCallback(() => {
    if (containerBounds && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }
    return { width: window.innerWidth, height: window.innerHeight };
  }, [containerBounds]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Initialize points with strategic distribution for better visual coverage
    const { width, height } = getCanvasDimensions();
    pointsRef.current = Array.from({ length: pointCount }, (_, i) => {
      let x, y;

      if (i < pointCount * 0.35) {
        // Top area points (35%) - reduced slightly for better balance
        x = Math.random() * width;
        y = Math.random() * (height * 0.35);
      } else if (i < pointCount * 0.65) {
        // Center and sides points (30%) - better distributed
        x = Math.random() * width;
        y = height * 0.2 + Math.random() * (height * 0.6);
      } else {
        // Scattered points for depth (35%)
        x = Math.random() * width;
        y = Math.random() * height;
      }

      return {
        x,
        y,
        vx: (Math.random() - 0.5) * speed * (0.8 + Math.random() * 0.4), // Varied speed for natural movement
        vy: (Math.random() - 0.5) * speed * (0.8 + Math.random() * 0.4),
        connections: 0,
        pulse: Math.random() * Math.PI * 2,
        baseSize: 2.5 + Math.random() * 1.5 // Individual base sizes for variety
      };
    });

    setIsInitialized(true);

    // Optimized animation loop with performance monitoring
    const animate = (currentTime: number) => {
      if (!canvas || !ctx || !isVisibleRef.current) return;

      // Throttle to 60fps max
      if (currentTime - lastTimeRef.current < 16.67) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = currentTime;

      // Clear with optimized method
      const { width, height } = getCanvasDimensions();
      ctx.clearRect(0, 0, width, height);

      // Reset connection counts
      pointsRef.current.forEach(point => point.connections = 0);

      // Draw connections with optimized algorithm
      const connections: Array<{x1: number, y1: number, x2: number, y2: number, opacity: number, distance: number}> = [];

      for (let i = 0; i < pointsRef.current.length; i++) {
        const point = pointsRef.current[i];

        for (let j = i + 1; j < pointsRef.current.length; j++) {
          const otherPoint = pointsRef.current[j];

          // Skip if both points already have too many connections
          if (point.connections >= 3 && otherPoint.connections >= 3) continue;

          const dx = point.x - otherPoint.x;
          const dy = point.y - otherPoint.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionRadius) {
            const opacity = Math.pow(1 - (distance / connectionRadius), 1.5) * 0.95; // Enhanced opacity curve for better visibility
            connections.push({
              x1: point.x,
              y1: point.y,
              x2: otherPoint.x,
              y2: otherPoint.y,
              opacity,
              distance // Store distance for line width calculation
            });
            point.connections++;
            otherPoint.connections++;
          }
        }
      }

      // Batch draw connections with enhanced visual effects
      connections.forEach(conn => {
        const lineWidth = Math.max(1.5, conn.opacity * 3); // Slightly thicker for better visibility
        const glowIntensity = conn.opacity * 0.3;
        
        // Draw glow effect for lines
        ctx.beginPath();
        ctx.moveTo(conn.x1, conn.y1);
        ctx.lineTo(conn.x2, conn.y2);
        ctx.strokeStyle = `${lineColor}${Math.floor(glowIntensity * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = lineWidth + 2;
        ctx.stroke();
        
        // Draw main line
        ctx.beginPath();
        ctx.moveTo(conn.x1, conn.y1);
        ctx.lineTo(conn.x2, conn.y2);
        ctx.strokeStyle = `${lineColor}${Math.floor(conn.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      });

      // Update and draw points
      pointsRef.current.forEach(point => {
        // Update position with smooth movement
        point.x += point.vx;
        point.y += point.vy;
        point.pulse += 0.05;

        // Smooth wall bouncing with container bounds
        const { width, height } = getCanvasDimensions();
        const padding = 30;
        if (point.x < padding || point.x > width - padding) {
          point.vx *= -0.9;
          point.x = Math.max(padding, Math.min(width - padding, point.x));
        }
        if (point.y < padding || point.y > height - padding) {
          point.vy *= -0.9;
          point.y = Math.max(padding, Math.min(height - padding, point.y));
        }

        // Draw point with professional glow effect
        const baseSize = point.baseSize || 3;
        const pulseSize = baseSize + Math.sin(point.pulse) * 0.6; // Smoother, more professional pulse
        const connectionIntensity = Math.min(point.connections / 4, 1);
        const dynamicOpacity = 0.85 + connectionIntensity * 0.15;

        // Outer glow - more subtle but visible
        const outerGradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, pulseSize + 3);
        outerGradient.addColorStop(0, `${color}${Math.floor(dynamicOpacity * 255).toString(16).padStart(2, '0')}`);
        outerGradient.addColorStop(0.7, `${color}${Math.floor(dynamicOpacity * 0.4 * 255).toString(16).padStart(2, '0')}`);
        outerGradient.addColorStop(1, `${color}10`);

        ctx.beginPath();
        ctx.arc(point.x, point.y, pulseSize + 2, 0, Math.PI * 2);
        ctx.fillStyle = outerGradient;
        ctx.fill();

        // Middle glow layer
        const middleGradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, pulseSize + 1);
        middleGradient.addColorStop(0, `${color}${Math.floor((dynamicOpacity * 0.9) * 255).toString(16).padStart(2, '0')}`);
        middleGradient.addColorStop(1, `${color}40`);

        ctx.beginPath();
        ctx.arc(point.x, point.y, pulseSize + 1, 0, Math.PI * 2);
        ctx.fillStyle = middleGradient;
        ctx.fill();

        // Inner core - bright and visible
        ctx.beginPath();
        ctx.arc(point.x, point.y, pulseSize * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor((0.95 + connectionIntensity * 0.05) * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Visibility change optimization
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      if (isVisibleRef.current && !animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [color, lineColor, pointCount, connectionRadius, speed, handleResize, containerBounds, getCanvasDimensions]);

  // For browsers or devices that might struggle with canvas animation,
  // provide a fallback using CSS-based neural nodes
  const renderFallbackNodes = () => {
    const nodeCount = Math.min(pointCount, 15); // Limit nodes for performance
    return Array.from({ length: nodeCount }).map((_, i) => (
      <div 
        key={i}
        className="neural-node absolute rounded-full"
        style={{
          backgroundColor: color,
          width: `${Math.random() * 6 + 4}px`,
          height: `${Math.random() * 6 + 4}px`,
          left: `${Math.random() * 90 + 5}%`,
          top: `${Math.random() * 90 + 5}%`,
          boxShadow: `0 0 ${Math.random() * 10 + 5}px ${color}`,
          animationDuration: `${Math.random() * 3 + 2}s`
        }}
      />
    ));
  };

  // For browsers or devices that might struggle with canvas animation,
  // provide a fallback using CSS-based lines
  const renderFallbackLines = () => {
    return Array.from({ length: 6 }).map((_, i) => (
      <div 
        key={i}
        className="fast-line"
        style={{
          top: `${i * 15 + 10}%`,
          width: `${Math.random() * 20 + 30}%`,
          animationDuration: `${Math.random() * 2 + 2}s`,
          animationDelay: `${Math.random() * 1}s`
        }}
      />
    ));
  };

  return (
    <div
      ref={containerRef}
      className={containerBounds ? "absolute inset-0 z-0" : "fixed inset-0 z-0"}
      style={{ overflow: 'hidden' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          willChange: 'auto',
          opacity: 0.85, // Enhanced visibility for professional look
        }}
      />
      {/* Fallback CSS-based neural network for browsers that struggle with canvas */}
      {!isInitialized && (
        <div className="absolute inset-0 overflow-hidden">
          {renderFallbackNodes()}
          {renderFallbackLines()}
        </div>
      )}
    </div>
  );
}