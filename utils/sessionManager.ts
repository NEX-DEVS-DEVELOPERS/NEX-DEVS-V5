/**
 * Enhanced Session Manager for Real-time Session Tracking
 */

export interface SessionInfo {
  id: string;
  ip: string;
  userAgent: string;
  deviceFingerprint: string;
  startTime: string;
  lastActivity: string;
  duration: number;
  isActive: boolean;
  securityScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  activityCount: number;
  location?: {
    country: string;
    city: string;
  };
  deviceInfo: {
    type: 'mobile' | 'tablet' | 'desktop' | 'unknown';
    browser: string;
    os: string;
  };
}

export interface SessionStats {
  activeSessions: number;
  concurrentUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  securityScoreDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  deviceTypeDistribution: {
    mobile: number;
    tablet: number;
    desktop: number;
    unknown: number;
  };
  topCountries: { country: string; count: number }[];
}

export class SessionManager {
  private static instance: SessionManager;
  private sessions: Map<string, SessionInfo> = new Map();
  private updateCallbacks: ((data: { sessions: SessionInfo[]; stats: SessionStats }) => void)[] = [];
  private cleanupInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.startSessionTracking();
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Create or update a session
   */
  public createOrUpdateSession(
    ip: string,
    userAgent: string,
    deviceFingerprint: string,
    additionalData?: any
  ): SessionInfo {
    const sessionId = this.generateSessionId(ip, deviceFingerprint);
    const now = new Date().toISOString();
    
    let session = this.sessions.get(sessionId);
    
    if (session) {
      // Update existing session
      session.lastActivity = now;
      session.duration = Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000);
      session.activityCount++;
      session.isActive = true;
      
      // Recalculate security score
      session.securityScore = this.calculateSecurityScore(session);
      session.riskLevel = this.determineRiskLevel(session.securityScore);
    } else {
      // Create new session
      session = {
        id: sessionId,
        ip,
        userAgent,
        deviceFingerprint,
        startTime: now,
        lastActivity: now,
        duration: 0,
        isActive: true,
        securityScore: 100,
        riskLevel: 'low',
        activityCount: 1,
        location: additionalData?.location,
        deviceInfo: {
          type: this.detectDeviceType(userAgent),
          browser: this.extractBrowser(userAgent),
          os: this.extractOS(userAgent)
        }
      };
      
      session.securityScore = this.calculateSecurityScore(session);
      session.riskLevel = this.determineRiskLevel(session.securityScore);
    }
    
