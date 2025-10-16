/**
 * Security Monitor Utility
 * Monitors unauthorized access attempts and security violations
 */

export interface SecurityEvent {
  id: string;
  type: 'unauthorized_access' | 'failed_login' | 'suspicious_activity' | 'rate_limit_exceeded';
  timestamp: string;
  ip: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  details: {
    endpoint?: string;
    method?: string;
    statusCode?: number;
    attempts?: number;
    reason?: string;
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityAlert {
  id: string;
  title: string;
  message: string;
  events: SecurityEvent[];
  timestamp: string;
  acknowledged: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export class SecurityMonitor {
  private static instance: SecurityMonitor;
  private events: SecurityEvent[] = [];
  private alerts: SecurityAlert[] = [];
  private rateLimitMap: Map<string, { count: number; lastReset: number }> = new Map();
  private suspiciousIPs: Set<string> = new Set();
  private alertCallbacks: ((alert: SecurityAlert) => void)[] = [];

  // Configuration
  private readonly MAX_EVENTS = 1000;
  private readonly MAX_ALERTS = 100;
  private readonly RATE_LIMIT_WINDOW = 60000; // 1 minute
  private readonly RATE_LIMIT_THRESHOLD = 10; // requests per minute
  private readonly EMAIL_ALERT_CONFIG = {
    enabled: true,
    recipient: 'nexdevs.org@gmail.com',
    appPassword: 'hcgn fypy ylnm pvud'
  };

  private constructor() {
    this.loadStoredData();
  }

  public static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  /**
   * Record a security event
   */
  public recordEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date().toISOString()
    };

    this.events.unshift(securityEvent);
    
    // Keep only recent events
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(0, this.MAX_EVENTS);
    }

    // Check if this should trigger an alert
    this.evaluateForAlert(securityEvent);
    
    // Store to localStorage
    this.saveToStorage();
  }

  /**
   * Check rate limiting for an IP
   */
  public checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const key = ip;
    
    let rateLimitData = this.rateLimitMap.get(key);
    
    if (!rateLimitData || (now - rateLimitData.lastReset) > this.RATE_LIMIT_WINDOW) {
      rateLimitData = { count: 0, lastReset: now };
      this.rateLimitMap.set(key, rateLimitData);
    }

    rateLimitData.count++;
    
    const allowed = rateLimitData.count <= this.RATE_LIMIT_THRESHOLD;
    const remaining = Math.max(0, this.RATE_LIMIT_THRESHOLD - rateLimitData.count);

    if (!allowed) {
      this.recordEvent({
        type: 'rate_limit_exceeded',
        ip,
        userAgent: 'Unknown',
        details: {
          attempts: rateLimitData.count,
          reason: 'Rate limit exceeded'
        },
        riskLevel: 'medium'
      });
    }

