import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminConfiguration,
  updateProModeMaintenanceConfig,
  isProModeUnderMaintenance,
  getProModeMaintenanceEndDate,
  getProModeTimeRemaining,
  type ProModeMaintenanceConfig
} from '@/backend/utils/nexiousAISettings';

// Rate limiting for security
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 50; // Max requests per window

// Admin authentication check with enhanced security
function checkAdminAuth(request: NextRequest): { isValid: boolean; error?: string } {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isValid: false, error: 'Missing or invalid authorization header' };
  }

  const password = authHeader.substring(7);

  // Check for empty password
  if (!password || password.trim().length === 0) {
    return { isValid: false, error: 'Empty password provided' };
  }

  // Check against environment variable first, then fallback
  const validPasswords = [
    process.env.ADMIN_PASSWORD,
    'nex-devs.org889123'
  ].filter(Boolean);

  if (!validPasswords.includes(password)) {
    return { isValid: false, error: 'Invalid credentials' };
  }

  return { isValid: true };
}

// Rate limiting check
function checkRateLimit(request: NextRequest): { allowed: boolean; error?: string } {
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  // Clean up old entries
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }

  const clientData = rateLimitMap.get(clientIP);

  if (!clientData) {
    // First request from this IP
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (now > clientData.resetTime) {
    // Reset window
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      error: `Rate limit exceeded. Try again in ${Math.ceil((clientData.resetTime - now) / 60000)} minutes.`
    };
  }

  // Increment count
  clientData.count++;
  return { allowed: true };
}

// Security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

// Validate date input
function validateDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date > new Date();
}

