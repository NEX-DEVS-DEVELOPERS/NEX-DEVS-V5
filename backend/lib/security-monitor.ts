import { ENV_CONFIG, logSecurityEvent } from './env-config';

// Security event types
export type SecurityEventType = 
  | 'failed_login'
  | 'unauthorized_access'
  | 'suspicious_activity'
  | 'rate_limit_exceeded'
  | 'ip_blocked'
  | 'session_hijack_attempt';

// Security event interface
export interface SecurityEvent {
  type: SecurityEventType;
  username?: string;
  clientIP: string;
  userAgent: string;
  timestamp: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
}

// Security monitoring class
export class SecurityMonitor {
  private static instance: SecurityMonitor;
  private events: SecurityEvent[] = [];
  private readonly MAX_EVENTS = 1000; // Keep last 1000 events in memory
  private readonly ALERT_THRESHOLDS = {
    failed_login: 3, // Alert after 3 failed logins
    unauthorized_access: 1, // Alert immediately
    suspicious_activity: 2,
    rate_limit_exceeded: 5,
  };

  private constructor() {}

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  // Record a security event
  async recordEvent(event: Omit<SecurityEvent, 'timestamp'>): Promise<void> {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    // Add to events array
    this.events.unshift(fullEvent);
    
    // Keep only the last MAX_EVENTS
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(0, this.MAX_EVENTS);
    }

    // Log the event server-side
    logSecurityEvent(`Security Event: ${event.type}`, {
      username: event.username,
      clientIP: event.clientIP,
      userAgent: event.userAgent,
      severity: event.severity,
      details: event.details
    });

    // Check if we should send an alert
    await this.checkAlertThresholds(fullEvent);
  }

  // Check if alert thresholds are exceeded
  private async checkAlertThresholds(event: SecurityEvent): Promise<void> {
    const threshold = this.ALERT_THRESHOLDS[event.type as keyof typeof this.ALERT_THRESHOLDS];
    
    if (!threshold) return;

    // Count recent events of the same type from the same IP
    const recentEvents = this.getRecentEvents(event.clientIP, event.type, 30); // Last 30 minutes
    
    if (recentEvents.length >= threshold || event.severity === 'critical') {
      await this.sendSecurityAlert(event, recentEvents);
    }
  }

  // Get recent events for analysis
  private getRecentEvents(clientIP: string, eventType: SecurityEventType, minutesBack: number): SecurityEvent[] {
    const cutoffTime = new Date(Date.now() - minutesBack * 60 * 1000);
    
    return this.events.filter(event => 
      event.clientIP === clientIP &&
      event.type === eventType &&
      new Date(event.timestamp) > cutoffTime
    );
  }

  // Send security alert email
  private async sendSecurityAlert(event: SecurityEvent, recentEvents: SecurityEvent[]): Promise<void> {
    try {
      const alertData = {
        event,
        recentEvents,
        summary: {
          totalEvents: recentEvents.length,
          timeWindow: '30 minutes',
          severity: event.severity,
          clientIP: event.clientIP,
          userAgent: event.userAgent
        }
      };

      // Call the security alert API
      const response = await fetch('/api/security/alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      });

      if (!response.ok) {
        console.error('Failed to send security alert:', await response.text());
      } else {
        logSecurityEvent('Security alert sent', {
          eventType: event.type,
          clientIP: event.clientIP,
          severity: event.severity
        });
      }
    } catch (error) {
      console.error('Error sending security alert:', error);
    }
  }

  // Get security statistics
  getSecurityStats(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    recentEvents: SecurityEvent[];
    topIPs: Array<{ ip: string; count: number }>;
  } {
    const eventsByType: Record<string, number> = {};
    const ipCounts: Record<string, number> = {};

    this.events.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      ipCounts[event.clientIP] = (ipCounts[event.clientIP] || 0) + 1;
    });

    const topIPs = Object.entries(ipCounts)
      .map(([ip, count]) => ({ ip, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEvents: this.events.length,
      eventsByType,
      recentEvents: this.events.slice(0, 20), // Last 20 events
      topIPs
    };
  }

  // Extract client information from request
  static extractClientInfo(request: Request): {
    clientIP: string;
    userAgent: string;
    location?: string;
  } {
    const headers = request.headers;
    
    // Try to get real IP address
    const clientIP = 
      headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headers.get('x-real-ip') ||
      headers.get('cf-connecting-ip') ||
      headers.get('x-client-ip') ||
      '::1'; // fallback for localhost

    const userAgent = headers.get('user-agent') || 'Unknown';

    return {
      clientIP,
      userAgent,
      // Location detection could be added here using IP geolocation service
    };
  }

  // Helper method to create failed login event
  static createFailedLoginEvent(
    username: string,
    clientInfo: ReturnType<typeof SecurityMonitor.extractClientInfo>,
    details: Record<string, any> = {}
  ): Omit<SecurityEvent, 'timestamp'> {
    return {
      type: 'failed_login',
      username,
      clientIP: clientInfo.clientIP,
      userAgent: clientInfo.userAgent,
      location: clientInfo.location,
      severity: 'medium',
      details: {
        ...details,
        reason: 'Invalid credentials provided'
      }
    };
  }

  // Helper method to create unauthorized access event
  static createUnauthorizedAccessEvent(
    clientInfo: ReturnType<typeof SecurityMonitor.extractClientInfo>,
    details: Record<string, any> = {}
  ): Omit<SecurityEvent, 'timestamp'> {
    return {
      type: 'unauthorized_access',
      clientIP: clientInfo.clientIP,
      userAgent: clientInfo.userAgent,
      location: clientInfo.location,
      severity: 'high',
      details: {
        ...details,
        reason: 'Attempted access to protected resource without authorization'
      }
    };
  }
}

// Export singleton instance
export const securityMonitor = SecurityMonitor.getInstance();
