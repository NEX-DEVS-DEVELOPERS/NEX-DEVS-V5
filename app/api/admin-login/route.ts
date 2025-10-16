import { NextResponse } from 'next/server';
import { ENV_CONFIG, validateEnvironmentVariables, debugEnvironmentVariables, logSecurityEvent } from '@/backend/lib/env-config';
import { securityMonitor, SecurityMonitor } from '@/backend/lib/security-monitor';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Debug environment variables in development (server-side only)
    debugEnvironmentVariables();

    // Validate environment configuration
    const envValidation = validateEnvironmentVariables();

    if (!envValidation.isValid) {
      // Server-side only error logging - never exposed to browser console
      if (ENV_CONFIG.IS_SERVER) {
        logSecurityEvent('Missing Environment Variables', {
          missing: envValidation.missing,
          nodeEnv: ENV_CONFIG.NODE_ENV
        });
      }
      return NextResponse.json({
        error: 'Server configuration error',
        // Remove debug info completely in production to prevent browser console exposure
        debug: ENV_CONFIG.IS_DEVELOPMENT && ENV_CONFIG.IS_SERVER ? {
          missing: envValidation.missing,
          nodeEnv: ENV_CONFIG.NODE_ENV
        } : undefined
      }, { status: 500 });
    }

    // Get credentials from validated environment config
    const { ADMIN_USERNAME, ADMIN_PASSWORD, DATABASE_PASSWORD } = ENV_CONFIG;

    // Get client information for comprehensive security monitoring
    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     request.headers.get('cf-connecting-ip') ||
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Enhanced server-side security logging with detailed console format
    if (ENV_CONFIG.IS_SERVER) {
      // Format exactly matching the user's console output example
      console.log('🔐 Admin Login Attempt:');
      console.log(`Received username: ${username}`);
      console.log(`Expected username: ${ADMIN_USERNAME}`);
      console.log(`Received password length: ${password?.length || 0}`);
      console.log(`Expected password length: ${ADMIN_PASSWORD?.length || 0}`);
      console.log(`Username match: ${username === ADMIN_USERNAME}`);
      console.log(`Password match: ${password === ADMIN_PASSWORD}`);

      // Also log to security system for comprehensive monitoring
      logSecurityEvent('Admin Login Attempt', {
        receivedUsername: username,
        expectedUsername: ADMIN_USERNAME,
        usernameMatch: username === ADMIN_USERNAME,
        passwordLengthMatch: password?.length === ADMIN_PASSWORD?.length,
        clientIP,
        userAgent,
        timestamp: new Date().toISOString()
      });
    }

    // Validate credentials
    if (
      username === ADMIN_USERNAME &&
      password === ADMIN_PASSWORD
    ) {
      // Server-side success logging only - never exposed to browser console
      if (ENV_CONFIG.IS_SERVER) {
        console.log('✅ Authentication successful for user:', username);

        logSecurityEvent('Authentication Successful', {
          username: username,
          clientIP,
          userAgent
        });
      }

      const response = NextResponse.json({
        success: true,
        databasePassword: DATABASE_PASSWORD, // ✅ send DB password securely from server
        message: 'Login successful'
      });

      // Set secure HTTP-only cookie for authentication
      response.cookies.set('admin-auth', 'true', {
        httpOnly: true,
        secure: ENV_CONFIG.IS_PRODUCTION,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 2, // 2 hours
      });

      // Cookie set successfully - server-side logging only
      if (ENV_CONFIG.IS_SERVER) {
        logSecurityEvent('Authentication Cookie Set', { username });
      }
      return response;
    }

    // Authentication failed - enhanced server-side logging with console format
    if (ENV_CONFIG.IS_SERVER) {
      console.log(`❌ Authentication failed for user: ${username}`);

      // Enhanced security logging for failed authentication
      logSecurityEvent('Authentication Failed', {
        username: username,
        clientIP,
        userAgent,
        timestamp: new Date().toISOString(),
        reason: 'invalid_credentials'
      });
    }
    return NextResponse.json({
      error: 'Invalid username or password'
      // Debug info removed for security - no client-side exposure
    }, { status: 401 });
  } catch (error) {
    // Server-side only error logging - never exposed to browser console
    if (ENV_CONFIG.IS_SERVER) {
      logSecurityEvent('Login Error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

