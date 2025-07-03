import { NextRequest, NextResponse } from 'next/server';
import { emailSecurityService } from '@/lib/email-security';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing email security service...');
    
    // Create comprehensive test security event data
    const testAlertData = {
      event: {
        type: 'failed_login' as const,
        severity: 'high' as const,
        timestamp: new Date().toISOString(),
        clientIP: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  '127.0.0.1',
        userAgent: request.headers.get('user-agent') || 'Test-Agent/1.0',
        username: 'test_security_violation@example.com',
        details: {
          reason: 'failed_login',
          attempts: 3,
          referer: request.headers.get('referer') || 'http://localhost:3000/hasnaat/login',
          origin: request.headers.get('origin') || 'http://localhost:3000',
          acceptLanguage: request.headers.get('accept-language') || 'en-US,en;q=0.9',
          acceptEncoding: request.headers.get('accept-encoding') || 'gzip, deflate, br',
          connection: request.headers.get('connection') || 'keep-alive',
          host: request.headers.get('host') || 'localhost:3000',
          xForwardedProto: request.headers.get('x-forwarded-proto') || 'http',
          xForwardedHost: request.headers.get('x-forwarded-host') || 'localhost:3000',
          dnt: request.headers.get('dnt') || '1',
          upgradeInsecureRequests: request.headers.get('upgrade-insecure-requests') || '1',
          blockDuration: '30 minutes',
          environment: 'test',
          attemptedFrom: 'test_endpoint',
          attackVector: 'admin_login_test',
          threatLevel: 'HIGH',
          investigationPriority: 'URGENT'
        }
      },
      recentEvents: [
        {
          type: 'failed_login' as const,
          severity: 'medium' as const,
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
          clientIP: '127.0.0.1',
          userAgent: 'Test-Agent/1.0',
          username: 'test_security_violation@example.com',
          details: { reason: 'failed_login', attempts: 1 }
        },
        {
          type: 'failed_login' as const,
          severity: 'medium' as const,
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
          clientIP: '127.0.0.1',
          userAgent: 'Test-Agent/1.0',
          username: 'test_security_violation@example.com',
          details: { reason: 'failed_login', attempts: 2 }
        }
      ],
      summary: {
        totalEvents: 3,
        timeWindow: '30 minutes',
        severity: 'high',
        clientIP: request.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: request.headers.get('user-agent') || 'Test-Agent/1.0'
      }
    };

    console.log('📧 Sending test security alert...');
    console.log('Alert data:', JSON.stringify(testAlertData, null, 2));
    
    const emailSent = await emailSecurityService.sendSecurityAlert(testAlertData);
    
    if (emailSent) {
      console.log('✅ Test security alert email sent successfully!');
      return NextResponse.json({
        success: true,
        message: 'Test security alert email sent successfully',
        details: {
          recipient: 'nexdevs.org@gmail.com',
          eventType: testAlertData.event.type,
          severity: testAlertData.event.severity,
          timestamp: testAlertData.event.timestamp
        }
      });
    } else {
      console.log('❌ Failed to send test security alert email');
      return NextResponse.json({
        success: false,
        message: 'Failed to send test security alert email',
        error: 'Email service not available'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Test email security API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Test email security API error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Email Security Test Endpoint',
    instructions: 'Send a POST request to test the email security alert system',
    endpoint: '/api/test-email-security',
    method: 'POST'
  });
}
