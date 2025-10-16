import { NextRequest, NextResponse } from 'next/server';
import { enhancedSecurityMonitor } from '@/backend/utils/enhancedSecurityMonitor';

// Admin password from environment
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nex-devs.org889123';

/**
 * Security Action API endpoint for immediate response actions
 * Allows blocking IPs, devices, and acknowledging alerts
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('Authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    if (bearerToken !== ADMIN_PASSWORD) {
      return NextResponse.json({
        error: 'Authentication required',
        timestamp: new Date().toISOString()
      }, { status: 401 });
    }

    const body = await request.json();
    const { action, target, alertId } = body;

    switch (action) {
      case 'block_ip':
        if (!target) {
          return NextResponse.json({
            error: 'IP address required',
            timestamp: new Date().toISOString()
          }, { status: 400 });
        }
        
        enhancedSecurityMonitor.blockIP(target);
        
        return NextResponse.json({
          success: true,
          message: `IP ${target} has been blocked`,
          action: 'block_ip',
          target,
          timestamp: new Date().toISOString()
        });

      case 'block_device':
        if (!target) {
          return NextResponse.json({
            error: 'Device ID required',
            timestamp: new Date().toISOString()
          }, { status: 400 });
        }
        
        enhancedSecurityMonitor.blockDevice(target);
        
        return NextResponse.json({
          success: true,
          message: `Device ${target} has been blocked`,
          action: 'block_device',
          target,
          timestamp: new Date().toISOString()
        });

      case 'acknowledge_alert':
        if (!alertId) {
          return NextResponse.json({
            error: 'Alert ID required',
            timestamp: new Date().toISOString()
          }, { status: 400 });
        }
        
        enhancedSecurityMonitor.acknowledgeAlert(alertId);
        
        return NextResponse.json({
          success: true,
          message: `Alert ${alertId} has been acknowledged`,
          action: 'acknowledge_alert',
          target: alertId,
          timestamp: new Date().toISOString()
        });

      case 'unblock_ip':
        if (!target) {
          return NextResponse.json({
            error: 'IP address required',
            timestamp: new Date().toISOString()
          }, { status: 400 });
        }
        
        // Access private property to unblock (in a real implementation, you'd add a public method)
        (enhancedSecurityMonitor as any).blockedIPs.delete(target);
        
        return NextResponse.json({
          success: true,
          message: `IP ${target} has been unblocked`,
          action: 'unblock_ip',
          target,
          timestamp: new Date().toISOString()
        });

      case 'unblock_device':
        if (!target) {
          return NextResponse.json({
            error: 'Device ID required',
            timestamp: new Date().toISOString()
          }, { status: 400 });
        }
        
        // Access private property to unblock (in a real implementation, you'd add a public method)
        (enhancedSecurityMonitor as any).blockedDevices.delete(target);
        const device = (enhancedSecurityMonitor as any).deviceFingerprints.get(target);
        if (device) {
          device.isBlocked = false;
        }
        
        return NextResponse.json({
          success: true,
          message: `Device ${target} has been unblocked`,
          action: 'unblock_device',
          target,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({
          error: 'Invalid action',
          validActions: ['block_ip', 'block_device', 'acknowledge_alert', 'unblock_ip', 'unblock_device'],
          timestamp: new Date().toISOString()
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Security action API error:', error);
    return NextResponse.json({
      error: 'Failed to execute security action',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * Get current security status
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('Authorization');
    const url = new URL(request.url);
    const passwordFromQuery = url.searchParams.get('password');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const password = passwordFromQuery || bearerToken || '';
    
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({
        error: 'Authentication required',
        timestamp: new Date().toISOString()
      }, { status: 401 });
    }

    const stats = enhancedSecurityMonitor.getSecurityStats();
    const events = enhancedSecurityMonitor.getRecentEvents(20);
    const alerts = enhancedSecurityMonitor.getSecurityAlerts();

    return NextResponse.json({
      stats,
      events,
      alerts,
      blockedIPs: Array.from((enhancedSecurityMonitor as any).blockedIPs || []),
      blockedDevices: Array.from((enhancedSecurityMonitor as any).blockedDevices || []),
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Security status API error:', error);
    return NextResponse.json({
      error: 'Failed to get security status',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