// Calculate date from days
function calculateDateFromDays(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

// GET - Retrieve current Pro Mode status and configuration
export async function GET(request: NextRequest) {
  try {
    // Check rate limiting
    const rateLimitCheck = checkRateLimit(request);
    if (!rateLimitCheck.allowed) {
      const response = NextResponse.json(
        { error: rateLimitCheck.error },
        { status: 429 }
      );
      return addSecurityHeaders(response);
    }

    // Check admin authentication
    const authCheck = checkAdminAuth(request);
    if (!authCheck.isValid) {
      console.warn(`Pro Mode API: Authentication failed - ${authCheck.error}`);
      const response = NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
      return addSecurityHeaders(response);
    }

    const config = getAdminConfiguration();
    const timeRemaining = getProModeTimeRemaining();
    const isUnderMaintenance = isProModeUnderMaintenance();
    const endDate = getProModeMaintenanceEndDate();

    const response = NextResponse.json({
      success: true,
      data: {
        isUnderMaintenance,
        maintenanceMessage: config.proModeMaintenance.maintenanceMessage,
        maintenanceEndDate: endDate.toISOString(),
        showCountdown: config.proModeMaintenance.showCountdown,
        timeRemaining,
        daysRemaining: timeRemaining.days,
        hoursRemaining: timeRemaining.hours,
        minutesRemaining: timeRemaining.minutes,
        secondsRemaining: timeRemaining.seconds,
        isExpired: timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes === 0 && timeRemaining.seconds === 0
      }
    });

    return addSecurityHeaders(response);
  } catch (error) {
    console.error('Error fetching Pro Mode configuration:', error);
    const response = NextResponse.json(
      { error: 'Failed to fetch Pro Mode configuration' },
      { status: 500 }
    );
    return addSecurityHeaders(response);
  }
}

// POST - Update Pro Mode configuration
export async function POST(request: NextRequest) {
  try {
    // Check rate limiting
    const rateLimitCheck = checkRateLimit(request);
    if (!rateLimitCheck.allowed) {
      const response = NextResponse.json(
        { error: rateLimitCheck.error },
        { status: 429 }
      );
      return addSecurityHeaders(response);
    }

    // Check admin authentication
    const authCheck = checkAdminAuth(request);
    if (!authCheck.isValid) {
      console.warn(`Pro Mode API: Authentication failed - ${authCheck.error}`);
      const response = NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
      return addSecurityHeaders(response);
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'toggle':
        // Toggle Pro Mode maintenance status
        const currentConfig = getAdminConfiguration();
        const newMaintenanceStatus = !currentConfig.proModeMaintenance.isUnderMaintenance;
        
        updateProModeMaintenanceConfig({
          isUnderMaintenance: newMaintenanceStatus
        });

        return NextResponse.json({
          success: true,
          message: `Pro Mode ${newMaintenanceStatus ? 'disabled' : 'enabled'} successfully`,
          data: {
            isUnderMaintenance: newMaintenanceStatus,
            action: newMaintenanceStatus ? 'disabled' : 'enabled'
          }
        });

      case 'set-duration':
        // Set Pro Mode duration in days
        const { days } = data;
        
        if (!days || typeof days !== 'number' || days < 1 || days > 365) {
          return NextResponse.json(
            { error: 'Invalid duration. Must be between 1 and 365 days.' },
            { status: 400 }
          );
        }

        const newEndDate = calculateDateFromDays(days);
        
        updateProModeMaintenanceConfig({
          maintenanceEndDate: newEndDate,
          isUnderMaintenance: true
        });

        return NextResponse.json({
          success: true,
          message: `Pro Mode duration set to ${days} days`,
          data: {
            days,
            endDate: newEndDate.toISOString(),
            isUnderMaintenance: true
          }
        });

      case 'set-custom-date':
        // Set custom expiration date
        const { customDate } = data;
        
        if (!customDate || !validateDate(customDate)) {
          return NextResponse.json(
            { error: 'Invalid date. Must be a future date.' },
            { status: 400 }
          );
        }

        const customEndDate = new Date(customDate);
        
        updateProModeMaintenanceConfig({
          maintenanceEndDate: customEndDate,
          isUnderMaintenance: true
        });

        return NextResponse.json({
          success: true,
          message: 'Pro Mode expiration date updated successfully',
          data: {
            endDate: customEndDate.toISOString(),
            isUnderMaintenance: true
          }
        });

      case 'update-message':
        // Update maintenance message
        const { message } = data;
        
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
          return NextResponse.json(
            { error: 'Invalid message. Message cannot be empty.' },
            { status: 400 }
          );
        }

        updateProModeMaintenanceConfig({
          maintenanceMessage: message.trim()
        });

        return NextResponse.json({
          success: true,
          message: 'Maintenance message updated successfully',
          data: {
            maintenanceMessage: message.trim()
          }
        });

      case 'toggle-countdown':
        // Toggle countdown display
        const currentCountdownConfig = getAdminConfiguration();
        const newCountdownStatus = !currentCountdownConfig.proModeMaintenance.showCountdown;
        
        updateProModeMaintenanceConfig({
          showCountdown: newCountdownStatus
        });

        return NextResponse.json({
          success: true,
          message: `Countdown display ${newCountdownStatus ? 'enabled' : 'disabled'}`,
          data: {
            showCountdown: newCountdownStatus
          }
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error updating Pro Mode configuration:', error);
    return NextResponse.json(
      { error: 'Failed to update Pro Mode configuration' },
      { status: 500 }
    );
  }
}

// PUT - Batch update Pro Mode configuration
export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const updates: Partial<ProModeMaintenanceConfig> = {};

    // Validate and prepare updates
    if (body.isUnderMaintenance !== undefined) {
      updates.isUnderMaintenance = Boolean(body.isUnderMaintenance);
    }

    if (body.maintenanceMessage !== undefined) {
      if (typeof body.maintenanceMessage !== 'string' || body.maintenanceMessage.trim().length === 0) {
        return NextResponse.json(
          { error: 'Invalid maintenance message' },
          { status: 400 }
        );
      }
      updates.maintenanceMessage = body.maintenanceMessage.trim();
    }

    if (body.maintenanceEndDate !== undefined) {
      if (!validateDate(body.maintenanceEndDate)) {
        return NextResponse.json(
          { error: 'Invalid end date. Must be a future date.' },
          { status: 400 }
        );
      }
      updates.maintenanceEndDate = new Date(body.maintenanceEndDate);
    }

    if (body.showCountdown !== undefined) {
      updates.showCountdown = Boolean(body.showCountdown);
    }

    // Apply updates
    updateProModeMaintenanceConfig(updates);

    return NextResponse.json({
      success: true,
      message: 'Pro Mode configuration updated successfully',
      data: updates
    });

  } catch (error) {
    console.error('Error batch updating Pro Mode configuration:', error);
    return NextResponse.json(
      { error: 'Failed to update Pro Mode configuration' },
      { status: 500 }
    );
  }
}

