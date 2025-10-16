/**
 * Real-time Performance Monitor
 * Tracks FPS, memory usage, network performance, and API response times
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  networkLatency: number;
  apiResponseTimes: {
    average: number;
    recent: number[];
    slowest: number;
    fastest: number;
  };
  cpuUsage: number;
  timestamp: string;
}

export interface NetworkMetrics {
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export class RealTimePerformanceMonitor {
  private static instance: RealTimePerformanceMonitor;
  private metrics: PerformanceMetrics;
  private isMonitoring: boolean = false;
  private frameCount: number = 0;
  private lastFrameTime: number = 0;
  private frameTimes: number[] = [];
  private apiResponseTimes: number[] = [];
  private animationFrameId: number | null = null;
  private updateCallbacks: ((metrics: PerformanceMetrics) => void)[] = [];
  private monitoringInterval: number = 1000; // 1 second

  private constructor() {
    this.metrics = this.getInitialMetrics();
  }

  public static getInstance(): RealTimePerformanceMonitor {
    if (!RealTimePerformanceMonitor.instance) {
      RealTimePerformanceMonitor.instance = new RealTimePerformanceMonitor();
    }
    return RealTimePerformanceMonitor.instance;
  }

  /**
   * Start monitoring performance metrics
   */
  public startMonitoring(): () => void {
    if (typeof window === 'undefined') {
      console.warn('Performance monitoring is only available in browser environment');
      return () => {};
    }

    this.isMonitoring = true;
    this.startFrameMonitoring();
    
    const intervalId = setInterval(() => {
      this.updateMetrics();
    }, this.monitoringInterval);

    return () => {
      this.stopMonitoring();
      clearInterval(intervalId);
    };
  }

  /**
   * Stop monitoring
   */
  public stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Subscribe to performance updates
   */
  public onUpdate(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.updateCallbacks.push(callback);
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Get current performance metrics
   */
  public getCurrentMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Track API response time
   */
  public trackAPIResponse(responseTime: number): void {
    this.apiResponseTimes.push(responseTime);
    
    // Keep only last 50 response times
    if (this.apiResponseTimes.length > 50) {
      this.apiResponseTimes.shift();
    }

    this.updateAPIMetrics();
  }

  /**
   * Measure network latency
   */
  public async measureNetworkLatency(): Promise<number> {
    try {
      const startTime = performance.now();
      
      // Use a small image or API endpoint for latency measurement
      const response = await fetch('/api/ping', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      const endTime = performance.now();
      const latency = endTime - startTime;
      
      return latency;
    } catch (error) {
      console.warn('Network latency measurement failed:', error);
      return 0;
    }
  }

  /**
   * Get network information
   */
  public getNetworkMetrics(): NetworkMetrics {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (connection) {
      return {
        connectionType: connection.type || 'unknown',
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      };
    }

    return {
      connectionType: 'unknown',
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0,
      saveData: false
    };
  }

  private getInitialMetrics(): PerformanceMetrics {
    return {
      fps: 0,
      frameTime: 0,
      memoryUsage: {
        used: 0,
        total: 0,
        percentage: 0
      },
      networkLatency: 0,
      apiResponseTimes: {
        average: 0,
        recent: [],
        slowest: 0,
        fastest: Infinity
      },
      cpuUsage: 0,
      timestamp: new Date().toISOString()
    };
  }

  private startFrameMonitoring(): void {
    const measureFrame = (currentTime: number) => {
      if (!this.isMonitoring) return;

      if (this.lastFrameTime > 0) {
        const frameTime = currentTime - this.lastFrameTime;
        this.frameTimes.push(frameTime);
        this.frameCount++;

        // Keep only last 60 frame times
        if (this.frameTimes.length > 60) {
          this.frameTimes.shift();
        }
      }

      this.lastFrameTime = currentTime;
      this.animationFrameId = requestAnimationFrame(measureFrame);
    };

    this.animationFrameId = requestAnimationFrame(measureFrame);
  }

  private updateMetrics(): void {
    if (!this.isMonitoring) return;

    // Calculate FPS
    const avgFrameTime = this.frameTimes.length > 0 
      ? this.frameTimes.reduce((sum, time) => sum + time, 0) / this.frameTimes.length
      : 0;
    
    const fps = avgFrameTime > 0 ? Math.round(1000 / avgFrameTime) : 0;

    // Get memory usage
    const memoryInfo = this.getMemoryUsage();

    // Update network latency
    this.measureNetworkLatency().then(latency => {
      this.metrics.networkLatency = latency;
    });

    // Estimate CPU usage (simplified)
    const cpuUsage = this.estimateCPUUsage();

    this.metrics = {
      fps: Math.min(fps, 60), // Cap at 60 FPS
      frameTime: avgFrameTime,
      memoryUsage: memoryInfo,
      networkLatency: this.metrics.networkLatency,
      apiResponseTimes: this.metrics.apiResponseTimes,
      cpuUsage,
      timestamp: new Date().toISOString()
    };

    // Notify callbacks
    this.updateCallbacks.forEach(callback => {
      try {
        callback(this.metrics);
      } catch (error) {
        console.error('Error in performance callback:', error);
      }
    });

    // Reset frame count for next interval
    this.frameCount = 0;
  }

  private getMemoryUsage() {
    const memory = (performance as any).memory;
    
    if (memory) {
      const used = Math.round(memory.usedJSHeapSize / (1024 * 1024));
      const total = Math.round(memory.jsHeapSizeLimit / (1024 * 1024));
      const percentage = total > 0 ? Math.round((used / total) * 100) : 0;

      return { used, total, percentage };
    }

    return { used: 0, total: 0, percentage: 0 };
  }

  private estimateCPUUsage(): number {
    // Simplified CPU usage estimation based on frame performance
    if (this.frameTimes.length === 0) return 0;

    const avgFrameTime = this.frameTimes.reduce((sum, time) => sum + time, 0) / this.frameTimes.length;
    const targetFrameTime = 1000 / 60; // 60 FPS target
    
    // Estimate CPU usage based on how much longer frames take than target
    const cpuUsage = Math.min(100, Math.max(0, (avgFrameTime / targetFrameTime - 1) * 100));
    
    return Math.round(cpuUsage);
  }

  private updateAPIMetrics(): void {
    if (this.apiResponseTimes.length === 0) return;

    const recent = this.apiResponseTimes.slice(-10); // Last 10 responses
    const average = this.apiResponseTimes.reduce((sum, time) => sum + time, 0) / this.apiResponseTimes.length;
    const slowest = Math.max(...this.apiResponseTimes);
    const fastest = Math.min(...this.apiResponseTimes);

    this.metrics.apiResponseTimes = {
      average: Math.round(average),
      recent,
      slowest: Math.round(slowest),
      fastest: Math.round(fastest)
    };
  }
}

// Export singleton instance
export const performanceMonitor = RealTimePerformanceMonitor.getInstance();
