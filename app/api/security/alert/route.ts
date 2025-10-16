import { NextRequest, NextResponse } from 'next/server';
import { emailSecurityService } from '@/backend/lib/email-security';
import { logSecurityEvent } from '@/backend/lib/env-config';
import type { SecurityEvent } from '@/backend/lib/security-monitor';

export async function POST(request: NextRequest) {
  try {
    const alertData = await request.json();
    
    // Validate the alert data structure
    if (!alertData.event || !alertData.summary) {
      return NextResponse.json(
        { error: 'Invalid alert data structure' },
        { status: 400 }
      );
    }

    const { event, recentEvents, summary } = alertData;

    // Log the security alert attempt
    logSecurityEvent('Security alert triggered', {
      eventType: event.type,
      severity: event.severity,
      clientIP: event.clientIP,
      username: event.username,
      totalRecentEvents: recentEvents?.length || 0
    });

    // Send the security alert email
    const emailSent = await emailSecurityService.sendSecurityAlert(alertData);

    if (emailSent) {
      logSecurityEvent('Security alert email sent successfully', {
        eventType: event.type,
        severity: event.severity,
        clientIP: event.clientIP
      });

      return NextResponse.json({
        success: true,
        message: 'Security alert sent successfully'
      });
    } else {
      logSecurityEvent('Failed to send security alert email', {
        eventType: event.type,
        severity: event.severity,
        clientIP: event.clientIP
      });

      return NextResponse.json(
        { error: 'Failed to send security alert email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Security alert API error:', error);
    
    logSecurityEvent('Security alert API error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve security alert status/stats
export async function GET(request: NextRequest) {
  try {
    // This could be used by admin panel to check security alert system status
    return NextResponse.json({
      status: 'active',
      emailService: 'configured',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Security alert status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check security alert status' },
      { status: 500 }
    );
  }
}

