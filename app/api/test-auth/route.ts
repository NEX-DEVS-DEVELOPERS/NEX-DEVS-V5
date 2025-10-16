import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check for authentication cookie
    const authCookie = request.cookies.get('admin-auth');
    
    if (authCookie && authCookie.value === 'true') {
      return NextResponse.json({ 
        authenticated: true,
        message: 'User is authenticated'
      });
    }
    
    return NextResponse.json({ 
      authenticated: false,
      message: 'User is not authenticated'
    }, { status: 401 });
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

