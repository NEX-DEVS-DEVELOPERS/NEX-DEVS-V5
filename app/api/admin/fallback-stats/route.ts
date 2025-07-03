import { NextRequest, NextResponse } from 'next/server'
import { getFallbackStats, getFallbackLogs, clearFallbackLogs } from '@/utils/nexiousAISettings'

// Admin authentication check
function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  
  const password = authHeader.substring(7)
  const validPasswords = ['nex-devs.org889123', 'nex-devs919']
  return validPasswords.includes(password)
}

// GET - Fetch fallback statistics and logs
export async function GET(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = getFallbackStats()
    const logs = getFallbackLogs()
    
    return NextResponse.json({
      success: true,
      data: {
        stats,
        logs
      }
    })
  } catch (error) {
    console.error('Error fetching fallback statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fallback statistics' },
      { status: 500 }
    )
  }
}

// DELETE - Clear fallback logs
export async function DELETE(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    clearFallbackLogs()
    
    return NextResponse.json({
      success: true,
      message: 'Fallback logs cleared successfully'
    })
  } catch (error) {
    console.error('Error clearing fallback logs:', error)
    return NextResponse.json(
      { error: 'Failed to clear fallback logs' },
      { status: 500 }
    )
  }
}
