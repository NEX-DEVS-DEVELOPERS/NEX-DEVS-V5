/**
 * Enhanced Security Monitor for Admin Debug Panel
 * Focuses on real-time security monitoring with device tracking and immediate response capabilities
 */

export interface DeviceFingerprint {
  id: string;
  userAgent: string;
  browserName: string;
  browserVersion: string;
  osName: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  firstSeen: string;
  lastSeen: string;
  isBlocked: boolean;
}

export interface SecuritySession {
  id: string;
  deviceFingerprint: DeviceFingerprint;
  ip: string;
  location?: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  startTime: string;
  lastActivity: string;
  duration: number;
  isActive: boolean;
  securityScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  loginAttempts: number;
  failedAttempts: number;
}

export interface SecurityEvent {
  id: string;
  type: 'failed_login' | 'unauthorized_access' | 'brute_force' | 'suspicious_activity' | 'password_violation';
  timestamp: string;
  ip: string;
  deviceFingerprint: DeviceFingerprint;
  location?: {
    country: string;
    city: string;
  };
  details: {
    endpoint?: string;
    method?: string;
    userAgent?: string;
    attempts?: number;
    reason?: string;
    passwordStrength?: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  blocked: boolean;
  responseAction?: string;
}

export interface SecurityAlert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  events: SecurityEvent[];
  acknowledged: boolean;
  responseActions: string[];
  autoResponse?: string;
  resolutionTime?: number;
}

export interface SecurityStats {
  failedPasswordAttempts: number;
  loginAttemptFrequency: {
    perMinute: number;
    perHour: number;
  };
  bruteForceDetected: boolean;
  suspiciousIPs: number;
  passwordViolations: number;
  accountLockouts: {
    count: number;
    remainingTime: number;
  };
  activeSessions: number;
  concurrentUsers: number;
  blockedDevices: number;
  totalSecurityEvents: number;
}

export class EnhancedSecurityMonitor {
  private static instance: EnhancedSecurityMonitor;
  private sessions: Map<string, SecuritySession> = new Map();
  private events: SecurityEvent[] = [];
  private alerts: SecurityAlert[] = [];
  private blockedIPs: Set<string> = new Set();
  private blockedDevices: Set<string> = new Set();
  private deviceFingerprints: Map<string, DeviceFingerprint> = new Map();
  private updateCallbacks: ((data: any) => void)[] = [];
  private stats: SecurityStats;

  // Real-time tracking
  private loginAttempts: { timestamp: number; ip: string }[] = [];
  private failedAttempts: { timestamp: number; ip: string; deviceId: string }[] = [];
  private accountLockouts: Map<string, { lockedUntil: number; attempts: number }> = new Map();

  private constructor() {
    this.stats = this.initializeStats();
    this.loadStoredData();
    this.startRealTimeTracking();
  }

  public static getInstance(): EnhancedSecurityMonitor {
    if (!EnhancedSecurityMonitor.instance) {
      EnhancedSecurityMonitor.instance = new EnhancedSecurityMonitor();
    }
    return EnhancedSecurityMonitor.instance;
  }

  /**
   * Generate device fingerprint from request data
   */
  public generateDeviceFingerprint(userAgent: string, additionalData?: any): DeviceFingerprint {
    const id = this.hashString(userAgent + (additionalData?.ip || '') + (additionalData?.acceptLanguage || ''));
    
    const existing = this.deviceFingerprints.get(id);
    if (existing) {
      existing.lastSeen = new Date().toISOString();
      return existing;
    }

    const fingerprint: DeviceFingerprint = {
      id,
      userAgent,
      browserName: this.extractBrowserName(userAgent),
      browserVersion: this.extractBrowserVersion(userAgent),
      osName: this.extractOSName(userAgent),
      deviceType: this.detectDeviceType(userAgent),
      screenResolution: additionalData?.screenResolution || 'Unknown',
      timezone: additionalData?.timezone || 'Unknown',
      language: additionalData?.language || 'Unknown',
      platform: additionalData?.platform || 'Unknown',
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      isBlocked: false
    };

    this.deviceFingerprints.set(id, fingerprint);
    this.saveToStorage();
    return fingerprint;
  }