    this.sessions.set(sessionId, session);
    this.notifyCallbacks();
    return session;
  }

  /**
   * Mark session as inactive
   */
  public deactivateSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      this.notifyCallbacks();
    }
  }

  /**
   * Get all active sessions
   */
  public getActiveSessions(): SessionInfo[] {
    const now = Date.now();
    const activeSessions: SessionInfo[] = [];
    
    this.sessions.forEach(session => {
      const lastActivityTime = new Date(session.lastActivity).getTime();
      const timeSinceActivity = now - lastActivityTime;
      
      // Consider session active if last activity was within 30 minutes
      if (session.isActive && timeSinceActivity < 1800000) {
        // Update duration in real-time
        session.duration = Math.floor((now - new Date(session.startTime).getTime()) / 1000);
        activeSessions.push(session);
      } else if (session.isActive) {
        // Auto-deactivate stale sessions
        session.isActive = false;
      }
    });
    
    return activeSessions.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
  }

  /**
   * Get session statistics
   */
  public getSessionStats(): SessionStats {
    const activeSessions = this.getActiveSessions();
    const allSessions = Array.from(this.sessions.values());
    
    // Calculate average session duration
    const totalDuration = allSessions.reduce((sum, session) => sum + session.duration, 0);
    const averageSessionDuration = allSessions.length > 0 ? totalDuration / allSessions.length : 0;
    
    // Security score distribution
    const securityScoreDistribution = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };
    
    activeSessions.forEach(session => {
      securityScoreDistribution[session.riskLevel]++;
    });
    
    // Device type distribution
    const deviceTypeDistribution = {
      mobile: 0,
      tablet: 0,
      desktop: 0,
      unknown: 0
    };
    
    activeSessions.forEach(session => {
      deviceTypeDistribution[session.deviceInfo.type]++;
    });
    
    // Top countries
    const countryCount = new Map<string, number>();
    activeSessions.forEach(session => {
      if (session.location?.country) {
        const count = countryCount.get(session.location.country) || 0;
        countryCount.set(session.location.country, count + 1);
      }
    });
    
    const topCountries = Array.from(countryCount.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Get unique users (by IP)
    const uniqueIPs = new Set(activeSessions.map(session => session.ip));
    
    return {
      activeSessions: activeSessions.length,
      concurrentUsers: uniqueIPs.size,
      totalSessions: allSessions.length,
      averageSessionDuration: Math.round(averageSessionDuration),
      securityScoreDistribution,
      deviceTypeDistribution,
      topCountries
    };
  }

  /**
   * Subscribe to session updates
   */
  public onUpdate(callback: (data: { sessions: SessionInfo[]; stats: SessionStats }) => void): () => void {
    this.updateCallbacks.push(callback);
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Get session by ID
   */
  public getSession(sessionId: string): SessionInfo | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get sessions by IP
   */
  public getSessionsByIP(ip: string): SessionInfo[] {
    return Array.from(this.sessions.values()).filter(session => session.ip === ip);
  }

  private calculateSecurityScore(session: SessionInfo): number {
    let score = 100;
    
    // Reduce score based on session duration (very long sessions might be suspicious)
    if (session.duration > 14400) { // 4 hours
      score -= 10;
    }
    
    // Reduce score based on activity patterns
    const activityRate = session.activityCount / Math.max(1, session.duration / 60); // activities per minute
    if (activityRate > 10) { // Very high activity rate
      score -= 15;
    }
    
    // Reduce score for unknown device types
    if (session.deviceInfo.type === 'unknown') {
      score -= 5;
    }
    
    // Reduce score for suspicious user agents
    if (session.userAgent.includes('bot') || session.userAgent.includes('crawler')) {
      score -= 20;
    }
    
    // Reduce score for multiple sessions from same IP
    const sessionsFromSameIP = this.getSessionsByIP(session.ip).filter(s => s.isActive);
    if (sessionsFromSameIP.length > 3) {
      score -= 15;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private determineRiskLevel(securityScore: number): SessionInfo['riskLevel'] {
    if (securityScore >= 80) return 'low';
    if (securityScore >= 60) return 'medium';
    if (securityScore >= 40) return 'high';
    return 'critical';
  }

  private detectDeviceType(userAgent: string): SessionInfo['deviceInfo']['type'] {
    if (/Mobile|Android|iPhone/.test(userAgent)) {
      if (/iPad|Tablet/.test(userAgent)) return 'tablet';
      return 'mobile';
    }
    if (/Windows|Mac|Linux/.test(userAgent)) return 'desktop';
    return 'unknown';
  }

  private extractBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private extractOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private generateSessionId(ip: string, deviceFingerprint: string): string {
    return `session_${this.hashString(ip + deviceFingerprint)}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  private startSessionTracking(): void {
    // Update session data every 10 seconds for better performance
    this.cleanupInterval = setInterval(() => {
      this.notifyCallbacks();
      this.cleanupOldSessions();
    }, 10000);
  }

  private cleanupOldSessions(): void {
    const now = Date.now();
    const sessionsToRemove: string[] = [];
    
    this.sessions.forEach((session, sessionId) => {
      const lastActivityTime = new Date(session.lastActivity).getTime();
      const timeSinceActivity = now - lastActivityTime;
      
      // Remove sessions inactive for more than 24 hours
      if (timeSinceActivity > 86400000) {
        sessionsToRemove.push(sessionId);
      }
    });
    
    sessionsToRemove.forEach(sessionId => {
      this.sessions.delete(sessionId);
    });
  }

  private notifyCallbacks(): void {
    const data = {
      sessions: this.getActiveSessions(),
      stats: this.getSessionStats()
    };
    
    this.updateCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in session manager callback:', error);
      }
    });
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

export const sessionManager = SessionManager.getInstance();
