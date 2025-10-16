import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { adminPassword } = body
    
    // Verify admin password
    const correctPassword = process.env.ADMIN_PASSWORD || 'nex-devs.org889123'
    
    if (adminPassword !== correctPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    // Get client information for logging
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    console.log('✅ Security state reset by legitimate admin:', {
      clientIP,
      userAgent,
      timestamp: new Date().toISOString()
    })
    
    const response = NextResponse.json({
      success: true,
      message: 'Security state reset successfully'
    })
    
    // Clear all security cookies
    response.cookies.delete('security-block')
    response.cookies.delete('failed-attempts')
    response.cookies.delete('block-timestamp')
    
    return response
    
  } catch (error) {
    console.error('Security reset error:', error)
    return NextResponse.json({ error: 'Security reset failed' }, { status: 500 })
  }
}