  /**
   * Record failed login attempt with device tracking
   */
  public recordFailedLogin(ip: string, userAgent: string, additionalData?: any): void {
    const deviceFingerprint = this.generateDeviceFingerprint(userAgent, { ...additionalData, ip });
    const now = Date.now();
    
    // Add to failed attempts tracking
    this.failedAttempts.push({ timestamp: now, ip, deviceId: deviceFingerprint.id });
    
    // Clean old attempts (keep last hour)
    this.failedAttempts = this.failedAttempts.filter(attempt => now - attempt.timestamp < 3600000);
    
    // Update stats
    this.stats.failedPasswordAttempts++;
    this.updateLoginFrequency();
    
    // Check for brute force
    const recentFailures = this.failedAttempts.filter(attempt => 
      attempt.ip === ip && now - attempt.timestamp < 300000 // 5 minutes
    );
    
    if (recentFailures.length >= 5) {
      this.stats.bruteForceDetected = true;
      this.blockIP(ip);
      this.blockDevice(deviceFingerprint.id);
    }

    // Create security event
    const event: SecurityEvent = {
      id: this.generateId(),
      type: 'failed_login',
      timestamp: new Date().toISOString(),
      ip,
      deviceFingerprint,
      location: additionalData?.location,
      details: {
        attempts: recentFailures.length,
        reason: 'Invalid credentials',
        userAgent
      },
      severity: recentFailures.length >= 3 ? 'high' : 'medium',
      blocked: recentFailures.length >= 5,
      responseAction: recentFailures.length >= 5 ? 'IP and device blocked' : undefined
    };

    this.addSecurityEvent(event);
    this.notifyCallbacks();
  }

  /**
   * Block IP address immediately
   */
  public blockIP(ip: string): void {
    this.blockedIPs.add(ip);
    this.saveToStorage();
    this.notifyCallbacks();
  }

  /**
   * Block device by fingerprint ID
   */
  public blockDevice(deviceId: string): void {
    this.blockedDevices.add(deviceId);
    const device = this.deviceFingerprints.get(deviceId);
    if (device) {
      device.isBlocked = true;
    }
    this.saveToStorage();
    this.notifyCallbacks();
  }

  /**
   * Check if IP is blocked
   */
  public isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  /**
   * Check if device is blocked
   */
  public isDeviceBlocked(deviceId: string): boolean {
    return this.blockedDevices.has(deviceId);
  }

  /**
   * Get real-time security statistics
   */
  public getSecurityStats(): SecurityStats {
    this.updateStats();
    return { ...this.stats };
  }

  /**
   * Get recent security events with device information
   */
  public getRecentEvents(limit: number = 20): SecurityEvent[] {
    return this.events.slice(0, limit);
  }

  /**
   * Get active security alerts
   */
  public getSecurityAlerts(): SecurityAlert[] {
    return this.alerts.filter(alert => !alert.acknowledged);
  }

  /**
   * Get active sessions with real-time data
   */
  public getActiveSessions(): SecuritySession[] {
    const now = Date.now();
    const activeSessions: SecuritySession[] = [];
    
    this.sessions.forEach(session => {
      if (session.isActive && (now - new Date(session.lastActivity).getTime()) < 1800000) { // 30 minutes
        session.duration = Math.floor((now - new Date(session.startTime).getTime()) / 1000);
        activeSessions.push(session);
      }
    });
    
    return activeSessions;
  }

