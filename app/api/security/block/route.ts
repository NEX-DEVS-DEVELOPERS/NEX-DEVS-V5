import { NextRequest, NextResponse } from 'next/server'
import { emailSecurityService } from '@/lib/email-security'
import { logSecurityEvent } from '@/lib/env-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reason, details } = body
    
    // Get comprehensive client information for security monitoring
    const clientIP = request.ip ||
                     request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     request.headers.get('cf-connecting-ip') ||
                     request.headers.get('x-client-ip') ||
                     request.headers.get('x-cluster-client-ip') ||
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'unknown'
    const origin = request.headers.get('origin') || 'unknown'
    const acceptLanguage = request.headers.get('accept-language') || 'unknown'
    const acceptEncoding = request.headers.get('accept-encoding') || 'unknown'
    const connection = request.headers.get('connection') || 'unknown'
    const host = request.headers.get('host') || 'unknown'
    const xForwardedProto = request.headers.get('x-forwarded-proto') || 'unknown'
    const xForwardedHost = request.headers.get('x-forwarded-host') || 'unknown'
    const dnt = request.headers.get('dnt') || 'unknown' // Do Not Track
    const upgradeInsecureRequests = request.headers.get('upgrade-insecure-requests') || 'unknown'
    
    // Get current failed attempts
    const currentAttempts = request.cookies.get('failed-attempts')
    const attempts = currentAttempts ? parseInt(currentAttempts.value) : 0
    const newAttempts = attempts + 1
    
    // Create comprehensive security event data with enhanced tracking
    const securityEventData = {
      reason,
      details: {
        ...details,
        // Enhanced device and network fingerprinting
        deviceFingerprint: {
          userAgent,
          acceptLanguage,
          acceptEncoding,
          dnt,
          upgradeInsecureRequests,
          screenResolution: 'unknown', // Would need client-side JS
          timezone: 'unknown', // Would need client-side JS
          platform: 'unknown' // Would need client-side JS
        },
        networkInfo: {
          clientIP,
          xForwardedProto,
          xForwardedHost,
          connection,
          host
        },
        navigationInfo: {
          referer,
          origin
        },
        attackPattern: {
          attempts: newAttempts,
          timeWindow: '30 minutes',
          attackType: reason,
          severity: newAttempts >= 2 ? 'high' : 'medium'
        }
      },
      clientIP,
      userAgent,
      referer,
      origin,
      acceptLanguage,
      attempts: newAttempts,
      timestamp: new Date().toISOString(),
      // Additional tracking data
      serverInfo: {
        nodeEnv: process.env.NODE_ENV || 'unknown',
        serverTime: new Date().toISOString(),
        requestMethod: 'POST',
        endpoint: '/api/security/block'
      }
    }

    // Enhanced server-side security logging with exact console format
    console.log(`🚨 SECURITY VIOLATION: ${JSON.stringify(securityEventData, null, 2)}`);

    // Also log to security system
    logSecurityEvent('SECURITY VIOLATION', securityEventData)

    // Send email alert for unauthorized access attempts
    try {
      const alertData = {
        event: {
          type: 'failed_login' as const,
          severity: newAttempts >= 2 ? 'high' as const : 'medium' as const,
          timestamp: new Date().toISOString(),
          clientIP,
          userAgent,
          username: details?.username || 'unknown',
          details: {
            reason,
            attempts: newAttempts,
            referer,
            origin,
            acceptLanguage,
            acceptEncoding,
            connection,
            host,
            xForwardedProto,
            xForwardedHost,
            dnt,
            upgradeInsecureRequests,
            blockDuration: '30 minutes',
            environment: process.env.NODE_ENV || 'unknown',
            attackVector: 'admin_login_attempt',
            threatLevel: newAttempts >= 2 ? 'HIGH' : 'MEDIUM',
            investigationPriority: newAttempts >= 2 ? 'URGENT' : 'NORMAL',
            ...details
          }
        },
        recentEvents: [], // Could be enhanced to track recent events
        summary: {
          totalEvents: newAttempts,
          timeWindow: '30 minutes',
          severity: newAttempts >= 2 ? 'high' : 'medium',
          clientIP,
          userAgent,
          // Enhanced summary information
          attackSummary: {
            firstAttempt: new Date().toISOString(),
            latestAttempt: new Date().toISOString(),
            totalAttempts: newAttempts,
            attackDuration: '30 minutes',
            targetEndpoint: '/hasnaat/login',
            attackType: 'Brute Force Login Attempt',
            riskLevel: newAttempts >= 2 ? 'HIGH RISK' : 'MEDIUM RISK'
          }
        }
      }

      // Send security alert email (non-blocking)
      emailSecurityService.sendSecurityAlert(alertData).catch(error => {
        logSecurityEvent('Failed to send security alert email', { error: error.message })
      })
    } catch (emailError) {
      logSecurityEvent('Security email alert error', { error: emailError })
    }
    
    const response = NextResponse.json({
      success: true,
      failedAttempts: newAttempts,
      isBlocked: newAttempts >= 2
    })
    
    // Set security cookies
    const now = Date.now()
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 30 * 60 // 30 minutes
    }
    
    // Update failed attempts
    response.cookies.set('failed-attempts', newAttempts.toString(), cookieOptions)
    
    // If 2 or more attempts, block access
    if (newAttempts >= 2) {
      response.cookies.set('security-block', 'true', cookieOptions)
      response.cookies.set('block-timestamp', now.toString(), cookieOptions)
      
      // Enhanced blocking notification with comprehensive data
      logSecurityEvent('ACCESS BLOCKED - Multiple Failed Attempts', {
        clientIP,
        userAgent,
        referer,
        origin,
        acceptLanguage,
        totalAttempts: newAttempts,
        blockDuration: '30 minutes',
        timestamp: new Date().toISOString()
      })
    }
    
    return response
    
  } catch (error) {
    console.error('Security block error:', error)
    return NextResponse.json({ error: 'Security block failed' }, { status: 500 })
  }
}