    return { allowed, remaining };
  }

  /**
   * Record unauthorized access attempt
   */
  public recordUnauthorizedAccess(
    ip: string, 
    userAgent: string, 
    endpoint: string, 
    method: string = 'GET'
  ): void {
    this.recordEvent({
      type: 'unauthorized_access',
      ip,
      userAgent,
      details: {
        endpoint,
        method,
        statusCode: 401,
        reason: 'Invalid or missing authentication'
      },
      riskLevel: this.calculateRiskLevel(ip, 'unauthorized_access')
    });
  }

  /**
   * Record failed login attempt
   */
  public recordFailedLogin(ip: string, userAgent: string, attempts: number = 1): void {
    this.recordEvent({
      type: 'failed_login',
      ip,
      userAgent,
      details: {
        attempts,
        reason: 'Invalid credentials'
      },
      riskLevel: attempts > 3 ? 'high' : 'medium'
    });
  }

  /**
   * Get recent security events
   */
  public getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.events.slice(0, limit);
  }

  /**
   * Get security alerts
   */
  public getAlerts(): SecurityAlert[] {
    return this.alerts;
  }

  /**
   * Get security statistics
   */
  public getSecurityStats(): {
    totalEvents: number;
    recentEvents: number;
    suspiciousIPs: number;
    activeAlerts: number;
    riskDistribution: Record<string, number>;
  } {
    const last24Hours = Date.now() - (24 * 60 * 60 * 1000);
    const recentEvents = this.events.filter(event => 
      new Date(event.timestamp).getTime() > last24Hours
    );

    const riskDistribution = this.events.reduce((acc, event) => {
      acc[event.riskLevel] = (acc[event.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEvents: this.events.length,
      recentEvents: recentEvents.length,
      suspiciousIPs: this.suspiciousIPs.size,
      activeAlerts: this.alerts.filter(alert => !alert.acknowledged).length,
      riskDistribution
    };
  }

  /**
   * Subscribe to security alerts
   */
  public onAlert(callback: (alert: SecurityAlert) => void): () => void {
    this.alertCallbacks.push(callback);
    return () => {
      const index = this.alertCallbacks.indexOf(callback);
      if (index > -1) {
        this.alertCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Acknowledge an alert
   */
  public acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.saveToStorage();
    }
  }

  private evaluateForAlert(event: SecurityEvent): void {
    // Check for multiple failed attempts from same IP
    const recentEvents = this.events.filter(e => 
      e.ip === event.ip && 
      e.type === event.type &&
      (Date.now() - new Date(e.timestamp).getTime()) < 300000 // 5 minutes
    );

    if (recentEvents.length >= 3) {
      this.createAlert({
        title: 'Multiple Security Events Detected',
        message: `${recentEvents.length} ${event.type} events from IP ${event.ip} in the last 5 minutes`,
        events: recentEvents,
        riskLevel: 'high'
      });
    }

    // Mark IP as suspicious for high-risk events
    if (event.riskLevel === 'high' || event.riskLevel === 'critical') {
      this.suspiciousIPs.add(event.ip);
    }
  }

  private createAlert(alertData: Omit<SecurityAlert, 'id' | 'timestamp' | 'acknowledged'>): void {
    const alert: SecurityAlert = {
      ...alertData,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      acknowledged: false
    };

    this.alerts.unshift(alert);
    
    // Keep only recent alerts
    if (this.alerts.length > this.MAX_ALERTS) {
      this.alerts = this.alerts.slice(0, this.MAX_ALERTS);
    }

    // Notify callbacks
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Error in security alert callback:', error);
      }
    });

    // Send email alert if configured
    if (this.EMAIL_ALERT_CONFIG.enabled) {
      this.sendEmailAlert(alert);
    }

    this.saveToStorage();
  }

  private calculateRiskLevel(ip: string, eventType: string): SecurityEvent['riskLevel'] {
    const recentEvents = this.events.filter(e => 
      e.ip === ip && 
      (Date.now() - new Date(e.timestamp).getTime()) < 3600000 // 1 hour
    );

    if (recentEvents.length >= 10) return 'critical';
    if (recentEvents.length >= 5) return 'high';
    if (recentEvents.length >= 2) return 'medium';
    return 'low';
  }

  private async sendEmailAlert(alert: SecurityAlert): Promise<void> {
    try {
      // This would typically use a service like SendGrid, Nodemailer, etc.
      // For now, we'll just log the alert
      console.warn('Security Alert:', {
        title: alert.title,
        message: alert.message,
        riskLevel: alert.riskLevel,
        timestamp: alert.timestamp,
        events: alert.events.map(e => ({
          type: e.type,
          ip: e.ip,
          timestamp: e.timestamp
        }))
      });
    } catch (error) {
      console.error('Failed to send security alert email:', error);
    }
  }

  private generateId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadStoredData(): void {
    try {
      if (typeof window !== 'undefined') {
        const storedEvents = localStorage.getItem('security_events');
        const storedAlerts = localStorage.getItem('security_alerts');
        
        if (storedEvents) {
          this.events = JSON.parse(storedEvents);
        }
        
        if (storedAlerts) {
          this.alerts = JSON.parse(storedAlerts);
        }
      }
    } catch (error) {
      console.error('Failed to load security data from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('security_events', JSON.stringify(this.events.slice(0, 100)));
        localStorage.setItem('security_alerts', JSON.stringify(this.alerts.slice(0, 50)));
      }
    } catch (error) {
      console.error('Failed to save security data to storage:', error);
    }
  }
}

// Export singleton instance
export const securityMonitor = SecurityMonitor.getInstance();
