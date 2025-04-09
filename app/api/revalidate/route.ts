import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Set a secret token for security
const REVALIDATE_TOKEN = 'your-secret-token';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check for valid token
    const token = searchParams.get('token');
    if (token !== REVALIDATE_TOKEN) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Get path to revalidate (default to '/')
    const path = searchParams.get('path') || '/';
    
    // Revalidate the path
    revalidatePath(path);
    
    return NextResponse.json({
      revalidated: true,
      path,
      now: Date.now()
    });
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json({ error: 'Error revalidating' }, { status: 500 });
  }
} 