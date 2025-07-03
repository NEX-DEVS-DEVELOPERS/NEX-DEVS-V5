/**
 * Comprehensive Device Detection Utility
 * Provides detailed information about the user's device, browser, and system capabilities
 */

export interface DeviceInfo {
  browser: {
    name: string;
    version: string;
    userAgent: string;
    language: string;
    languages: string[];
    cookieEnabled: boolean;
    doNotTrack: boolean | null;
    onLine: boolean;
  };
  system: {
    platform: string;
    os: string;
    architecture: string;
    cores: number;
    memory: number; // in GB
    touchSupport: boolean;
    maxTouchPoints: number;
  };
  screen: {
    width: number;
    height: number;
    availWidth: number;
    availHeight: number;
    colorDepth: number;
    pixelDepth: number;
    devicePixelRatio: number;
    orientation: string;
  };
  viewport: {
    width: number;
    height: number;
    scrollX: number;
    scrollY: number;
  };
  network: {
    connectionType: string;
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
  performance: {
    memoryUsage: number; // in MB
    jsHeapSizeLimit: number; // in MB
    usedJSHeapSize: number; // in MB
    totalJSHeapSize: number; // in MB
    timing: {
      navigationStart: number;
      loadEventEnd: number;
      domContentLoaded: number;
      pageLoadTime: number;
    };
  };
  geolocation: {
    supported: boolean;
    permission: string;
    coords?: {
      latitude: number;
      longitude: number;
      accuracy: number;
    };
  };
  features: {
    webGL: boolean;
    webGL2: boolean;
    webRTC: boolean;
    serviceWorker: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    webAssembly: boolean;
    notifications: boolean;
    vibration: boolean;
    battery: boolean;
    gamepad: boolean;
  };
  security: {
    https: boolean;
    secureContext: boolean;
    crossOriginIsolated: boolean;
  };
  timestamp: string;
}

export class DeviceDetector {
  private static instance: DeviceDetector;
  private deviceInfo: DeviceInfo | null = null;
  private updateCallbacks: ((info: DeviceInfo) => void)[] = [];

  private constructor() {}

  public static getInstance(): DeviceDetector {
    if (!DeviceDetector.instance) {
      DeviceDetector.instance = new DeviceDetector();
    }
    return DeviceDetector.instance;
  }

  /**
   * Get comprehensive device information
   */
  public async getDeviceInfo(): Promise<DeviceInfo> {
    if (typeof window === 'undefined') {
      throw new Error('Device detection is only available in browser environment');
    }

    const info: DeviceInfo = {
      browser: this.getBrowserInfo(),
      system: this.getSystemInfo(),
      screen: this.getScreenInfo(),
      viewport: this.getViewportInfo(),
      network: this.getNetworkInfo(),
      performance: this.getPerformanceInfo(),
      geolocation: await this.getGeolocationInfo(),
      features: this.getFeatureSupport(),
      security: this.getSecurityInfo(),
      timestamp: new Date().toISOString()
    };

    this.deviceInfo = info;
    this.notifyCallbacks(info);
    return info;
  }

  /**
   * Subscribe to device info updates
   */
  public onUpdate(callback: (info: DeviceInfo) => void): () => void {
    this.updateCallbacks.push(callback);
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }

  private notifyCallbacks(info: DeviceInfo): void {
    this.updateCallbacks.forEach(callback => {
      try {
        callback(info);
      } catch (error) {
        console.error('Error in device info callback:', error);
      }
    });
  }

