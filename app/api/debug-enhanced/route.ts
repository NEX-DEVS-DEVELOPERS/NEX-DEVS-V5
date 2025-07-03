import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import neonDb from '@/lib/neon';
import { geolocationService } from '@/utils/geolocation';
import { enhancedSecurityMonitor } from '@/utils/enhancedSecurityMonitor';
import { sessionManager } from '@/utils/sessionManager';

// Admin password from environment
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nex-devs.org889123';

/**
 * Enhanced Debug API endpoint with comprehensive real-time data
 * Provides database metrics, device information, performance data, and geolocation
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  // Extract client information for security monitoring
  const clientIP = extractClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'Unknown';

  // Check if IP or device is blocked
  const deviceFingerprint = enhancedSecurityMonitor.generateDeviceFingerprint(userAgent, { ip: clientIP });

  if (enhancedSecurityMonitor.isIPBlocked(clientIP) || enhancedSecurityMonitor.isDeviceBlocked(deviceFingerprint.id)) {
    return NextResponse.json({
      error: 'Access denied - IP or device blocked',
      timestamp: new Date().toISOString()
    }, { status: 403 });
  }

  // Check for authentication
  const authHeader = request.headers.get('Authorization');
  const url = new URL(request.url);
  const passwordFromQuery = url.searchParams.get('password');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const password = passwordFromQuery || bearerToken || '';

  // Simple auth check if password provided
  const isAuthenticated = password === ADMIN_PASSWORD;

  if (!isAuthenticated) {
    // Record failed login attempt with enhanced tracking
    enhancedSecurityMonitor.recordFailedLogin(clientIP, userAgent, {
      endpoint: '/api/debug-enhanced',
      method: request.method,
      location: await geolocationService.getLocationInfo(clientIP).catch(() => null)
    });

    return NextResponse.json({
      error: 'Authentication required',
      timestamp: new Date().toISOString()
    }, { status: 401 });
  }

  try {
    // Create or update session
    const locationInfo = await geolocationService.getLocationInfo(clientIP).catch(() => null);
    const session = sessionManager.createOrUpdateSession(clientIP, userAgent, deviceFingerprint.id, {
      location: locationInfo ? { country: locationInfo.country, city: locationInfo.city } : undefined
    });

    // Get enhanced security data
    const securityStats = enhancedSecurityMonitor.getSecurityStats();
    const recentSecurityEvents = enhancedSecurityMonitor.getRecentEvents(15);
    const securityAlerts = enhancedSecurityMonitor.getSecurityAlerts();
    const activeSessions = sessionManager.getActiveSessions();
    const sessionStats = sessionManager.getSessionStats();
    
    // Gather server information with enhanced metrics
    const serverInfo = {
      environment: process.env.NODE_ENV,
      nodeVersion: process.version,
      platform: os.platform(),
      arch: os.arch(),
      cpuCount: os.cpus().length,
      cpuModel: os.cpus()[0]?.model || 'Unknown',
      memoryTotal: Math.round(os.totalmem() / (1024 * 1024)),
      memoryFree: Math.round(os.freemem() / (1024 * 1024)),
      memoryUsed: Math.round((os.totalmem() - os.freemem()) / (1024 * 1024)),
      memoryUsagePercent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100),
      uptime: Math.round(os.uptime()),
      loadAverage: os.loadavg(),
      hostname: os.hostname(),
      networkInterfaces: Object.keys(os.networkInterfaces()),
      processUptime: Math.round(process.uptime()),
      processMemory: process.memoryUsage()
    };

    // Get comprehensive database status
    let databaseInfo;
    try {
      databaseInfo = await neonDb.getDebugStatus();
    } catch (error) {
      console.error('Database debug status error:', error);
      databaseInfo = {
        database: {
          type: 'PostgreSQL (Neon)',
          connectivity: 'error',
          error: error instanceof Error ? error.message : 'Unknown database error'
        }
      };
    }



    // Calculate API response time
    const responseTime = Date.now() - startTime;

    // Build comprehensive response
    const responseObj = {
      timestamp: new Date().toISOString(),
      responseTime,
      authenticated: isAuthenticated,
      
      // Server Information
      server: serverInfo,
      
      // Database Information
      database: databaseInfo.database,
      
      // Performance Metrics
      performance: {
        apiResponseTime: responseTime,
        serverUptime: serverInfo.uptime,
        processUptime: serverInfo.processUptime,
        memoryUsage: {
          system: {
            total: serverInfo.memoryTotal,
            free: serverInfo.memoryFree,
            used: serverInfo.memoryUsed,
            percentage: serverInfo.memoryUsagePercent
          },
          process: serverInfo.processMemory
        },
        cpu: {
          count: serverInfo.cpuCount,
          model: serverInfo.cpuModel,
          loadAverage: serverInfo.loadAverage
        }
      },
      
      // System Information
      system: {
        platform: serverInfo.platform,
        arch: serverInfo.arch,
        hostname: serverInfo.hostname,
        networkInterfaces: serverInfo.networkInterfaces,
        nodeVersion: serverInfo.nodeVersion,
        environment: serverInfo.environment
      },
      
      // Enhanced Session Information
      session: {
        current: session,
        stats: sessionStats,
        activeSessions: activeSessions.slice(0, 10), // Limit to 10 most recent
        serverStartTime: new Date(Date.now() - (serverInfo.processUptime * 1000)).toISOString(),
        serverUptime: serverInfo.processUptime,
        requestCount: databaseInfo.database?.queryMetrics?.totalQueries || 0
      },

      // Enhanced Security Information
      security: {
        stats: securityStats,
        recentEvents: recentSecurityEvents,
        alerts: securityAlerts,
        deviceFingerprint: deviceFingerprint,
        blockedIPs: Array.from(enhancedSecurityMonitor['blockedIPs'] || []).slice(0, 10),
        blockedDevices: Array.from(enhancedSecurityMonitor['blockedDevices'] || []).slice(0, 10)
      }
    };
    
    return NextResponse.json(responseObj, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error('Enhanced debug API error:', error);
    return NextResponse.json({
      error: 'Failed to gather enhanced debug information',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime
    }, { status: 500 });
  }
}

/**
 * Extract client IP address from request headers
 */
function extractClientIP(request: NextRequest): string {
  // Try various headers in order of preference
  const ipHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'x-client-ip',
    'x-cluster-client-ip',
    'forwarded-for',
    'forwarded'
  ];

  for (const header of ipHeaders) {
    const value = request.headers.get(header);
    if (value) {
      // Handle comma-separated IPs (take the first one)
      const ip = value.split(',')[0].trim();
      if (isValidIP(ip)) {
        return ip;
      }
    }
  }

  return 'unknown';
}

/**
 * Validate IP address format
 */
function isValidIP(ip: string): boolean {
  // Basic IPv4 validation
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }

  // Basic IPv6 validation (simplified)
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv6Regex.test(ip);
}
