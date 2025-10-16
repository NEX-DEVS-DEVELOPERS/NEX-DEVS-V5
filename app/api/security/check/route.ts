import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get client information
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Check for security block cookie
    const securityBlock = request.cookies.get('security-block')
    const failedAttempts = request.cookies.get('failed-attempts')
    const blockTimestamp = request.cookies.get('block-timestamp')
    
    const isBlocked = securityBlock?.value === 'true'
    const attempts = failedAttempts ? parseInt(failedAttempts.value) : 0
    const blockTime = blockTimestamp ? parseInt(blockTimestamp.value) : 0
    
    // Check if block has expired (30 minutes)
    const now = Date.now()
    const blockDuration = 30 * 60 * 1000 // 30 minutes
    const blockExpired = blockTime && (now - blockTime) > blockDuration
    
    if (isBlocked && blockExpired) {
      // Block has expired, reset security state
      const response = NextResponse.json({
        isBlocked: false,
        failedAttempts: 0,
        timeRemaining: 0
      })
      
      // Clear security cookies
      response.cookies.delete('security-block')
      response.cookies.delete('failed-attempts')
      response.cookies.delete('block-timestamp')
      
      return response
    }
    
    const timeRemaining = isBlocked && blockTime 
      ? Math.max(0, Math.ceil((blockDuration - (now - blockTime)) / (60 * 1000)))
      : 0
    
    return NextResponse.json({
      isBlocked,
      failedAttempts: attempts,
      timeRemaining,
      clientIP: clientIP.substring(0, 10) + '...' // Partial IP for logging
    })
    
  } catch (error) {
    console.error('Security check error:', error)
    return NextResponse.json({ error: 'Security check failed' }, { status: 500 })
  }
}