  private getBrowserInfo() {
    const nav = navigator;
    const userAgent = nav.userAgent;
    
    // Simple browser detection
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browserName = 'Chrome';
      const match = userAgent.match(/Chrome\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Firefox')) {
      browserName = 'Firefox';
      const match = userAgent.match(/Firefox\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browserName = 'Safari';
      const match = userAgent.match(/Version\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Edg')) {
      browserName = 'Edge';
      const match = userAgent.match(/Edg\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    }

    return {
      name: browserName,
      version: browserVersion,
      userAgent,
      language: nav.language,
      languages: Array.from(nav.languages || [nav.language]),
      cookieEnabled: nav.cookieEnabled,
      doNotTrack: nav.doNotTrack === '1' ? true : nav.doNotTrack === '0' ? false : null,
      onLine: nav.onLine
    };
  }

  private getSystemInfo() {
    const nav = navigator;
    const userAgent = nav.userAgent;
    
    // OS detection
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return {
      platform: nav.platform,
      os,
      architecture: (nav as any).userAgentData?.platform || 'Unknown',
      cores: nav.hardwareConcurrency || 1,
      memory: (nav as any).deviceMemory || 0,
      touchSupport: 'ontouchstart' in window || nav.maxTouchPoints > 0,
      maxTouchPoints: nav.maxTouchPoints || 0
    };
  }

  private getScreenInfo() {
    const screen = window.screen;
    
    return {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      devicePixelRatio: window.devicePixelRatio || 1,
      orientation: screen.orientation?.type || 'Unknown'
    };
  }

  private getViewportInfo() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };
  }

  private getNetworkInfo() {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      return {
        connectionType: connection.type || 'Unknown',
        effectiveType: connection.effectiveType || 'Unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      };
    }

    return {
      connectionType: 'Unknown',
      effectiveType: 'Unknown',
      downlink: 0,
      rtt: 0,
      saveData: false
    };
  }

  private getPerformanceInfo() {
    const memory = (performance as any).memory;
    const timing = performance.timing;

    const memoryInfo = memory ? {
      memoryUsage: Math.round(memory.usedJSHeapSize / (1024 * 1024)),
      jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / (1024 * 1024)),
      usedJSHeapSize: Math.round(memory.usedJSHeapSize / (1024 * 1024)),
      totalJSHeapSize: Math.round(memory.totalJSHeapSize / (1024 * 1024))
    } : {
      memoryUsage: 0,
      jsHeapSizeLimit: 0,
      usedJSHeapSize: 0,
      totalJSHeapSize: 0
    };

    const timingInfo = timing ? {
      navigationStart: timing.navigationStart,
      loadEventEnd: timing.loadEventEnd,
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      pageLoadTime: timing.loadEventEnd - timing.navigationStart
    } : {
      navigationStart: 0,
      loadEventEnd: 0,
      domContentLoaded: 0,
      pageLoadTime: 0
    };

    return {
      ...memoryInfo,
      timing: timingInfo
    };
  }

  private async getGeolocationInfo() {
    const info = {
      supported: 'geolocation' in navigator,
      permission: 'unknown' as string,
      coords: undefined as any
    };

    if (info.supported) {
      try {
        // Check permission
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        info.permission = permission.state;

        // If granted, get position
        if (permission.state === 'granted') {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              maximumAge: 300000 // 5 minutes
            });
          });

          info.coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
        }
      } catch (error) {
        console.warn('Geolocation error:', error);
      }
    }

    return info;
  }

  private getFeatureSupport() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    const gl2 = canvas.getContext('webgl2');

    return {
      webGL: !!gl,
      webGL2: !!gl2,
      webRTC: !!(window as any).RTCPeerConnection || !!(window as any).webkitRTCPeerConnection,
      serviceWorker: 'serviceWorker' in navigator,
      localStorage: (() => {
        try {
          return 'localStorage' in window && window.localStorage !== null;
        } catch {
          return false;
        }
      })(),
      sessionStorage: (() => {
        try {
          return 'sessionStorage' in window && window.sessionStorage !== null;
        } catch {
          return false;
        }
      })(),
      indexedDB: 'indexedDB' in window,
      webAssembly: 'WebAssembly' in window,
      notifications: 'Notification' in window,
      vibration: 'vibrate' in navigator,
      battery: 'getBattery' in navigator,
      gamepad: 'getGamepads' in navigator
    };
  }

  private getSecurityInfo() {
    return {
      https: location.protocol === 'https:',
      secureContext: window.isSecureContext,
      crossOriginIsolated: window.crossOriginIsolated || false
    };
  }

  /**
   * Start monitoring for changes
   */
  public startMonitoring(interval: number = 5000): () => void {
    const intervalId = setInterval(async () => {
      try {
        await this.getDeviceInfo();
      } catch (error) {
        console.error('Error updating device info:', error);
      }
    }, interval);

    // Listen for viewport changes
    const handleResize = () => {
      if (this.deviceInfo) {
        this.deviceInfo.viewport = this.getViewportInfo();
        this.deviceInfo.screen = this.getScreenInfo();
        this.deviceInfo.timestamp = new Date().toISOString();
        this.notifyCallbacks(this.deviceInfo);
      }
    };

    const handleOnlineStatus = () => {
      if (this.deviceInfo) {
        this.deviceInfo.browser.onLine = navigator.onLine;
        this.deviceInfo.timestamp = new Date().toISOString();
        this.notifyCallbacks(this.deviceInfo);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }
}

// Export singleton instance
export const deviceDetector = DeviceDetector.getInstance();