  /**
   * Subscribe to real-time updates
   */
  public onUpdate(callback: (data: any) => void): () => void {
    this.updateCallbacks.push(callback);
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Acknowledge security alert
   */
  public acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.resolutionTime = Date.now() - new Date(alert.timestamp).getTime();
      this.saveToStorage();
      this.notifyCallbacks();
    }
  }

  private addSecurityEvent(event: SecurityEvent): void {
    this.events.unshift(event);
    
    // Keep only recent events
    if (this.events.length > 1000) {
      this.events = this.events.slice(0, 1000);
    }

    // Check if this should create an alert
    this.evaluateForAlert(event);
    this.saveToStorage();
  }

  private evaluateForAlert(event: SecurityEvent): void {
    const recentSimilarEvents = this.events.filter(e => 
      e.ip === event.ip && 
      e.type === event.type &&
      (Date.now() - new Date(e.timestamp).getTime()) < 300000 // 5 minutes
    );

    if (recentSimilarEvents.length >= 3) {
      const alert: SecurityAlert = {
        id: this.generateId(),
        title: `Multiple ${event.type.replace('_', ' ')} attempts detected`,
        message: `${recentSimilarEvents.length} ${event.type} events from ${event.deviceFingerprint.deviceType} device (${event.deviceFingerprint.browserName}) at IP ${event.ip}`,
        severity: 'high',
        timestamp: new Date().toISOString(),
        events: recentSimilarEvents,
        acknowledged: false,
        responseActions: ['Block IP', 'Block Device', 'Send Alert Email'],
        autoResponse: event.blocked ? 'IP and device automatically blocked' : undefined
      };

      this.alerts.unshift(alert);
      if (this.alerts.length > 100) {
        this.alerts = this.alerts.slice(0, 100);
      }
    }
  }

  private updateStats(): void {
    const now = Date.now();
    
    // Update login attempt frequency
    const lastMinute = this.loginAttempts.filter(attempt => now - attempt.timestamp < 60000);
    const lastHour = this.loginAttempts.filter(attempt => now - attempt.timestamp < 3600000);
    
    this.stats.loginAttemptFrequency = {
      perMinute: lastMinute.length,
      perHour: lastHour.length
    };
    
    // Update other stats
    this.stats.suspiciousIPs = this.blockedIPs.size;
    this.stats.blockedDevices = this.blockedDevices.size;
    this.stats.activeSessions = this.getActiveSessions().length;
    this.stats.concurrentUsers = new Set(this.getActiveSessions().map(s => s.ip)).size;
    this.stats.totalSecurityEvents = this.events.length;
    
    // Check account lockouts
    let activeAccountLockouts = 0;
    let minRemainingTime = 0;
    
    this.accountLockouts.forEach((lockout, ip) => {
      if (lockout.lockedUntil > now) {
        activeAccountLockouts++;
        const remaining = lockout.lockedUntil - now;
        if (minRemainingTime === 0 || remaining < minRemainingTime) {
          minRemainingTime = remaining;
        }
      }
    });
    
    this.stats.accountLockouts = {
      count: activeAccountLockouts,
      remainingTime: Math.ceil(minRemainingTime / 1000)
    };
  }

  private updateLoginFrequency(): void {
    const now = Date.now();
    this.loginAttempts.push({ timestamp: now, ip: 'unknown' });
    
    // Clean old attempts
    this.loginAttempts = this.loginAttempts.filter(attempt => now - attempt.timestamp < 3600000);
  }

  private startRealTimeTracking(): void {
    // Update stats every 10 seconds for better performance
    setInterval(() => {
      this.updateStats();
      this.notifyCallbacks();
    }, 10000);
  }

  private notifyCallbacks(): void {
    const data = {
      stats: this.getSecurityStats(),
      events: this.getRecentEvents(10),
      alerts: this.getSecurityAlerts(),
      sessions: this.getActiveSessions()
    };
    
    this.updateCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in security monitor callback:', error);
      }
    });
  }

  private initializeStats(): SecurityStats {
    return {
      failedPasswordAttempts: 0,
      loginAttemptFrequency: { perMinute: 0, perHour: 0 },
      bruteForceDetected: false,
      suspiciousIPs: 0,
      passwordViolations: 0,
      accountLockouts: { count: 0, remainingTime: 0 },
      activeSessions: 0,
      concurrentUsers: 0,
      blockedDevices: 0,
      totalSecurityEvents: 0
    };
  }

  private extractBrowserName(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private extractBrowserVersion(userAgent: string): string {
    const match = userAgent.match(/(Chrome|Firefox|Safari|Edge)\/(\d+)/);
    return match ? match[2] : 'Unknown';
  }

  private extractOSName(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private detectDeviceType(userAgent: string): DeviceFingerprint['deviceType'] {
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      if (/iPad|Tablet/.test(userAgent)) return 'tablet';
      return 'mobile';
    }
    return 'desktop';
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `device_${Math.abs(hash).toString(36)}`;
  }

  private generateId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadStoredData(): void {
    try {
      if (typeof window !== 'undefined') {
        const storedEvents = localStorage.getItem('enhanced_security_events');
        const storedAlerts = localStorage.getItem('enhanced_security_alerts');
        const storedDevices = localStorage.getItem('enhanced_device_fingerprints');
        const storedBlocked = localStorage.getItem('enhanced_blocked_data');
        
        if (storedEvents) this.events = JSON.parse(storedEvents);
        if (storedAlerts) this.alerts = JSON.parse(storedAlerts);
        if (storedDevices) {
          const devices = JSON.parse(storedDevices);
          this.deviceFingerprints = new Map(devices);
        }
        if (storedBlocked) {
          const blocked = JSON.parse(storedBlocked);
          this.blockedIPs = new Set(blocked.ips || []);
          this.blockedDevices = new Set(blocked.devices || []);
        }
      }
    } catch (error) {
      console.error('Failed to load enhanced security data:', error);
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('enhanced_security_events', JSON.stringify(this.events.slice(0, 100)));
        localStorage.setItem('enhanced_security_alerts', JSON.stringify(this.alerts.slice(0, 50)));
        localStorage.setItem('enhanced_device_fingerprints', JSON.stringify(Array.from(this.deviceFingerprints.entries())));
        localStorage.setItem('enhanced_blocked_data', JSON.stringify({
          ips: Array.from(this.blockedIPs),
          devices: Array.from(this.blockedDevices)
        }));
      }
    } catch (error) {
      console.error('Failed to save enhanced security data:', error);
    }
  }
}

export const enhancedSecurityMonitor = EnhancedSecurityMonitor.getInstance();
