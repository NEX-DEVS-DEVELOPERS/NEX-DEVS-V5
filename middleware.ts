import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Performance cache for middleware responses
const responseCache = new Map<string, { response: NextResponse; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for admin routes

// Define protected admin routes - optimized with Set for O(1) lookup
const PROTECTED_ADMIN_ROUTES = new Set([
  '/hasnaat',
  '/hasnaat/projects',
  '/hasnaat/projects/new',
  '/hasnaat/projects/edit',
  '/hasnaat/database',
  '/hasnaat/database/test',
  '/hasnaat/team',
  '/hasnaat/reviews',
  '/hasnaat/questions',
  '/hasnaat/command-room'
])

// Define public admin routes (no authentication required) - optimized with Set
const PUBLIC_ADMIN_ROUTES = new Set([
  '/hasnaat/login'
])

// Legacy admin paths that should be permanently blocked - optimized with Set
const LEGACY_ADMIN_PATHS = new Set([
  '/admin',
  '/admin/login',
  '/admin/projects',
  '/admin/team',
  '/admin/reviews',
  '/admin/database',
  '/admin/command-room'
])

// Clean cache periodically to prevent memory leaks - optimized frequency
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  // Collect keys to delete
  responseCache.forEach((value, key) => {
    if (now - value.timestamp > CACHE_DURATION) {
      keysToDelete.push(key);
    }
  });
  
  // Delete collected keys
  keysToDelete.forEach(key => responseCache.delete(key));
}, 300000); // Clean every 5 minutes instead of every 2 minutes

// Security helper functions
function isLegacyAdminPath(pathname: string): boolean {
  return pathname.startsWith('/admin')
}

function isAccessBlocked(request: NextRequest): boolean {
  // Check for security block cookie
  const securityBlock = request.cookies.get('security-block')
  if (securityBlock && securityBlock.value === 'true') {
    return true
  }

  // Check for failed attempts cookie
  const failedAttempts = request.cookies.get('failed-attempts')
  if (failedAttempts && parseInt(failedAttempts.value) >= 2) {
    return true
  }

  return false
}

function logSecurityViolation(type: string, details: any): void {
  const timestamp = new Date().toISOString()
  console.warn(`🚨 SECURITY VIOLATION [${type.toUpperCase()}] at ${timestamp}:`, details)
}

// Helper function to check if a path matches or is a subpath of any route in a Set
function isPathInRouteSet(pathname: string, routeSet: Set<string>): boolean {
  // First check for exact match
  if (routeSet.has(pathname)) {
    return true;
  }
  
  // Then check if the path starts with any route in the set followed by '/'
  // Convert Set to Array to avoid iteration issues
  return Array.from(routeSet).some(route => pathname.startsWith(route + '/'));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  // 🚨 SECURITY CHECK 1: Block all legacy admin paths permanently
  if (isLegacyAdminPath(pathname)) {
    logSecurityViolation('legacy_path_access', {
      pathname,
      clientIP,
      userAgent,
      timestamp: new Date().toISOString()
    })

    // Return 404 response for legacy admin paths
    return new NextResponse(null, { status: 404 })
  }

  // Check if this is a hasnaat admin route
  const isAdminRoute = pathname.startsWith('/hasnaat')

  if (!isAdminRoute) {
    // Allow all non-admin routes
    return NextResponse.next()
  }

  // 🚨 SECURITY CHECK 2: Check if access is blocked due to failed attempts
  if (isAccessBlocked(request)) {
    logSecurityViolation('blocked_access_attempt', {
      pathname,
      clientIP,
      userAgent,
      timestamp: new Date().toISOString()
    })

    // Return 404 response for blocked access
    return new NextResponse(null, { status: 404 })
  }

  // Check if this is a public admin route (login page)
  const isPublicAdminRoute = isPathInRouteSet(pathname, PUBLIC_ADMIN_ROUTES);

  if (isPublicAdminRoute) {
    // For login page, still check if access is blocked
    if (isAccessBlocked(request)) {
      return new NextResponse(null, { status: 404 })
    }

    // Allow access to login page if not blocked
    return NextResponse.next()
  }

  // Check if this is a protected admin route
  const isProtectedRoute = isPathInRouteSet(pathname, PROTECTED_ADMIN_ROUTES);

  if (isProtectedRoute) {
    // Check for authentication cookie
    const authCookie = request.cookies.get('admin-auth')

    if (!authCookie || authCookie.value !== 'true') {
      // Check if access is blocked before redirecting
      if (isAccessBlocked(request)) {
        return new NextResponse(null, { status: 404 })
      }

      // Redirect to login if not authenticated and not blocked
      const loginUrl = new URL('/hasnaat/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)

      console.log(`🔒 Unauthorized access attempt to ${pathname}, redirecting to login`)

      return NextResponse.redirect(loginUrl)
    }

    // User is authenticated, allow access
    console.log(`✅ Authenticated access to ${pathname}`)
    return NextResponse.next()
  }

  // For any other hasnaat routes not explicitly defined, require authentication
  const authCookie = request.cookies.get('admin-auth')

  if (!authCookie || authCookie.value !== 'true') {
    // Check if access is blocked
    if (isAccessBlocked(request)) {
      return new NextResponse(null, { status: 404 })
    }

    const loginUrl = new URL('/hasnaat/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)

    console.log(`🔒 Unauthorized access attempt to ${pathname}, redirecting to login`)

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all admin routes (both legacy and current) except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/admin/:path*',
    '/hasnaat/:path*'
  ]
}
